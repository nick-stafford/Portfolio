import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SystemNode {
  id: string;
  name: string;
  icon: string;
  color: string;
  position: { x: number; y: number }; // percentage-based positioning
}

// 6 nodes in a perfect hexagonal arrangement around center
// Using percentage positioning for perfect centering
const systems: SystemNode[] = [
  { id: 'salesforce', name: 'Salesforce', icon: '☁️', color: '#00A1E0', position: { x: 50, y: 8 } },      // Top center
  { id: 'quickbooks', name: 'QuickBooks', icon: '📊', color: '#2CA01C', position: { x: 85, y: 29 } },    // Top right
  { id: 'slack', name: 'Slack', icon: '💬', color: '#4A154B', position: { x: 85, y: 71 } },              // Bottom right
  { id: 'stripe', name: 'Stripe', icon: '💳', color: '#635BFF', position: { x: 50, y: 92 } },            // Bottom center
  { id: 'hubspot', name: 'HubSpot', icon: '🎯', color: '#FF7A59', position: { x: 15, y: 71 } },          // Bottom left
  { id: 'aws', name: 'AWS', icon: '⚡', color: '#FF9900', position: { x: 15, y: 29 } },                   // Top left
];

const connections = [
  ['salesforce', 'quickbooks'],
  ['quickbooks', 'slack'],
  ['slack', 'stripe'],
  ['stripe', 'hubspot'],
  ['hubspot', 'aws'],
  ['aws', 'salesforce'],
  // Cross connections
  ['salesforce', 'stripe'],
  ['quickbooks', 'hubspot'],
  ['slack', 'aws'],
];

export default function SynapseHubAnimation() {
  const [isHovered, setIsHovered] = useState(false);
  const [activeConnection, setActiveConnection] = useState(0);
  const [syncCount, setSyncCount] = useState(0);
  const [dataPoints, setDataPoints] = useState(0);
  const [showSalesforceView, setShowSalesforceView] = useState(false);
  const [sfActivity, setSfActivity] = useState<{type: string; message: string; id: number}[]>([]);
  const [sfActivityId, setSfActivityId] = useState(0);

  // Cycle through connections
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isHovered) {
        setActiveConnection((prev) => (prev + 1) % connections.length);
        setSyncCount((prev) => prev + Math.floor(Math.random() * 50) + 10);
      }
    }, 1200);

    return () => clearInterval(interval);
  }, [isHovered]);

  // Animate data points counter
  useEffect(() => {
    const target = 1847293;
    const duration = 3000;
    const steps = 100;
    const increment = target / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setDataPoints(target);
        clearInterval(timer);
      } else {
        setDataPoints(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, []);

  // Toggle between hub view and Salesforce view every 7 seconds
  useEffect(() => {
    if (isHovered) return;

    const viewToggle = setInterval(() => {
      setShowSalesforceView((prev) => !prev);
      setSfActivity([]); // Reset activity on view change
    }, 7000);

    return () => clearInterval(viewToggle);
  }, [isHovered]);

  // Salesforce AI activity simulation
  const sfActivities = [
    { type: 'ai', message: 'AI detected buying signal in Acme Corp' },
    { type: 'sync', message: 'QuickBooks invoice synced to Opportunity' },
    { type: 'ai', message: 'Lead score updated: +15 points' },
    { type: 'update', message: 'Contact enriched with LinkedIn data' },
    { type: 'ai', message: 'Next best action: Schedule follow-up call' },
    { type: 'sync', message: 'Slack thread linked to Case #4521' },
    { type: 'ai', message: 'Churn risk detected: TechStart Inc' },
    { type: 'update', message: 'Deal stage auto-updated to Negotiation' },
  ];

  useEffect(() => {
    if (!showSalesforceView || isHovered) return;

    const activityInterval = setInterval(() => {
      setSfActivityId((prev) => {
        const newId = prev + 1;
        const randomActivity = sfActivities[Math.floor(Math.random() * sfActivities.length)];
        setSfActivity((curr) => [
          { ...randomActivity, id: newId },
          ...curr,
        ].slice(0, 4));
        return newId;
      });
    }, 1500);

    return () => clearInterval(activityInterval);
  }, [showSalesforceView, isHovered]);

  const getSystemById = (id: string) => systems.find((s) => s.id === id);

  return (
    <div
      className="w-full max-w-md mx-auto"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Header stats */}
      <div className="flex justify-center items-center gap-6 mb-4">
        <div className="text-center">
          <motion.div
            className="text-lg font-bold tabular-nums"
            style={{ color: 'var(--color-accent-primary)' }}
          >
            {systems.length}
          </motion.div>
          <div className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>Systems</div>
        </div>
        <div className="text-center">
          <motion.div
            className="text-lg font-bold tabular-nums"
            style={{ color: 'var(--color-success)' }}
          >
            {connections.length}
          </motion.div>
          <div className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>Connections</div>
        </div>
        <div className="text-center">
          <motion.div
            className="text-lg font-bold tabular-nums"
            style={{ color: '#FF9900' }}
          >
            {syncCount.toLocaleString()}
          </motion.div>
          <div className="text-[10px]" style={{ color: 'var(--color-text-muted)' }}>Syncs/hr</div>
        </div>

        {/* Pause indicator */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              className="flex items-center gap-1"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
            >
              <svg className="w-3 h-3" style={{ color: 'var(--color-text-muted)' }} fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Main visualization */}
      <div
        className="relative rounded-xl overflow-hidden"
        style={{
          aspectRatio: '1 / 1',
          background: 'radial-gradient(ellipse at center, rgba(99, 91, 255, 0.15) 0%, rgba(10, 10, 15, 0.95) 70%)',
          border: '1px solid var(--color-border)',
        }}
      >
        <AnimatePresence mode="wait">
          {!showSalesforceView ? (
            <motion.div
              key="hub-view"
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Grid background */}
              <div
                className="absolute inset-0 opacity-10"
                style={{
                  backgroundImage: 'linear-gradient(rgba(99, 91, 255, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(99, 91, 255, 0.3) 1px, transparent 1px)',
                  backgroundSize: '30px 30px',
                }}
              />

              {/* Outer orbit ring */}
              <div
                className="absolute rounded-full"
                style={{
                  width: '75%',
                  height: '75%',
                  left: '12.5%',
                  top: '12.5%',
                  border: '1px dashed rgba(99, 91, 255, 0.2)',
                }}
              />

              {/* Connection lines - SVG overlay */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
                <defs>
                  <linearGradient id="activeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#635BFF" />
                    <stop offset="50%" stopColor="#00D4FF" />
                    <stop offset="100%" stopColor="#635BFF" />
                  </linearGradient>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="1" result="coloredBlur" />
                    <feMerge>
                      <feMergeNode in="coloredBlur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Lines from each node to center */}
                {systems.map((system, i) => (
                  <motion.line
                    key={`center-${system.id}`}
                    x1="50"
                    y1="50"
                    x2={system.position.x}
                    y2={system.position.y}
                    stroke="rgba(99, 91, 255, 0.15)"
                    strokeWidth="0.3"
                    strokeDasharray="2 2"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                  />
                ))}

                {/* Peer-to-peer connections */}
                {connections.map(([fromId, toId], i) => {
                  const from = getSystemById(fromId);
                  const to = getSystemById(toId);
                  if (!from || !to) return null;

                  const isActive = i === activeConnection;

                  return (
                    <g key={`${fromId}-${toId}`}>
                      {/* Base connection line */}
                      <motion.line
                        x1={from.position.x}
                        y1={from.position.y}
                        x2={to.position.x}
                        y2={to.position.y}
                        stroke="rgba(99, 91, 255, 0.2)"
                        strokeWidth="0.4"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ delay: 0.5 + i * 0.05, duration: 0.3 }}
                      />

                      {/* Active connection glow */}
                      {isActive && (
                        <>
                          <motion.line
                            x1={from.position.x}
                            y1={from.position.y}
                            x2={to.position.x}
                            y2={to.position.y}
                            stroke="url(#activeGradient)"
                            strokeWidth="1.5"
                            filter="url(#glow)"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0, 1, 1, 0] }}
                            transition={{ duration: 1.2 }}
                          />
                          {/* Data packet */}
                          <motion.circle
                            r="1.5"
                            fill="#00D4FF"
                            filter="url(#glow)"
                            initial={{ cx: from.position.x, cy: from.position.y }}
                            animate={{ cx: to.position.x, cy: to.position.y }}
                            transition={{ duration: 0.8, ease: 'easeInOut' }}
                          />
                        </>
                      )}
                    </g>
                  );
                })}
              </svg>

              {/* Central hub */}
              <motion.div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full flex items-center justify-center z-10"
                style={{
                  background: 'linear-gradient(135deg, #635BFF 0%, #8B7FFF 50%, #635BFF 100%)',
                  boxShadow: '0 0 30px rgba(99, 91, 255, 0.6)',
                }}
                animate={{
                  boxShadow: [
                    '0 0 20px rgba(99, 91, 255, 0.4)',
                    '0 0 40px rgba(99, 91, 255, 0.8)',
                    '0 0 20px rgba(99, 91, 255, 0.4)',
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <span className="text-2xl">🧠</span>
              </motion.div>

              {/* Hub pulse ring */}
              <motion.div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full pointer-events-none"
                style={{ border: '2px solid rgba(99, 91, 255, 0.6)' }}
                animate={{ scale: [1, 2, 2], opacity: [0.6, 0, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              />

              {/* System nodes */}
              {systems.map((system, i) => {
                const isActive = connections[activeConnection]?.includes(system.id);

                return (
                  <motion.div
                    key={system.id}
                    className="absolute flex flex-col items-center"
                    style={{
                      left: `${system.position.x}%`,
                      top: `${system.position.y}%`,
                      transform: 'translate(-50%, -50%)',
                    }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: i * 0.1, type: 'spring', stiffness: 300 }}
                  >
                    <motion.div
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-xl relative"
                      style={{
                        background: `linear-gradient(135deg, ${system.color}25 0%, ${system.color}10 100%)`,
                        border: `2px solid ${system.color}`,
                        boxShadow: `0 0 15px ${system.color}30`,
                      }}
                      whileHover={{ scale: 1.1 }}
                      animate={{
                        boxShadow: isActive
                          ? [`0 0 15px ${system.color}30`, `0 0 30px ${system.color}70`, `0 0 15px ${system.color}30`]
                          : `0 0 15px ${system.color}30`,
                        scale: isActive ? [1, 1.08, 1] : 1,
                      }}
                      transition={{ duration: 0.6 }}
                    >
                      {system.icon}

                      {/* Active indicator */}
                      {isActive && (
                        <motion.div
                          className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full"
                          style={{ background: '#10b981', boxShadow: '0 0 8px #10b981' }}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.2 }}
                        />
                      )}
                    </motion.div>
                    <span
                      className="text-[9px] mt-1 font-semibold whitespace-nowrap"
                      style={{ color: system.color }}
                    >
                      {system.name}
                    </span>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              key="salesforce-view"
              className="absolute inset-0 flex flex-col"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              style={{ background: '#1B2431' }}
            >
              {/* Salesforce Global Header */}
              <div
                className="flex items-center px-2 py-1.5 gap-2"
                style={{ background: '#032D60', borderBottom: '1px solid #0176D3' }}
              >
                {/* App Launcher */}
                <div className="w-5 h-5 grid grid-cols-3 gap-0.5 p-0.5 rounded cursor-pointer hover:bg-white/10">
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className="w-1 h-1 rounded-sm bg-white/70" />
                  ))}
                </div>

                {/* Salesforce Logo */}
                <span className="text-white text-[10px] font-bold">Sales</span>

                {/* Nav tabs */}
                <div className="flex items-center gap-1 ml-2">
                  {['Home', 'Accounts', 'Opportunities'].map((tab, i) => (
                    <span
                      key={tab}
                      className="text-[8px] px-1.5 py-0.5 rounded"
                      style={{
                        background: i === 2 ? 'rgba(255,255,255,0.15)' : 'transparent',
                        color: i === 2 ? '#fff' : 'rgba(255,255,255,0.7)',
                      }}
                    >
                      {tab}
                    </span>
                  ))}
                </div>

                {/* Global Search */}
                <div
                  className="flex-1 mx-2 flex items-center gap-1 px-2 py-0.5 rounded"
                  style={{ background: 'rgba(255,255,255,0.1)' }}
                >
                  <svg className="w-2.5 h-2.5 text-white/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span className="text-[8px] text-white/50">Search...</span>
                </div>

                {/* Einstein indicator */}
                <motion.div
                  className="flex items-center gap-1 px-1.5 py-0.5 rounded"
                  style={{ background: 'rgba(147, 112, 219, 0.3)' }}
                  animate={{ boxShadow: ['0 0 0 0 rgba(147, 112, 219, 0.4)', '0 0 0 3px rgba(147, 112, 219, 0)'] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <span className="text-[10px]">✨</span>
                  <span className="text-[7px] text-purple-300 font-medium">Einstein</span>
                </motion.div>

                {/* User avatar */}
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
                  <span className="text-[8px] text-white font-bold">NS</span>
                </div>
              </div>

              {/* Record Page Header */}
              <div
                className="px-3 py-2"
                style={{ background: '#16325C', borderBottom: '1px solid #0176D3' }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-yellow-500 flex items-center justify-center">
                    <span className="text-xs">💰</span>
                  </div>
                  <div>
                    <div className="text-[8px] text-blue-300">Opportunity</div>
                    <div className="text-[11px] text-white font-semibold">Acme Corp - Enterprise Deal</div>
                  </div>
                  <div className="ml-auto flex items-center gap-1">
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-green-500/20 text-green-400">Negotiation</span>
                    <span className="text-[9px] font-mono text-green-400">$125,000</span>
                  </div>
                </div>
              </div>

              {/* Main Content Area - Split View */}
              <div className="flex-1 flex overflow-hidden">
                {/* Left - Record Details */}
                <div className="flex-1 p-2 overflow-hidden" style={{ borderRight: '1px solid #0176D3' }}>
                  {/* Highlights Panel */}
                  <div className="mb-2 p-2 rounded" style={{ background: 'rgba(255,255,255,0.05)' }}>
                    <div className="text-[8px] text-blue-300 mb-1.5 font-medium">HIGHLIGHTS</div>
                    <div className="grid grid-cols-2 gap-2">
                      {[
                        { label: 'Close Date', value: 'Mar 28, 2026' },
                        { label: 'Probability', value: '75%' },
                        { label: 'Account', value: 'Acme Corp' },
                        { label: 'Contact', value: 'John Smith' },
                      ].map((item) => (
                        <div key={item.label}>
                          <div className="text-[7px] text-gray-400">{item.label}</div>
                          <div className="text-[9px] text-white">{item.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Path/Stage indicator */}
                  <div className="mb-2">
                    <div className="flex items-center gap-0.5">
                      {['Qualification', 'Needs Analysis', 'Proposal', 'Negotiation', 'Closed'].map((stage, i) => (
                        <div
                          key={stage}
                          className="flex-1 h-1.5 rounded-full"
                          style={{
                            background: i <= 3 ? '#0176D3' : 'rgba(255,255,255,0.1)',
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Activity Timeline */}
                  <div className="text-[8px] text-blue-300 mb-1 font-medium">ACTIVITY</div>
                  <div className="space-y-1.5 max-h-[100px] overflow-hidden">
                    <AnimatePresence mode="popLayout">
                      {sfActivity.slice(0, 3).map((activity) => (
                        <motion.div
                          key={activity.id}
                          className="flex items-start gap-1.5 p-1.5 rounded"
                          style={{ background: activity.type === 'ai' ? 'rgba(147, 112, 219, 0.15)' : 'rgba(255,255,255,0.05)' }}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          layout
                        >
                          <span className="text-[10px]">
                            {activity.type === 'ai' ? '✨' : activity.type === 'sync' ? '🔄' : '📝'}
                          </span>
                          <div className="flex-1">
                            <span className="text-[8px] text-gray-300">{activity.message}</span>
                            <div className="text-[7px] text-gray-500 mt-0.5">Just now</div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Right - Einstein AI Panel */}
                <div className="w-[42%] p-2 flex flex-col" style={{ background: 'rgba(147, 112, 219, 0.08)' }}>
                  <div className="flex items-center gap-1.5 mb-2">
                    <motion.div
                      animate={{ scale: [1, 1.15, 1], rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <span className="text-sm">✨</span>
                    </motion.div>
                    <span className="text-[9px] font-semibold text-purple-300">Einstein Insights</span>
                  </div>

                  {/* AI Insight Cards */}
                  <div className="space-y-1.5 flex-1 overflow-hidden">
                    <motion.div
                      className="p-1.5 rounded"
                      style={{ background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)' }}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                    >
                      <div className="flex items-center gap-1 mb-1">
                        <span className="text-[9px]">📈</span>
                        <span className="text-[8px] font-semibold text-green-400">High Win Probability</span>
                      </div>
                      <p className="text-[7px] text-gray-300">Deal signals suggest 85% likelihood to close based on engagement patterns.</p>
                    </motion.div>

                    <motion.div
                      className="p-1.5 rounded"
                      style={{ background: 'rgba(147, 112, 219, 0.15)', border: '1px solid rgba(147, 112, 219, 0.3)' }}
                      animate={{ boxShadow: ['0 0 0 0 rgba(147, 112, 219, 0.3)', '0 0 8px 0 rgba(147, 112, 219, 0.3)'] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <div className="flex items-center gap-1 mb-1">
                        <motion.span
                          className="text-[9px]"
                          animate={{ rotate: [0, 10, -10, 0] }}
                          transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
                        >
                          🎯
                        </motion.span>
                        <span className="text-[8px] font-semibold text-purple-300">Next Best Action</span>
                      </div>
                      <p className="text-[7px] text-gray-300">Schedule executive sponsor meeting to accelerate close.</p>
                    </motion.div>

                    <motion.div
                      className="p-1.5 rounded"
                      style={{ background: 'rgba(255, 165, 0, 0.1)', border: '1px solid rgba(255, 165, 0, 0.3)' }}
                    >
                      <div className="flex items-center gap-1 mb-1">
                        <span className="text-[9px]">🔗</span>
                        <span className="text-[8px] font-semibold text-orange-400">Connected Data</span>
                      </div>
                      <p className="text-[7px] text-gray-300">QuickBooks invoice #4521 synced • Slack thread linked</p>
                    </motion.div>
                  </div>

                  {/* AI Processing indicator */}
                  <motion.div
                    className="mt-2 flex items-center justify-center gap-1.5 py-1 rounded"
                    style={{ background: 'rgba(147, 112, 219, 0.2)' }}
                  >
                    <motion.div
                      className="w-1.5 h-1.5 rounded-full bg-purple-400"
                      animate={{ scale: [1, 1.3, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1, repeat: Infinity }}
                    />
                    <span className="text-[7px] text-purple-300">AI analyzing in real-time</span>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom stats bar */}
      <motion.div
        className="mt-4 flex justify-between items-center px-4 py-3 rounded-lg"
        style={{
          background: 'var(--color-bg-surface)',
          border: '1px solid var(--color-border)',
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <div className="flex items-center gap-2">
          <motion.div
            className="w-2 h-2 rounded-full"
            style={{ background: '#10b981' }}
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
          <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>All Systems Operational</span>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <div>
            <span style={{ color: 'var(--color-text-muted)' }}>Data Points: </span>
            <span className="font-mono font-bold" style={{ color: 'var(--color-accent-primary)' }}>
              {dataPoints.toLocaleString()}
            </span>
          </div>
          <div>
            <span style={{ color: 'var(--color-text-muted)' }}>Latency: </span>
            <span className="font-mono font-bold" style={{ color: '#10b981' }}>12ms</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
