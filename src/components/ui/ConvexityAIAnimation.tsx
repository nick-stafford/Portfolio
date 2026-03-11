import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface StockAlert {
  ticker: string;
  price: number;
  change: number;
  tier: 1 | 2;
  sector: string;
  momentum: number;
}

const mockAlerts: StockAlert[] = [
  { ticker: 'NVDA', price: 142.58, change: 8.4, tier: 1, sector: 'Tech', momentum: 94 },
  { ticker: 'AMD', price: 178.32, change: 5.2, tier: 1, sector: 'Tech', momentum: 87 },
  { ticker: 'PLTR', price: 24.89, change: 12.1, tier: 2, sector: 'Tech', momentum: 82 },
  { ticker: 'SOFI', price: 8.45, change: 6.8, tier: 2, sector: 'Finance', momentum: 79 },
  { ticker: 'RIVN', price: 18.23, change: 4.5, tier: 2, sector: 'Auto', momentum: 71 },
];

export default function ConvexityAIAnimation() {
  const [alerts, setAlerts] = useState<StockAlert[]>([]);
  const [scanning, setScanning] = useState(true);
  const [scanProgress, setScanProgress] = useState(0);
  const [currentAlert, setCurrentAlert] = useState(0);

  // Initial scan animation
  useEffect(() => {
    const scanInterval = setInterval(() => {
      setScanProgress((prev) => {
        if (prev >= 100) {
          setScanning(false);
          clearInterval(scanInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 40);

    return () => clearInterval(scanInterval);
  }, []);

  // Add alerts progressively after scan completes
  useEffect(() => {
    if (!scanning && alerts.length < mockAlerts.length) {
      const timer = setTimeout(() => {
        setAlerts((prev) => [...prev, mockAlerts[prev.length]]);
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [scanning, alerts.length]);

  // Cycle through highlighting alerts
  useEffect(() => {
    if (alerts.length === mockAlerts.length) {
      const interval = setInterval(() => {
        setCurrentAlert((prev) => (prev + 1) % alerts.length);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [alerts.length]);

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <motion.div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #635BFF 0%, #00D4FF 100%)' }}
            animate={{ rotate: scanning ? 360 : 0 }}
            transition={{ duration: 2, repeat: scanning ? Infinity : 0, ease: 'linear' }}
          >
            <span className="text-white text-sm">📈</span>
          </motion.div>
          <div>
            <div className="text-sm font-bold" style={{ color: 'var(--color-text-primary)' }}>ConvexityAI</div>
            <div className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>Momentum Scanner</div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <motion.div
            className="w-2 h-2 rounded-full"
            style={{ background: scanning ? '#f59e0b' : '#10b981' }}
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          <span className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>
            {scanning ? 'Scanning...' : 'Live'}
          </span>
        </div>
      </div>

      {/* Main panel */}
      <div
        className="rounded-xl overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, rgba(99, 91, 255, 0.1) 0%, rgba(10, 10, 15, 0.95) 100%)',
          border: '1px solid var(--color-border)',
        }}
      >
        {/* Scan progress bar */}
        <AnimatePresence>
          {scanning && (
            <motion.div
              className="px-4 py-3 border-b"
              style={{ borderColor: 'var(--color-border)' }}
              exit={{ height: 0, opacity: 0, padding: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                  Scanning 4,200+ stocks...
                </span>
                <span className="text-xs font-mono" style={{ color: 'var(--color-accent-primary)' }}>
                  {scanProgress}%
                </span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--color-bg-surface)' }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: 'linear-gradient(90deg, #635BFF, #00D4FF)' }}
                  initial={{ width: 0 }}
                  animate={{ width: `${scanProgress}%` }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Alerts list */}
        <div className="p-3 space-y-2">
          {/* Column headers */}
          <div className="flex items-center text-[9px] px-2 pb-1" style={{ color: 'var(--color-text-muted)' }}>
            <span className="w-16">TICKER</span>
            <span className="w-14 text-right">PRICE</span>
            <span className="w-14 text-right">CHG%</span>
            <span className="w-10 text-center">TIER</span>
            <span className="flex-1 text-right">MOMENTUM</span>
          </div>

          {/* Alert rows */}
          <AnimatePresence mode="popLayout">
            {alerts.map((alert, i) => (
              <motion.div
                key={alert.ticker}
                className="flex items-center px-2 py-2 rounded-lg"
                style={{
                  background: i === currentAlert ? 'rgba(99, 91, 255, 0.15)' : 'rgba(99, 91, 255, 0.05)',
                  border: i === currentAlert ? '1px solid rgba(99, 91, 255, 0.3)' : '1px solid transparent',
                }}
                initial={{ opacity: 0, x: -20, height: 0 }}
                animate={{ opacity: 1, x: 0, height: 'auto' }}
                transition={{ duration: 0.3 }}
              >
                {/* Ticker */}
                <div className="w-16">
                  <span className="text-sm font-bold" style={{ color: 'var(--color-text-primary)' }}>
                    {alert.ticker}
                  </span>
                  <div className="text-[8px]" style={{ color: 'var(--color-text-muted)' }}>
                    {alert.sector}
                  </div>
                </div>

                {/* Price */}
                <div className="w-14 text-right">
                  <span className="text-xs font-mono" style={{ color: 'var(--color-text-secondary)' }}>
                    ${alert.price.toFixed(2)}
                  </span>
                </div>

                {/* Change */}
                <div className="w-14 text-right">
                  <span className="text-xs font-mono font-bold" style={{ color: '#10b981' }}>
                    +{alert.change}%
                  </span>
                </div>

                {/* Tier badge */}
                <div className="w-10 flex justify-center">
                  <span
                    className="px-1.5 py-0.5 rounded text-[9px] font-bold"
                    style={{
                      background: alert.tier === 1 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(99, 91, 255, 0.2)',
                      color: alert.tier === 1 ? '#10b981' : '#635BFF',
                    }}
                  >
                    T{alert.tier}
                  </span>
                </div>

                {/* Momentum bar */}
                <div className="flex-1 flex items-center justify-end gap-2">
                  <div className="w-16 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(99, 91, 255, 0.2)' }}>
                    <motion.div
                      className="h-full rounded-full"
                      style={{
                        background: alert.momentum > 85 ? '#10b981' : alert.momentum > 75 ? '#00D4FF' : '#635BFF',
                      }}
                      initial={{ width: 0 }}
                      animate={{ width: `${alert.momentum}%` }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                    />
                  </div>
                  <span className="text-[10px] font-mono w-6" style={{ color: 'var(--color-text-secondary)' }}>
                    {alert.momentum}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Empty state while scanning */}
          {alerts.length === 0 && scanning && (
            <div className="py-8 text-center">
              <motion.div
                className="inline-block"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <svg className="w-6 h-6" style={{ color: 'var(--color-accent-primary)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </motion.div>
              <div className="text-xs mt-2" style={{ color: 'var(--color-text-muted)' }}>
                Analyzing momentum patterns...
              </div>
            </div>
          )}
        </div>

        {/* AI Analysis footer */}
        <AnimatePresence>
          {!scanning && alerts.length === mockAlerts.length && (
            <motion.div
              className="px-4 py-3 border-t"
              style={{
                borderColor: 'var(--color-border)',
                background: 'rgba(99, 91, 255, 0.05)',
              }}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-start gap-2">
                <span className="text-sm">🤖</span>
                <div>
                  <div className="text-[10px] font-semibold mb-1" style={{ color: 'var(--color-accent-primary)' }}>
                    AI Analysis (Groq llama-3.3-70b)
                  </div>
                  <motion.p
                    className="text-[10px] leading-relaxed"
                    style={{ color: 'var(--color-text-muted)' }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    Strong momentum detected in semiconductor sector. NVDA breaking out of consolidation
                    with high volume. Consider position sizing based on volatility metrics.
                  </motion.p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom stats */}
      <motion.div
        className="mt-3 flex justify-between items-center text-[10px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <div className="flex items-center gap-3">
          <div>
            <span style={{ color: 'var(--color-text-muted)' }}>Tier 1: </span>
            <span className="font-bold" style={{ color: '#10b981' }}>
              {alerts.filter(a => a.tier === 1).length}
            </span>
          </div>
          <div>
            <span style={{ color: 'var(--color-text-muted)' }}>Tier 2: </span>
            <span className="font-bold" style={{ color: '#635BFF' }}>
              {alerts.filter(a => a.tier === 2).length}
            </span>
          </div>
        </div>
        <div style={{ color: 'var(--color-text-muted)' }}>
          Updated: <span className="font-mono">Just now</span>
        </div>
      </motion.div>
    </div>
  );
}
