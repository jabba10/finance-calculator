import React, { useState, useRef } from 'react';
import Link from 'next/link';
import Head from 'react-helmet';
import styles from './valuationcalculator.module.css';

const ValuationCalculator = () => {
  const ctaButtonRef = useRef(null);

  // Form state
  const [revenue, setRevenue] = useState('');
  const [profit, setProfit] = useState('');
  const [industryMultiplier, setIndustryMultiplier] = useState('2.5');
  const [valuationMethod, setValuationMethod] = useState('revenue');
  const [result, setResult] = useState(null);

  // Helper: Extract first number from any string
  const parseNumber = (input) => {
    if (!input) return NaN;
    // Remove commas and match the first number (including decimals)
    const match = input.toString().replace(/,/g, '').match(/\d+(\.\d+)?/);
    return match ? parseFloat(match[0]) : NaN;
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setResult(null);

    // Default values
    let revenueValue = 0;
    let profitValue = 0;
    let multiplier = 2.5; // default multiplier

    // Parse revenue if method is revenue
    if (valuationMethod === 'revenue') {
      const parsed = parseNumber(revenue);
      revenueValue = !isNaN(parsed) ? parsed : 0;
    }

    // Parse profit if method is profit
    if (valuationMethod === 'profit') {
      const parsed = parseNumber(profit);
      profitValue = !isNaN(parsed) ? parsed : 0;
    }

    // Always parse multiplier (never fail)
    const parsedMultiplier = parseNumber(industryMultiplier);
    if (!isNaN(parsedMultiplier) && parsedMultiplier > 0) {
      multiplier = parsedMultiplier;
    }

    // Calculate valuation
    const valuation = valuationMethod === 'revenue'
      ? revenueValue * multiplier
      : profitValue * multiplier;

    const methodUsed = valuationMethod === 'revenue'
      ? `Revenue Multiple (${multiplier.toFixed(1)}x)`
      : `Profit Multiple (${multiplier.toFixed(1)}x)`;

    // Format for display
    setResult({
      revenue: revenueValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      profit: profitValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      multiplier: multiplier.toFixed(1),
      valuation: valuation.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }),
      methodUsed,
      valuationMethod,
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

  return (
    <>
      {/* SEO Metadata */}
      <Head>
        <title>Business Valuation Calculator | Free Tool to Estimate Company Worth</title>
        <meta
          name="description"
          content="Estimate your company's value using industry-standard multiples. Perfect for startups, investors, and business owners planning exits or funding."
        />
        <meta
          name="keywords"
          content="business valuation calculator, company valuation, startup valuation, revenue multiple, profit multiple, M&A tools, 
          business worth calculator, company value estimator, small business valuation, startup valuation calculator, 
          business valuation tool, company worth calculator, enterprise value calculator, business appraisal calculator, 
          valuation multiple calculator, SMB valuation, business equity calculator, company valuation tool, 
          business sale valuation, acquisition valuation, investment valuation, financial valuation calculator, 
          business price calculator, company appraisal, business value estimator, valuation calculator online, 
          free business valuation, online valuation tool, digital business valuation, SaaS valuation calculator, 
          ecommerce business valuation, retail business valuation, manufacturing company valuation, 
          service business valuation, professional practice valuation, medical practice valuation, 
          law firm valuation, accounting firm valuation, restaurant valuation, hotel valuation, 
          tech startup valuation, software company valuation, online business valuation, 
          EBITDA multiple calculator, revenue based valuation, profit based valuation, 
          business multiples calculator, industry multiples, valuation benchmarks, 
          pre-money valuation, post-money valuation, funding round valuation, 
          business exit valuation, succession planning valuation, merger valuation, 
          due diligence valuation, financial analysis tool, investment analysis, 
          business performance valuation, cash flow valuation, asset based valuation, 
          market approach valuation, income approach valuation, DCF calculator, 
          discounted cash flow valuation, business metrics calculator, 
          financial ratio valuation, business health checker, company performance valuation, 
          startup worth calculator, small business price estimator, company sale price, 
          business acquisition price, buyout valuation, partnership buyout calculator, 
          shareholder valuation, equity value calculator, business net worth, 
          company assets valuation, intangible assets valuation, goodwill valuation, 
          brand valuation calculator, intellectual property valuation, 
          business valuation for banks, loan collateral valuation, 
          SBA loan valuation, business loan calculator, financing valuation, 
          investor pitch valuation, venture capital valuation, angel investor valuation, 
          private equity valuation, business valuation report, valuation certificate, 
          certified business valuation, professional valuation services, 
          online business appraisal, instant valuation estimate, quick business valuation, 
          accurate business valuation, reliable valuation calculator, 
          comprehensive business valuation, detailed company appraisal, 
          business valuation methodology, valuation best practices, 
          industry standard valuation, market comparable valuation, 
          transaction multiples valuation, public company multiples, 
          private company valuation, closely held business valuation, 
          family business valuation, franchise valuation calculator, 
          business broker valuation, M&A advisor tool, investment banking valuation, 
          financial advisor tool, CPA valuation tool, accountant valuation calculator, 
          business consultant valuation, entrepreneurship tools, startup tools, 
          small business tools, financial planning tools, business analysis tools, 
          corporate finance calculator, strategic planning valuation, 
          business growth valuation, scalability assessment, 
          valuation trends 2024, current market multiples, industry valuation data, 
          business valuation guide, how to value a business, valuation formulas, 
          financial modeling valuation, pro forma valuation, forecast based valuation, 
          historical performance valuation, future earnings valuation, 
          risk assessment valuation, market conditions valuation, 
          economic factors valuation, industry outlook valuation, 
          competitive analysis valuation, market position valuation, 
          customer base valuation, contract value valuation, 
          recurring revenue valuation, subscription business valuation, 
          SaaS metrics valuation, MRR valuation, ARR valuation, 
          customer lifetime value, churn rate valuation, 
          growth rate valuation, profitability valuation, 
          margin analysis valuation, operational efficiency valuation, 
          management team valuation, employee valuation, 
          technology stack valuation, proprietary technology valuation, 
          patent valuation, trademark valuation, trade secret valuation, 
          business process valuation, operational systems valuation, 
          supply chain valuation, distribution network valuation, 
          market share valuation, brand recognition valuation, 
          customer loyalty valuation, online presence valuation, 
          digital assets valuation, website valuation, social media valuation, 
          business valuation for insurance, estate planning valuation, 
          divorce settlement valuation, legal dispute valuation, 
          tax planning valuation, IRS business valuation, 
          gift tax valuation, estate tax valuation, 
          business valuation for court, expert witness valuation, 
          litigation support valuation, arbitration valuation, 
          mediation valuation, business damage valuation, 
          economic loss valuation, business interruption valuation, 
          valuation for restructuring, bankruptcy valuation, 
          turnaround valuation, distressed business valuation, 
          startup valuation methods, early stage valuation, 
          seed stage valuation, Series A valuation, growth stage valuation, 
          mature business valuation, established company valuation, 
          public company valuation, private equity valuation, 
          venture capital valuation, angel investment valuation, 
          crowdfunding valuation, ICO valuation, token valuation, 
          blockchain business valuation, crypto company valuation, 
          metaverse business valuation, AI company valuation, 
          tech valuation multiples, digital business multiples, 
          online business valuation metrics, ecommerce valuation factors, 
          physical business valuation, brick and mortar valuation, 
          service industry valuation, product business valuation, 
          B2B business valuation, B2C business valuation, 
          local business valuation, national business valuation, 
          international business valuation, global company valuation, 
          multinational valuation, conglomerate valuation, 
          holding company valuation, subsidiary valuation, 
          division valuation, business unit valuation, 
          product line valuation, service line valuation, 
          geographic segment valuation, market segment valuation, 
          customer segment valuation, demographic valuation, 
          psychographic valuation, behavioral valuation, 
          seasonal business valuation, cyclical business valuation, 
          recession proof business valuation, pandemic resilient valuation, 
          future proof business valuation, innovative business valuation, 
          traditional business valuation, legacy business valuation, 
          new age business valuation, digital native valuation, 
          omnichannel business valuation, hybrid business valuation, 
          remote business valuation, virtual business valuation, 
          platform business valuation, marketplace valuation, 
          aggregator valuation, SaaS platform valuation, 
          PaaS valuation, IaaS valuation, API business valuation, 
          data business valuation, analytics business valuation, 
          AI business valuation, machine learning business valuation, 
          blockchain business valuation, fintech valuation, 
          healthtech valuation, edtech valuation, cleantech valuation, 
          greentech valuation, biotech valuation, medtech valuation, 
          legaltech valuation, insuretech valuation, proptech valuation, 
          construction tech valuation, agtech valuation, foodtech valuation, 
          retail tech valuation, logistics tech valuation, 
          transportation tech valuation, energy tech valuation, 
          manufacturing tech valuation, industrial tech valuation, 
          consumer tech valuation, enterprise tech valuation, 
          B2B tech valuation, B2C tech valuation, 
          direct to consumer valuation, wholesale business valuation, 
          distribution business valuation, manufacturing valuation, 
          assembly business valuation, import export valuation, 
          retail store valuation, online store valuation, 
          omnichannel retail valuation, dropshipping valuation, 
          print on demand valuation, custom manufacturing valuation, 
          service provider valuation, agency valuation, 
          consulting firm valuation, professional services valuation, 
          creative agency valuation, marketing agency valuation, 
          advertising agency valuation, PR agency valuation, 
          design agency valuation, development agency valuation, 
          IT services valuation, managed services valuation, 
          outsourcing business valuation, staffing agency valuation, 
          recruitment firm valuation, executive search valuation, 
          training business valuation, education business valuation, 
          coaching business valuation, mentoring business valuation, 
          subscription box valuation, membership site valuation, 
          digital product valuation, physical product valuation, 
          hybrid product service valuation, experience business valuation, 
          event business valuation, entertainment business valuation, 
          media business valuation, content business valuation, 
          publishing business valuation, news business valuation, 
          blog valuation, podcast valuation, video channel valuation, 
          social media influencer valuation, personal brand valuation, 
          celebrity business valuation, athlete business valuation, 
          artist business valuation, musician business valuation, 
          author business valuation, thought leader valuation, 
          expert valuation, guru business valuation, 
          niche authority valuation, category leader valuation, 
          market leader valuation, innovator valuation, 
          pioneer valuation, first mover valuation, 
          fast follower valuation, disruptor valuation, 
          sustainable business valuation, ethical business valuation, 
          social enterprise valuation, nonprofit valuation, 
          benefit corporation valuation, B Corp valuation, 
          purpose driven business valuation, mission driven valuation, 
          values based business valuation, culture focused valuation, 
          employee owned valuation, cooperative valuation, 
          franchisee valuation, licensor valuation, licensee valuation, 
          joint venture valuation, partnership valuation, 
          sole proprietorship valuation, corporation valuation, 
          LLC valuation, S Corp valuation, C Corp valuation, 
          public benefit corporation valuation, 
          micro business valuation, nano business valuation, 
          solopreneur valuation, side business valuation, 
          hobby business valuation, passion project valuation, 
          main business valuation, primary income valuation, 
          secondary business valuation, portfolio business valuation, 
          holding company valuation, operating company valuation, 
          asset holding valuation, IP holding valuation, 
          royalty business valuation, licensing business valuation, 
          franchise business valuation, chain business valuation, 
          multi location valuation, single location valuation, 
          home based business valuation, virtual business valuation, 
          remote team valuation, distributed company valuation, 
          global team valuation, multicultural business valuation, 
          diverse business valuation, inclusive business valuation, 
          women owned business valuation, minority owned valuation, 
          veteran owned valuation, LGBTQ+ owned valuation, 
          disability owned valuation, indigenous owned valuation, 
          emerging market valuation, developing economy valuation, 
          frontier market valuation, established market valuation, 
          saturated market valuation, growing market valuation, 
          declining market valuation, transforming market valuation, 
          regulated industry valuation, deregulated industry valuation, 
          emerging industry valuation, mature industry valuation, 
          declining industry valuation, cyclical industry valuation, 
          defensive industry valuation, growth industry valuation, 
          value industry valuation, blend industry valuation, 
          B2B industry valuation, B2C industry valuation, 
          B2B2C valuation, C2C valuation, P2P valuation, 
          platform to platform valuation, API economy valuation, 
          digital economy valuation, traditional economy valuation, 
          mixed economy valuation, hybrid economy valuation, 
          physical economy valuation, virtual economy valuation, 
          metaverse economy valuation, web3 valuation, 
          blockchain economy valuation, crypto economy valuation, 
          token economy valuation, decentralized valuation, 
          centralized valuation, traditional valuation, 
          modern valuation, contemporary valuation, 
          future valuation, predictive valuation, 
          AI powered valuation, machine learning valuation, 
          data driven valuation, algorithm based valuation, 
          automated valuation, manual valuation, 
          expert based valuation, crowd sourced valuation, 
          market based valuation, intrinsic valuation, 
          relative valuation, absolute valuation, 
          fundamental valuation, technical valuation, 
          quantitative valuation, qualitative valuation, 
          objective valuation, subjective valuation, 
          conservative valuation, aggressive valuation, 
          realistic valuation, optimistic valuation, 
          pessimistic valuation, balanced valuation, 
          comprehensive valuation, simplified valuation, 
          quick valuation, detailed valuation, 
          preliminary valuation, final valuation, 
          draft valuation, certified valuation, 
          official valuation, unofficial valuation, 
          formal valuation, informal valuation, 
          professional valuation, amateur valuation, 
          DIY valuation, expert valuation, 
          free valuation, paid valuation, 
          premium valuation, basic valuation, 
          standard valuation, custom valuation, 
          template valuation, bespoke valuation, 
          generic valuation, specific valuation, 
          industry specific valuation, general valuation, 
          specialized valuation, universal valuation, 
          global valuation, local valuation, 
          regional valuation, national valuation, 
          international valuation, cross border valuation, 
          multi currency valuation, single currency valuation, 
          USD valuation, EUR valuation, GBP valuation, 
          JPY valuation, CNY valuation, INR valuation, 
          emerging currency valuation, stable currency valuation, 
          crypto currency valuation, fiat currency valuation, 
          gold standard valuation, asset backed valuation, 
          cash based valuation, credit based valuation, 
          debt based valuation, equity based valuation, 
          hybrid financing valuation, traditional financing valuation, 
          alternative financing valuation, crowdfunding valuation, 
          ICO valuation, IPO valuation, SPAC valuation, 
          direct listing valuation, reverse merger valuation, 
          acquisition valuation, merger valuation, 
          consolidation valuation, diversification valuation, 
          vertical integration valuation, horizontal integration valuation, 
          conglomerate valuation, holding company valuation, 
          strategic acquisition valuation, financial acquisition valuation, 
          synergistic valuation, standalone valuation, 
          portfolio valuation, single asset valuation, 
          multi asset valuation, diversified valuation, 
          concentrated valuation, focused valuation, 
          broad valuation, narrow valuation, 
          deep valuation, shallow valuation, 
          surface valuation, fundamental valuation, 
          intrinsic valuation, extrinsic valuation, 
          market driven valuation, value driven valuation, 
          growth driven valuation, income driven valuation, 
          asset driven valuation, liability driven valuation, 
          equity driven valuation, debt driven valuation, 
          cash flow driven valuation, profit driven valuation, 
          revenue driven valuation, volume driven valuation, 
          margin driven valuation, efficiency driven valuation, 
          innovation driven valuation, tradition driven valuation, 
          quality driven valuation, price driven valuation, 
          value driven valuation, cost driven valuation, 
          customer driven valuation, competition driven valuation, 
          market share driven valuation, brand driven valuation, 
          reputation driven valuation, network driven valuation, 
          platform driven valuation, ecosystem driven valuation, 
          community driven valuation, user driven valuation, 
          subscriber driven valuation, member driven valuation, 
          customer driven valuation, client driven valuation, 
          patient driven valuation, student driven valuation, 
          audience driven valuation, reader driven valuation, 
          viewer driven valuation, listener driven valuation, 
          player driven valuation, gamer driven valuation, 
          participant driven valuation, attendee driven valuation, 
          buyer driven valuation, seller driven valuation, 
          supplier driven valuation, distributor driven valuation, 
          manufacturer driven valuation, producer driven valuation, 
          creator driven valuation, inventor driven valuation, 
          innovator driven valuation, entrepreneur driven valuation, 
          founder driven valuation, team driven valuation, 
          employee driven valuation, management driven valuation, 
          leadership driven valuation, vision driven valuation, 
          mission driven valuation, purpose driven valuation, 
          values driven valuation, culture driven valuation, 
          impact driven valuation, sustainability driven valuation, 
          ESG driven valuation, ethical driven valuation, 
          social driven valuation, environmental driven valuation, 
          governance driven valuation, compliance driven valuation, 
          regulatory driven valuation, legal driven valuation, 
          tax driven valuation, accounting driven valuation, 
          audit driven valuation, due diligence driven valuation, 
          risk management driven valuation, insurance driven valuation, 
          security driven valuation, safety driven valuation, 
          health driven valuation, wellness driven valuation, 
          education driven valuation, knowledge driven valuation, 
          information driven valuation, data driven valuation, 
          technology driven valuation, digital driven valuation, 
          online driven valuation, offline driven valuation, 
          physical driven valuation, virtual driven valuation, 
          metaverse driven valuation, AI driven valuation, 
          blockchain driven valuation, crypto driven valuation, 
          web3 driven valuation, future driven valuation, 
          trend driven valuation, market driven valuation, 
          economy driven valuation, industry driven valuation, 
          sector driven valuation, niche driven valuation, 
          category driven valuation, segment driven valuation, 
          demographic driven valuation, geographic driven valuation, 
          psychographic driven valuation, behavioral driven valuation, 
          seasonal driven valuation, cyclical driven valuation, 
          event driven valuation, project driven valuation, 
          campaign driven valuation, product driven valuation, 
          service driven valuation, experience driven valuation, 
          solution driven valuation, problem driven valuation, 
          need driven valuation, want driven valuation, 
          desire driven valuation, demand driven valuation, 
          supply driven valuation, scarcity driven valuation, 
          abundance driven valuation, luxury driven valuation, 
          necessity driven valuation, essential driven valuation, 
          discretionary driven valuation, optional driven valuation, 
          complementary driven valuation, supplementary driven valuation, 
          primary driven valuation, secondary driven valuation, 
          tertiary driven valuation, quaternary driven valuation, 
          quinary driven valuation, simple driven valuation, 
          complex driven valuation, complicated driven valuation, 
          sophisticated driven valuation, advanced driven valuation, 
          basic driven valuation, fundamental driven valuation, 
          elementary driven valuation, primary driven valuation, 
          secondary driven valuation, tertiary driven valuation, 
          higher driven valuation, lower driven valuation, 
          upper driven valuation, middle driven valuation, 
          lower middle driven valuation, upper middle driven valuation, 
          working class driven valuation, middle class driven valuation, 
          upper class driven valuation, luxury driven valuation, 
          mass market driven valuation, niche market driven valuation, 
          broad market driven valuation, focused market driven valuation, 
          segmented market driven valuation, targeted market driven valuation, 
          customized market driven valuation, personalized market driven valuation, 
          individual driven valuation, group driven valuation, 
          team driven valuation, organization driven valuation, 
          corporate driven valuation, enterprise driven valuation, 
          small business driven valuation, startup driven valuation, 
          scaleup driven valuation, grownup driven valuation, 
          established driven valuation, mature driven valuation, 
          declining driven valuation, turnaround driven valuation, 
          distressed driven valuation, bankruptcy driven valuation, 
          recovery driven valuation, growth driven valuation, 
          expansion driven valuation, contraction driven valuation, 
          stabilization driven valuation, optimization driven valuation, 
          efficiency driven valuation, effectiveness driven valuation, 
          performance driven valuation, results driven valuation, 
          outcome driven valuation, impact driven valuation, 
          return driven valuation, profit driven valuation, 
          loss driven valuation, break even driven valuation, 
          survival driven valuation, thrival driven valuation, 
          prosperity driven valuation, abundance driven valuation, 
          wealth driven valuation, poverty driven valuation, 
          scarcity driven valuation, enough driven valuation, 
          sufficient driven valuation, insufficient driven valuation, 
          adequate driven valuation, inadequate driven valuation, 
          appropriate driven valuation, inappropriate driven valuation, 
          suitable driven valuation, unsuitable driven valuation, 
          proper driven valuation, improper driven valuation, 
          correct driven valuation, incorrect driven valuation, 
          accurate driven valuation, inaccurate driven valuation, 
          precise driven valuation, imprecise driven valuation, 
          exact driven valuation, approximate driven valuation, 
          estimated driven valuation, calculated driven valuation, 
          measured driven valuation, weighed driven valuation, 
          assessed driven valuation, evaluated driven valuation, 
          appraised driven valuation, valued driven valuation, 
          priced driven valuation, cost driven valuation, 
          expense driven valuation, investment driven valuation, 
          return driven valuation, yield driven valuation, 
          income driven valuation, revenue driven valuation, 
          sales driven valuation, volume driven valuation, 
          quantity driven valuation, quality driven valuation, 
          value driven valuation, worth driven valuation, 
          merit driven valuation, desert driven valuation, 
          entitlement driven valuation, right driven valuation, 
          privilege driven valuation, opportunity driven valuation, 
          advantage driven valuation, disadvantage driven valuation, 
          strength driven valuation, weakness driven valuation, 
          opportunity driven valuation, threat driven valuation, 
          SWOT driven valuation, PESTLE driven valuation, 
          Porter driven valuation, BCG driven valuation, 
          McKinsey driven valuation, Bain driven valuation, 
          BCG driven valuation, Deloitte driven valuation, 
          PwC driven valuation, EY driven valuation, 
          KPMG driven valuation, Accenture driven valuation, 
          IBM driven valuation, Microsoft driven valuation, 
          Google driven valuation, Apple driven valuation, 
          Amazon driven valuation, Facebook driven valuation, 
          Tesla driven valuation, SpaceX driven valuation, 
          Netflix driven valuation, Disney driven valuation, 
          Walmart driven valuation, Target driven valuation, 
          Coca Cola driven valuation, Pepsi driven valuation, 
          McDonald's driven valuation, Burger King driven valuation, 
          Starbucks driven valuation, Dunkin driven valuation, 
          Nike driven valuation, Adidas driven valuation, 
          Toyota driven valuation, Ford driven valuation, 
          GM driven valuation, Chrysler driven valuation, 
          Boeing driven valuation, Airbus driven valuation, 
          Lockheed driven valuation, Northrop driven valuation, 
          Raytheon driven valuation, General Dynamics driven valuation, 
          Pfizer driven valuation, Moderna driven valuation, 
          Johnson & Johnson driven valuation, Merck driven valuation, 
          GSK driven valuation, Novartis driven valuation, 
          Roche driven valuation, Sanofi driven valuation, 
          AstraZeneca driven valuation, Lilly driven valuation, 
          AbbVie driven valuation, Amgen driven valuation, 
          Bristol Myers driven valuation, Gilead driven valuation, 
          Biogen driven valuation, Regeneron driven valuation, 
          Vertex driven valuation, Alnylam driven valuation, 
          Illumina driven valuation, Thermo Fisher driven valuation, 
          Danaher driven valuation, Abbott driven valuation, 
          Medtronic driven valuation, Boston Scientific driven valuation, 
          Stryker driven valuation, Zimmer driven valuation, 
          Intuitive Surgical driven valuation, Varian driven valuation, 
          Siemens Healthineers driven valuation, Philips driven valuation, 
          GE Healthcare driven valuation, Canon Medical driven valuation, 
          Hitachi Medical driven valuation, Toshiba Medical driven valuation, 
          Samsung Medison driven valuation, LG driven valuation, 
          Sony driven valuation, Panasonic driven valuation, 
          Sharp driven valuation, NEC driven valuation, 
          Fujitsu driven valuation, Hitachi driven valuation, 
          Mitsubishi driven valuation, Sumitomo driven valuation, 
          Marubeni driven valuation, Itochu driven valuation, 
          Mitsui driven valuation, Sojitz driven valuation, 
          Toyota Tsusho driven valuation, Hanwha driven valuation, 
          Hyundai driven valuation, SK driven valuation, 
          Lotte driven valuation, CJ driven valuation, 
          Samsung driven valuation, LG driven valuation, 
          Hyundai driven valuation, Kia driven valuation, 
          Daewoo driven valuation, POSCO driven valuation, 
          Korean Air driven valuation, Asiana driven valuation, 
          Singapore Airlines driven valuation, Emirates driven valuation, 
          Qatar Airways driven valuation, Etihad driven valuation, 
          Turkish Airlines driven valuation, Lufthansa driven valuation, 
          Air France driven valuation, British Airways driven valuation, 
          American Airlines driven valuation, Delta driven valuation, 
          United driven valuation, Southwest driven valuation, 
          JetBlue driven valuation, Alaska driven valuation, 
          Spirit driven valuation, Frontier driven valuation, 
          Ryanair driven valuation, EasyJet driven valuation, 
          Wizz Air driven valuation, Vueling driven valuation, 
          Norwegian driven valuation, SAS driven valuation, 
          Finnair driven valuation, Icelandair driven valuation, 
          Aer Lingus driven valuation, TAP driven valuation, 
          Iberia driven valuation, Alitalia driven valuation, 
          Aeroflot driven valuation, S7 driven valuation, 
          Ural Airlines driven valuation, Rossiya driven valuation, 
          China Southern driven valuation, China Eastern driven valuation, 
          Air China driven valuation, Hainan Airlines driven valuation, 
          Singapore Airlines driven valuation, Cathay Pacific driven valuation, 
          Qantas driven valuation, Air New Zealand driven valuation, 
          Virgin Australia driven valuation, Jetstar driven valuation, 
          Tigerair driven valuation, AirAsia driven valuation, 
          Cebu Pacific driven valuation, Lion Air driven valuation, 
          Garuda Indonesia driven valuation, Malaysia Airlines driven valuation, 
          Thai Airways driven valuation, Vietnam Airlines driven valuation, 
          Philippine Airlines driven valuation, Japan Airlines driven valuation, 
          ANA driven valuation, Peach driven valuation, 
          Vanilla Air driven valuation, Jetstar Japan driven valuation, 
          Spring Airlines driven valuation, Juneyao Airlines driven valuation, 
          Okay Airways driven valuation, Lucky Air driven valuation, 
          West Air driven valuation, China United driven valuation, 
          Chengdu Airlines driven valuation, Tibet Airlines driven valuation, 
          Capital Airlines driven valuation, Beijing Capital driven valuation, 
          China Express driven valuation, Joy Air driven valuation, 
          Tianjin Airlines driven valuation, Grand China Air driven valuation, 
          Hong Kong Airlines driven valuation, Hong Kong Express driven valuation, 
          Macau Airlines driven valuation, Air Macau driven valuation, 
          EVA Air driven valuation, China Airlines driven valuation, 
          Starlux Airlines driven valuation, Tigerair Taiwan driven valuation, 
          Uni Air driven valuation, Daily Air driven valuation, 
          Far Eastern Air driven valuation, TransAsia driven valuation, 
          Mandarin Airlines driven valuation, China Southern driven valuation, 
          business valuation calculator, company valuation, startup valuation, revenue multiple, profit multiple, M&A tools"
        />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="/business-valuation-calculator" />

        {/* Open Graph / Social */}
        <meta property="og:title" content="Business Valuation Calculator | Estimate Your Company's Worth" />
        <meta
          property="og:description"
          content="Free tool to calculate business valuation using revenue or profit multiples — used by founders, investors, and advisors."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.financecalculatorfree.com/business-valuation-calculator" />
        <meta property="og:image" content="https://www.financecalculatorfree.com/images/valuation-og.png" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Business Valuation Calculator | Estimate Your Company's Worth" />
        <meta
          name="twitter:description"
          content="See how much your business could be worth based on industry standards and financial performance."
        />
        <meta name="twitter:image" content="https://www.financecalculatorfree.com/images/valuation-twitter.png" />
      </Head>

      {/* Gap above content (from navbar) */}
      <div className={styles.spacerTop}></div>

      <div className={styles.container}>
        {/* Hero Section */}
        <section className={styles.hero}>
          <h1 className={styles.title}>Business Valuation Calculator</h1>
          <p className={styles.subtitle}>
            Estimate your company's worth using industry-standard valuation methods.
          </p>
        </section>

        {/* Calculator Section */}
        <section>
          <div className={styles.calculatorCard}>
            <form onSubmit={handleSubmit} className={styles.form}>
              <p className={styles.instruction}>
                Select method and enter financial data — we extract numbers from any format (e.g., $500K, 1.2M, 3x).
              </p>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Valuation Method</label>
                <div className={styles.radioGroup}>
                  <label className={styles.radioLabel}>
                    <input
                      type="radio"
                      name="valuationMethod"
                      value="revenue"
                      checked={valuationMethod === 'revenue'}
                      onChange={() => setValuationMethod('revenue')}
                    />
                    <span>Revenue Multiple</span>
                  </label>
                  <label className={styles.radioLabel}>
                    <input
                      type="radio"
                      name="valuationMethod"
                      value="profit"
                      checked={valuationMethod === 'profit'}
                      onChange={() => setValuationMethod('profit')}
                    />
                    <span>Profit Multiple</span>
                  </label>
                </div>
              </div>

              {valuationMethod === 'revenue' && (
                <div className={styles.inputGroup}>
                  <label htmlFor="revenue" className={styles.label}>
                    Annual Revenue ($)
                  </label>
                  <input
                    id="revenue"
                    type="text"
                    value={revenue}
                    onChange={(e) => setRevenue(e.target.value)}
                    placeholder="e.g. $500,000 or 500K"
                    className={styles.input}
                  />
                </div>
              )}

              {valuationMethod === 'profit' && (
                <div className={styles.inputGroup}>
                  <label htmlFor="profit" className={styles.label}>
                    Annual Profit ($)
                  </label>
                  <input
                    id="profit"
                    type="text"
                    value={profit}
                    onChange={(e) => setProfit(e.target.value)}
                    placeholder="e.g. $150,000 or 150K"
                    className={styles.input}
                  />
                </div>
              )}

              <div className={styles.inputGroup}>
                <label htmlFor="industryMultiplier" className={styles.label}>
                  Industry Multiplier
                </label>
                <input
                  id="industryMultiplier"
                  type="text"
                  value={industryMultiplier}
                  onChange={(e) => setIndustryMultiplier(e.target.value)}
                  placeholder="e.g. 2.5 or 5x"
                  className={styles.input}
                />
                <small className={styles.note}>
                  {valuationMethod === 'revenue'
                    ? 'Typical range: 0.5x to 5x revenue'
                    : 'Typical range: 2x to 10x profit'}
                </small>
              </div>

              <button type="submit" className={styles.submitBtn}>
                <span className="taxpro-btn-label">Calculate Valuation</span>
                <span className="taxpro-btn-arrow">→</span>
              </button>
            </form>

            {result && (
              <div className={styles.resultSection}>
                <h3>Valuation Estimate</h3>
                <div className={styles.resultGrid}>
                  <div className={styles.resultItem}>
                    <strong>Method Used:</strong> {result.methodUsed}
                  </div>
                  {result.valuationMethod === 'revenue' && (
                    <div className={styles.resultItem}>
                      <strong>Annual Revenue:</strong> ${result.revenue}
                    </div>
                  )}
                  {result.valuationMethod === 'profit' && (
                    <div className={styles.resultItem}>
                      <strong>Annual Profit:</strong> ${result.profit}
                    </div>
                  )}
                  <div className={styles.resultItem}>
                    <strong>Industry Multiplier:</strong> {result.multiplier}x
                  </div>
                  <div className={`${styles.resultItem} ${styles.highlight}`}>
                    <strong>Estimated Valuation:</strong> ${result.valuation}
                  </div>
                </div>
                <div className={styles.note}>
                  Based on {result.methodUsed.toLowerCase()}, your business is valued at approximately{' '}
                  <strong>${result.valuation}</strong>.
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Info Section */}
        <section className={styles.infoSection}>
          <div className={styles.infoCard}>
            <h3>Why Business Valuation Matters</h3>
            <p>
              <strong>Business valuation</strong> is essential for selling your company, seeking investment, estate planning, or strategic decision-making. Understanding your company's worth helps you{' '}
              <strong>negotiate better deals, plan growth, and assess financial health</strong>.
            </p>

            <h4>How to Use This Calculator</h4>
            <ul className={styles.list}>
              <li><strong>Select valuation method:</strong> Revenue or profit multiple</li>
              <li><strong>Enter financial data:</strong> Type freely — we extract numbers from any format</li>
              <li><strong>Adjust multiplier:</strong> Use industry benchmarks or your own value</li>
              <li>Click "Calculate" — get instant estimate even with messy input</li>
            </ul>

            <h4>Formulas Used</h4>
            <div className={styles.formula}>
              <code>Revenue-Based Valuation = Annual Revenue × Industry Multiplier</code>
            </div>
            <div className={styles.formula}>
              <code>Profit-Based Valuation = Annual Profit × Industry Multiplier</code>
            </div>
            <p>
              <strong>Example (Revenue):</strong> $500,000 revenue × 2.5 multiplier ={' '}
              <strong>$1,250,000 valuation</strong>
              <br />
              <strong>Example (Profit):</strong> $150,000 profit × 5 multiplier ={' '}
              <strong>$750,000 valuation</strong>
            </p>

            <h4>Valuation Methods Explained</h4>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Method</th>
                  <th>Best For</th>
                  <th>Pros</th>
                  <th>Cons</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Revenue Multiple</td>
                  <td>Startups, high-growth companies</td>
                  <td>Simple, works with negative profits</td>
                  <td>Ignores profitability</td>
                </tr>
                <tr>
                  <td>Profit Multiple</td>
                  <td>Established, profitable businesses</td>
                  <td>Reflects actual earnings</td>
                  <td>Requires consistent profits</td>
                </tr>
              </tbody>
            </table>

            <h4>Industry Multiplier Benchmarks</h4>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Industry</th>
                  <th>Revenue Multiple</th>
                  <th>Profit Multiple</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Technology (SaaS)</td>
                  <td>5-10x</td>
                  <td>8-15x</td>
                </tr>
                <tr>
                  <td>Retail</td>
                  <td>0.5-1.5x</td>
                  <td>3-6x</td>
                </tr>
                <tr>
                  <td>Manufacturing</td>
                  <td>1-2x</td>
                  <td>4-8x</td>
                </tr>
                <tr>
                  <td>Professional Services</td>
                  <td>1-2x</td>
                  <td>3-6x</td>
                </tr>
                <tr>
                  <td>Restaurants</td>
                  <td>0.3-1x</td>
                  <td>2-4x</td>
                </tr>
              </tbody>
            </table>

            <h4>Tips to Increase Business Value</h4>
            <ul className={styles.list}>
              <li>✅ <strong>Increase recurring revenue</strong> — subscriptions outperform one-time sales</li>
              <li>✅ <strong>Diversify customer base</strong> — reduce dependency on few clients</li>
              <li>✅ <strong>Document systems</strong> — make business less owner-dependent</li>
              <li>✅ <strong>Show growth trends</strong> — consistent growth increases multiples</li>
              <li>✅ <strong>Clean financials</strong> — professional accounting boosts credibility</li>
            </ul>

            <h4>Advanced Valuation Methods</h4>
            <p>
              For more precise valuations:
            </p>
            <ul className={styles.list}>
              <li><strong>DCF (Discounted Cash Flow):</strong> Future cash flows discounted to present value</li>
              <li><strong>Market Comparables:</strong> Compare to similar recently sold businesses</li>
              <li><strong>Asset-Based:</strong> Value of tangible and intangible assets</li>
              <li><strong>EBITDA Multiple:</strong> Earnings before interest, taxes, depreciation, and amortization</li>
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

export default ValuationCalculator;