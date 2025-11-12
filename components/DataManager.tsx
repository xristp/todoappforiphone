'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Upload, Save } from 'lucide-react';
import { Category } from '@/types';
import {
  exportData,
  downloadDataAsJSON,
  importData,
  readFileAsText,
  saveLocalBackup,
} from '@/lib/data-manager';

interface DataManagerProps {
  show: boolean;
  categories: Category[];
  onClose: () => void;
  onImport: (categories: Category[]) => void;
}

export default function DataManager({
  show,
  categories,
  onClose,
  onImport,
}: DataManagerProps) {
  const [importMessage, setImportMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleExport = () => {
    const data = exportData(categories);
    downloadDataAsJSON(data);
    saveLocalBackup(categories);
    setImportMessage({ type: 'success', text: '✓ Data exported and backed up successfully!' });
    setTimeout(() => setImportMessage(null), 3000);
  };

  const handleImport = async (file: File) => {
    try {
      const text = await readFileAsText(file);
      const result = importData(text);
      
      if (result.success && result.imported) {
        const parsedData = JSON.parse(text);
        
        // Save current data as backup before replacing
        saveLocalBackup(categories);
        
        // Replace categories with imported data
        onImport(parsedData.categories);
        
        setImportMessage({
          type: 'success',
          text: `✓ Imported ${result.imported.categories} categories and ${result.imported.todos} todos!`
        });
        
        setTimeout(() => setImportMessage(null), 5000);
      } else {
        setImportMessage({
          type: 'error',
          text: `✗ ${result.message}: ${result.errors?.join(', ')}`
        });
        setTimeout(() => setImportMessage(null), 5000);
      }
    } catch (error) {
      setImportMessage({
        type: 'error',
        text: '✗ Failed to read file'
      });
      setTimeout(() => setImportMessage(null), 3000);
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0, 0, 0, 0.7)', backdropFilter: 'blur(8px)' }}
          onClick={() => {
            onClose();
            setImportMessage(null);
          }}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="bento-card max-w-lg w-full p-6"
            onClick={(e) => e.stopPropagation()}
            style={{ maxHeight: '80vh', overflowY: 'auto' }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                Data Manager
              </h2>
              <button
                onClick={() => {
                  onClose();
                  setImportMessage(null);
                }}
                className="p-2 rounded-full hover:bg-white hover:bg-opacity-10 transition-all"
              >
                <X className="w-5 h-5" style={{ color: 'var(--text-secondary)' }} />
              </button>
            </div>

            {/* Import/Export Explanation */}
            <p className="text-sm mb-6" style={{ color: 'var(--text-tertiary)' }}>
              Export your data as JSON to keep a backup, or import from a previous export to restore your todos.
            </p>

            {/* Message Display */}
            <AnimatePresence>
              {importMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="mb-4 p-3 rounded-xl"
                  style={{
                    background: importMessage.type === 'success' 
                      ? 'rgba(52, 211, 153, 0.15)' 
                      : 'rgba(239, 68, 68, 0.15)',
                    border: `1px solid ${importMessage.type === 'success' ? 'rgba(52, 211, 153, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                    color: importMessage.type === 'success' ? '#34D399' : '#EF4444'
                  }}
                >
                  {importMessage.text}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Export Section */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-3 uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>
                Export Data
              </h3>
              <button
                onClick={handleExport}
                className="w-full p-4 rounded-xl flex items-center justify-between transition-all hover:scale-[1.02]"
                style={{
                  background: 'rgba(52, 211, 153, 0.1)',
                  border: '1px solid rgba(52, 211, 153, 0.2)',
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg" style={{ background: 'rgba(52, 211, 153, 0.2)' }}>
                    <Download className="w-5 h-5" style={{ color: '#34D399' }} />
                  </div>
                  <div className="text-left">
                    <p className="font-medium" style={{ color: 'var(--text-primary)' }}>Download JSON</p>
                    <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                      {categories.length} categories, {categories.flatMap(c => c.todos).length} todos
                    </p>
                  </div>
                </div>
                <span style={{ color: '#34D399' }}>→</span>
              </button>
            </div>

            {/* Import Section */}
            <div className="mb-6">
              <h3 className="text-sm font-semibold mb-3 uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>
                Import Data
              </h3>
              <label
                className="w-full p-4 rounded-xl flex items-center justify-between transition-all hover:scale-[1.02] cursor-pointer"
                style={{
                  background: 'rgba(233, 116, 81, 0.1)',
                  border: '1px solid rgba(233, 116, 81, 0.2)',
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg" style={{ background: 'rgba(233, 116, 81, 0.2)' }}>
                    <Upload className="w-5 h-5" style={{ color: '#E97451' }} />
                  </div>
                  <div className="text-left">
                    <p className="font-medium" style={{ color: 'var(--text-primary)' }}>Upload JSON</p>
                    <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                      Replace current data with backup
                    </p>
                  </div>
                </div>
                <span style={{ color: '#E97451' }}>→</span>
                <input
                  type="file"
                  accept=".json"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      await handleImport(file);
                      e.target.value = '';
                    }
                  }}
                />
              </label>
            </div>

            {/* Auto-Backup Info */}
            <div className="p-4 rounded-xl" style={{ background: 'rgba(255, 255, 255, 0.03)' }}>
              <div className="flex items-start gap-3">
                <Save className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: '#34D399' }} />
                <div>
                  <p className="text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                    Auto-Backup Enabled
                  </p>
                  <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                    Your data is automatically backed up locally. The last 5 backups are kept in your browser.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
