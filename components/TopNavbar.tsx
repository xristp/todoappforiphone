'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Search, Database, LogOut } from 'lucide-react';

interface TopNavbarProps {
  showSearch: boolean;
  showDataManager: boolean;
  showLogout: boolean;
  onSearchToggle: () => void;
  onDataManagerToggle: () => void;
  onLogoutToggle: () => void;
  onLogout: () => void;
}

export default function TopNavbar({
  showSearch,
  showDataManager,
  showLogout,
  onSearchToggle,
  onDataManagerToggle,
  onLogoutToggle,
  onLogout,
}: TopNavbarProps) {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6"
    >
      <div className="pill-nav px-8 py-4 flex items-center gap-6">
        <h1 className="text-xl font-bold" style={{ color: 'var(--accent-coral)' }}>
          TaskMaster
        </h1>
        
        {/* Search Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onSearchToggle}
          className="flex items-center gap-2 p-2.5 rounded-full transition-all"
          style={{ 
            color: showSearch ? 'var(--accent-coral)' : 'var(--text-secondary)',
            background: showSearch ? 'rgba(233, 116, 81, 0.15)' : 'rgba(255, 255, 255, 0.05)'
          }}
        >
          <Search className="w-4 h-4" />
        </motion.button>
        
        {/* Data Manager Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onDataManagerToggle}
          className="flex items-center gap-2 p-2.5 rounded-full transition-all"
          style={{ 
            color: showDataManager ? '#34D399' : 'var(--text-secondary)',
            background: showDataManager ? 'rgba(52, 211, 153, 0.15)' : 'rgba(255, 255, 255, 0.05)'
          }}
          title="Backup & Restore"
        >
          <Database className="w-4 h-4" />
        </motion.button>
        
        {/* Logout - Icon Only */}
        <div className="relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onLogoutToggle}
            className="flex items-center gap-2 p-2.5 rounded-full transition-all"
            style={{ 
              color: showLogout ? '#FF3B30' : 'var(--text-secondary)',
              background: showLogout ? 'rgba(255, 59, 48, 0.15)' : 'rgba(255, 255, 255, 0.05)'
            }}
          >
            <LogOut className="w-4 h-4" />
          </motion.button>
          
          <AnimatePresence>
            {showLogout && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                transition={{ 
                  type: "spring",
                  stiffness: 500,
                  damping: 30
                }}
                onClick={onLogout}
                className="absolute top-full right-0 mt-2 px-6 py-3 rounded-xl font-medium whitespace-nowrap"
                style={{ 
                  background: 'rgba(255, 59, 48, 0.15)',
                  border: '1px solid rgba(255, 59, 48, 0.3)',
                  color: '#FF3B30',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)'
                }}
              >
                Logout
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.nav>
  );
}
