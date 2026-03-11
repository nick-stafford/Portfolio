import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TaxCodeAnimation() {
  const [isHovered, setIsHovered] = useState(false);
  const [activeHighlight, setActiveHighlight] = useState(0);
  const [savingsAmount, setSavingsAmount] = useState(0);
  const [discoveredDeductions, setDiscoveredDeductions] = useState<number[]>([]);

  const deductions = [
    { id: 0, section: '§179', label: 'Equipment Expense', amount: 18200, x: 65, y: 22, width: 28 },
    { id: 1, section: '§199A', label: 'QBI Deduction', amount: 12450, x: 45, y: 35, width: 35 },
    { id: 2, section: '§401k', label: 'Retirement', amount: 6500, x: 55, y: 48, width: 25 },
    { id: 3, section: '§280A', label: 'Home Office', amount: 4200, x: 40, y: 61, width: 30 },
    { id: 4, section: '§170', label: 'Charitable', amount: 3800, x: 60, y: 74, width: 22 },
    { id: 5, section: '§164', label: 'SALT Deduction', amount: 2682, x: 50, y: 87, width: 28 },
  ];

  // Cycle through highlights
  useEffect(() => {
    if (isHovered) return;

    const interval = setInterval(() => {
      setActiveHighlight((prev) => {
        const next = (prev + 1) % deductions.length;
        // Add to discovered if not already there
        setDiscoveredDeductions((curr) =>
          curr.includes(next) ? curr : [...curr, next]
        );
        return next;
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [isHovered]);

  // Calculate running total
  useEffect(() => {
    const total = discoveredDeductions.reduce((sum, id) => sum + deductions[id].amount, 0);

    // Animate to new total
    const duration = 500;
    const steps = 30;
    const start = savingsAmount;
    const increment = (total - start) / steps;
    let current = start;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current += increment;
      if (step >= steps) {
        setSavingsAmount(total);
        clearInterval(timer);
      } else {
        setSavingsAmount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [discoveredDeductions]);

  // Reset animation periodically
  useEffect(() => {
    if (isHovered) return;

    const resetInterval = setInterval(() => {
      setDiscoveredDeductions([]);
      setActiveHighlight(0);
      setSavingsAmount(0);
    }, 9000);

    return () => clearInterval(resetInterval);
  }, [isHovered]);

  return (
    <div
      className="w-full max-w-lg mx-auto"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header bar */}
      <div
        className="flex items-center justify-between px-4 py-2 rounded-t-xl"
        style={{ background: 'linear-gradient(90deg, #1a1a24 0%, #252532 100%)', border: '1px solid var(--color-border)', borderBottom: 'none' }}
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <motion.div
              className="w-2 h-2 rounded-full bg-green-500"
              animate={{ opacity: [1, 0.4, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <span className="text-xs font-medium" style={{ color: 'var(--color-text-primary)' }}>TaxCode AI</span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded" style={{ background: 'rgba(99, 91, 255, 0.2)', color: 'var(--color-accent-primary)' }}>
            ANALYZING
          </span>
        </div>

        {/* Savings counter */}
        <motion.div
          className="flex items-center gap-2 px-3 py-1 rounded-lg"
          style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)' }}
          animate={{
            boxShadow: savingsAmount > 0 ? ['0 0 0 0 rgba(16, 185, 129, 0.4)', '0 0 0 4px rgba(16, 185, 129, 0)'] : 'none'
          }}
          transition={{ duration: 0.6, repeat: savingsAmount > 0 ? Infinity : 0 }}
        >
          <span className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>Savings:</span>
          <span className="text-sm font-bold font-mono" style={{ color: '#10b981' }}>
            ${savingsAmount.toLocaleString()}
          </span>
        </motion.div>
      </div>

      {/* Main content area */}
      <div
        className="relative h-[420px] rounded-b-xl overflow-hidden"
        style={{ background: '#0d0d14', border: '1px solid var(--color-border)', borderTop: 'none' }}
      >
        {/* Split layout */}
        <div className="flex h-full">
          {/* Left side - Document preview */}
          <div className="w-1/2 p-4 relative" style={{ borderRight: '1px solid var(--color-border)' }}>
            <div className="text-[10px] mb-2 flex items-center gap-2" style={{ color: 'var(--color-text-muted)' }}>
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Tax_Documents_2025.pdf
            </div>

            {/* Fake document */}
            <div
              className="relative h-[340px] rounded-lg overflow-hidden"
              style={{ background: '#fefefe', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}
            >
              {/* Document content - fake text lines */}
              <div className="p-3 space-y-2">
                <div className="text-center pb-2 mb-2" style={{ borderBottom: '1px solid #ddd' }}>
                  <div className="text-[8px] font-bold text-gray-800">FORM 1040 - U.S. INDIVIDUAL TAX RETURN</div>
                  <div className="text-[6px] text-gray-500">Department of the Treasury</div>
                </div>

                {/* Fake form lines with highlight zones */}
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="flex items-center gap-1">
                    <span className="text-[6px] w-3 text-gray-400">{i + 1}</span>
                    <div
                      className="h-2 rounded-sm flex-1"
                      style={{
                        background: `linear-gradient(90deg, #e5e5e5 ${30 + Math.random() * 50}%, transparent 100%)`,
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Animated highlight boxes */}
              {deductions.map((ded) => (
                <motion.div
                  key={ded.id}
                  className="absolute rounded"
                  style={{
                    left: `${ded.x - ded.width/2}%`,
                    top: `${ded.y}%`,
                    width: `${ded.width}%`,
                    height: '18px',
                    border: activeHighlight === ded.id ? '2px solid #635BFF' :
                            discoveredDeductions.includes(ded.id) ? '2px solid #10b981' : '2px solid transparent',
                    background: activeHighlight === ded.id ? 'rgba(99, 91, 255, 0.2)' :
                               discoveredDeductions.includes(ded.id) ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                  }}
                  animate={{
                    scale: activeHighlight === ded.id ? [1, 1.02, 1] : 1,
                  }}
                  transition={{ duration: 0.3 }}
                />
              ))}

              {/* Scanning line */}
              <motion.div
                className="absolute left-0 right-0 h-0.5"
                style={{ background: 'linear-gradient(90deg, transparent, #635BFF, transparent)' }}
                animate={{ top: ['10%', '95%', '10%'] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              />
            </div>
          </div>

          {/* Right side - AI Analysis feed */}
          <div className="w-1/2 p-4 flex flex-col">
            <div className="text-[10px] mb-3 flex items-center gap-2" style={{ color: 'var(--color-text-muted)' }}>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              >
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </motion.div>
              AI Analysis
            </div>

            {/* Discovered deductions list */}
            <div className="flex-1 space-y-2 overflow-hidden">
              <AnimatePresence>
                {discoveredDeductions.map((id) => {
                  const ded = deductions[id];
                  return (
                    <motion.div
                      key={id}
                      className="p-2 rounded-lg"
                      style={{
                        background: 'rgba(16, 185, 129, 0.1)',
                        border: '1px solid rgba(16, 185, 129, 0.3)'
                      }}
                      initial={{ opacity: 0, x: 50, scale: 0.8 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: 'spring' }}
                          >
                            <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </motion.div>
                          <div>
                            <div className="text-[10px] font-mono" style={{ color: 'var(--color-accent-primary)' }}>{ded.section}</div>
                            <div className="text-xs" style={{ color: 'var(--color-text-secondary)' }}>{ded.label}</div>
                          </div>
                        </div>
                        <motion.span
                          className="text-sm font-bold font-mono"
                          style={{ color: '#10b981' }}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.3 }}
                        >
                          +${ded.amount.toLocaleString()}
                        </motion.span>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {/* Placeholder for empty state */}
              {discoveredDeductions.length === 0 && (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <motion.div
                      className="w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center"
                      style={{ background: 'rgba(99, 91, 255, 0.2)' }}
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <svg className="w-4 h-4" style={{ color: 'var(--color-accent-primary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </motion.div>
                    <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Scanning for deductions...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom status */}
            <div
              className="mt-3 pt-3 flex items-center justify-between"
              style={{ borderTop: '1px solid var(--color-border)' }}
            >
              <div className="flex items-center gap-2">
                <span className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>
                  {discoveredDeductions.length} / {deductions.length} found
                </span>
              </div>
              <div className="flex items-center gap-1">
                <svg className="w-3 h-3 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span className="text-[10px]" style={{ color: '#10b981' }}>IRS Compliant</span>
              </div>
            </div>
          </div>
        </div>

        {/* Pause indicator */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded"
              style={{ background: 'rgba(0,0,0,0.6)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <svg className="w-3 h-3" style={{ color: 'var(--color-text-muted)' }} fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
              <span className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>Paused</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
