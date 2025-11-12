'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { Category } from '@/types';

interface SearchBarProps {
  showSearch: boolean;
  searchQuery: string;
  categories: Category[];
  onSearchChange: (value: string) => void;
  onClose: () => void;
}

export default function SearchBar({
  showSearch,
  searchQuery,
  categories,
  onSearchChange,
  onClose,
}: SearchBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (showSearch && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showSearch]);

  const resultCount = categories.flatMap(cat => 
    cat.todos.filter(todo => 
      !todo.archived &&
      (todo.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      todo.notes?.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  ).length;

  return (
    <AnimatePresence>
      {showSearch && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: -10 }}
          transition={{ 
            type: "spring",
            stiffness: 500,
            damping: 30
          }}
          className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50"
          onClick={onClose}
        >
          <motion.div 
            className="pill-nav px-6 py-3 flex items-center gap-3 min-w-[500px] shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            style={{ 
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(233, 116, 81, 0.2)'
            }}
          >
            <Search className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--accent-coral)' }} />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search across all todos..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Escape') {
                  onClose();
                }
              }}
              className="flex-1 bg-transparent border-0 outline-none text-base placeholder:text-sm"
              style={{ color: 'var(--text-primary)' }}
            />
            {searchQuery && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-xs px-2 py-1 rounded-full"
                style={{ 
                  background: 'rgba(233, 116, 81, 0.15)',
                  color: 'var(--accent-coral)'
                }}
              >
                {resultCount} results
              </motion.span>
            )}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white hover:bg-opacity-10 transition-all"
              style={{ color: 'var(--text-secondary)' }}
            >
              <X className="w-4 h-4" />
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
