'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface TodoCheckboxProps {
  completed: boolean;
  onToggle: (e: React.MouseEvent) => void;
  size?: 'sm' | 'md' | 'lg';
}

export default function TodoCheckbox({ completed, onToggle, size = 'md' }: TodoCheckboxProps) {
  const sizeMap = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const iconSizeMap = {
    sm: 'w-2.5 h-2.5',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ 
        scale: 0.75,
        transition: { 
          type: "spring", 
          stiffness: 1000, 
          damping: 12,
          duration: 0.1
        }
      }}
      onPointerDown={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onToggle(e);
      }}
      className={`${sizeMap[size]} rounded-full flex items-center justify-center flex-shrink-0 relative`}
      style={{
        border: `2px solid ${completed ? '#22C55E' : 'rgba(255, 255, 255, 0.2)'}`,
        backgroundColor: completed ? '#22C55E' : 'transparent',
        transition: 'all 0.12s cubic-bezier(0.34, 1.56, 0.64, 1)',
        boxShadow: completed ? '0 0 0 2px rgba(34, 197, 94, 0.2)' : 'none'
      }}
    >
      <AnimatePresence mode="wait">
        {completed && (
          <motion.svg
            key="checkmark"
            initial={{ scale: 0, rotate: -90, opacity: 0 }}
            animate={{ 
              scale: 1, 
              rotate: 0, 
              opacity: 1,
              transition: { 
                type: "spring", 
                stiffness: 900, 
                damping: 12,
                duration: 0.12,
                opacity: { duration: 0.08 }
              }
            }}
            exit={{ 
              scale: 0, 
              rotate: 90, 
              opacity: 0,
              transition: { duration: 0.1 }
            }}
            className={`${iconSizeMap[size]} absolute`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <motion.polyline 
              points="20 6 9 17 4 12"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.15, delay: 0.02 }}
            />
          </motion.svg>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
