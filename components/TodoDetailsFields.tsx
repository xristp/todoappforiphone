'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, User, StickyNote, ChevronDown } from 'lucide-react';

interface TodoDetailsFieldsProps {
  notes: string;
  setNotes: (value: string) => void;
  dueDate: string;
  setDueDate: (value: string) => void;
  dueTime: string;
  setDueTime: (value: string) => void;
  assignedTo: string;
  setAssignedTo: (value: string) => void;
  accentColor?: string;
}

export default function TodoDetailsFields({
  notes,
  setNotes,
  dueDate,
  setDueDate,
  dueTime,
  setDueTime,
  assignedTo,
  setAssignedTo,
  accentColor = '#E97451'
}: TodoDetailsFieldsProps) {
  const [showTimeDropdown, setShowTimeDropdown] = useState(false);

  const timeOptions = [
    '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00',
    '17:00', '18:00', '19:00', '20:00'
  ];

  return (
    <div className="space-y-3">
      {/* Due Date */}
      <div className="relative">
        <Calendar className="absolute left-3 top-3 w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
        <input
          type="date"
          placeholder="Due date..."
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border-0 transition-all focus:outline-none text-sm"
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            color: 'var(--text-primary)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        />
      </div>

      {/* Due Time */}
      <div className="relative">
        <Clock className="absolute left-3 top-3 w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
        <div
          onClick={() => setShowTimeDropdown(!showTimeDropdown)}
          className="w-full pl-10 pr-10 py-2.5 rounded-lg border-0 transition-all cursor-pointer text-sm flex items-center justify-between"
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            color: dueTime ? 'var(--text-primary)' : 'var(--text-tertiary)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        >
          <span>{dueTime || 'Select time...'}</span>
          <ChevronDown className="w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
        </div>
        
        <AnimatePresence>
          {showTimeDropdown && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute z-50 w-full mt-1 rounded-lg overflow-hidden max-h-48 overflow-y-auto"
              style={{
                background: 'rgba(28, 28, 30, 0.98)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
              }}
            >
              {timeOptions.map((time) => (
                <div
                  key={time}
                  onClick={() => {
                    setDueTime(time);
                    setShowTimeDropdown(false);
                  }}
                  className="px-4 py-2.5 cursor-pointer transition-all text-sm"
                  style={{
                    background: dueTime === time ? 'rgba(233, 116, 81, 0.1)' : 'transparent',
                    color: dueTime === time ? accentColor : 'var(--text-primary)',
                  }}
                  onMouseEnter={(e) => {
                    if (dueTime !== time) {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (dueTime !== time) {
                      e.currentTarget.style.background = 'transparent';
                    }
                  }}
                >
                  {time}
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Assigned To */}
      <div className="relative">
        <User className="absolute left-3 top-3 w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
        <input
          placeholder="Assign to..."
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border-0 transition-all focus:outline-none text-sm"
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            color: 'var(--text-primary)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        />
      </div>

      {/* Notes */}
      <div className="relative">
        <StickyNote className="absolute left-3 top-3 w-4 h-4" style={{ color: 'var(--text-tertiary)' }} />
        <input
          placeholder="Add notes..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 rounded-lg border-0 transition-all focus:outline-none text-sm"
          style={{
            background: 'rgba(255, 255, 255, 0.03)',
            color: 'var(--text-primary)',
            border: '1px solid rgba(255, 255, 255, 0.06)',
          }}
        />
      </div>
    </div>
  );
}
