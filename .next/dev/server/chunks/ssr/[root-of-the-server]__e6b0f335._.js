module.exports = [
"[project]/src/pages/financial-literacy-score-calculator.jsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__,
    "getStaticProps",
    ()=>getStaticProps
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/head.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$script$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/script.js [ssr] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module './financialliteracyquizcalculator.module.css'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
;
;
;
;
;
const FinancialLiteracyQuizCalculator = ({ currentDate, lastModifiedDate })=>{
    const [currentQuestion, setCurrentQuestion] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(0);
    const [answers, setAnswers] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])({});
    const [score, setScore] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [quizCompleted, setQuizCompleted] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [timeSpent, setTimeSpent] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(0);
    const questions = [
        {
            id: 1,
            question: "What is the recommended percentage of your monthly income that should go towards housing costs?",
            options: [
                {
                    id: 'a',
                    text: "50% or less",
                    isCorrect: false
                },
                {
                    id: 'b',
                    text: "30% or less",
                    isCorrect: true
                },
                {
                    id: 'c',
                    text: "70% or less",
                    isCorrect: false
                },
                {
                    id: 'd',
                    text: "There's no recommendation",
                    isCorrect: false
                }
            ],
            explanation: "The 30% rule suggests spending no more than 30% of your gross monthly income on housing costs (rent/mortgage + utilities). This helps ensure you have enough money for other expenses and savings.",
            category: "Budgeting"
        },
        {
            id: 2,
            question: "How much should you have in an emergency fund?",
            options: [
                {
                    id: 'a',
                    text: "1 month of expenses",
                    isCorrect: false
                },
                {
                    id: 'b',
                    text: "3-6 months of expenses",
                    isCorrect: true
                },
                {
                    id: 'c',
                    text: "12 months of expenses",
                    isCorrect: false
                },
                {
                    id: 'd',
                    text: "$1,000 regardless of expenses",
                    isCorrect: false
                }
            ],
            explanation: "Financial experts recommend saving 3-6 months of essential living expenses in an emergency fund. This provides a buffer for job loss, medical emergencies, or unexpected repairs.",
            category: "Emergency Planning"
        },
        {
            id: 3,
            question: "Which debt repayment strategy is most mathematically efficient?",
            options: [
                {
                    id: 'a',
                    text: "Snowball method (smallest balances first)",
                    isCorrect: false
                },
                {
                    id: 'b',
                    text: "Avalanche method (highest interest first)",
                    isCorrect: true
                },
                {
                    id: 'c',
                    text: "Consolidate all debts",
                    isCorrect: false
                },
                {
                    id: 'd',
                    text: "Pay minimums on all",
                    isCorrect: false
                }
            ],
            explanation: "The avalanche method saves the most money in interest payments by targeting debts with the highest interest rates first, though the snowball method can provide psychological wins.",
            category: "Debt Management"
        },
        {
            id: 4,
            question: "What is compound interest?",
            options: [
                {
                    id: 'a',
                    text: "Interest calculated only on principal",
                    isCorrect: false
                },
                {
                    id: 'b',
                    text: "Interest calculated on principal + accumulated interest",
                    isCorrect: true
                },
                {
                    id: 'c',
                    text: "A type of loan interest",
                    isCorrect: false
                },
                {
                    id: 'd',
                    text: "Interest that decreases over time",
                    isCorrect: false
                }
            ],
            explanation: "Compound interest is 'interest on interest' - it's calculated on the initial principal and also on the accumulated interest from previous periods. This causes investments to grow exponentially.",
            category: "Investing Basics"
        },
        {
            id: 5,
            question: "What does the 'Rule of 72' help you calculate?",
            options: [
                {
                    id: 'a',
                    text: "Years to double your money",
                    isCorrect: true
                },
                {
                    id: 'b',
                    text: "Monthly savings needed for retirement",
                    isCorrect: false
                },
                {
                    id: 'c',
                    text: "Optimal debt-to-income ratio",
                    isCorrect: false
                },
                {
                    id: 'd',
                    text: "Credit score impact of missed payments",
                    isCorrect: false
                }
            ],
            explanation: "The Rule of 72 estimates how long it takes for an investment to double at a given annual rate of return. Divide 72 by the interest rate (e.g., 72 ÷ 6% = 12 years to double).",
            category: "Investment Math"
        },
        {
            id: 6,
            question: "What is diversification in investing?",
            options: [
                {
                    id: 'a',
                    text: "Putting all money in one stock",
                    isCorrect: false
                },
                {
                    id: 'b',
                    text: "Spreading investments across different assets",
                    isCorrect: true
                },
                {
                    id: 'c',
                    text: "Investing only in bonds",
                    isCorrect: false
                },
                {
                    id: 'd',
                    text: "Buying and selling frequently",
                    isCorrect: false
                }
            ],
            explanation: "Diversification reduces risk by spreading investments across different asset classes (stocks, bonds, real estate), sectors, and geographic regions. It's captured in the saying 'don't put all your eggs in one basket.'",
            category: "Risk Management"
        },
        {
            id: 7,
            question: "Which retirement account offers tax-free withdrawals in retirement?",
            options: [
                {
                    id: 'a',
                    text: "Traditional IRA",
                    isCorrect: false
                },
                {
                    id: 'b',
                    text: "Roth IRA",
                    isCorrect: true
                },
                {
                    id: 'c',
                    text: "401(k)",
                    isCorrect: false
                },
                {
                    id: 'd',
                    text: "Taxable brokerage account",
                    isCorrect: false
                }
            ],
            explanation: "Roth IRAs are funded with after-tax dollars, but qualified withdrawals (after age 59½ and 5-year holding period) are tax-free. Traditional IRAs and 401(k)s offer tax-deferred growth but withdrawals are taxed.",
            category: "Retirement Planning"
        },
        {
            id: 8,
            question: "What is a good credit score range?",
            options: [
                {
                    id: 'a',
                    text: "300-579",
                    isCorrect: false
                },
                {
                    id: 'b',
                    text: "580-669",
                    isCorrect: false
                },
                {
                    id: 'c',
                    text: "670-739",
                    isCorrect: false
                },
                {
                    id: 'd',
                    text: "740-850",
                    isCorrect: true
                }
            ],
            explanation: "Scores 740-850 are considered excellent and typically qualify for the best interest rates. Good scores (670-739) are acceptable, while fair (580-669) and poor (300-579) scores result in higher interest rates or loan denials.",
            category: "Credit Management"
        },
        {
            id: 9,
            question: "What's the difference between a stock and a bond?",
            options: [
                {
                    id: 'a',
                    text: "Stocks represent ownership, bonds represent debt",
                    isCorrect: true
                },
                {
                    id: 'b',
                    text: "Stocks are safer than bonds",
                    isCorrect: false
                },
                {
                    id: 'c',
                    text: "Bonds have unlimited growth potential",
                    isCorrect: false
                },
                {
                    id: 'd',
                    text: "There's no difference",
                    isCorrect: false
                }
            ],
            explanation: "Stocks represent ownership shares in a company (equity), while bonds represent loans to a company or government (debt). Stocks generally offer higher growth potential but more risk; bonds offer fixed income with lower risk.",
            category: "Investment Types"
        },
        {
            id: 10,
            question: "What is dollar-cost averaging?",
            options: [
                {
                    id: 'a',
                    text: "Investing a fixed amount regularly regardless of price",
                    isCorrect: true
                },
                {
                    id: 'b',
                    text: "Buying when prices are high",
                    isCorrect: false
                },
                {
                    id: 'c',
                    text: "Selling when prices drop",
                    isCorrect: false
                },
                {
                    id: 'd',
                    text: "Timing the market perfectly",
                    isCorrect: false
                }
            ],
            explanation: "Dollar-cost averaging involves investing a fixed amount at regular intervals, which averages out purchase prices over time. This reduces the impact of market volatility and removes emotion from investing decisions.",
            category: "Investment Strategy"
        },
        {
            id: 11,
            question: "What is inflation?",
            options: [
                {
                    id: 'a',
                    text: "When prices decrease over time",
                    isCorrect: false
                },
                {
                    id: 'b',
                    text: "When prices increase over time",
                    isCorrect: true
                },
                {
                    id: 'c',
                    text: "When interest rates drop",
                    isCorrect: false
                },
                {
                    id: 'd',
                    text: "When the economy shrinks",
                    isCorrect: false
                }
            ],
            explanation: "Inflation is the rate at which prices for goods and services rise, decreasing purchasing power. The Federal Reserve targets 2% annual inflation. Investments should outpace inflation to maintain real value.",
            category: "Economic Concepts"
        },
        {
            id: 12,
            question: "What does 'net worth' mean?",
            options: [
                {
                    id: 'a',
                    text: "Your annual salary",
                    isCorrect: false
                },
                {
                    id: 'b',
                    text: "Assets minus liabilities",
                    isCorrect: true
                },
                {
                    id: 'c',
                    text: "Monthly disposable income",
                    isCorrect: false
                },
                {
                    id: 'd',
                    text: "Value of your home",
                    isCorrect: false
                }
            ],
            explanation: "Net worth = Assets (what you own: cash, investments, property) - Liabilities (what you owe: debts, loans, mortgages). It's a key measure of financial health that should grow over time.",
            category: "Financial Metrics"
        }
    ];
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        const timer = setInterval(()=>{
            if (!quizCompleted) {
                setTimeSpent((prev)=>prev + 1);
            }
        }, 1000);
        return ()=>clearInterval(timer);
    }, [
        quizCompleted
    ]);
    const handleAnswer = (questionId, optionId, isCorrect)=>{
        setAnswers((prev)=>({
                ...prev,
                [questionId]: {
                    selected: optionId,
                    isCorrect: isCorrect,
                    answered: true
                }
            }));
    };
    const nextQuestion = ()=>{
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion((prev)=>prev + 1);
        } else {
            calculateScore();
        }
    };
    const prevQuestion = ()=>{
        if (currentQuestion > 0) {
            setCurrentQuestion((prev)=>prev - 1);
        }
    };
    const calculateScore = ()=>{
        const correctAnswers = Object.values(answers).filter((answer)=>answer.isCorrect).length;
        const totalAnswered = Object.keys(answers).length;
        const percentage = Math.round(correctAnswers / questions.length * 100);
        // Calculate category scores
        const categoryScores = {};
        questions.forEach((q)=>{
            if (!categoryScores[q.category]) {
                categoryScores[q.category] = {
                    correct: 0,
                    total: 0
                };
            }
            categoryScores[q.category].total++;
            if (answers[q.id]?.isCorrect) {
                categoryScores[q.category].correct++;
            }
        });
        // Determine literacy level
        let level = '';
        let description = '';
        let color = '';
        if (percentage >= 90) {
            level = 'Financial Expert';
            description = 'You have comprehensive financial knowledge!';
            color = '#10b981';
        } else if (percentage >= 75) {
            level = 'Advanced';
            description = 'Strong financial literacy with advanced understanding';
            color = '#3b82f6';
        } else if (percentage >= 60) {
            level = 'Intermediate';
            description = 'Good foundation with room for improvement';
            color = '#f59e0b';
        } else if (percentage >= 40) {
            level = 'Beginner';
            description = 'Basic understanding - great starting point!';
            color = '#ef4444';
        } else {
            level = 'Novice';
            description = 'Time to start your financial education journey';
            color = '#dc2626';
        }
        setScore({
            correct: correctAnswers,
            total: questions.length,
            percentage: percentage,
            level: level,
            description: description,
            color: color,
            categoryScores: categoryScores,
            timeSpent: timeSpent
        });
        setQuizCompleted(true);
    };
    const restartQuiz = ()=>{
        setAnswers({});
        setCurrentQuestion(0);
        setScore(null);
        setQuizCompleted(false);
        setTimeSpent(0);
    };
    const formatTime = (seconds)=>{
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };
    const getProgressPercentage = ()=>{
        return Object.keys(answers).length / questions.length * 100;
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("title", {
                        children: "Financial Literacy Quiz | Test Your Money Knowledge"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                        lineNumber: 273,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("meta", {
                        name: "description",
                        content: "Take our comprehensive financial literacy quiz to assess your money knowledge, identify areas for improvement, and get personalized learning recommendations."
                    }, void 0, false, {
                        fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                        lineNumber: 274,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("meta", {
                        name: "keywords",
                        content: "financial literacy quiz, money knowledge test, personal finance quiz, financial education test, money management quiz, financial literacy assessment"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                        lineNumber: 275,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("meta", {
                        name: "date",
                        content: currentDate
                    }, void 0, false, {
                        fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                        lineNumber: 276,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("meta", {
                        name: "last-modified",
                        content: lastModifiedDate
                    }, void 0, false, {
                        fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                        lineNumber: 277,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("meta", {
                        name: "viewport",
                        content: "width=device-width, initial-scale=1"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                        lineNumber: 278,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("link", {
                        rel: "canonical",
                        href: "https://yourdomain.com/financial-literacy-quiz"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                        lineNumber: 279,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("meta", {
                        property: "og:title",
                        content: "Financial Literacy Quiz | Test Your Money Knowledge"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                        lineNumber: 282,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("meta", {
                        property: "og:description",
                        content: "Challenge yourself with 12 essential financial literacy questions. Discover your financial knowledge level and get personalized improvement recommendations."
                    }, void 0, false, {
                        fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                        lineNumber: 283,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("meta", {
                        property: "og:type",
                        content: "website"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                        lineNumber: 284,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("meta", {
                        property: "og:url",
                        content: "https://yourdomain.com/financial-literacy-quiz"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                        lineNumber: 285,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("meta", {
                        name: "twitter:card",
                        content: "summary_large_image"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                        lineNumber: 288,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("meta", {
                        name: "twitter:title",
                        content: "Financial Literacy Quiz"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                        lineNumber: 289,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("meta", {
                        name: "twitter:description",
                        content: "Test your financial knowledge with our comprehensive quiz"
                    }, void 0, false, {
                        fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                        lineNumber: 290,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                lineNumber: 272,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$script$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                id: "financial-literacy-quiz-schema",
                type: "application/ld+json",
                dangerouslySetInnerHTML: {
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Quiz",
                        "name": "Financial Literacy Quiz",
                        "description": "Interactive financial literacy assessment covering essential money management topics",
                        "educationalLevel": "All levels",
                        "assesses": "Financial knowledge, money management skills, investment understanding",
                        "learningResourceType": "Quiz",
                        "offers": {
                            "@type": "Offer",
                            "price": "0",
                            "priceCurrency": "USD"
                        },
                        "aggregateRating": {
                            "@type": "AggregateRating",
                            "ratingValue": "4.7",
                            "ratingCount": "2800",
                            "bestRating": "5",
                            "worstRating": "1"
                        },
                        "datePublished": currentDate,
                        "dateModified": currentDate,
                        "author": {
                            "@type": "Organization",
                            "name": "Financial Education Academy",
                            "url": "https://yourdomain.com"
                        },
                        "numberOfQuestions": 12,
                        "questionCategories": [
                            "Budgeting",
                            "Emergency Planning",
                            "Debt Management",
                            "Investing Basics",
                            "Investment Math",
                            "Risk Management",
                            "Retirement Planning",
                            "Credit Management",
                            "Investment Types",
                            "Investment Strategy",
                            "Economic Concepts",
                            "Financial Metrics"
                        ]
                    })
                }
            }, void 0, false, {
                fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                lineNumber: 294,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: styles.container,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("header", {
                        className: styles.header,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: styles.headerContent,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                                    className: styles.mainTitle,
                                    children: "Financial Literacy Quiz"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                    lineNumber: 348,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                    className: styles.subtitle,
                                    children: "Test Your Money Knowledge & Build Financial Confidence"
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                    lineNumber: 349,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: styles.badgeContainer,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            className: styles.badge,
                                            children: "12 Essential Questions"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                            lineNumber: 351,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            className: styles.badge,
                                            children: [
                                                "Time: ",
                                                formatTime(timeSpent)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                            lineNumber: 352,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            className: styles.badge,
                                            children: [
                                                "Questions: ",
                                                Object.keys(answers).length,
                                                "/",
                                                questions.length
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                            lineNumber: 353,
                                            columnNumber: 15
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                    lineNumber: 350,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                            lineNumber: 347,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                        lineNumber: 346,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("main", {
                        className: styles.mainContent,
                        children: !quizCompleted ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: styles.quizLayout,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: styles.progressContainer,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: styles.progressBar,
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: styles.progressFill,
                                                style: {
                                                    width: `${getProgressPercentage()}%`
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                lineNumber: 364,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                            lineNumber: 363,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: styles.progressText,
                                            children: [
                                                "Question ",
                                                currentQuestion + 1,
                                                " of ",
                                                questions.length,
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                    className: styles.progressPercentage,
                                                    children: [
                                                        Math.round(getProgressPercentage()),
                                                        "% Complete"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                    lineNumber: 371,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                            lineNumber: 369,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                    lineNumber: 362,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: styles.quizCard,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: styles.questionHeader,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                    className: styles.questionCategory,
                                                    children: questions[currentQuestion].category
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                    lineNumber: 380,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                                    className: styles.questionTitle,
                                                    children: questions[currentQuestion].question
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                    lineNumber: 383,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                            lineNumber: 379,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: styles.optionsContainer,
                                            children: questions[currentQuestion].options.map((option)=>{
                                                const isSelected = answers[questions[currentQuestion].id]?.selected === option.id;
                                                const isAnswered = answers[questions[currentQuestion].id]?.answered;
                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                    className: `${styles.optionButton} ${isSelected ? option.isCorrect ? styles.correct : styles.incorrect : ''} ${isAnswered && !isSelected && option.isCorrect ? styles.missedCorrect : ''}`,
                                                    onClick: ()=>handleAnswer(questions[currentQuestion].id, option.id, option.isCorrect),
                                                    disabled: isAnswered,
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: styles.optionContent,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: styles.optionLetter,
                                                                children: option.id
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                                lineNumber: 407,
                                                                columnNumber: 27
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: styles.optionText,
                                                                children: option.text
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                                lineNumber: 408,
                                                                columnNumber: 27
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            isSelected && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: styles.optionStatus,
                                                                children: option.isCorrect ? '✓ Correct' : '✗ Incorrect'
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                                lineNumber: 410,
                                                                columnNumber: 29
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                        lineNumber: 406,
                                                        columnNumber: 25
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                }, option.id, false, {
                                                    fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                    lineNumber: 394,
                                                    columnNumber: 23
                                                }, ("TURBOPACK compile-time value", void 0));
                                            })
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                            lineNumber: 388,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        answers[questions[currentQuestion].id]?.answered && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: styles.explanationCard,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                    className: styles.explanationTitle,
                                                    children: "💡 Explanation"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                    lineNumber: 422,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                    className: styles.explanationText,
                                                    children: questions[currentQuestion].explanation
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                    lineNumber: 423,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                            lineNumber: 421,
                                            columnNumber: 19
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: styles.navigationButtons,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                    className: styles.navButton,
                                                    onClick: prevQuestion,
                                                    disabled: currentQuestion === 0,
                                                    children: "← Previous"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                    lineNumber: 430,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                    className: styles.navButton,
                                                    onClick: nextQuestion,
                                                    disabled: !answers[questions[currentQuestion].id]?.answered,
                                                    children: currentQuestion === questions.length - 1 ? 'See Results →' : 'Next Question →'
                                                }, void 0, false, {
                                                    fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                    lineNumber: 438,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                            lineNumber: 429,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                    lineNumber: 378,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: styles.questionList,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                            className: styles.listTitle,
                                            children: "Questions"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                            lineNumber: 450,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: styles.questionGrid,
                                            children: questions.map((q, index)=>{
                                                const answer = answers[q.id];
                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                    className: `${styles.questionNumber} ${currentQuestion === index ? styles.current : ''} ${answer ? answer.isCorrect ? styles.answeredCorrect : styles.answeredIncorrect : ''}`,
                                                    onClick: ()=>setCurrentQuestion(index),
                                                    children: [
                                                        index + 1,
                                                        answer && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                            className: styles.answerStatus,
                                                            children: answer.isCorrect ? '✓' : '✗'
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                            lineNumber: 464,
                                                            columnNumber: 27
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, q.id, true, {
                                                    fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                    lineNumber: 455,
                                                    columnNumber: 23
                                                }, ("TURBOPACK compile-time value", void 0));
                                            })
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                            lineNumber: 451,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                    lineNumber: 449,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                            lineNumber: 360,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0)) : /* Results Display */ /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: styles.resultsLayout,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: styles.resultsCard,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                            className: styles.sectionTitle,
                                            children: "Your Financial Literacy Score"
                                        }, void 0, false, {
                                            fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                            lineNumber: 478,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        score && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: styles.scoreDisplay,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: styles.scoreCircle,
                                                            style: {
                                                                background: `conic-gradient(${score.color} ${score.percentage}%, #f3f4f6 ${score.percentage}%)`
                                                            },
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: styles.scoreInner,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: styles.scoreValue,
                                                                        children: [
                                                                            score.percentage,
                                                                            "%"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                                        lineNumber: 487,
                                                                        columnNumber: 27
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: styles.scoreLabel,
                                                                        children: "Score"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                                        lineNumber: 488,
                                                                        columnNumber: 27
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                                lineNumber: 486,
                                                                columnNumber: 25
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                            lineNumber: 483,
                                                            columnNumber: 23
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: styles.scoreDetails,
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: styles.scoreLevel,
                                                                    style: {
                                                                        color: score.color
                                                                    },
                                                                    children: score.level
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                                    lineNumber: 493,
                                                                    columnNumber: 25
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                    className: styles.scoreDescription,
                                                                    children: score.description
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                                    lineNumber: 496,
                                                                    columnNumber: 25
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: styles.scoreStats,
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: styles.statItem,
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                    className: styles.statValue,
                                                                                    children: [
                                                                                        score.correct,
                                                                                        "/",
                                                                                        score.total
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                                                    lineNumber: 500,
                                                                                    columnNumber: 29
                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                    className: styles.statLabel,
                                                                                    children: "Correct Answers"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                                                    lineNumber: 501,
                                                                                    columnNumber: 29
                                                                                }, ("TURBOPACK compile-time value", void 0))
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                                            lineNumber: 499,
                                                                            columnNumber: 27
                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: styles.statItem,
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                    className: styles.statValue,
                                                                                    children: formatTime(score.timeSpent)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                                                    lineNumber: 504,
                                                                                    columnNumber: 29
                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                    className: styles.statLabel,
                                                                                    children: "Time Taken"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                                                    lineNumber: 505,
                                                                                    columnNumber: 29
                                                                                }, ("TURBOPACK compile-time value", void 0))
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                                            lineNumber: 503,
                                                                            columnNumber: 27
                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: styles.statItem,
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                    className: styles.statValue,
                                                                                    children: [
                                                                                        Math.round(score.correct / score.timeSpent * 60),
                                                                                        "/min"
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                                                    lineNumber: 508,
                                                                                    columnNumber: 29
                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                    className: styles.statLabel,
                                                                                    children: "Correct per Hour"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                                                    lineNumber: 511,
                                                                                    columnNumber: 29
                                                                                }, ("TURBOPACK compile-time value", void 0))
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                                            lineNumber: 507,
                                                                            columnNumber: 27
                                                                        }, ("TURBOPACK compile-time value", void 0))
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                                    lineNumber: 498,
                                                                    columnNumber: 25
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                            lineNumber: 492,
                                                            columnNumber: 23
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                    lineNumber: 482,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: styles.categoryBreakdown,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                            className: styles.breakdownTitle,
                                                            children: "Category Performance"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                            lineNumber: 519,
                                                            columnNumber: 23
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: styles.categoryGrid,
                                                            children: Object.entries(score.categoryScores).map(([category, data])=>{
                                                                const percentage = Math.round(data.correct / data.total * 100);
                                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: styles.categoryItem,
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: styles.categoryHeader,
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                    className: styles.categoryName,
                                                                                    children: category
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                                                    lineNumber: 526,
                                                                                    columnNumber: 33
                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                    className: styles.categoryScore,
                                                                                    children: [
                                                                                        percentage,
                                                                                        "%"
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                                                    lineNumber: 527,
                                                                                    columnNumber: 33
                                                                                }, ("TURBOPACK compile-time value", void 0))
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                                            lineNumber: 525,
                                                                            columnNumber: 31
                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: styles.categoryBar,
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                className: styles.categoryBarFill,
                                                                                style: {
                                                                                    width: `${percentage}%`,
                                                                                    backgroundColor: percentage >= 80 ? '#10b981' : percentage >= 60 ? '#f59e0b' : '#ef4444'
                                                                                }
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                                                lineNumber: 530,
                                                                                columnNumber: 33
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                                            lineNumber: 529,
                                                                            columnNumber: 31
                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: styles.categoryDetails,
                                                                            children: [
                                                                                data.correct,
                                                                                " of ",
                                                                                data.total,
                                                                                " correct"
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                                            lineNumber: 539,
                                                                            columnNumber: 31
                                                                        }, ("TURBOPACK compile-time value", void 0))
                                                                    ]
                                                                }, category, true, {
                                                                    fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                                    lineNumber: 524,
                                                                    columnNumber: 29
                                                                }, ("TURBOPACK compile-time value", void 0));
                                                            })
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                            lineNumber: 520,
                                                            columnNumber: 23
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                    lineNumber: 518,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: styles.recommendationsCard,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                            className: styles.recommendationsTitle,
                                                            children: "📚 Personalized Learning Path"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                            lineNumber: 550,
                                                            columnNumber: 23
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        score.percentage < 100 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: styles.recommendationsList,
                                                            children: Object.entries(score.categoryScores).filter(([_, data])=>data.correct / data.total < 0.7).map(([category, data])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: styles.recommendationItem,
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h4", {
                                                                            className: styles.recommendationCategory,
                                                                            children: category
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                                            lineNumber: 558,
                                                                            columnNumber: 33
                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                            className: styles.recommendationText,
                                                                            children: [
                                                                                category === 'Budgeting' && 'Learn the 50/30/20 rule and budgeting methods',
                                                                                category === 'Investing Basics' && 'Study compound interest and investment fundamentals',
                                                                                category === 'Retirement Planning' && 'Understand different retirement accounts and strategies',
                                                                                category === 'Credit Management' && 'Learn how credit scores work and how to improve them',
                                                                                category === 'Debt Management' && 'Master debt repayment strategies and interest calculations',
                                                                                category === 'Risk Management' && 'Understand diversification and risk assessment',
                                                                                ![
                                                                                    'Budgeting',
                                                                                    'Investing Basics',
                                                                                    'Retirement Planning',
                                                                                    'Credit Management',
                                                                                    'Debt Management',
                                                                                    'Risk Management'
                                                                                ].includes(category) && 'Review key concepts and practice calculations'
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                                            lineNumber: 559,
                                                                            columnNumber: 33
                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: styles.recommendationResources,
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                    className: styles.resourceTag,
                                                                                    children: "Recommended Resources:"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                                                    lineNumber: 570,
                                                                                    columnNumber: 35
                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                    className: styles.resourceItem,
                                                                                    children: "Books"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                                                    lineNumber: 571,
                                                                                    columnNumber: 35
                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                    className: styles.resourceItem,
                                                                                    children: "Online Courses"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                                                    lineNumber: 572,
                                                                                    columnNumber: 35
                                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                    className: styles.resourceItem,
                                                                                    children: "Practice Exercises"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                                                    lineNumber: 573,
                                                                                    columnNumber: 35
                                                                                }, ("TURBOPACK compile-time value", void 0))
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                                            lineNumber: 569,
                                                                            columnNumber: 33
                                                                        }, ("TURBOPACK compile-time value", void 0))
                                                                    ]
                                                                }, category, true, {
                                                                    fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                                    lineNumber: 557,
                                                                    columnNumber: 31
                                                                }, ("TURBOPACK compile-time value", void 0)))
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                            lineNumber: 553,
                                                            columnNumber: 25
                                                        }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: styles.perfectScore,
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: styles.perfectIcon,
                                                                    children: "🏆"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                                    lineNumber: 580,
                                                                    columnNumber: 27
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h4", {
                                                                    children: "Perfect Score!"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                                    lineNumber: 581,
                                                                    columnNumber: 27
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                    children: "You have exceptional financial literacy knowledge. Consider:"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                                    lineNumber: 582,
                                                                    columnNumber: 27
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("ul", {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                                                                            children: "Teaching financial literacy to others"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                                            lineNumber: 584,
                                                                            columnNumber: 29
                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                                                                            children: "Exploring advanced investment strategies"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                                            lineNumber: 585,
                                                                            columnNumber: 29
                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                                                                            children: "Learning about estate planning and tax optimization"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                                            lineNumber: 586,
                                                                            columnNumber: 29
                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("li", {
                                                                            children: "Getting certified as a financial educator"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                                            lineNumber: 587,
                                                                            columnNumber: 29
                                                                        }, ("TURBOPACK compile-time value", void 0))
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                                    lineNumber: 583,
                                                                    columnNumber: 27
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                            lineNumber: 579,
                                                            columnNumber: 25
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                    lineNumber: 549,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0)),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: styles.actionButtons,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                            className: styles.primaryButton,
                                                            onClick: restartQuiz,
                                                            children: "↻ Retake Quiz"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                            lineNumber: 594,
                                                            columnNumber: 23
                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                            className: styles.secondaryButton,
                                                            onClick: ()=>window.print(),
                                                            children: "📄 Print Results"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                            lineNumber: 597,
                                                            columnNumber: 23
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                    lineNumber: 593,
                                                    columnNumber: 21
                                                }, ("TURBOPACK compile-time value", void 0))
                                            ]
                                        }, void 0, true)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                    lineNumber: 477,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: styles.educationalContent,
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("article", {
                                        className: styles.articleCard,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                                className: styles.articleTitle,
                                                children: "Why Financial Literacy Matters"
                                            }, void 0, false, {
                                                fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                lineNumber: 608,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: styles.articleSection,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                        className: styles.articleSubtitle,
                                                        children: "The Impact of Financial Knowledge"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                        lineNumber: 611,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                        children: "Financial literacy isn't just about understanding money—it's about making informed decisions that affect every aspect of your life. Studies show that financially literate individuals are more likely to save, invest wisely, avoid high-cost debt, and achieve long-term financial security."
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                        lineNumber: 612,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: styles.statisticsCard,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h4", {
                                                                children: "📈 Financial Literacy Statistics:"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                                lineNumber: 615,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: styles.statisticsGrid,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: styles.statistic,
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                className: styles.statisticValue,
                                                                                children: "53%"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                                                lineNumber: 618,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                className: styles.statisticLabel,
                                                                                children: "Of adults are financially anxious"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                                                lineNumber: 619,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                                        lineNumber: 617,
                                                                        columnNumber: 25
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: styles.statistic,
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                className: styles.statisticValue,
                                                                                children: "3x"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                                                lineNumber: 622,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                className: styles.statisticLabel,
                                                                                children: "Higher retirement savings for literate individuals"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                                                lineNumber: 623,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                                        lineNumber: 621,
                                                                        columnNumber: 25
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: styles.statistic,
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                className: styles.statisticValue,
                                                                                children: "40%"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                                                lineNumber: 626,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                className: styles.statisticLabel,
                                                                                children: "Lower likelihood of using high-cost loans"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                                                lineNumber: 627,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                                        lineNumber: 625,
                                                                        columnNumber: 25
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: styles.statistic,
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                className: styles.statisticValue,
                                                                                children: "2.5x"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                                                lineNumber: 630,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                className: styles.statisticLabel,
                                                                                children: "More likely to have emergency savings"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                                                lineNumber: 631,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                                        lineNumber: 629,
                                                                        columnNumber: 25
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                                lineNumber: 616,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                        lineNumber: 614,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                lineNumber: 610,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: styles.articleSection,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                        className: styles.articleSubtitle,
                                                        children: "Essential Financial Literacy Topics"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                        lineNumber: 638,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: styles.topicsGrid,
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: styles.topicCard,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h4", {
                                                                        children: "💰 Budgeting & Cash Flow"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                                        lineNumber: 642,
                                                                        columnNumber: 25
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                        children: "Understanding income vs expenses, creating sustainable budgets, and managing cash flow effectively."
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                                        lineNumber: 643,
                                                                        columnNumber: 25
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: styles.topicResources,
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                children: "Key Concepts:"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                                                lineNumber: 645,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                children: "50/30/20 Rule"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                                                lineNumber: 646,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                children: "Zero-Based Budgeting"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                                                lineNumber: 647,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                children: "Cash Flow Management"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                                                lineNumber: 648,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                                        lineNumber: 644,
                                                                        columnNumber: 25
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                                lineNumber: 641,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: styles.topicCard,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h4", {
                                                                        children: "📈 Investing Fundamentals"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                                        lineNumber: 653,
                                                                        columnNumber: 25
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                        children: "Compound interest, risk vs return, diversification, and long-term investment strategies."
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                                        lineNumber: 654,
                                                                        columnNumber: 25
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: styles.topicResources,
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                children: "Key Concepts:"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                                                lineNumber: 656,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                children: "Rule of 72"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                                                lineNumber: 657,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                children: "Dollar-Cost Averaging"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                                                lineNumber: 658,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                children: "Asset Allocation"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                                                lineNumber: 659,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                                        lineNumber: 655,
                                                                        columnNumber: 25
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                                lineNumber: 652,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: styles.topicCard,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h4", {
                                                                        children: "🏦 Debt Management"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                                        lineNumber: 664,
                                                                        columnNumber: 25
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                        children: "Good vs bad debt, interest calculations, repayment strategies, and credit management."
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                                        lineNumber: 665,
                                                                        columnNumber: 25
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: styles.topicResources,
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                children: "Key Concepts:"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                                                lineNumber: 667,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                children: "Avalanche Method"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                                                lineNumber: 668,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                children: "Snowball Method"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                                                lineNumber: 669,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                children: "Debt-to-Income Ratio"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                                                lineNumber: 670,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                                        lineNumber: 666,
                                                                        columnNumber: 25
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                                lineNumber: 663,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: styles.topicCard,
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h4", {
                                                                        children: "👵 Retirement Planning"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                                        lineNumber: 675,
                                                                        columnNumber: 25
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                        children: "Retirement accounts, Social Security, withdrawal strategies, and income planning."
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                                        lineNumber: 676,
                                                                        columnNumber: 25
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: styles.topicResources,
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                children: "Key Concepts:"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                                                lineNumber: 678,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                children: "4% Rule"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                                                lineNumber: 679,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                children: "Tax-Advantaged Accounts"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                                                lineNumber: 680,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                children: "Required Minimum Distributions"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                                                lineNumber: 681,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                                        lineNumber: 677,
                                                                        columnNumber: 25
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                                lineNumber: 674,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                        lineNumber: 640,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                                lineNumber: 637,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                        lineNumber: 607,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                    lineNumber: 606,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                            lineNumber: 476,
                            columnNumber: 13
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                        lineNumber: 358,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("footer", {
                        className: styles.footer,
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: styles.footerContent,
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                    className: styles.footerText,
                                    children: [
                                        "Financial Literacy Quiz • Test Your Knowledge • Updated ",
                                        currentDate
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                    lineNumber: 694,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                    className: styles.footerNote,
                                    children: "Note: This quiz is for educational purposes only. Financial literacy is a lifelong learning journey, and this assessment is just one step in building your financial knowledge."
                                }, void 0, false, {
                                    fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                                    lineNumber: 697,
                                    columnNumber: 13
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                            lineNumber: 693,
                            columnNumber: 11
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                        lineNumber: 692,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/pages/financial-literacy-score-calculator.jsx",
                lineNumber: 344,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true);
};
async function getStaticProps() {
    const buildTime = new Date();
    const currentDate = buildTime.toISOString().split('T')[0];
    const lastModifiedDate = buildTime.toISOString();
    return {
        props: {
            currentDate,
            lastModifiedDate
        },
        revalidate: 21600
    };
}
const __TURBOPACK__default__export__ = FinancialLiteracyQuizCalculator;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__e6b0f335._.js.map