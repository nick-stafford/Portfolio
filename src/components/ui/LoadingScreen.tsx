import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsLoading(false), 500);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 100);

    // Fallback: hide after 2.5s max
    const timeout = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
          style={{ backgroundColor: 'var(--color-bg-primary)' }}
        >
          {/* Animated Mountain Logo */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="relative mb-8"
          >
            <svg
              viewBox="0 0 120 120"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-32 h-32"
            >
              <defs>
                <linearGradient id="loadMountainGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" style={{ stopColor: '#4B5563' }} />
                  <stop offset="50%" style={{ stopColor: '#6B7280' }} />
                  <stop offset="100%" style={{ stopColor: '#9CA3AF' }} />
                </linearGradient>
                <linearGradient id="loadPeakGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" style={{ stopColor: '#635BFF' }} />
                  <stop offset="100%" style={{ stopColor: '#00D4FF' }} />
                </linearGradient>
                <linearGradient id="loadSnowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style={{ stopColor: '#F0F0F5' }} />
                  <stop offset="100%" style={{ stopColor: '#9CA3AF' }} />
                </linearGradient>
              </defs>

              {/* Background circle with pulse */}
              <motion.circle
                cx="60"
                cy="60"
                r="55"
                fill="none"
                stroke="url(#loadPeakGrad)"
                strokeWidth="2"
                initial={{ pathLength: 0, opacity: 0.3 }}
                animate={{ pathLength: 1, opacity: [0.3, 0.8, 0.3] }}
                transition={{
                  pathLength: { duration: 2, ease: 'easeInOut' },
                  opacity: { duration: 2, repeat: Infinity },
                }}
              />

              {/* Back mountain - draws in */}
              <motion.path
                d="M30 90 L60 40 L90 90 Z"
                fill="url(#loadMountainGrad)"
                opacity="0.6"
                initial={{ pathLength: 0, fillOpacity: 0 }}
                animate={{ pathLength: 1, fillOpacity: 0.6 }}
                transition={{ duration: 0.8, delay: 0.3 }}
              />

              {/* Front mountain - draws in */}
              <motion.path
                d="M20 90 L50 30 L80 90 Z"
                fill="url(#loadMountainGrad)"
                initial={{ pathLength: 0, fillOpacity: 0 }}
                animate={{ pathLength: 1, fillOpacity: 1 }}
                transition={{ duration: 0.8, delay: 0.5 }}
              />

              {/* Snow cap */}
              <motion.path
                d="M50 30 L42 50 L50 45 L58 50 Z"
                fill="url(#loadSnowGrad)"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1 }}
              />

              {/* Accent peak line */}
              <motion.path
                d="M50 30 L50 45"
                stroke="url(#loadPeakGrad)"
                strokeWidth="3"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 1.2 }}
              />

              {/* Small accent triangle */}
              <motion.path
                d="M75 90 L90 65 L105 90 Z"
                fill="url(#loadPeakGrad)"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 0.9, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
              />
            </svg>

            {/* Glow effect */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'radial-gradient(circle, rgba(99, 91, 255, 0.3) 0%, transparent 70%)',
              }}
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.5, 0.8, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />
          </motion.div>

          {/* Name */}
          <motion.h1
            className="text-2xl font-bold mb-4"
            style={{ color: 'var(--color-text-primary)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            Nick Stafford
          </motion.h1>

          {/* Progress bar */}
          <div className="w-48 h-1 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--color-bg-surface)' }}>
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'var(--gradient-primary)' }}
              initial={{ width: '0%' }}
              animate={{ width: `${Math.min(progress, 100)}%` }}
              transition={{ ease: 'easeOut' }}
            />
          </div>

          {/* Loading text */}
          <motion.p
            className="mt-4 text-sm"
            style={{ color: 'var(--color-text-muted)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            Loading experience...
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
