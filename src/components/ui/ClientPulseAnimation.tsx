import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Communication {
  id: number;
  type: 'email' | 'call' | 'ticket' | 'slack';
  client: string;
  preview: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  score: number;
  signal?: string;
}

const communications: Communication[] = [
  { id: 1, type: 'email', client: 'Acme Corp', preview: 'Really impressed with the demo yesterday...', sentiment: 'positive', score: 92, signal: 'Buying Signal' },
  { id: 2, type: 'ticket', client: 'TechStart Inc', preview: 'This is the third time this week...', sentiment: 'negative', score: 23, signal: 'Churn Risk' },
  { id: 3, type: 'call', client: 'GlobalTech', preview: 'Budget approved for Q2, ready to move forward', sentiment: 'positive', score: 88, signal: 'Ready to Close' },
  { id: 4, type: 'slack', client: 'Innovate LLC', preview: 'Quick question about enterprise pricing...', sentiment: 'neutral', score: 65, signal: 'Upsell Opportunity' },
  { id: 5, type: 'email', client: 'DataFlow Co', preview: 'Comparing your solution with competitors...', sentiment: 'neutral', score: 54 },
  { id: 6, type: 'ticket', client: 'CloudNine', preview: 'Love the new feature release!', sentiment: 'positive', score: 85 },
  { id: 7, type: 'call', client: 'NextGen Labs', preview: 'Need to discuss contract renewal...', sentiment: 'neutral', score: 61, signal: 'Renewal Risk' },
  { id: 8, type: 'email', client: 'Summit Partners', preview: 'Your team has been incredibly responsive', sentiment: 'positive', score: 94, signal: 'Expansion Ready' },
];

const integrations = [
  { name: 'Salesforce', color: '#00A1E0', icon: '☁️' },
  { name: 'Outlook', color: '#0078D4', icon: '📧' },
  { name: 'Slack', color: '#4A154B', icon: '💬' },
  { name: 'Zendesk', color: '#03363D', icon: '🎫' },
];

export default function ClientPulseAnimation() {
  const [isHovered, setIsHovered] = useState(false);
  const [visibleComms, setVisibleComms] = useState<{comm: Communication, uid: number}[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [uidCounter, setUidCounter] = useState(0);
  const [metrics, setMetrics] = useState({
    hotLeads: 3,
    atRisk: 2,
    opportunities: 847000,
    healthScore: 78,
  });

  // Add communications one by one
  useEffect(() => {
    if (isHovered) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        const next = (prev + 1) % communications.length;
        return next;
      });

      setUidCounter((prev) => {
        const newUid = prev + 1;
        const nextComm = communications[(currentIndex + 1) % communications.length];
        setVisibleComms((curr) => {
          const updated = [{comm: nextComm, uid: newUid}, ...curr].slice(0, 5);
          return updated;
        });
        return newUid;
      });

      // Update metrics randomly
      setMetrics((curr) => ({
        hotLeads: curr.hotLeads + (Math.random() > 0.7 ? 1 : 0),
        atRisk: Math.max(1, curr.atRisk + (Math.random() > 0.8 ? 1 : Math.random() > 0.5 ? -1 : 0)),
        opportunities: curr.opportunities + Math.floor(Math.random() * 25000),
        healthScore: Math.min(100, Math.max(60, curr.healthScore + (Math.random() > 0.5 ? 2 : -1))),
      }));
    }, 1800);

    return () => clearInterval(interval);
  }, [isHovered, currentIndex]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email': return '📧';
      case 'call': return '📞';
      case 'ticket': return '🎫';
      case 'slack': return '💬';
      default: return '📄';
    }
  };

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return '#10b981';
      case 'negative': return '#ef4444';
      default: return '#f59e0b';
    }
  };

  return (
    <div
      className="w-full max-w-lg mx-auto"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header with integrations */}
      <div
        className="flex items-center justify-between px-4 py-2 rounded-t-xl"
        style={{ background: 'linear-gradient(90deg, #0f172a 0%, #1e293b 100%)', border: '1px solid var(--color-border)', borderBottom: 'none' }}
      >
        <div className="flex items-center gap-2">
          <motion.div
            className="w-2 h-2 rounded-full"
            style={{ background: '#10b981' }}
            animate={{ opacity: [1, 0.4, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          <span className="text-xs font-bold" style={{ color: 'var(--color-text-primary)' }}>ClientPulse AI</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#10b981' }}>LIVE</span>
        </div>

        {/* Integration badges */}
        <div className="flex items-center gap-1">
          {integrations.map((int, i) => (
            <motion.div
              key={int.name}
              className="w-5 h-5 rounded flex items-center justify-center text-[10px]"
              style={{ background: `${int.color}30`, border: `1px solid ${int.color}50` }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              title={int.name}
            >
              {int.icon}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Main dashboard */}
      <div
        className="relative h-[400px] rounded-b-xl overflow-hidden"
        style={{ background: '#0f172a', border: '1px solid var(--color-border)', borderTop: 'none' }}
      >
        <div className="flex h-full">
          {/* Left - Live Feed */}
          <div className="w-[55%] p-3 flex flex-col" style={{ borderRight: '1px solid rgba(255,255,255,0.1)' }}>
            <div className="text-[10px] mb-2 flex items-center justify-between" style={{ color: 'var(--color-text-muted)' }}>
              <span>Live Communications</span>
              <span className="font-mono">{visibleComms.length} active</span>
            </div>

            {/* Communications feed */}
            <div className="flex-1 space-y-2 overflow-hidden">
              <AnimatePresence mode="popLayout">
                {visibleComms.map((item) => (
                  <motion.div
                    key={item.uid}
                    className="p-2 rounded-lg"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                    initial={{ opacity: 0, x: -30, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 30, scale: 0.9 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    layout
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-sm">{getTypeIcon(item.comm.type)}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-medium truncate" style={{ color: 'var(--color-text-primary)' }}>{item.comm.client}</span>
                          <div
                            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                            style={{ background: getSentimentColor(item.comm.sentiment) }}
                          />
                        </div>
                        <p className="text-[10px] truncate" style={{ color: 'var(--color-text-muted)' }}>{item.comm.preview}</p>
                        {item.comm.signal && (
                          <motion.span
                            className="inline-block mt-1 text-[8px] px-1.5 py-0.5 rounded"
                            style={{
                              background: item.comm.sentiment === 'positive' ? 'rgba(16, 185, 129, 0.2)' :
                                         item.comm.sentiment === 'negative' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                              color: getSentimentColor(item.comm.sentiment),
                            }}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2 }}
                          >
                            {item.comm.signal}
                          </motion.span>
                        )}
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div
                          className="text-[11px] font-mono font-bold"
                          style={{ color: getSentimentColor(item.comm.sentiment) }}
                        >
                          {item.comm.score}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {visibleComms.length === 0 && (
                <div className="flex items-center justify-center h-full">
                  <motion.div
                    className="text-center"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <div className="text-2xl mb-2">📡</div>
                    <span className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>Listening for signals...</span>
                  </motion.div>
                </div>
              )}
            </div>
          </div>

          {/* Right - Intelligence Panel */}
          <div className="w-[45%] p-3 flex flex-col">
            <div className="text-[10px] mb-3" style={{ color: 'var(--color-text-muted)' }}>Intelligence Dashboard</div>

            {/* Metrics grid */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <motion.div
                className="p-2 rounded-lg text-center"
                style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)' }}
                animate={{ boxShadow: ['0 0 0 0 rgba(16, 185, 129, 0)', '0 0 0 3px rgba(16, 185, 129, 0.2)', '0 0 0 0 rgba(16, 185, 129, 0)'] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="text-lg font-bold" style={{ color: '#10b981' }}>{metrics.hotLeads}</div>
                <div className="text-[9px]" style={{ color: 'var(--color-text-muted)' }}>Hot Leads</div>
              </motion.div>

              <motion.div
                className="p-2 rounded-lg text-center"
                style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)' }}
              >
                <div className="text-lg font-bold" style={{ color: '#ef4444' }}>{metrics.atRisk}</div>
                <div className="text-[9px]" style={{ color: 'var(--color-text-muted)' }}>At Risk</div>
              </motion.div>

              <div
                className="p-2 rounded-lg text-center col-span-2"
                style={{ background: 'rgba(99, 91, 255, 0.1)', border: '1px solid rgba(99, 91, 255, 0.3)' }}
              >
                <div className="text-lg font-bold font-mono" style={{ color: 'var(--color-accent-primary)' }}>
                  ${(metrics.opportunities / 1000).toFixed(0)}K
                </div>
                <div className="text-[9px]" style={{ color: 'var(--color-text-muted)' }}>Pipeline Opportunities</div>
              </div>
            </div>

            {/* Health Score Gauge */}
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="relative w-24 h-24">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${metrics.healthScore * 2.51} 251`}
                    initial={{ strokeDasharray: '0 251' }}
                    animate={{ strokeDasharray: `${metrics.healthScore * 2.51} 251` }}
                    transition={{ duration: 0.5 }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-bold" style={{ color: '#10b981' }}>{metrics.healthScore}</span>
                  <span className="text-[8px]" style={{ color: 'var(--color-text-muted)' }}>Health</span>
                </div>
              </div>
              <span className="text-[10px] mt-2" style={{ color: 'var(--color-text-muted)' }}>Portfolio Health Score</span>
            </div>

            {/* Action items */}
            <div className="space-y-1">
              <div className="text-[9px] font-medium" style={{ color: 'var(--color-text-muted)' }}>Recommended Actions</div>
              {[
                { action: 'Call TechStart - sentiment dropping', urgent: true },
                { action: 'Send proposal to Acme Corp', urgent: false },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-2 text-[10px] p-1.5 rounded"
                  style={{ background: 'rgba(255,255,255,0.03)' }}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.2 }}
                >
                  <span>{item.urgent ? '🔴' : '🟡'}</span>
                  <span style={{ color: 'var(--color-text-secondary)' }}>{item.action}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom ticker */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 py-1.5 px-3 flex items-center gap-4 overflow-hidden"
          style={{ background: 'rgba(0,0,0,0.5)', borderTop: '1px solid rgba(255,255,255,0.1)' }}
        >
          <motion.div
            className="flex items-center gap-6 whitespace-nowrap"
            animate={{ x: [0, -500] }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
          >
            <span className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>
              🔥 <span style={{ color: '#10b981' }}>Acme Corp</span> showing buying signals
            </span>
            <span className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>
              ⚠️ <span style={{ color: '#ef4444' }}>TechStart</span> sentiment dropped 23%
            </span>
            <span className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>
              💰 <span style={{ color: 'var(--color-accent-primary)' }}>$45K</span> upsell opportunity detected
            </span>
            <span className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>
              📈 <span style={{ color: '#10b981' }}>GlobalTech</span> ready to close
            </span>
            <span className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>
              🔥 <span style={{ color: '#10b981' }}>Acme Corp</span> showing buying signals
            </span>
          </motion.div>
        </motion.div>

        {/* Pause indicator */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded"
              style={{ background: 'rgba(0,0,0,0.7)' }}
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
