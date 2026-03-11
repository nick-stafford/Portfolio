import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Konami Code: Up Up Down Down Left Right Left Right B A
const KONAMI_CODE = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'KeyB', 'KeyA'
];

export default function EasterEgg() {
  const [inputSequence, setInputSequence] = useState<string[]>([]);
  const [isActivated, setIsActivated] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const newSequence = [...inputSequence, e.code].slice(-KONAMI_CODE.length);
      setInputSequence(newSequence);

      // Check if sequence matches Konami code
      if (newSequence.length === KONAMI_CODE.length &&
          newSequence.every((key, i) => key === KONAMI_CODE[i])) {
        setIsActivated(true);
        setShowMessage(true);

        // Hide message after 5 seconds
        setTimeout(() => setShowMessage(false), 5000);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [inputSequence]);

  // Matrix rain effect when activated
  const MatrixRain = () => {
    const columns = Math.floor(window.innerWidth / 20);
    const chars = 'NICKSTAFFORD01アイウエオカキクケコABCDEFGHIJK$%^&*';

    return (
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-[200]">
        {Array.from({ length: columns }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-green-500 font-mono text-sm"
            style={{
              left: i * 20,
              writingMode: 'vertical-rl',
            }}
            initial={{ y: -100, opacity: 0 }}
            animate={{
              y: window.innerHeight + 100,
              opacity: [0, 1, 1, 0],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              delay: Math.random() * 2,
              repeat: Infinity,
              repeatDelay: Math.random() * 3,
            }}
          >
            {Array.from({ length: 20 })
              .map(() => chars[Math.floor(Math.random() * chars.length)])
              .join('')}
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <>
      {isActivated && <MatrixRain />}

      <AnimatePresence>
        {showMessage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -50 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[300] text-center"
          >
            <div
              className="p-8 rounded-2xl"
              style={{
                background: 'rgba(10, 10, 15, 0.95)',
                border: '2px solid var(--color-accent-primary)',
                boxShadow: '0 0 50px rgba(99, 91, 255, 0.5)',
              }}
            >
              <motion.div
                className="text-6xl mb-4"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 0.5, repeat: 3 }}
              >
                🎮
              </motion.div>
              <h2 className="text-2xl font-bold gradient-text mb-2">
                Achievement Unlocked!
              </h2>
              <p style={{ color: 'var(--color-text-secondary)' }}>
                You found the secret Konami Code!
              </p>
              <p className="text-sm mt-4" style={{ color: 'var(--color-accent-primary)' }}>
                +100 Developer Points
              </p>

              <div className="mt-6 flex justify-center gap-2">
                {['🚀', '💻', '🧠', '📈', '⚡'].map((emoji, i) => (
                  <motion.span
                    key={i}
                    className="text-2xl"
                    initial={{ y: 0 }}
                    animate={{ y: [-5, 5, -5] }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      delay: i * 0.1,
                    }}
                  >
                    {emoji}
                  </motion.span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hint (subtle) */}
      <div
        className="fixed bottom-4 left-4 text-xs opacity-20 hover:opacity-60 transition-opacity cursor-help"
        style={{ color: 'var(--color-text-muted)' }}
        title="Try the Konami Code..."
      >
        ↑↑↓↓←→←→BA
      </div>
    </>
  );
}
