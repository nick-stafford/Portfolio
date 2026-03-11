import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FinancialStatementAnimation from '../ui/FinancialStatementAnimation';
import TaxCodeAnimation from '../ui/TaxCodeAnimation';
import SynapseHubAnimation from '../ui/SynapseHubAnimation';
import ClientPulseAnimation from '../ui/ClientPulseAnimation';
import GLPAnimation from '../ui/GLPAnimation';
import ConvexityAIAnimation from '../ui/ConvexityAIAnimation';

interface Project {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  tech: string[];
  image: string;
  codePreview?: string;
  chartImage?: string;
  liveDemo?: string;
  github?: string;
  type: 'app' | 'analysis' | 'animation' | 'tax' | 'integration' | 'sales' | 'devops';
}

const projects: Project[] = [
  {
    id: 1,
    title: 'ConvexityAI',
    subtitle: 'Stock Scanner & Research Platform',
    description: 'AI-powered stock momentum scanner that detects stocks starting to trend up after consolidation. Features Tier 1/2 alert classification, sector rotation analysis, and AI research using Groq\'s llama-3.3-70b model.',
    tech: ['Python', 'Streamlit', 'Plotly', 'Groq API', 'SQLite', 'LanceDB'],
    image: '/images/convexity-dashboard.png',
    liveDemo: 'http://localhost:8501',
    github: 'https://github.com/nick/convexityai',
    type: 'app',
  },
  {
    id: 2,
    title: 'Tungsten Analysis',
    subtitle: 'Quantitative Market Research',
    description: 'Comprehensive financial analysis of tungsten-related equities. Includes risk-adjusted performance metrics (Sharpe, Sortino, Calmar ratios), correlation analysis, technical indicators, and professional-grade visualizations.',
    tech: ['Python', 'Jupyter', 'Pandas', 'yfinance', 'Matplotlib', 'Seaborn'],
    image: '/images/tungsten-chart.png',
    codePreview: `def calculate_metrics(returns, risk_free=0.05):
    """Calculate comprehensive risk-adjusted metrics"""
    ann_return = returns.mean() * 252
    ann_vol = returns.std() * np.sqrt(252)
    sharpe = (ann_return - risk_free) / ann_vol

    # Sortino Ratio (downside deviation only)
    downside_returns = returns[returns < 0]
    sortino = (ann_return - risk_free) / (downside_returns.std() * np.sqrt(252))

    # Maximum Drawdown
    cum_returns = (1 + returns).cumprod()
    max_drawdown = (cum_returns / cum_returns.cummax() - 1).min()

    return {'Sharpe': sharpe, 'Sortino': sortino, 'MaxDD': max_drawdown}`,
    chartImage: '/images/tungsten-performance.png',
    type: 'analysis',
  },
  {
    id: 3,
    title: 'Financial Statement Builder',
    subtitle: 'Automated Report Generation',
    description: 'AI-powered system that transforms raw financial data into formatted statements. Watch as data flows through the pipeline, code executes in real-time, and a complete financial report materializes.',
    tech: ['Python', 'GPT-4', 'Pandas', 'ReportLab', 'FastAPI'],
    image: '/images/financial-statement.png',
    type: 'animation',
  },
  {
    id: 4,
    title: 'TaxCode AI',
    subtitle: 'Intelligent Tax Strategy Engine',
    description: 'AI-powered tax optimization that cross-references your financial data against 75,000+ pages of IRC tax code to find every legal deduction. Full audit trail and compliance documentation included.',
    tech: ['Python', 'RAG', 'GPT-4', 'Vector DB', 'FastAPI', 'PDF Parsing'],
    image: '/images/taxcode-ai.png',
    github: 'https://github.com/nick/taxcode-ai',
    type: 'tax',
  },
  {
    id: 5,
    title: 'SynapseHub',
    subtitle: 'Enterprise Integration Orchestrator',
    description: 'Unified integration platform that connects your entire business stack. Real-time bidirectional sync between CRM, accounting, communication, and cloud services. One API to rule them all.',
    tech: ['Python', 'FastAPI', 'Redis', 'Kafka', 'OAuth2', 'Webhooks'],
    image: '/images/synapse-hub.png',
    github: 'https://github.com/nick/synapsehub',
    type: 'integration',
  },
  {
    id: 6,
    title: 'ClientPulse AI',
    subtitle: 'Sales Intelligence & Customer Health',
    description: 'AI that monitors every client touchpoint - emails, calls, support tickets, CRM - to surface at-risk accounts, identify upsell opportunities, and score leads based on sentiment and buying signals.',
    tech: ['Python', 'NLP', 'Salesforce API', 'GPT-4', 'FastAPI', 'Redis'],
    image: '/images/clientpulse.png',
    github: 'https://github.com/nick/clientpulse',
    type: 'sales',
  },
  {
    id: 7,
    title: 'GLP',
    subtitle: 'CI/CD Pipeline Orchestrator',
    description: 'End-to-end deployment automation from code to production. Builds, tests, containerizes, and deploys to Kubernetes with zero-downtime rolling updates. Full observability and rollback support.',
    tech: ['Python', 'Docker', 'Kubernetes', 'AWS EKS', 'GitHub Actions', 'Terraform'],
    image: '/images/glp-pipeline.png',
    github: 'https://github.com/nick/glp',
    type: 'devops',
  },
];

// Code block component with syntax highlighting simulation
function CodeBlock({ code }: { code: string }) {
  return (
    <div className="code-block w-full max-w-xl">
      <div className="code-header">
        <span className="code-dot red"></span>
        <span className="code-dot yellow"></span>
        <span className="code-dot green"></span>
        <span className="ml-4 text-xs text-gray-400 font-mono">tungsten_analysis.py</span>
      </div>
      <div className="code-content text-sm leading-relaxed">
        <pre className="overflow-x-auto">
          <code>
            {code.split('\n').map((line, i) => (
              <div key={i} className="whitespace-pre">
                <span className="text-gray-500 select-none mr-4">{String(i + 1).padStart(2, ' ')}</span>
                {highlightSyntax(line)}
              </div>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}

// Simple syntax highlighting
function highlightSyntax(line: string): JSX.Element {
  const keywords = ['def', 'return', 'if', 'for', 'import', 'from', 'class', 'in'];
  const functions = ['calculate_metrics', 'mean', 'std', 'sqrt', 'cumprod', 'cummax', 'min'];

  let result = line;

  // Highlight strings
  result = result.replace(/(["'].*?["'])/g, '<span class="code-string">$1</span>');

  // Highlight comments
  if (result.includes('#')) {
    const commentIndex = result.indexOf('#');
    const before = result.substring(0, commentIndex);
    const comment = result.substring(commentIndex);
    result = before + `<span class="code-comment">${comment}</span>`;
  }

  // Highlight keywords
  keywords.forEach(kw => {
    const regex = new RegExp(`\\b${kw}\\b`, 'g');
    result = result.replace(regex, `<span class="code-keyword">${kw}</span>`);
  });

  // Highlight numbers
  result = result.replace(/\b(\d+\.?\d*)\b/g, '<span class="code-number">$1</span>');

  return <span dangerouslySetInnerHTML={{ __html: result }} />;
}

// Animated number counter for financial data
function AnimatedNumber({ value, prefix = '', suffix = '' }: { value: number; prefix?: string; suffix?: string }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = value / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= value) {
        setDisplay(value);
        clearInterval(timer);
      } else {
        setDisplay(current);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value]);

  return (
    <span className="tabular-nums">
      {prefix}{display.toFixed(2)}{suffix}
    </span>
  );
}

// Exciting animated stock chart - LINE GOES UP
function StockChartAnimation() {
  const [isVisible, setIsVisible] = useState(false);
  const [returnValue, setReturnValue] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    // Animate the return counter
    const duration = 2500;
    const steps = 100;
    const targetValue = 93.91;
    const increment = targetValue / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= targetValue) {
        setReturnValue(targetValue);
        clearInterval(timer);
      } else {
        setReturnValue(current);
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, []);

  // Generate upward trending chart path with some volatility
  const generateChartPath = () => {
    const points: string[] = [];
    const width = 280;
    const height = 120;
    const steps = 40;

    for (let i = 0; i <= steps; i++) {
      const x = (i / steps) * width;
      // Upward trend with some volatility
      const trend = (i / steps) * height * 0.7;
      const volatility = Math.sin(i * 0.8) * 8 + Math.sin(i * 1.5) * 5;
      const y = height - 10 - trend - volatility;
      points.push(`${i === 0 ? 'M' : 'L'} ${x} ${y}`);
    }
    return points.join(' ');
  };

  const chartPath = generateChartPath();

  return (
    <div className="relative w-full h-48 overflow-hidden rounded-xl" style={{ background: 'linear-gradient(180deg, rgba(16, 185, 129, 0.05) 0%, rgba(10, 10, 15, 0.9) 100%)' }}>
      {/* Grid lines */}
      <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
        {[0.25, 0.5, 0.75].map((y) => (
          <line
            key={y}
            x1="0"
            y1={`${y * 100}%`}
            x2="100%"
            y2={`${y * 100}%`}
            stroke="rgba(99, 91, 255, 0.1)"
            strokeDasharray="4 4"
          />
        ))}
      </svg>

      {/* Main chart */}
      <svg className="absolute inset-0 w-full h-full p-4" viewBox="0 0 280 120" preserveAspectRatio="none">
        {/* Gradient fill under the line */}
        <defs>
          <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#635BFF" />
            <stop offset="50%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Area fill */}
        <motion.path
          d={`${chartPath} L 280 120 L 0 120 Z`}
          fill="url(#chartGradient)"
          initial={{ opacity: 0 }}
          animate={{ opacity: isVisible ? 1 : 0 }}
          transition={{ delay: 0.5, duration: 1 }}
        />

        {/* Main line with draw animation */}
        <motion.path
          d={chartPath}
          fill="none"
          stroke="url(#lineGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          filter="url(#glow)"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: isVisible ? 1 : 0 }}
          transition={{ duration: 2.5, ease: "easeOut" }}
        />

        {/* Glowing dot at the end */}
        <motion.circle
          cx="280"
          cy="25"
          r="6"
          fill="#10b981"
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            scale: isVisible ? [0, 1.5, 1] : 0,
            opacity: isVisible ? 1 : 0,
          }}
          transition={{ delay: 2.3, duration: 0.4 }}
        />
        <motion.circle
          cx="280"
          cy="25"
          r="6"
          fill="#10b981"
          initial={{ scale: 1, opacity: 0 }}
          animate={{
            scale: [1, 2.5, 1],
            opacity: [0.8, 0, 0.8],
          }}
          transition={{ delay: 2.5, duration: 1.5, repeat: Infinity }}
        />
      </svg>

      {/* Return badge - TOP RIGHT */}
      <motion.div
        className="absolute top-3 right-3 px-3 py-2 rounded-lg"
        style={{
          background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0.1) 100%)',
          border: '1px solid rgba(16, 185, 129, 0.5)',
          boxShadow: '0 0 20px rgba(16, 185, 129, 0.3)',
        }}
        initial={{ opacity: 0, y: -10, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center gap-1">
          <motion.svg
            className="w-4 h-4"
            style={{ color: '#10b981' }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            animate={{ y: [0, -2, 0] }}
            transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 1 }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </motion.svg>
          <span className="text-xl font-bold tabular-nums" style={{ color: '#10b981' }}>
            +{returnValue.toFixed(2)}%
          </span>
        </div>
      </motion.div>

      {/* Stock ticker */}
      <motion.div
        className="absolute top-3 left-3 flex items-center gap-2"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
      >
        <span className="text-lg font-bold" style={{ color: 'var(--color-text-primary)' }}>KMT</span>
        <span className="text-sm px-2 py-0.5 rounded" style={{ background: 'rgba(99, 91, 255, 0.2)', color: 'var(--color-accent-primary)' }}>NYSE</span>
      </motion.div>

      {/* Bottom metrics */}
      <motion.div
        className="absolute bottom-3 left-3 right-3 flex justify-between text-xs"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <div className="flex gap-4">
          <div>
            <span style={{ color: 'var(--color-text-muted)' }}>Sharpe </span>
            <span className="font-mono font-bold" style={{ color: 'var(--color-accent-primary)' }}>1.86</span>
          </div>
          <div>
            <span style={{ color: 'var(--color-text-muted)' }}>Sortino </span>
            <span className="font-mono font-bold" style={{ color: '#10b981' }}>2.41</span>
          </div>
        </div>
        <div>
          <span style={{ color: 'var(--color-text-muted)' }}>Max DD </span>
          <span className="font-mono font-bold" style={{ color: '#ef4444' }}>-22.3%</span>
        </div>
      </motion.div>

      {/* Sparkle particles on good performance */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full"
          style={{
            background: i % 2 === 0 ? '#10b981' : '#635BFF',
            right: `${10 + i * 5}%`,
            top: '20%',
          }}
          initial={{ opacity: 0, y: 0 }}
          animate={{
            opacity: [0, 1, 0],
            y: [0, -30, -50],
            x: [0, (i - 2) * 10, (i - 2) * 15],
          }}
          transition={{
            delay: 2.4 + i * 0.1,
            duration: 0.8,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
}

// Live Demo Embed Modal
function LiveDemoModal({ url, onClose }: { url: string; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.9)' }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-6xl h-[80vh] rounded-2xl overflow-hidden"
        style={{ border: '2px solid var(--color-accent-primary)' }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between p-4"
          style={{ background: 'var(--gradient-primary)' }}
        >
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500" />
              <span className="w-3 h-3 rounded-full bg-yellow-500" />
              <span className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <span className="text-white font-medium">Live Demo - ConvexityAI</span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 text-sm text-white bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
            >
              Open in New Tab
            </a>
            <button
              onClick={onClose}
              className="p-1 text-white hover:bg-white/20 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Iframe */}
        <iframe
          src={url}
          className="w-full h-full bg-white"
          title="Live Demo"
          sandbox="allow-scripts allow-same-origin allow-forms"
        />
      </motion.div>
    </motion.div>
  );
}

// Main project slider component
export default function ProjectSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [showLiveDemo, setShowLiveDemo] = useState(false);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prev) => {
      let next = prev + newDirection;
      if (next < 0) next = projects.length - 1;
      if (next >= projects.length) next = 0;
      return next;
    });
  };

  const currentProject = projects[currentIndex];

  return (
    <section id="projects" className="relative min-h-screen py-20 overflow-hidden" style={{ backgroundColor: 'var(--color-bg-secondary)' }}>
      {/* Section header */}
      <div className="container mx-auto px-6 mb-12">
        <div className="section-header">
          <span className="section-label">Featured Work</span>
          <h2 className="text-4xl md:text-5xl font-bold" style={{ color: 'var(--color-text-primary)' }}>
            Projects
          </h2>
        </div>
      </div>

      {/* Project slider */}
      <div className="relative h-[600px] md:h-[700px]">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(_, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);
              if (swipe < -swipeConfidenceThreshold) {
                paginate(1);
              } else if (swipe > swipeConfidenceThreshold) {
                paginate(-1);
              }
            }}
            className="absolute inset-0 px-6"
          >
            <div className="container mx-auto h-full flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
              {/* Project info */}
              <div className="flex-1 space-y-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 text-xs font-medium rounded-full"
                    style={{ backgroundColor: 'var(--color-bg-surface)', color: 'var(--color-accent-primary)' }}>
                    {currentProject.type === 'app' ? 'Application' :
                     currentProject.type === 'analysis' ? 'Data Analysis' :
                     currentProject.type === 'tax' ? 'Tax Intelligence' :
                     currentProject.type === 'integration' ? 'Enterprise Integration' :
                     currentProject.type === 'sales' ? 'Sales Intelligence' :
                     currentProject.type === 'devops' ? 'DevOps & CI/CD' : 'Automation'}
                  </span>
                  <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                    {String(currentIndex + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
                  </span>
                </div>

                <h3 className="text-4xl md:text-5xl font-bold gradient-text">
                  {currentProject.title}
                </h3>

                <p className="text-xl" style={{ color: 'var(--color-text-secondary)' }}>
                  {currentProject.subtitle}
                </p>

                <p style={{ color: 'var(--color-text-secondary)', maxWidth: '500px' }}>
                  {currentProject.description}
                </p>

                {/* Tech stack */}
                <div className="flex flex-wrap gap-2 pt-4">
                  {currentProject.tech.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1 text-sm rounded-lg"
                      style={{
                        backgroundColor: 'var(--color-bg-surface)',
                        border: '1px solid var(--color-border)',
                        color: 'var(--color-text-secondary)',
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Action buttons */}
                <div className="flex flex-wrap gap-4 pt-4">
                  {currentProject.liveDemo && currentProject.type === 'app' && (
                    <button
                      onClick={() => setShowLiveDemo(true)}
                      className="btn btn-primary"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Preview Live Demo
                    </button>
                  )}
                  {currentProject.liveDemo && (
                    <a href={currentProject.liveDemo} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                      Open in New Tab
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                  {currentProject.github && (
                    <a href={currentProject.github} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">
                      View Code
                    </a>
                  )}
                </div>
              </div>

              {/* Project visual */}
              <div className="flex-1 w-full max-w-2xl">
                {currentProject.type === 'analysis' && currentProject.codePreview ? (
                  <div className="space-y-4">
                    <CodeBlock code={currentProject.codePreview} />
                    {/* Animated stock chart - LINE GOES UP */}
                    <StockChartAnimation />
                  </div>
                ) : currentProject.type === 'animation' ? (
                  /* Financial Statement Animation */
                  <div className="glass-card p-6" style={{ backgroundColor: 'var(--color-bg-surface)' }}>
                    <FinancialStatementAnimation />
                  </div>
                ) : currentProject.type === 'tax' ? (
                  /* TaxCode AI Animation */
                  <div className="glass-card p-6" style={{ backgroundColor: 'var(--color-bg-surface)' }}>
                    <TaxCodeAnimation />
                  </div>
                ) : currentProject.type === 'integration' ? (
                  /* SynapseHub Animation */
                  <div className="glass-card p-6" style={{ backgroundColor: 'var(--color-bg-surface)' }}>
                    <SynapseHubAnimation />
                  </div>
                ) : currentProject.type === 'sales' ? (
                  /* ClientPulse AI Animation */
                  <div className="glass-card p-6" style={{ backgroundColor: 'var(--color-bg-surface)' }}>
                    <ClientPulseAnimation />
                  </div>
                ) : currentProject.type === 'devops' ? (
                  /* GLP Pipeline Animation */
                  <div className="glass-card p-6" style={{ backgroundColor: 'var(--color-bg-surface)' }}>
                    <GLPAnimation />
                  </div>
                ) : currentProject.type === 'app' ? (
                  /* ConvexityAI Animation */
                  <div className="glass-card p-6" style={{ backgroundColor: 'var(--color-bg-surface)' }}>
                    <ConvexityAIAnimation />
                  </div>
                ) : (
                  /* Default placeholder */
                  <div className="glass-card aspect-video flex items-center justify-center" style={{ backgroundColor: 'var(--color-bg-surface)' }}>
                    <div className="text-center p-8">
                      <div className="w-16 h-16 mx-auto mb-4 rounded-xl flex items-center justify-center" style={{ background: 'var(--gradient-primary)' }}>
                        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <p style={{ color: 'var(--color-text-muted)' }}>Screenshot coming soon</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation arrows */}
        <button
          onClick={() => paginate(-1)}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full transition-all hover:scale-110"
          style={{ backgroundColor: 'var(--color-bg-surface)', border: '1px solid var(--color-border)' }}
          aria-label="Previous project"
        >
          <svg className="w-6 h-6" style={{ color: 'var(--color-text-primary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={() => paginate(1)}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full transition-all hover:scale-110"
          style={{ backgroundColor: 'var(--color-bg-surface)', border: '1px solid var(--color-border)' }}
          aria-label="Next project"
        >
          <svg className="w-6 h-6" style={{ color: 'var(--color-text-primary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Pagination dots */}
      <div className="flex justify-center gap-3 mt-8">
        {projects.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
            className={`w-3 h-3 rounded-full transition-all ${
              index === currentIndex ? 'w-8' : ''
            }`}
            style={{
              backgroundColor: index === currentIndex ? 'var(--color-accent-primary)' : 'var(--color-border)',
            }}
            aria-label={`Go to project ${index + 1}`}
          />
        ))}
      </div>

      {/* Live Demo Modal */}
      <AnimatePresence>
        {showLiveDemo && currentProject.liveDemo && (
          <LiveDemoModal
            url={currentProject.liveDemo}
            onClose={() => setShowLiveDemo(false)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
