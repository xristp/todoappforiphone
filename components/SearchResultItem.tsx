'use client';

import { motion } from 'framer-motion';
import { Trash2, Briefcase, Home, Target, Dumbbell, BookOpen, Palette, ShoppingCart, Plane, Heart, Star, Zap, Coffee, Code, Music } from 'lucide-react';
import TodoCheckbox from './TodoCheckbox';

interface SearchResultItemProps {
  todo: any;
  categoryName: string;
  categoryIcon: string;
  categoryId: string;
  index: number;
  onToggle: () => void;
  onDelete: () => void;
  onOpenCategory: () => void;
}

const ICON_MAP: { [key: string]: any } = {
  briefcase: Briefcase, home: Home, target: Target, dumbbell: Dumbbell,
  book: BookOpen, palette: Palette, cart: ShoppingCart, plane: Plane,
  heart: Heart, star: Star, zap: Zap, coffee: Coffee, code: Code, music: Music
};

export default function SearchResultItem({
  todo,
  categoryName,
  categoryIcon,
  categoryId,
  index,
  onToggle,
  onDelete,
  onOpenCategory,
}: SearchResultItemProps) {
  const IconComponent = ICON_MAP[categoryIcon] || Briefcase;

  return (
    <motion.div
      key={`${categoryId}-${todo.id}`}
      layout
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ 
        delay: index * 0.03,
        layout: { type: "spring", stiffness: 500, damping: 35 }
      }}
      className="relative overflow-hidden group"
      style={{ 
        borderRadius: '16px',
        background: 'rgba(255, 255, 255, 0.02)'
      }}
    >
      <div 
        className="relative flex items-center gap-3 p-3 transition-all hover:bg-white hover:bg-opacity-5"
        style={{
          background: 'rgba(36, 36, 36, 0.5)',
          backdropFilter: 'blur(12px)',
        }}
      >
        {/* Checkbox */}
        <TodoCheckbox 
          completed={todo.completed}
          onToggle={(e) => {
            e.stopPropagation();
            onToggle();
          }}
        />

        {/* Icon */}
        <motion.div 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="w-9 h-9 flex items-center justify-center flex-shrink-0 cursor-pointer"
          onClick={(e) => {
            e.stopPropagation();
            onOpenCategory();
          }}
          style={{ 
            background: 'rgba(255, 255, 255, 0.04)',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}
        >
          <IconComponent className="w-4 h-4" style={{ color: 'var(--text-secondary)' }} />
        </motion.div>

        {/* Content */}
        <div 
          className="flex-1 min-w-0 cursor-pointer transition-transform hover:translate-x-0.5"
          onClick={(e) => {
            e.stopPropagation();
            onOpenCategory();
          }}
        >
          <p 
            className="text-sm font-medium mb-0.5 truncate" 
            style={{ 
              color: todo.completed ? 'var(--text-tertiary)' : 'var(--text-primary)',
              textDecoration: todo.completed ? 'line-through' : 'none'
            }}
          >
            {todo.title}
          </p>
          <div className="flex items-center gap-1.5 text-xs flex-wrap">
            <span style={{ color: 'var(--text-tertiary)', opacity: 0.7 }}>
              {categoryName}
            </span>
            {todo.dueDate && (
              <>
                <span style={{ color: 'var(--text-tertiary)', opacity: 0.5 }}>•</span>
                <span style={{ color: '#E97451', opacity: 0.8 }}>
                  {new Date(todo.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </>
            )}
            {todo.assignedTo && (
              <>
                <span style={{ color: 'var(--text-tertiary)', opacity: 0.5 }}>•</span>
                <span style={{ color: 'var(--text-tertiary)', opacity: 0.7 }}>
                  {todo.assignedTo}
                </span>
              </>
            )}
          </div>
          {todo.notes && (
            <p className="text-xs mt-1 truncate" style={{ color: 'var(--text-tertiary)', opacity: 0.6 }}>
              {todo.notes}
            </p>
          )}
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onPointerDown={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onDelete();
            }}
            className="w-8 h-8 flex items-center justify-center rounded-lg transition-all"
            style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
            }}
            title="Delete"
          >
            <Trash2 className="w-3.5 h-3.5" style={{ color: '#EF4444' }} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
