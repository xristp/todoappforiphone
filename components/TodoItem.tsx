'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Todo } from '@/types';
import { X, ChevronDown, ChevronUp, Copy, Archive, Calendar, AlertCircle, Edit2, Save } from 'lucide-react';
import { format, isAfter, isBefore, isToday, isTomorrow, parseISO } from 'date-fns';

interface TodoItemProps {
  todo: Todo;
  accentColor: string;
  onToggle: () => void;
  onDelete: () => void;
  onUpdate: (updates: Partial<Todo>) => void;
  onDuplicate: () => void;
  onArchive: () => void;
}

export default function TodoItem({ todo, accentColor, onToggle, onDelete, onUpdate, onDuplicate, onArchive }: TodoItemProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.title);
  const [editNotes, setEditNotes] = useState(todo.notes || '');
  const [editDueDate, setEditDueDate] = useState(todo.dueDate || '');

  const handleSave = () => {
    onUpdate({ title: editText, notes: editNotes || undefined, dueDate: editDueDate || undefined });
    setIsEditing(false);
  };

  const getDueDateInfo = () => {
    if (!todo.dueDate) return null;
    const dueDate = parseISO(todo.dueDate);
    const now = new Date();
    if (isToday(dueDate)) return { text: 'Today', color: '#FF9500', urgent: true };
    if (isTomorrow(dueDate)) return { text: 'Tomorrow', color: '#FFB84D', urgent: false };
    if (isBefore(dueDate, now)) return { text: 'Overdue', color: '#FF3B30', urgent: true };
    if (isAfter(dueDate, now)) return { text: format(dueDate, 'MMM d'), color: 'var(--text-tertiary)', urgent: false };
    return null;
  };

  const dueDateInfo = getDueDateInfo();
  const hasNotes = todo.notes && todo.notes.trim().length > 0;

  return (
    <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className='group'>
      <div className='flex items-start gap-3 p-4 rounded-xl transition-all' style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
        <motion.button whileTap={{ scale: 0.88 }} transition={{ type: 'spring', stiffness: 500, damping: 20 }} onClick={onToggle} className='w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0 mt-0.5' style={{ borderColor: todo.completed ? accentColor : 'rgba(255, 255, 255, 0.2)', backgroundColor: todo.completed ? accentColor : 'transparent' }}>
          {todo.completed && <motion.svg initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} className='w-3.5 h-3.5 text-white' fill='none' viewBox='0 0 24 24' stroke='currentColor' strokeWidth={3}><path strokeLinecap='round' strokeLinejoin='round' d='M5 13l4 4L19 7' /></motion.svg>}
        </motion.button>
        <div className='flex-1 min-w-0'>
          {isEditing ? (
            <div className='space-y-2'>
              <input value={editText} onChange={(e) => setEditText(e.target.value)} className='w-full px-3 py-2 rounded-lg border-0 text-sm' style={{ background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-primary)', border: '1px solid rgba(255, 255, 255, 0.1)' }} autoFocus />
              <textarea value={editNotes} onChange={(e) => setEditNotes(e.target.value)} placeholder='Add notes...' rows={2} className='w-full px-3 py-2 rounded-lg border-0 text-sm resize-none' style={{ background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-primary)', border: '1px solid rgba(255, 255, 255, 0.1)' }} />
              <input type='date' value={editDueDate} onChange={(e) => setEditDueDate(e.target.value)} className='px-3 py-2 rounded-lg border-0 text-sm' style={{ background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-primary)', border: '1px solid rgba(255, 255, 255, 0.1)' }} />
              <div className='flex gap-2'>
                <button onClick={handleSave} className='px-3 py-1.5 rounded-lg text-sm flex items-center gap-1' style={{ background: accentColor, color: 'white' }}><Save className='w-3.5 h-3.5' />Save</button>
                <button onClick={() => setIsEditing(false)} className='px-3 py-1.5 rounded-lg text-sm' style={{ background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-secondary)' }}>Cancel</button>
              </div>
            </div>
          ) : (
            <>
              <div className='flex items-start justify-between gap-2'>
                <div className='flex-1'>
                  <p className='transition-all text-sm' style={{ color: todo.completed ? 'var(--text-tertiary)' : 'var(--text-primary)', textDecoration: todo.completed ? 'line-through' : 'none', opacity: todo.completed ? 0.5 : 1 }}>{todo.title}</p>
                  {dueDateInfo && <div className='flex items-center gap-1.5 mt-1.5'><Calendar className='w-3.5 h-3.5' style={{ color: dueDateInfo.color }} /><span className='text-xs font-medium' style={{ color: dueDateInfo.color }}>{dueDateInfo.text}</span>{dueDateInfo.urgent && !todo.completed && <AlertCircle className='w-3.5 h-3.5' style={{ color: dueDateInfo.color }} />}</div>}
                </div>
                {hasNotes && <button onClick={() => setIsExpanded(!isExpanded)} className='p-1 rounded hover:bg-white hover:bg-opacity-5' style={{ color: 'var(--text-tertiary)' }}>{isExpanded ? <ChevronUp className='w-4 h-4' /> : <ChevronDown className='w-4 h-4' />}</button>}
              </div>
              <AnimatePresence>{isExpanded && hasNotes && <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className='overflow-hidden'><p className='text-xs mt-2 pt-2 border-t' style={{ color: 'var(--text-secondary)', borderColor: 'rgba(255, 255, 255, 0.08)' }}>{todo.notes}</p></motion.div>}</AnimatePresence>
            </>
          )}
        </div>
        {!isEditing && (
          <div className='flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity'>
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setIsEditing(true)} className='p-1.5 rounded-lg transition-all' style={{ background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-secondary)' }} title='Edit'><Edit2 className='w-3.5 h-3.5' /></motion.button>
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={onDuplicate} className='p-1.5 rounded-lg transition-all' style={{ background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-secondary)' }} title='Duplicate'><Copy className='w-3.5 h-3.5' /></motion.button>
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={onArchive} className='p-1.5 rounded-lg transition-all' style={{ background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-secondary)' }} title='Archive'><Archive className='w-3.5 h-3.5' /></motion.button>
            <motion.button whileHover={{ scale: 1.15, rotate: 10 }} whileTap={{ scale: 0.85 }} transition={{ type: 'spring', stiffness: 500, damping: 20 }} onClick={onDelete} className='p-1.5 rounded-lg transition-all' style={{ background: 'rgba(255, 59, 48, 0.1)', color: '#FF3B30' }} title='Delete'><X className='w-3.5 h-3.5' /></motion.button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
