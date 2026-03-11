import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TerminalLine {
  id: number;
  type: 'command' | 'output' | 'success' | 'info' | 'stage';
  text: string;
  delay: number;
}

const pipelineScript: TerminalLine[] = [
  { id: 1, type: 'command', text: '$ glp deploy --env production', delay: 0 },
  { id: 2, type: 'info', text: '🚀 GLP Pipeline v2.4.1 - Starting deployment...', delay: 400 },
  { id: 3, type: 'stage', text: '═══════════════════════════════════════════════', delay: 600 },
  { id: 4, type: 'stage', text: '  STAGE 1: BUILD', delay: 800 },
  { id: 5, type: 'stage', text: '═══════════════════════════════════════════════', delay: 900 },
  { id: 6, type: 'output', text: '  → Installing dependencies...', delay: 1100 },
  { id: 7, type: 'output', text: '  → Compiling TypeScript...', delay: 1400 },
  { id: 8, type: 'output', text: '  → Building React frontend...', delay: 1700 },
  { id: 9, type: 'output', text: '  → Building FastAPI backend...', delay: 2000 },
  { id: 10, type: 'success', text: '  ✓ Build completed in 42.3s', delay: 2300 },
  { id: 11, type: 'stage', text: '═══════════════════════════════════════════════', delay: 2600 },
  { id: 12, type: 'stage', text: '  STAGE 2: TEST', delay: 2700 },
  { id: 13, type: 'stage', text: '═══════════════════════════════════════════════', delay: 2800 },
  { id: 14, type: 'output', text: '  → Running unit tests... 147 passed', delay: 3000 },
  { id: 15, type: 'output', text: '  → Running integration tests... 38 passed', delay: 3300 },
  { id: 16, type: 'output', text: '  → Code coverage: 94.2%', delay: 3600 },
  { id: 17, type: 'success', text: '  ✓ All tests passed', delay: 3900 },
  { id: 18, type: 'stage', text: '═══════════════════════════════════════════════', delay: 4200 },
  { id: 19, type: 'stage', text: '  STAGE 3: CONTAINERIZE', delay: 4300 },
  { id: 20, type: 'stage', text: '═══════════════════════════════════════════════', delay: 4400 },
  { id: 21, type: 'output', text: '  → Building Docker image...', delay: 4600 },
  { id: 22, type: 'info', text: '    FROM python:3.11-slim', delay: 4800 },
  { id: 23, type: 'info', text: '    COPY ./app /app', delay: 4950 },
  { id: 24, type: 'info', text: '    RUN pip install -r requirements.txt', delay: 5100 },
  { id: 25, type: 'output', text: '  → Pushing to registry: gcr.io/glp-prod/app:v2.4.1', delay: 5400 },
  { id: 26, type: 'success', text: '  ✓ Image pushed successfully', delay: 5700 },
  { id: 27, type: 'stage', text: '═══════════════════════════════════════════════', delay: 6000 },
  { id: 28, type: 'stage', text: '  STAGE 4: DEPLOY TO KUBERNETES', delay: 6100 },
  { id: 29, type: 'stage', text: '═══════════════════════════════════════════════', delay: 6200 },
  { id: 30, type: 'output', text: '  → Connecting to AWS EKS cluster...', delay: 6400 },
  { id: 31, type: 'output', text: '  → Applying Kubernetes manifests...', delay: 6700 },
  { id: 32, type: 'info', text: '    deployment.apps/glp-api configured', delay: 6900 },
  { id: 33, type: 'info', text: '    service/glp-api-svc configured', delay: 7050 },
  { id: 34, type: 'info', text: '    ingress.networking.k8s.io/glp-ingress configured', delay: 7200 },
  { id: 35, type: 'output', text: '  → Rolling update: 0/3 → 1/3 → 2/3 → 3/3 pods ready', delay: 7500 },
  { id: 36, type: 'success', text: '  ✓ Deployment successful', delay: 7900 },
  { id: 37, type: 'stage', text: '═══════════════════════════════════════════════', delay: 8200 },
  { id: 38, type: 'success', text: '🎉 DEPLOYMENT COMPLETE', delay: 8400 },
  { id: 39, type: 'info', text: '   URL: https://app.glp-prod.io', delay: 8600 },
  { id: 40, type: 'info', text: '   Duration: 2m 34s', delay: 8750 },
  { id: 41, type: 'stage', text: '═══════════════════════════════════════════════', delay: 8900 },
];

export default function GLPAnimation() {
  const [isHovered, setIsHovered] = useState(false);
  const [visibleLines, setVisibleLines] = useState<TerminalLine[]>([]);
  const [currentStage, setCurrentStage] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const stages = ['Build', 'Test', 'Container', 'Deploy'];

  useEffect(() => {
    if (isHovered) return;

    setVisibleLines([]);
    setCurrentStage(0);
    setIsComplete(false);

    const timers: NodeJS.Timeout[] = [];

    pipelineScript.forEach((line) => {
      const timer = setTimeout(() => {
        setVisibleLines((prev) => [...prev, line]);

        // Update stage based on line content
        if (line.text.includes('STAGE 1')) setCurrentStage(1);
        if (line.text.includes('STAGE 2')) setCurrentStage(2);
        if (line.text.includes('STAGE 3')) setCurrentStage(3);
        if (line.text.includes('STAGE 4')) setCurrentStage(4);
        if (line.text.includes('DEPLOYMENT COMPLETE')) {
          setCurrentStage(5);
          setIsComplete(true);
        }
      }, line.delay);

      timers.push(timer);
    });

    // Reset after completion
    const resetTimer = setTimeout(() => {
      setVisibleLines([]);
      setCurrentStage(0);
      setIsComplete(false);
    }, 12000);

    timers.push(resetTimer);

    return () => timers.forEach(clearTimeout);
  }, [isHovered]);

  const getLineColor = (type: string) => {
    switch (type) {
      case 'command': return '#10b981';
      case 'success': return '#10b981';
      case 'info': return '#6b7280';
      case 'stage': return '#635BFF';
      default: return '#e5e7eb';
    }
  };

  return (
    <div
      className="w-full max-w-lg mx-auto"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Terminal header */}
      <div
        className="flex items-center justify-between px-4 py-2 rounded-t-xl"
        style={{ background: '#1e1e1e', border: '1px solid #333', borderBottom: 'none' }}
      >
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-3 h-3 rounded-full bg-[#ff5f56]" />
            <span className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <span className="w-3 h-3 rounded-full bg-[#27ca40]" />
          </div>
          <span className="ml-3 text-xs font-mono" style={{ color: '#888' }}>glp-pipeline — zsh</span>
        </div>

        {/* Pipeline stages indicator */}
        <div className="flex items-center gap-1">
          {stages.map((stage, i) => (
            <motion.div
              key={stage}
              className="flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-mono"
              style={{
                background: currentStage > i ? 'rgba(16, 185, 129, 0.2)' :
                           currentStage === i + 1 ? 'rgba(99, 91, 255, 0.3)' : 'rgba(255,255,255,0.05)',
                color: currentStage > i ? '#10b981' :
                       currentStage === i + 1 ? '#635BFF' : '#666',
                border: currentStage === i + 1 ? '1px solid #635BFF' : '1px solid transparent',
              }}
              animate={currentStage === i + 1 ? { opacity: [1, 0.6, 1] } : {}}
              transition={{ duration: 0.8, repeat: Infinity }}
            >
              {currentStage > i ? '✓' : i + 1}
              <span className="hidden sm:inline">{stage}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Terminal body */}
      <div
        className="relative h-[400px] rounded-b-xl overflow-hidden font-mono text-xs"
        style={{ background: '#0d0d0d', border: '1px solid #333', borderTop: 'none' }}
      >
        {/* Scanlines effect */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.1) 2px, rgba(255,255,255,0.1) 4px)',
          }}
        />

        {/* Terminal content */}
        <div className="h-full overflow-hidden p-4">
          <div className="space-y-0.5">
            <AnimatePresence>
              {visibleLines.map((line) => (
                <motion.div
                  key={line.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.15 }}
                  style={{ color: getLineColor(line.type) }}
                  className={line.type === 'stage' ? 'font-bold' : ''}
                >
                  {line.type === 'command' && (
                    <span className="text-[#888]">
                      <span style={{ color: '#10b981' }}>nick@glp</span>
                      <span style={{ color: '#888' }}>:</span>
                      <span style={{ color: '#635BFF' }}>~/projects</span>
                      <span style={{ color: '#888' }}> </span>
                    </span>
                  )}
                  <span>{line.text.replace('$ ', '')}</span>
                  {line.type === 'command' && (
                    <motion.span
                      className="inline-block w-2 h-4 ml-1 align-middle"
                      style={{ background: '#10b981' }}
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.5, repeat: 3 }}
                    />
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Blinking cursor at the end */}
            {visibleLines.length === 0 && (
              <div style={{ color: '#888' }}>
                <span style={{ color: '#10b981' }}>nick@glp</span>
                <span>:</span>
                <span style={{ color: '#635BFF' }}>~/projects</span>
                <span> </span>
                <motion.span
                  className="inline-block w-2 h-4 align-middle"
                  style={{ background: '#10b981' }}
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.6, repeat: Infinity }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Success overlay */}
        <AnimatePresence>
          {isComplete && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              style={{ background: 'rgba(0,0,0,0.7)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="text-center"
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              >
                <motion.div
                  className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center"
                  style={{ background: 'rgba(16, 185, 129, 0.2)', border: '3px solid #10b981' }}
                  animate={{
                    boxShadow: [
                      '0 0 0 0 rgba(16, 185, 129, 0.4)',
                      '0 0 0 20px rgba(16, 185, 129, 0)',
                    ],
                  }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <motion.path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    />
                  </svg>
                </motion.div>
                <div className="text-xl font-bold" style={{ color: '#10b981' }}>Deployed!</div>
                <div className="text-sm mt-2" style={{ color: '#888' }}>
                  Production is live at <span style={{ color: '#635BFF' }}>app.glp-prod.io</span>
                </div>

                {/* Tech badges */}
                <div className="flex justify-center gap-2 mt-4">
                  {['Docker', 'K8s', 'AWS'].map((tech, i) => (
                    <motion.span
                      key={tech}
                      className="px-2 py-1 text-[10px] rounded"
                      style={{ background: 'rgba(99, 91, 255, 0.2)', color: '#635BFF', border: '1px solid #635BFF' }}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                    >
                      {tech}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pause indicator */}
        <AnimatePresence>
          {isHovered && !isComplete && (
            <motion.div
              className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded"
              style={{ background: 'rgba(0,0,0,0.8)' }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <svg className="w-3 h-3" style={{ color: '#888' }} fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
              </svg>
              <span className="text-[10px]" style={{ color: '#888' }}>Paused</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
