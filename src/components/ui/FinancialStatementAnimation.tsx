import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Phase = 'data' | 'code' | 'statement';

export default function FinancialStatementAnimation() {
  const [phase, setPhase] = useState<Phase>('data');
  const [isHovered, setIsHovered] = useState(false);
  const phaseIndexRef = useRef(0);

  // Cycle through phases - 3 seconds each, pauses on hover
  useEffect(() => {
    const phases: Phase[] = ['data', 'code', 'statement'];

    const interval = setInterval(() => {
      if (!isHovered) {
        phaseIndexRef.current = (phaseIndexRef.current + 1) % phases.length;
        setPhase(phases[phaseIndexRef.current]);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [isHovered]);

  // Raw Excel-like data
  const ExcelData = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.4 }}
      className="w-full h-[390px] flex flex-col"
    >
      <div className="rounded-lg overflow-hidden shadow-2xl flex-1 flex flex-col" style={{ border: '1px solid var(--color-border)' }}>
        {/* Excel header */}
        <div className="flex items-center gap-2 px-3 py-1.5" style={{ background: '#217346' }}>
          <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 2l5 5h-5V4zM8 17v-1h2v1H8zm0-3v-1h2v1H8zm0-3V9h2v2H8zm6 6v-1h2v1h-2zm0-3v-1h2v1h-2zm0-3V9h2v2h-2z"/>
          </svg>
          <span className="text-white text-xs font-medium">Q4_2025_financials.xlsx</span>
        </div>

        {/* Spreadsheet */}
        <div className="flex-1" style={{ background: '#1e1e1e', fontSize: '11px' }}>
          {/* Header */}
          <div className="grid grid-cols-5 font-medium" style={{ background: '#2d2d2d' }}>
            {['Account', 'Q1', 'Q2', 'Q3', 'Q4'].map((h, i) => (
              <div key={i} className="px-2 py-1.5 border-b border-r border-gray-700 text-gray-400">
                {h}
              </div>
            ))}
          </div>

          {/* Data rows - extensive financials */}
          {[
            ['Revenue', '2.45M', '2.78M', '3.12M', '3.65M'],
            ['Product Sales', '1.96M', '2.22M', '2.50M', '2.92M'],
            ['Services', '490K', '556K', '624K', '730K'],
            ['COGS', '(980K)', '(1.1M)', '(1.2M)', '(1.4M)'],
            ['Gross Profit', '1.47M', '1.68M', '1.92M', '2.25M'],
            ['SG&A', '(490K)', '(556K)', '(624K)', '(730K)'],
            ['R&D', '(245K)', '(278K)', '(312K)', '(365K)'],
            ['Marketing', '(147K)', '(167K)', '(187K)', '(219K)'],
            ['EBITDA', '588K', '679K', '797K', '936K'],
            ['Depreciation', '(49K)', '(56K)', '(62K)', '(73K)'],
            ['Amortization', '(49K)', '(56K)', '(62K)', '(73K)'],
            ['EBIT', '490K', '567K', '673K', '790K'],
            ['Interest Exp', '(32K)', '(37K)', '(43K)', '(51K)'],
            ['Other Income', '12K', '14K', '16K', '18K'],
            ['Pre-Tax', '470K', '544K', '646K', '757K'],
            ['Tax (21%)', '(99K)', '(114K)', '(136K)', '(159K)'],
            ['Net Income', '371K', '430K', '510K', '598K'],
          ].map((row, rowIndex) => (
            <motion.div
              key={rowIndex}
              className="grid grid-cols-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: rowIndex * 0.04 }}
            >
              {row.map((cell, cellIndex) => (
                <div
                  key={cellIndex}
                  className="px-2 py-1 border-b border-r border-gray-800 font-mono"
                  style={{
                    color: cellIndex === 0 ? '#e0e0e0' :
                           cell.startsWith('(') ? '#ef4444' : '#10b981',
                  }}
                >
                  {cell}
                </div>
              ))}
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div
        className="flex items-center justify-center gap-2 mt-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: 'var(--color-accent-primary)' }}
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 0.6, delay: i * 0.15, repeat: Infinity }}
            />
          ))}
        </div>
        <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Extracting data</span>
      </motion.div>
    </motion.div>
  );

  // Professional code display - all visible at once, no cursor
  const CodeWriting = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.4 }}
      className="w-full h-[390px] flex flex-col"
    >
      <div className="rounded-lg overflow-hidden shadow-2xl flex-1 flex flex-col" style={{ background: '#0d1117', border: '1px solid #30363d' }}>
        {/* VS Code style header */}
        <div className="flex items-center justify-between px-3 py-1.5" style={{ background: '#161b22', borderBottom: '1px solid #30363d' }}>
          <div className="flex items-center gap-2">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
              <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
              <span className="w-3 h-3 rounded-full bg-[#27ca40]" />
            </div>
            <span className="text-xs ml-2" style={{ color: '#8b949e' }}>financial_processor.py</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: '#238636', color: 'white' }}>Python</span>
          </div>
        </div>

        {/* Code content - professional syntax highlighting */}
        <div className="p-4 font-mono text-xs leading-relaxed overflow-hidden flex-1" style={{ color: '#c9d1d9' }}>
          {[
            { num: 1, code: <><span style={{color:'#ff7b72'}}>import</span> pandas <span style={{color:'#ff7b72'}}>as</span> pd</> },
            { num: 2, code: <><span style={{color:'#ff7b72'}}>from</span> reportlab.lib.pagesizes <span style={{color:'#ff7b72'}}>import</span> letter</> },
            { num: 3, code: <><span style={{color:'#ff7b72'}}>from</span> financial_engine <span style={{color:'#ff7b72'}}>import</span> StatementGenerator</> },
            { num: 4, code: '' },
            { num: 5, code: <><span style={{color:'#ff7b72'}}>class</span> <span style={{color:'#d2a8ff'}}>IncomeStatement</span>(StatementGenerator):</> },
            { num: 6, code: <><span style={{color:'#8b949e'}}>    </span><span style={{color:'#ff7b72'}}>def</span> <span style={{color:'#d2a8ff'}}>__init__</span>(self, fiscal_year: <span style={{color:'#79c0ff'}}>int</span>):</> },
            { num: 7, code: <><span style={{color:'#8b949e'}}>        </span>self.fiscal_year = fiscal_year</> },
            { num: 8, code: <><span style={{color:'#8b949e'}}>        </span>self.quarters = [<span style={{color:'#a5d6ff'}}>'Q1'</span>, <span style={{color:'#a5d6ff'}}>'Q2'</span>, <span style={{color:'#a5d6ff'}}>'Q3'</span>, <span style={{color:'#a5d6ff'}}>'Q4'</span>]</> },
            { num: 9, code: '' },
            { num: 10, code: <><span style={{color:'#8b949e'}}>    </span><span style={{color:'#ff7b72'}}>def</span> <span style={{color:'#d2a8ff'}}>calculate_metrics</span>(self, df: pd.DataFrame):</> },
            { num: 11, code: <><span style={{color:'#8b949e'}}>        </span>self.revenue = df[<span style={{color:'#a5d6ff'}}>'Revenue'</span>].sum()</> },
            { num: 12, code: <><span style={{color:'#8b949e'}}>        </span>self.cogs = df[<span style={{color:'#a5d6ff'}}>'COGS'</span>].sum()</> },
            { num: 13, code: <><span style={{color:'#8b949e'}}>        </span>self.gross_profit = self.revenue - self.cogs</> },
            { num: 14, code: <><span style={{color:'#8b949e'}}>        </span>self.net_income = self._calculate_net()</> },
            { num: 15, code: <><span style={{color:'#8b949e'}}>        </span><span style={{color:'#ff7b72'}}>return</span> self.<span style={{color:'#d2a8ff'}}>generate_pdf</span>()</> },
          ].map((line, i) => (
            <motion.div
              key={i}
              className="flex"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <span className="w-5 text-right mr-3 select-none" style={{ color: '#6e7681' }}>
                {line.num}
              </span>
              <span>{line.code}</span>
            </motion.div>
          ))}
        </div>

        {/* Terminal output */}
        <div className="px-3 py-2" style={{ background: '#161b22', borderTop: '1px solid #30363d' }}>
          <div className="flex items-center gap-2 text-[10px]">
            <span style={{ color: '#3fb950' }}>$</span>
            <span style={{ color: '#8b949e' }}>python generate.py --output pdf</span>
          </div>
        </div>
      </div>

      <motion.div
        className="flex items-center justify-center mt-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Compiling report</span>
      </motion.div>
    </motion.div>
  );

  // Extensive financial statement
  const FinancialStatement = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.4 }}
      className="w-full h-[390px] flex flex-col"
    >
      <div
        className="rounded-lg overflow-hidden shadow-2xl flex-1 flex flex-col"
        style={{
          background: 'linear-gradient(180deg, #1a1a24 0%, #0f0f15 100%)',
          border: '1px solid var(--color-accent-primary)',
        }}
      >
        {/* Header */}
        <div className="px-4 py-2 text-center" style={{ background: 'rgba(99, 91, 255, 0.1)', borderBottom: '1px solid var(--color-accent-primary)' }}>
          <h3 className="text-sm font-bold gradient-text">NEXUS TECHNOLOGIES INC.</h3>
          <p className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>
            Consolidated Income Statement | Fiscal Year 2025
          </p>
        </div>

        {/* Statement body - extensive line items */}
        <div className="px-4 py-3 space-y-1 text-xs flex-1">
          {/* Revenue Section */}
          <div className="font-semibold pt-1" style={{ color: 'var(--color-accent-primary)' }}>REVENUE</div>
          {[
            { label: 'Product Revenue', value: '$9,245,000', indent: true },
            { label: 'Service Revenue', value: '$2,755,000', indent: true },
            { label: 'Total Revenue', value: '$12,000,000', bold: true },
          ].map((row, i) => (
            <motion.div
              key={`rev-${i}`}
              className="flex justify-between py-0.5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.03 }}
            >
              <span className={row.indent ? 'pl-3' : ''} style={{ color: row.bold ? 'var(--color-text-primary)' : 'var(--color-text-secondary)' }}>
                {row.label}
              </span>
              <span className="font-mono" style={{ color: row.bold ? 'var(--color-success)' : 'var(--color-text-primary)' }}>
                {row.value}
              </span>
            </motion.div>
          ))}

          {/* Costs Section */}
          <div className="font-semibold pt-2" style={{ color: 'var(--color-accent-primary)' }}>COSTS & EXPENSES</div>
          {[
            { label: 'Cost of Revenue', value: '($4,200,000)', indent: true },
            { label: 'Research & Development', value: '($1,800,000)', indent: true },
            { label: 'Sales & Marketing', value: '($1,440,000)', indent: true },
            { label: 'General & Administrative', value: '($960,000)', indent: true },
            { label: 'Total Operating Expenses', value: '($8,400,000)', bold: true },
          ].map((row, i) => (
            <motion.div
              key={`cost-${i}`}
              className="flex justify-between py-0.5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 + i * 0.03 }}
            >
              <span className={row.indent ? 'pl-3' : ''} style={{ color: row.bold ? 'var(--color-text-primary)' : 'var(--color-text-secondary)' }}>
                {row.label}
              </span>
              <span className="font-mono" style={{ color: '#ef4444' }}>
                {row.value}
              </span>
            </motion.div>
          ))}

          {/* Profitability */}
          <div className="font-semibold pt-2" style={{ color: 'var(--color-accent-primary)' }}>PROFITABILITY</div>
          {[
            { label: 'Operating Income', value: '$3,600,000' },
            { label: 'Interest Expense', value: '($180,000)' },
            { label: 'Income Before Tax', value: '$3,420,000' },
            { label: 'Income Tax (25%)', value: '($855,000)' },
          ].map((row, i) => (
            <motion.div
              key={`profit-${i}`}
              className="flex justify-between py-0.5 pl-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 + i * 0.03 }}
            >
              <span style={{ color: 'var(--color-text-secondary)' }}>{row.label}</span>
              <span className="font-mono" style={{ color: row.value.startsWith('(') ? '#ef4444' : 'var(--color-text-primary)' }}>
                {row.value}
              </span>
            </motion.div>
          ))}

          {/* Net Income - THE BIG NUMBER */}
          <motion.div
            className="relative flex justify-between py-2 mt-2 px-3 rounded-lg overflow-hidden"
            style={{
              background: 'linear-gradient(90deg, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.25) 100%)',
              border: '2px solid var(--color-success)',
            }}
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.35, type: 'spring', stiffness: 400, damping: 20 }}
          >
            {/* Subtle pulse glow */}
            <motion.div
              className="absolute inset-0 rounded-lg"
              animate={{
                boxShadow: [
                  'inset 0 0 20px rgba(16, 185, 129, 0.1)',
                  'inset 0 0 30px rgba(16, 185, 129, 0.3)',
                  'inset 0 0 20px rgba(16, 185, 129, 0.1)',
                ],
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <span className="font-bold relative" style={{ color: 'var(--color-text-primary)' }}>Net Income</span>
            <motion.span
              className="font-mono font-bold text-base relative"
              style={{ color: 'var(--color-success)' }}
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ delay: 0.5, duration: 0.3 }}
            >
              $2,565,000
            </motion.span>
          </motion.div>

          {/* Per Share */}
          <motion.div
            className="flex justify-between pt-1 text-[9px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <span style={{ color: 'var(--color-text-muted)' }}>Earnings Per Share (Diluted)</span>
            <span className="font-mono" style={{ color: 'var(--color-accent-primary)' }}>$2.14</span>
          </motion.div>
        </div>

        {/* Footer - VICTORY MOMENT */}
        <motion.div
          className="relative px-4 py-3 overflow-hidden"
          style={{
            background: 'linear-gradient(90deg, rgba(16, 185, 129, 0.2) 0%, rgba(99, 91, 255, 0.2) 50%, rgba(16, 185, 129, 0.2) 100%)',
            borderTop: '2px solid var(--color-success)'
          }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 400, damping: 15 }}
        >
          {/* Animated glow burst */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle at center, rgba(16, 185, 129, 0.4) 0%, transparent 70%)',
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 2, 2], opacity: [0, 0.8, 0] }}
            transition={{ delay: 0.6, duration: 0.8, ease: 'easeOut' }}
          />

          {/* Sparkle particles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{
                background: i % 2 === 0 ? '#10b981' : '#635BFF',
                left: `${15 + i * 14}%`,
                top: '50%',
              }}
              initial={{ scale: 0, y: 0 }}
              animate={{
                scale: [0, 1.5, 0],
                y: [0, -20, -30],
                opacity: [0, 1, 0],
              }}
              transition={{ delay: 0.7 + i * 0.05, duration: 0.6 }}
            />
          ))}

          <div className="relative flex items-center justify-between">
            {/* Success badge with animated checkmark */}
            <motion.div
              className="flex items-center gap-2"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.55, type: 'spring', stiffness: 500, damping: 15 }}
            >
              {/* Glowing checkmark circle */}
              <motion.div
                className="relative flex items-center justify-center w-6 h-6 rounded-full"
                style={{ background: 'var(--color-success)' }}
                animate={{
                  boxShadow: [
                    '0 0 0 0 rgba(16, 185, 129, 0.7)',
                    '0 0 0 8px rgba(16, 185, 129, 0)',
                    '0 0 0 0 rgba(16, 185, 129, 0)',
                  ],
                }}
                transition={{ delay: 0.7, duration: 1, repeat: 2 }}
              >
                {/* Animated checkmark SVG */}
                <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none">
                  <motion.path
                    d="M5 13l4 4L19 7"
                    stroke="currentColor"
                    strokeWidth={3}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 0.65, duration: 0.4, ease: 'easeOut' }}
                  />
                </svg>
              </motion.div>

              {/* Text with shimmer effect */}
              <div className="relative overflow-hidden">
                <motion.span
                  className="text-sm font-bold"
                  style={{ color: 'var(--color-success)' }}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  Report Generated
                </motion.span>
                {/* Shimmer overlay */}
                <motion.div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)',
                  }}
                  initial={{ x: '-100%' }}
                  animate={{ x: '200%' }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                />
              </div>
            </motion.div>

            {/* Export badges with stagger */}
            <div className="flex gap-1.5">
              {['PDF', 'XLSX', 'CSV'].map((format, i) => (
                <motion.span
                  key={format}
                  className="px-2 py-0.5 text-[10px] font-medium rounded"
                  style={{
                    background: 'rgba(99, 91, 255, 0.2)',
                    color: 'var(--color-accent-primary)',
                    border: '1px solid var(--color-accent-primary)',
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{
                    delay: 0.75 + i * 0.1,
                    type: 'spring',
                    stiffness: 500,
                    damping: 20,
                  }}
                  whileHover={{ scale: 1.1 }}
                >
                  {format}
                </motion.span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );

  return (
    <div
      className="w-full max-w-lg mx-auto"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Phase indicator - compact */}
      <div className="flex justify-center items-center gap-4 mb-4">
        {[
          { id: 'data', label: 'Data' },
          { id: 'code', label: 'Process' },
          { id: 'statement', label: 'Output' },
        ].map((p, i) => (
          <div key={p.id} className="flex items-center gap-2">
            <motion.div
              className="w-2 h-2 rounded-full"
              style={{
                background: phase === p.id ? 'var(--color-accent-primary)' : 'var(--color-border)',
              }}
              animate={{
                scale: phase === p.id ? [1, 1.3, 1] : 1,
              }}
              transition={{ duration: 0.3 }}
            />
            <span
              className="text-[10px] font-medium"
              style={{
                color: phase === p.id ? 'var(--color-accent-primary)' : 'var(--color-text-muted)',
              }}
            >
              {p.label}
            </span>
            {i < 2 && (
              <svg className="w-3 h-3 mx-1" style={{ color: 'var(--color-border)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            )}
          </div>
        ))}

        {/* Pause indicator */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              className="flex items-center gap-1 ml-2"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.15 }}
            >
              <svg className="w-3 h-3" style={{ color: 'var(--color-text-muted)' }} fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Animation container - fixed height for consistency */}
      <div className="relative h-[420px]">
        <AnimatePresence mode="wait">
          {phase === 'data' && <ExcelData key="data" />}
          {phase === 'code' && <CodeWriting key="code" />}
          {phase === 'statement' && <FinancialStatement key="statement" />}
        </AnimatePresence>
      </div>
    </div>
  );
}
