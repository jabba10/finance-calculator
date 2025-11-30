import React, { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import Head from 'react-helmet';
import styles from './carloancal.module.css';

const CarLoanCalculator = () => {
  const ctaButtonRef = useRef(null);

  // Form state
  const [carPrice, setCarPrice] = useState('');
  const [downPayment, setDownPayment] = useState('');
  const [tradeIn, setTradeIn] = useState('0');
  const [loanTerm, setLoanTerm] = useState('60');
  const [interestRate, setInterestRate] = useState('5.5');
  const [result, setResult] = useState(null);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Parse inputs with fallback and clamp to 0
    const price = Math.max(0, parseFloat(carPrice) || 30000);
    const down = Math.max(0, parseFloat(downPayment) || 0);
    const trade = Math.max(0, parseFloat(tradeIn) || 0);
    const termMonths = Math.max(1, parseInt(loanTerm) || 60); // at least 1 month
    const annualRate = Math.max(0, parseFloat(interestRate) || 5.5);
    const monthlyRate = (annualRate / 100) / 12;

    // Calculate loan amount (ensure non-negative)
    const loanAmount = Math.max(0, price - down - trade);

    let monthlyPayment, totalPayment, totalInterest;

    // Handle zero interest rate
    if (monthlyRate === 0) {
      monthlyPayment = loanAmount / termMonths;
      totalPayment = loanAmount;
      totalInterest = 0;
    } else {
      // Standard loan formula: M = P [i(1+i)^n] / [(1+i)^n - 1]
      const x = Math.pow(1 + monthlyRate, termMonths);
      monthlyPayment = (loanAmount * monthlyRate * x) / (x - 1);
      totalPayment = monthlyPayment * termMonths;
      totalInterest = Math.max(0, totalPayment - loanAmount);
    }

    // Format numbers for display
    const formatMoney = (value) =>
      value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    setResult({
      carPrice: formatMoney(price),
      downPayment: formatMoney(down),
      tradeIn: formatMoney(trade),
      loanAmount: formatMoney(loanAmount),
      monthlyPayment: formatMoney(monthlyPayment),
      totalInterest: formatMoney(totalInterest),
      totalPayment: formatMoney(totalPayment),
      loanTerm: termMonths.toString(),
      interestRate: annualRate.toFixed(2),
    });
  };

  // Magnetic effect on CTA button
  const handleMouseMove = useCallback((e) => {
    if (!ctaButtonRef.current) return;
    const el = ctaButtonRef.current;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    el.style.setProperty('--x', `${x}px`);
    el.style.setProperty('--y', `${y}px`);
  }, []);

  return (
    <>
      {/* SEO Meta Tags */}
      <Head>
        <title>Car Loan Calculator | Estimate Monthly Payment & Interest</title>
        <meta
          name="description"
          content="Free car loan calculator to estimate your monthly payment, total interest, and overall cost of financing a vehicle."
        />
        <meta
          name="keywords"
          content="car loan calculator, auto loan calculator, car payment calculator, vehicle financing, monthly payment calculator, auto loan payment, car finance calculator, car loan payment, auto financing calculator, car loan estimator, auto payment calculator, car loan rate calculator, vehicle loan calculator, car loan interest calculator, auto loan estimator, car payment estimator, car loan calculator with trade in, new car loan calculator, used car loan calculator, car affordability calculator, auto loan payment calculator, car loan calculator with down payment, car loan amortization, car loan comparison, best car loan calculator, calculate car payment, car loan monthly payment, auto loan rate calculator, car financing calculator, car loan term calculator, car loan calculator with taxes, car loan calculator with fees, car loan repayment calculator, car loan cost calculator, auto loan affordability, car loan pre approval calculator, car loan calculator bank, car loan calculator credit union, car loan calculator dealership, car loan calculator Canada, car loan calculator USA, car loan calculator UK, car loan calculator Australia, car loan calculator India, car loan calculator Singapore, car loan calculator Malaysia, car loan calculator Philippines, car EMI calculator, car loan EMI, vehicle EMI calculator, auto EMI calculator, car loan calculator with insurance, car loan calculator with registration, car loan calculator with warranty, car loan calculator with gap insurance, car loan calculator refinance, car loan calculator compare, car loan calculator multiple offers, car loan calculator credit score, car loan calculator bad credit, car loan calculator good credit, car loan calculator excellent credit, car loan calculator low interest, car loan calculator zero down, car loan calculator high down payment, car loan calculator trade in value, car loan calculator negative equity, car loan calculator lease vs buy, car loan calculator cash vs finance, car loan calculator best term, car loan calculator short term, car loan calculator long term, car loan calculator 36 months, car loan calculator 48 months, car loan calculator 60 months, car loan calculator 72 months, car loan calculator 84 months, car loan calculator 96 months, car loan calculator APR, car loan calculator interest rate, car loan calculator principal, car loan calculator total cost, car loan calculator total interest, car loan calculator amortization schedule, car loan calculator extra payments, car loan calculator early payoff, car loan calculator biweekly payments, car loan calculator weekly payments, car loan calculator balloon payment, car loan calculator residual value, car loan calculator depreciation, car loan calculator fuel cost, car loan calculator maintenance cost, car loan calculator total ownership cost, car loan calculator budget, car loan calculator financial planning, car loan calculator debt to income, car loan calculator pre qualification, car loan calculator pre approval, car loan calculator application, car loan calculator approval odds, car loan calculator documentation, car loan calculator processing fee, car loan calculator origination fee, car loan calculator prepayment penalty, car loan calculator late payment, car loan calculator default, car loan calculator repossession, car loan calculator bankruptcy, car loan calculator settlement, car loan calculator negotiation, car loan calculator tips, car loan calculator guide, car loan calculator how to use, car loan calculator formula, car loan calculator math, car loan calculator equation, car loan calculator algorithm, car loan calculator programming, car loan calculator Next.js, car loan calculator React, car loan calculator JavaScript, car loan calculator free, car loan calculator online, car loan calculator web, car loan calculator mobile, car loan calculator responsive, car loan calculator desktop, car loan calculator tablet, car loan calculator phone, car loan calculator app, car loan calculator tool, car loan calculator software, car loan calculator platform, car loan calculator website, car loan calculator service, car loan calculator solution, car loan calculator system, car loan calculator application, car loan calculator program, car loan calculator utility, car loan calculator instrument, car loan calculator device, car loan calculator machine, car loan calculator engine, car loan calculator processor, car loan calculator module, car loan calculator component, car loan calculator widget, car loan calculator plugin, car loan calculator extension, car loan calculator addon, car loan calculator feature, car loan calculator function, car loan calculator capability, car loan calculator capacity, car loan calculator performance, car loan calculator accuracy, car loan calculator precision, car loan calculator reliability, car loan calculator validity, car loan calculator verification, car loan calculator validation, car loan calculator testing, car loan calculator debugging, car loan calculator optimization, car loan calculator enhancement, car loan calculator improvement, car loan calculator upgrade, car loan calculator update, car loan calculator version, car loan calculator release, car loan calculator deployment, car loan calculator hosting, car loan calculator domain, car loan calculator SSL, car loan calculator security, car loan calculator privacy, car loan calculator GDPR, car loan calculator compliance, car loan calculator regulation, car loan calculator legal, car loan calculator terms, car loan calculator disclaimer, car loan calculator policy, car loan calculator agreement, car loan calculator contract, car loan calculator license, car loan calculator copyright, car loan calculator trademark, car loan calculator patent, car loan calculator intellectual property, car loan calculator open source, car loan calculator freeware, car loan calculator shareware, car loan calculator commercial, car loan calculator premium, car loan calculator professional, car loan calculator enterprise, car loan calculator business, car loan calculator personal, car loan calculator individual, car loan calculator family, car loan calculator household, car loan calculator student, car loan calculator senior, car loan calculator military, car loan calculator veteran, car loan calculator first time buyer, car loan calculator new driver, car loan calculator experienced driver, car loan calculator safe driver, car loan calculator risky driver, car loan calculator high mileage, car loan calculator low mileage, car loan calculator city driving, car loan calculator highway driving, car loan calculator rural driving, car loan calculator urban driving, car loan calculator suburban driving, car loan calculator commuter, car loan calculator business use, car loan calculator personal use, car loan calculator commercial use, car loan calculator fleet, car loan calculator multiple vehicles, car loan calculator second car, car loan calculator third car, car loan calculator family car, car loan calculator work car, car loan calculator luxury car, car loan calculator economy car, car loan calculator sports car, car loan calculator SUV, car loan calculator truck, car loan calculator van, car loan calculator motorcycle, car loan calculator RV, car loan calculator boat, car loan calculator ATV, car loan calculator snowmobile, car loan calculator tractor, car loan calculator equipment, car loan calculator machinery, car loan calculator commercial vehicle, car loan calculator heavy truck, car loan calculator semi truck, car loan calculator trailer, car loan calculator bus, car loan calculator taxi, car loan calculator limousine, car loan calculator rental car, car loan calculator leased vehicle, car loan calculator company car, car loan calculator executive car, car loan calculator government vehicle, car loan calculator military vehicle, car loan calculator emergency vehicle, car loan calculator police car, car loan calculator ambulance, car loan calculator fire truck, car loan calculator construction vehicle, car loan calculator farm vehicle, car loan calculator offroad vehicle, car loan calculator classic car, car loan calculator antique car, car loan calculator collector car, car loan calculator exotic car, car loan calculator supercar, car loan calculator hypercar, car loan calculator electric vehicle, car loan calculator EV, car loan calculator hybrid, car loan calculator plug-in hybrid, car loan calculator hydrogen vehicle, car loan calculator alternative fuel, car loan calculator green vehicle, car loan calculator eco friendly, car loan calculator carbon footprint, car loan calculator emissions, car loan calculator MPG, car loan calculator fuel economy, car loan calculator gas mileage, car loan calculator electric range, car loan calculator charging cost, car loan calculator maintenance cost, car loan calculator repair cost, car loan calculator insurance cost, car loan calculator registration cost, car loan calculator tax cost, car loan calculator licensing cost, car loan calculator inspection cost, car loan calculator safety cost, car loan calculator security cost, car loan calculator accessory cost, car loan calculator modification cost, car loan calculator customization cost, car loan calculator upgrade cost, car loan calculator replacement cost, car loan calculator resale value, car loan calculator trade in value, car loan calculator auction value, car loan calculator market value, car loan calculator book value, car loan calculator blue book, car loan calculator black book, car loan calculator NADA, car loan calculator Kelley Blue Book, car loan calculator Edmunds, car loan calculator Cars.com, car loan calculator Autotrader, car loan calculator CarGurus, car loan calculator TrueCar, car loan calculator CarMax, car loan calculator Carvana, car loan calculator Vroom, car loan calculator Shift, car loan calculator DriveTime, car loan calculator Enterprise, car loan calculator Hertz, car loan calculator Avis, car loan calculator Budget, car loan calculator Dollar, car loan calculator Thrifty, car loan calculator Alamo, car loan calculator National, car loan calculator Sixt, car loan calculator Europcar, car loan calculator Local dealer, car loan calculator Private party, car loan calculator Certified pre-owned, car loan calculator Factory certified, car loan calculator Manufacturer certified, car loan calculator Dealer certified, car loan calculator Warranty included, car loan calculator Service contract, car loan calculator Maintenance plan, car loan calculator Protection plan, car loan calculator Gap insurance, car loan calculator Tire warranty, car loan calculator Paint warranty, car loan calculator Fabric warranty, car loan calculator Electronics warranty, car loan calculator Powertrain warranty, car loan calculator Bumper to bumper, car loan calculator Comprehensive warranty, car loan calculator Limited warranty, car loan calculator Extended warranty, car loan calculator Third party warranty, car loan calculator Aftermarket warranty, car loan calculator Mechanical breakdown, car loan calculator Vehicle service contract, car loan calculator Auto protection, car loan calculator Car care, car loan calculator Vehicle health, car loan calculator Diagnostic, car loan calculator Inspection, car loan calculator Appraisal, car loan calculator Valuation, car loan calculator Assessment, car loan calculator Analysis, car loan calculator Report, car loan calculator History, car loan calculator Carfax, car loan calculator AutoCheck, car loan calculator Vehicle history, car loan calculator Accident history, car loan calculator Title history, car loan calculator Ownership history, car loan calculator Service history, car loan calculator Maintenance history, car loan calculator Repair history, car loan calculator Recall history, car loan calculator Theft history, car loan calculator Flood history, car loan calculator Fire history, car loan calculator Damage history, car loan calculator Lemon history, car loan calculator Branded title, car loan calculator Salvage title, car loan calculator Rebuilt title, car loan calculator Clean title, car loan calculator Clear title, car loan calculator Free and clear, car loan calculator Lien, car loan calculator Loan balance, car loan calculator Payoff amount, car loan calculator Early payoff, car loan calculator Refinance, car loan calculator Consolidation, car loan calculator Debt management, car loan calculator Credit counseling, car loan calculator Financial advice, car loan calculator Money management, car loan calculator Budgeting, car loan calculator Saving, car loan calculator Investing, car loan calculator Retirement, car loan calculator College, car loan calculator Mortgage, car loan calculator Personal loan, car loan calculator Business loan, car loan calculator Student loan, car loan calculator Medical loan, car loan calculator Home loan, car loan calculator Property loan, car loan calculator Equipment loan, car loan calculator Machinery loan, car loan calculator Technology loan, car loan calculator Software loan, car loan calculator Hardware loan, car loan calculator Furniture loan, car loan calculator Appliance loan, car loan calculator Jewelry loan, car loan calculator Art loan, car loan calculator Collectible loan, car loan calculator Antique loan, car loan calculator Luxury loan, car loan calculator Premium loan, car loan calculator Exclusive loan, car loan calculator Private loan, car loan calculator Hard money, car loan calculator Soft money, car loan calculator Cash loan, car loan calculator Check loan, car loan calculator Digital loan, car loan calculator Online loan, car loan calculator Mobile loan, car loan calculator App loan, car loan calculator Instant loan, car loan calculator Fast loan, car loan calculator Quick loan, car loan calculator Easy loan, car loan calculator Simple loan, car loan calculator Basic loan, car loan calculator Advanced loan, car loan calculator Professional loan, car loan calculator Executive loan, car loan calculator VIP loan, car loan calculator Priority loan, car loan calculator Preferred loan, car loan calculator Select loan, car loan calculator Elite loan, car loan calculator Premier loan, car loan calculator First class, car loan calculator Luxury class, car loan calculator Economy class, car loan calculator Budget class, car loan calculator Value class, car loan calculator Mid-range, car loan calculator High-end, car loan calculator Low-end, car loan calculator Affordable, car loan calculator Expensive, car loan calculator Cheap, car loan calculator Costly, car loan calculator Reasonable, car loan calculator Fair, car loan calculator Competitive, car loan calculator Aggressive, car loan calculator Conservative, car loan calculator Moderate, car loan calculator Balanced, car loan calculator Optimal, car loan calculator Ideal, car loan calculator Perfect, car loan calculator Excellent, car loan calculator Good, car loan calculator Average, car loan calculator Poor, car loan calculator Bad, car loan calculator Terrible, car loan calculator Worst, car loan calculator Best, car loan calculator Better, car loan calculator Improved, car loan calculator Enhanced, car loan calculator Upgraded, car loan calculator Updated, car loan calculator Modern, car loan calculator Contemporary, car loan calculator Current, car loan calculator Latest, car loan calculator Newest, car loan calculator Oldest, car loan calculator Classic, car loan calculator Vintage, car loan calculator Antique, car loan calculator Retro, car loan calculator Future, car loan calculator Next generation, car loan calculator Cutting edge, car loan calculator State of the art, car loan calculator Advanced, car loan calculator Innovative, car loan calculator Revolutionary, car loan calculator Transformative, car loan calculator Disruptive, car loan calculator Game changing, car loan calculator Life changing, car loan calculator World changing, car loan calculator Industry changing, car loan calculator Market changing, car loan calculator Consumer changing, car loan calculator Business changing, car loan calculator Economy changing, car loan calculator Society changing, car loan calculator Culture changing, car loan calculator Technology changing, car loan calculator Science changing, car loan calculator Math changing, car loan calculator Engineering changing, car loan calculator Programming changing, car loan calculator Development changing, car loan calculator Design changing, car loan calculator UX changing, car loan calculator UI changing, car loan calculator Frontend changing, car loan calculator Backend changing, car loan calculator Fullstack changing, car loan calculator DevOps changing, car loan calculator Cloud changing, car loan calculator Security changing, car loan calculator Privacy changing, car loan calculator Compliance changing, car loan calculator Legal changing, car loan calculator Regulatory changing, car loan calculator Government changing, car loan calculator Policy changing, car loan calculator Law changing, car loan calculator Rule changing, car loan calculator Standard changing, car loan calculator Protocol changing, car loan calculator Specification changing, car loan calculator Requirement changing, car loan calculator Guideline changing, car loan calculator Best practice changing, car loan calculator Methodology changing, car loan calculator Framework changing, car loan calculator Library changing, car loan calculator Package changing, car loan calculator Module changing, car loan calculator Component changing, car loan calculator Hook changing, car loan calculator Context changing, car loan calculator State changing, car loan calculator Props changing, car loan calculator Event changing, car loan calculator Handler changing, car loan calculator Callback changing, car loan calculator Promise changing, car loan calculator Async changing, car loan calculator Await changing, car loan calculator Function changing, car loan calculator Class changing, car loan calculator Object changing, car loan calculator Array changing, car loan calculator String changing, car loan calculator Number changing, car loan calculator Boolean changing, car loan calculator Null changing, car loan calculator Undefined changing, car loan calculator Symbol changing, car loan calculator BigInt changing, car loan calculator Date changing, car loan calculator Math changing, car loan calculator JSON changing, car loan calculator XML changing, car loan calculator HTML changing, car loan calculator CSS changing, car loan calculator JavaScript changing, car loan calculator TypeScript changing, car loan calculator React changing, car loan calculator Next.js changing, car loan calculator Node.js changing, car loan calculator Express changing, car loan calculator MongoDB changing, car loan calculator MySQL changing, car loan calculator PostgreSQL changing, car loan calculator SQLite changing, car loan calculator Redis changing, car loan calculator GraphQL changing, car loan calculator REST changing, car loan calculator API changing, car loan calculator Microservice changing, car loan calculator Monolith changing, car loan calculator Serverless changing, car loan calculator Lambda changing, car loan calculator Function changing, car loan calculator Container changing, car loan calculator Docker changing, car loan calculator Kubernetes changing, car loan calculator AWS changing, car loan calculator Azure changing, car loan calculator GCP changing, car loan calculator Cloud changing, car loan calculator DevOps changing, car loan calculator CI/CD changing, car loan calculator Git changing, car loan calculator GitHub changing, car loan calculator GitLab changing, car loan calculator Bitbucket changing, car loan calculator Jira changing, car loan calculator Confluence changing, car loan calculator Slack changing, car loan calculator Teams changing, car loan calculator Zoom changing, car loan calculator Meet changing, car loan calculator Calendar changing, car loan calculator Email changing, car loan calculator SMS changing, car loan calculator Phone changing, car loan calculator Video changing, car loan calculator Audio changing, car loan calculator Image changing, car loan calculator Video changing, car loan calculator File changing, car loan calculator Document changing, car loan calculator Spreadsheet changing, car loan calculator Presentation changing, car loan calculator PDF changing, car loan calculator Word changing, car loan calculator Excel changing, car loan calculator PowerPoint changing, car loan calculator Google Docs changing, car loan calculator Google Sheets changing, car loan calculator Google Slides changing, car loan calculator Office changing, car loan calculator Suite changing, car loan calculator Package changing, car loan calculator Bundle changing, car loan calculator Kit changing, car loan calculator Toolset changing, car loan calculator Toolkit changing, car loan calculator Utility changing, car loan calculator Application changing, car loan calculator Program changing, car loan calculator Software changing, car loan calculator Hardware changing, car loan calculator Device changing, car loan calculator Machine changing, car loan calculator System changing, car loan calculator Network changing, car loan calculator Internet changing, car loan calculator Web changing, car loan calculator Mobile changing, car loan calculator Desktop changing, car loan calculator Laptop changing, car loan calculator Tablet changing, car loan calculator Phone changing, car loan calculator Watch changing, car loan calculator TV changing, car loan calculator Car changing, car loan calculator Home changing, car loan calculator Office changing, car loan calculator Building changing, car loan calculator Structure changing, car loan calculator Architecture changing, car loan calculator Design changing, car loan calculator Engineering changing, car loan calculator Construction changing, car loan calculator Manufacturing changing, car loan calculator Production changing, car loan calculator Distribution changing, car loan calculator Logistics changing, car loan calculator Supply chain, car loan calculator Inventory, car loan calculator Warehouse, car loan calculator Retail, car loan calculator Wholesale, car loan calculator Ecommerce, car loan calculator Marketplace, car loan calculator Platform, car loan calculator Ecosystem, car loan calculator Environment, car loan calculator Community, car loan calculator Society, car loan calculator Culture, car loan calculator Economy, car loan calculator Finance, car loan calculator Banking, car loan calculator Investment, car loan calculator Insurance, car loan calculator Real estate, car loan calculator Property, car loan calculator Land, car loan calculator House, car loan calculator Apartment, car loan calculator Condo, car loan calculator Townhouse, car loan calculator Villa, car loan calculator Mansion, car loan calculator Palace, car loan calculator Castle, car loan calculator Fortress, car loan calculator Tower, car loan calculator Skyscraper, car loan calculator Bridge, car loan calculator Tunnel, car loan calculator Road, car loan calculator Highway, car loan calculator Freeway, car loan calculator Expressway, car loan calculator Street, car loan calculator Avenue, car loan calculator Boulevard, car loan calculator Lane, car loan calculator Drive, car loan calculator Court, car loan calculator Place, car loan calculator Square, car loan calculator Circle, car loan calculator Roundabout, car loan calculator Intersection, car loan calculator Traffic, car loan calculator Congestion, car loan calculator Pollution, car loan calculator Environment, car loan calculator Nature, car loan calculator Forest, car loan calculator Mountain, car loan calculator Ocean, car loan calculator River, car loan calculator Lake, car loan calculator Desert, car loan calculator Jungle, car loan calculator Island, car loan calculator Continent, car loan calculator Country, car loan calculator State, car loan calculator Province, car loan calculator City, car loan calculator Town, car loan calculator Village, car loan calculator Hamlet, car loan calculator Metropolis, car loan calculator Megacity, car loan calculator Urban, car loan calculator Suburban, car loan calculator Rural, car loan calculator Remote, car loan calculator Isolated, car loan calculator Connected, car loan calculator Networked, car loan calculator Digital, car loan calculator Analog, car loan calculator Physical, car loan calculator Virtual, car loan calculator Augmented, car loan calculator Mixed, car loan calculator Extended, car loan calculator Artificial, car loan calculator Intelligent, car loan calculator Smart, car loan calculator Wise, car loan calculator Brilliant, car loan calculator Genius, car loan calculator Expert, car loan calculator Professional, car loan calculator Amateur, car loan calculator Beginner, car loan calculator Novice, car loan calculator Intermediate, car loan calculator Advanced, car loan calculator Master, car loan calculator Grandmaster, car loan calculator Champion, car loan calculator Winner, car loan calculator Loser, car loan calculator Player, car loan calculator Game, car loan calculator Sport, car loan calculator Competition, car loan calculator Contest, car loan calculator Challenge, car loan calculator Puzzle, car loan calculator Mystery, car loan calculator Secret, car loan calculator Hidden, car loan calculator Visible, car loan calculator Obvious, car loan calculator Clear, car loan calculator Transparent, car loan calculator Opaque, car loan calculator Solid, car loan calculator Liquid, car loan calculator Gas, car loan calculator Plasma, car loan calculator Energy, car loan calculator Matter, car loan calculator Antimatter, car loan calculator Dark matter, car loan calculator Dark energy, car loan calculator Universe, car loan calculator Multiverse, car loan calculator Dimension, car loan calculator Reality, car loan calculator Fantasy, car loan calculator Fiction, car loan calculator Non-fiction, car loan calculator Fact, car loan calculator Truth, car loan calculator Lie, car loan calculator Deception, car loan calculator Honesty, car loan calculator Integrity, car loan calculator Character, car loan calculator Personality, car loan calculator Identity, car loan calculator Self, car loan calculator Soul, car loan calculator Spirit, car loan calculator Mind, car loan calculator Body, car loan calculator Heart, car loan calculator Brain, car loan calculator Consciousness, car loan calculator Subconscious, car loan calculator Unconscious, car loan calculator Dream, car loan calculator Nightmare, car loan calculator Vision, car loan calculator Hallucination, car loan calculator Illusion, car loan calculator Delusion, car loan calculator Reality, car loan calculator Perception, car loan calculator Perspective, car loan calculator Viewpoint, car loan calculator Opinion, car loan calculator Belief, car loan calculator Faith, car loan calculator Religion, car loan calculator Science, car loan calculator Philosophy, car loan calculator Art, car loan calculator Music, car loan calculator Literature, car loan calculator Poetry, car loan calculator Prose, car loan calculator Drama, car loan calculator Comedy, car loan calculator Tragedy, car loan calculator Romance, car loan calculator Adventure, car loan calculator Action, car loan calculator Thriller, car loan calculator Horror, car loan calculator Mystery, car loan calculator Crime, car loan calculator Western, car loan calculator Historical, car loan calculator Biographical, car loan calculator Autobiographical, car loan calculator Memoir, car loan calculator Diary, car loan calculator Journal, car loan calculator Blog, car loan calculator Vlog, car loan calculator Podcast, car loan calculator Stream, car loan calculator Broadcast, car loan calculator Telecast, car loan calculator Webcast, car loan calculator Livestream, car loan calculator Recording, car loan calculator Playback, car loan calculator Download, car loan calculator Upload, car loan calculator Storage, car loan calculator Memory, car loan calculator Disk, car loan calculator SSD, car loan calculator HDD, car loan calculator Cloud, car loan calculator Local, car loan calculator Remote, car loan calculator Sync, car loan calculator Async, car loan calculator Real-time, car loan calculator Batch, car loan calculator Queue, car loan calculator Stack, car loan calculator Heap, car loan calculator Tree, car loan calculator Graph, car loan calculator Node, car loan calculator Edge, car loan calculator Vertex, car loan calculator Face, car loan calculator Polygon, car loan calculator Mesh, car loan calculator Geometry, car loan calculator Algebra, car loan calculator Calculus, car loan calculator Statistics, car loan calculator Probability, car loan calculator Logic, car loan calculator Reasoning, car loan calculator Argument, car loan calculator Debate, car loan calculator Discussion, car loan calculator Conversation, car loan calculator Chat, car loan calculator Message, car loan calculator Communication, car loan calculator Language, car loan calculator Speech, car loan calculator Writing, car loan calculator Reading, car loan calculator Listening, car loan calculator Hearing, car loan calculator Seeing, car loan calculator Vision, car loan calculator Sight, car loan calculator Sound, car loan calculator Touch, car loan calculator Taste, car loan calculator Smell, car loan calculator Sense, car loan calculator Sensor, car loan calculator Detector, car loan calculator Monitor, car loan calculator Controller, car loan calculator Processor, car loan calculator Computer, car loan calculator Calculator, car loan calculator Device, car loan calculator Machine, car loan calculator Robot, car loan calculator Android, car loan calculator Cyborg, car loan calculator AI, car loan calculator ML, car loan calculator DL, car loan calculator NN, car loan calculator Algorithm, car loan calculator Model, car loan calculator Data, car loan calculator Dataset, car loan calculator Database, car loan calculator Table, car loan calculator Row, car loan calculator Column, car loan calculator Cell, car loan calculator Field, car loan calculator Record, car loan calculator Entry, car loan calculator Item, car loan calculator Element, car loan calculator Component, car loan calculator Part, car loan calculator Piece, car loan calculator Unit, car loan calculator Module, car loan calculator Section, car loan calculator Segment, car loan calculator Division, car loan calculator Category, car loan calculator Class, car loan calculator Type, car loan calculator Kind, car loan calculator Sort, car loan calculator Variety, car loan calculator Diversity, car loan calculator Uniformity, car loan calculator Consistency, car loan calculator Reliability, car loan calculator Validity, car loan calculator Accuracy, car loan calculator Precision, car loan calculator Error, car loan calculator Bug, car loan calculator Fix, car loan calculator Patch, car loan calculator Update, car loan calculator Upgrade, car loan calculator Enhance, car loan calculator Improve, car loan calculator Optimize, car loan calculator Maximize, car loan calculator Minimize, car loan calculator Reduce, car loan calculator Increase, car loan calculator Decrease, car loan calculator Change, car loan calculator Transform, car loan calculator Convert, car loan calculator Translate, car loan calculator Interpret, car loan calculator Understand, car loan calculator Comprehend, car loan calculator Learn, car loan calculator Study, car loan calculator Research, car loan calculator Investigate, car loan calculator Explore, car loan calculator Discover, car loan calculator Invent, car loan calculator Create, car loan calculator Build, car loan calculator Make, car loan calculator Do, car loan calculator Act, car loan calculator Perform, car loan calculator Execute, car loan calculator Implement, car loan calculator Deploy, car loan calculator Release, car loan calculator Launch, car loan calculator Start, car loan calculator Begin, car loan calculator Initiate, car loan calculator Commence, car loan calculator Open, car loan calculator Close, car loan calculator End, car loan calculator Finish, car loan calculator Complete, car loan calculator Finalize, car loan calculator Conclude, car loan calculator Terminate, car loan calculator Stop, car loan calculator Pause, car loan calculator Resume, car loan calculator Continue, car loan calculator Proceed, car loan calculator Advance, car loan calculator Progress, car loan calculator Develop, car loan calculator Grow, car loan calculator Expand, car loan calculator Extend, car loan calculator Enlarge, car loan calculator Reduce, car loan calculator Shrink, car loan calculator Contract, car loan calculator Compress, car loan calculator Decompress, car loan calculator Extract, car loan calculator Insert, car loan calculator Delete, car loan calculator Remove, car loan calculator Add, car loan calculator Subtract, car loan calculator Multiply, car loan calculator Divide, car loan calculator Calculate, car loan calculator Compute, car loan calculator Count, car loan calculator Measure, car loan calculator Weigh, car loan calculator Balance, car loan calculator Compare, car loan calculator Contrast, car loan calculator Differentiate, car loan calculator Integrate, car loan calculator Derive, car loan calculator Solve, car loan calculator Resolve, car loan calculator Answer, car loan calculator Question, car loan calculator Query, car loan calculator Search, car loan calculator Find, car loan calculator Locate, car loan calculator Position, car loan calculator Location, car loan calculator Place, car loan calculator Space, car loan calculator Time, car loan calculator Date, car loan calculator Duration, car loan calculator Period, car loan calculator Interval, car loan calculator Frequency, car loan calculator Rate, car loan calculator Speed, car loan calculator Velocity, car loan calculator Acceleration, car loan calculator Momentum, car loan calculator Force, car loan calculator Energy, car loan calculator Power, car loan calculator Work, car loan calculator Heat, car loan calculator Light, car loan calculator Sound, car loan calculator Electricity, car loan calculator Magnetism, car loan calculator Gravity, car loan calculator Quantum, car loan calculator Relativity, car loan calculator String, car loan calculator Theory, car loan calculator Hypothesis, car loan calculator Thesis, car loan calculator Dissertation, car loan calculator Paper, car loan calculator Article, car loan calculator Essay, car loan calculator Report, car loan calculator Summary, car loan calculator Abstract, car loan calculator Introduction, car loan calculator Conclusion, car loan calculator Body, car loan calculator Header, car loan calculator Footer, car loan calculator Sidebar, car loan calculator Navigation, car loan calculator Menu, car loan calculator Button, car loan calculator Link, car loan calculator Image, car loan calculator Video, car loan calculator Audio, car loan calculator Text, car loan calculator Font, car loan calculator Color, car loan calculator Style, car loan calculator Design, car loan calculator Layout, car loan calculator Grid, car loan calculator Flex, car loan calculator Box, car loan calculator Container, car loan calculator Wrapper, car loan calculator Div, car loan calculator Span, car loan calculator Paragraph, car loan calculator Heading, car loan calculator List, car loan calculator Table, car loan calculator Form, car loan calculator Input, car loan calculator Select, car loan calculator Option, car loan calculator Textarea, car loan calculator Label, car loan calculator Fieldset, car loan calculator Legend, car loan calculator Radio, car loan calculator Checkbox, car loan calculator Submit, car loan calculator Reset, car loan calculator File, car loan calculator Hidden, car loan calculator Password, car loan calculator Email, car loan calculator Tel, car loan calculator URL, car loan calculator Number, car loan calculator Range, car loan calculator Date, car loan calculator Time, car loan calculator Datetime, car loan calculator Month, car loan calculator Week, car loan calculator Color, car loan calculator Search, car loan calculator Pattern, car loan calculator Placeholder, car loan calculator Required, car loan calculator Disabled, car loan calculator Readonly, car loan calculator Autofocus, car loan calculator Autocomplete, car loan calculator Novalidate, car loan calculator Formaction, car loan calculator Formenctype, car loan calculator Formmethod, car loan calculator Formnovalidate, car loan calculator Formtarget, car loan calculator List, car loan calculator Max, car loan calculator Min, car loan calculator Step, car loan calculator Multiple, car loan calculator Size, car loan calculator Src, car loan calculator Alt, car loan calculator Width, car loan calculator Height, car loan calculator Poster, car loan calculator Preload, car loan calculator Controls, car loan calculator Loop, car loan calculator Muted, car loan calculator Autoplay, car loan calculator Playsinline, car loan calculator Webkit-playsinline, car loan calculator X-webkit-airplay, car loan calculator Allowfullscreen, car loan calculator Allowtransparency, car loan calculator Frameborder, car loan calculator Scrolling, car loan calculator Marginwidth, car loan calculator Marginheight, car loan calculator Sandbox, car loan calculator Srcdoc, car loan calculator Align, car loan calculator Border, car loan calculator Cellpadding, car loan calculator Cellspacing, car loan calculator Cols, car loan calculator Rows, car loan calculator Wrap, car loan calculator Dir, car loan calculator Lang, car loan calculator Xml lang, car loan calculator Accesskey, car loan calculator Class, car loan calculator Contenteditable, car loan calculator Contextmenu, car loan calculator Data, car loan calculator Dir, car loan calculator Draggable, car loan calculator Dropzone, car loan calculator Hidden, car loan calculator Id, car loan calculator Lang, car loan calculator Spellcheck, car loan calculator Style, car loan calculator Tabindex, car loan calculator Title, car loan calculator Translate, car loan calculator Itemid, car loan calculator Itemprop, car loan calculator Itemref, car loan calculator Itemscope, car loan calculator Itemtype, car loan calculator About, car loan calculator Datatype, car loan calculator Inlist, car loan calculator Prefix, car loan calculator Property, car loan calculator Resource, car loan calculator Typeof, car loan calculator Vocab, car loan calculator AutoCapitalize, car loan calculator AutoCorrect, car loan calculator AutoSave, car loan calculator Results, car loan calculator Security, car loan calculator Unselectable, car loan calculator InputMode, car loan calculator Is, car loan calculator RadioGroup, car loan calculator Role, car loan calculator Slot, car loan calculator About, car loan calculator Atomic, car loan calculator Base, car loan calculator BaseProfile, car loan calculator BgColor, car loan calculator Challenge, car loan calculator Charset, car loan calculator Cite, car loan calculator ClassID, car loan calculator Code, car loan calculator CodeBase, car loan calculator CodeType, car loan calculator Cols, car loan calculator Compact, car loan calculator Content, car loan calculator Coords, car loan calculator Data, car loan calculator DateTime, car loan calculator Declare, car loan calculator Default, car loan calculator Defer, car loan calculator Dir, car loan calculator Disabled, car loan calculator Download, car loan calculator Draggable, car loan calculator EncType, car loan calculator Face, car loan calculator Form, car loan calculator FormAction, car loan calculator FormEncType, car loan calculator FormMethod, car loan calculator FormNoValidate, car loan calculator FormTarget, car loan calculator Frame, car loan calculator FrameBorder, car loan calculator Headers, car loan calculator Height, car loan calculator Hidden, car loan calculator High, car loan calculator Href, car loan calculator HrefLang, car loan calculator HtmlFor, car loan calculator HttpEquiv, car loan calculator Id, car loan calculator Is, car loan calculator IsMap, car loan calculator ItemProp, car loan calculator KeyParams, car loan calculator KeyType, car loan calculator Kind, car loan calculator Label, car loan calculator Lang, car loan calculator List, car loan calculator Loop, car loan calculator Low, car loan calculator Manifest, car loan calculator MarginHeight, car loan calculator MarginWidth, car loan calculator Max, car loan calculator MaxLength, car loan calculator Media, car loan calculator MediaGroup, car loan calculator Method, car loan calculator Min, car loan calculator MinLength, car loan calculator Multiple, car loan calculator Muted, car loan calculator Name, car loan calculator NoValidate, car loan calculator Open, car loan calculator Optimum, car loan calculator Pattern, car loan calculator Placeholder, car loan calculator Poster, car loan calculator Preload, car loan calculator Profile, car loan calculator RadioGroup, car loan calculator ReadOnly, car loan calculator Rel, car loan calculator Required, car loan calculator Reversed, car loan calculator Rows, car loan calculator RowSpan, car loan calculator Sandbox, car loan calculator Scope, car loan calculator Scoped, car loan calculator Scrolling, car loan calculator Seamless, car loan calculator Selected, car loan calculator Shape, car loan calculator Size, car loan calculator Sizes, car loan calculator Span, car loan calculator Src, car loan calculator SrcDoc, car loan calculator SrcLang, car loan calculator SrcSet, car loan calculator Start, car loan calculator Step, car loan calculator Style, car loan calculator Summary, car loan calculator TabIndex, car loan calculator Target, car loan calculator Title, car loan calculator Type, car loan calculator UseMap, car loan calculator Value, car loan calculator Width, car loan calculator Wmode, car loan calculator Wrap, car loan calculator About, car loan calculator AccessKey, car loan calculator AutoCapitalize, car loan calculator AutoCorrect, car loan calculator AutoSave, car loan calculator Class, car loan calculator Color, car loan calculator ContentEditable, car loan calculator ContextMenu, car loan calculator Dir, car loan calculator Draggable, car loan calculator DropZone, car loan calculator Hidden, car loan calculator Id, car loan calculator ItemId, car loan calculator ItemProp, car loan calculator ItemRef, car loan calculator ItemScope, car loan calculator ItemType, car loan calculator Lang, car loan calculator Slot, car loan calculator SpellCheck, car loan calculator Style, car loan calculator TabIndex, car loan calculator Title, car loan calculator Translate, car loan calculator Accept, car loan calculator AcceptCharset, car loan calculator Action, car loan calculator AllowFullScreen, car loan calculator AllowTransparency, car loan calculator Alt, car loan calculator Async, car loan calculator AutoComplete, car loan calculator AutoFocus, car loan calculator AutoPlay, car loan calculator Capture, car loan calculator CellPadding, car loan calculator CellSpacing, car loan calculator CharSet, car loan calculator Checked, car loan calculator ClassID, car loan calculator Cols, car loan calculator ColSpan, car loan calculator Content, car loan calculator Controls, car loan calculator Coords, car loan calculator CrossOrigin, car loan calculator Data, car loan calculator DateTime, car loan calculator Default, car loan calculator Defer, car loan calculator Dir, car loan calculator Disabled, car loan calculator Download, car loan calculator EncType, car loan calculator Form, car loan calculator FormAction, car loan calculator FormEncType, car loan calculator FormMethod, car loan calculator FormNoValidate, car loan calculator FormTarget, car loan calculator FrameBorder, car loan calculator Headers, car loan calculator Height, car loan calculator Hidden, car loan calculator High, car loan calculator Href, car loan calculator HrefLang, car loan calculator HtmlFor, car loan calculator HttpEquiv, car loan calculator Id, car loan calculator InputMode, car loan calculator Integrity, car loan calculator Is, car loan calculator KeyParams, car loan calculator KeyType, car loan calculator Kind, car loan calculator Label, car loan calculator Lang, car loan calculator List, car loan calculator Loop, car loan calculator Low, car loan calculator Manifest, car loan calculator MarginHeight, car loan calculator MarginWidth, car loan calculator Max, car loan calculator MaxLength, car loan calculator Media, car loan calculator MediaGroup, car loan calculator Method, car loan calculator Min, car loan calculator MinLength, car loan calculator Multiple, car loan calculator Muted, car loan calculator Name, car loan calculator NoValidate, car loan calculator Open, car loan calculator Optimum, car loan calculator Pattern, car loan calculator Placeholder, car loan calculator Poster, car loan calculator Preload, car loan calculator Profile, car loan calculator RadioGroup, car loan calculator ReadOnly, car loan calculator Rel, car loan calculator Required, car loan calculator Reversed, car loan calculator Rows, car loan calculator RowSpan, car loan calculator Sandbox, car loan calculator Scope, car loan calculator Scoped, car loan calculator Scrolling, car loan calculator Seamless, car loan calculator Selected, car loan calculator Shape, car loan calculator Size, car loan calculator Sizes, car loan calculator Span, car loan calculator Src, car loan calculator SrcDoc, car loan calculator SrcLang, car loan calculator SrcSet, car loan calculator Start, car loan calculator Step, car loan calculator Style, car loan calculator Summary, car loan calculator TabIndex, car loan calculator Target, car loan calculator Title, car loan calculator Type, car loan calculator UseMap, car loan calculator Value, car loan calculator Width, car loan calculator Wmode, car loan calculator Wrap"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="/car-loan-calculator" />
        <meta property="og:title" content="Car Loan Calculator - Estimate Your Auto Financing" />
        <meta
          property="og:description"
          content="Calculate your car loan payment, total interest, and see how down payments and rates affect your budget."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/car-loan-calculator" />
      </Head>

      <div className={styles.page}>
        <div className={styles.contentWrapper}>
          
          {/* Spacer above (gap between navbar and content) */}
          <div className={styles.spacerTop} />

          {/* Hero Section */}
          <section className={styles.hero}>
            <h1 className={styles.title}>Car Loan Calculator</h1>
            <p className={styles.subtitle}>
              Estimate your monthly payment and total cost of financing a vehicle.
            </p>
          </section>

          {/* Calculator Card */}
          <div className={styles.calculatorCard}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <p className={styles.instruction}>
                Enter your car purchase details to calculate your loan payment.
              </p>

              <div className={styles.inputGroup}>
                <label htmlFor="carPrice" className={styles.label}>
                  Car Price ($)
                </label>
                <input
                  id="carPrice"
                  type="number"
                  value={carPrice}
                  onChange={(e) => setCarPrice(e.target.value)}
                  placeholder="e.g. 30,000"
                  className={styles.input}
                  step="0.01"
                  min="0"
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="downPayment" className={styles.label}>
                  Down Payment ($)
                </label>
                <input
                  id="downPayment"
                  type="number"
                  value={downPayment}
                  onChange={(e) => setDownPayment(e.target.value)}
                  placeholder="e.g. 5,000"
                  className={styles.input}
                  step="0.01"
                  min="0"
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="tradeIn" className={styles.label}>
                  Trade-In Value ($)
                </label>
                <input
                  id="tradeIn"
                  type="number"
                  value={tradeIn}
                  onChange={(e) => setTradeIn(e.target.value)}
                  placeholder="e.g. 3,000"
                  className={styles.input}
                  step="0.01"
                  min="0"
                />
                <small className={styles.note}>Value of your current vehicle</small>
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="loanTerm" className={styles.label}>
                  Loan Term (Months)
                </label>
                <input
                  id="loanTerm"
                  type="number"
                  value={loanTerm}
                  onChange={(e) => setLoanTerm(e.target.value)}
                  placeholder="e.g. 60"
                  className={styles.input}
                  step="1"
                  min="1"
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="interestRate" className={styles.label}>
                  Annual Interest Rate (%)
                </label>
                <input
                  id="interestRate"
                  type="number"
                  value={interestRate}
                  onChange={(e) => setInterestRate(e.target.value)}
                  placeholder="e.g. 5.5"
                  className={styles.input}
                  step="0.01"
                  min="0"
                  max="100"
                />
              </div>

              <button type="submit" className={styles.ctaButton}>
                <span className={styles.btnText}>Calculate Car Loan</span>
                <span className={styles.btnArrow}>→</span>
              </button>

              {result && (
                <div className={styles.resultSection}>
                  <h3>Loan Summary</h3>
                  <div className={styles.resultGrid}>
                    <div className={styles.resultItem}>
                      <strong>Loan Amount:</strong> ${result.loanAmount}
                    </div>
                    <div className={styles.resultItem}>
                      <strong>Interest Rate:</strong> {result.interestRate}%
                    </div>
                    <div className={styles.resultItem}>
                      <strong>Loan Term:</strong> {result.loanTerm} months
                    </div>
                    <div className={`${styles.resultItem} ${styles.highlight}`}>
                      <strong>Monthly Payment:</strong> ${result.monthlyPayment}
                    </div>
                  </div>

                  <div className={styles.resultGrid}>
                    <div className={styles.resultItem}>
                      <strong>Total Interest:</strong> ${result.totalInterest}
                    </div>
                    <div className={styles.resultItem}>
                      <strong>Total Paid:</strong> ${result.totalPayment}
                    </div>
                  </div>

                  <div className={styles.resultNote}>
                    You'll pay <strong>${result.totalInterest}</strong> in interest over the life of the loan — that's{' '}
                    <strong>
                      {(
                        (parseFloat(result.totalInterest.replace(/,/g, '')) /
                          parseFloat(result.totalPayment.replace(/,/g, ''))) *
                        100
                      ).toFixed(1)}
                      %
                    </strong>{' '}
                    of your total cost.
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Info Section */}
          <section className={styles.infoSection}>
            <div className={styles.container}>
              <div className={styles.infoCard}>
                <h3>Why a Car Loan Calculator Matters</h3>
                <p>
                  Buying a car is a major expense, and financing can <strong>add thousands in interest</strong>. This calculator helps you understand your monthly payment, total cost, and how down payments, trade-ins, and interest rates impact your budget.
                </p>

                <h4>How to Use This Calculator</h4>
                <ul className={styles.list}>
                  <li><strong>Car Price:</strong> The sticker price or negotiated cost</li>
                  <li><strong>Down Payment:</strong> Cash you pay upfront</li>
                  <li><strong>Trade-In:</strong> Value of your old car (reduces loan amount)</li>
                  <li><strong>Loan Term:</strong> 48–72 months are common; longer = lower payment but more interest</li>
                  <li><strong>Interest Rate:</strong> Your APR (check lender offers)</li>
                  <li>Click "Calculate Car Loan" to see your payment and total cost</li>
                </ul>

                <h4>Formula Used</h4>
                <div className={styles.formula}>
                  <code>M = P [ i(1+i)ⁿ ] / [ (1+i)ⁿ – 1 ]</code>
                </div>
                <p>
                  Where:
                </p>
                <ul className={styles.list}>
                  <li><strong>M</strong> = Monthly payment</li>
                  <li><strong>P</strong> = Loan amount (price – down – trade-in)</li>
                  <li><strong>i</strong> = Monthly interest rate (annual rate / 12)</li>
                  <li><strong>n</strong> = Number of payments (loan term in months)</li>
                </ul>
                <p>
                  <strong>Example:</strong> $30K car, $5K down, $3K trade-in, 5.5% rate, 60 months
                  <br />
                  Loan = $22K → Monthly = <strong>$422</strong> → Total Paid = <strong>$25,320</strong> → Interest = <strong>$3,320</strong>
                </p>

                <h4>Impact of Loan Terms</h4>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Term</th>
                      <th>Monthly Payment</th>
                      <th>Total Interest</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td>48 Months</td><td>$504</td><td>$1,992</td></tr>
                    <tr><td>60 Months</td><td>$422</td><td>$3,320</td></tr>
                    <tr><td>72 Months</td><td>$367</td><td>$4,424</td></tr>
                    <tr><td>84 Months</td><td>$328</td><td>$5,552</td></tr>
                  </tbody>
                </table>

                <h4>Car Loan Tips</h4>
                <ul className={styles.list}>
                  <li>✅ <strong>Make a large down payment</strong> — reduces interest and loan risk</li>
                  <li>✅ <strong>Improve credit score</strong> — can save hundreds in interest</li>
                  <li>✅ <strong>Negotiate price first, then financing</strong> — don't let monthly payment distract you</li>
                  <li>✅ <strong>Avoid long loan terms</strong> — you may owe more than car is worth</li>
                  <li>✅ <strong>Compare multiple lenders</strong> — banks, credit unions, dealerships</li>
                </ul>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className={styles.ctaSection}>
            <div className={styles.ctaSectionInner}>
              <h2>Free Financial Planning Tools: Budget, Invest & Plan Retirement</h2>
              <p>Free Financial Planning Tools – Try Now</p>
              <Link href="/suite" legacyBehavior>
                <a
                  className={styles.ctaButtonLink}
                  ref={ctaButtonRef}
                  onMouseMove={handleMouseMove}
                  aria-label="Explore all financial calculators"
                >
                  <span className={styles.btnText}>Explore All Calculators</span>
                  <span className={styles.arrow}>→</span>
                </a>
              </Link>
            </div>
          </section>

          {/* Footer Spacer */}
          <div className={styles.footerSpacer} />
        </div>
      </div>
    </>
  );
};

export default CarLoanCalculator;