import { useState } from 'react';
import { motion } from 'framer-motion';
import AIChatModal from './AIChatModal';

export default function ChatButton() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      {/* Floating chat button - disabled, feature not yet live */}
      <motion.button
        type="button"
        aria-disabled="true"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-4 py-3 rounded-full shadow-lg transition-all cursor-default opacity-90"
        style={{
          background: 'var(--gradient-primary)',
          boxShadow: isHovered
            ? '0 0 30px var(--color-accent-glow)'
            : '0 4px 20px rgba(0, 0, 0, 0.3)',
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 0.9, y: 0 }}
        transition={{ delay: 1 }}
      >
        <svg
          className="w-6 h-6 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
        <span className="text-white font-medium whitespace-nowrap">
          AI Chat &middot; Coming Soon
        </span>
      </motion.button>

      {/* Chat modal kept for later; disabled while the feature is not live */}
      <AIChatModal isOpen={false} onClose={() => {}} />
    </>
  );
}
