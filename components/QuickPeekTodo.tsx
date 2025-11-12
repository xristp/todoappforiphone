'use client';

import { useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useAnimation } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  CheckCircle2, Edit2, X, Briefcase, Home, Target, Dumbbell,
  BookOpen, Palette, ShoppingCart, Plane, Heart, Star,
  Zap, Coffee, Code, Music
} from 'lucide-react';

interface QuickPeekTodoProps {
  todo: any;
  categoryName: string;
  categoryIcon: string;
  categoryId: string;
  onToggle: () => void;
  onRemove: () => void;
  delay: number;
}

const ICON_MAP: { [key: string]: any } = {
  briefcase: Briefcase, home: Home, target: Target, dumbbell: Dumbbell,
  book: BookOpen, palette: Palette, cart: ShoppingCart, plane: Plane,
  heart: Heart, star: Star, zap: Zap, coffee: Coffee, code: Code, music: Music
};

export default function QuickPeekTodo({ 
  todo, 
  categoryName, 
  categoryIcon, 
  categoryId, 
  onToggle,
  onRemove,
  delay 
}: QuickPeekTodoProps) {
  const [dragX, setDragX] = useState(0);
  const [dragY, setDragY] = useState(0);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const controls = useAnimation();
  const router = useRouter();
  const accentColor = '#E97451';
  
  const IconComponent = ICON_MAP[categoryIcon] || Briefcase;
  
  const formatDueDate = (dueDate?: string) => {
    if (!dueDate) return null;
    const date = new Date(dueDate);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const resetPosition = async () => {
    await controls.start({
      x: 0,
      y: 0,
      transition: { type: "spring", stiffness: 700, damping: 25, duration: 0.15 }
    });
  };

  const handleDragEnd = async (_: any, info: any) => {
    const velocityX = info.velocity.x;
    const offsetX = info.offset.x;
    const offsetY = info.offset.y;
    
    // Swipe up to remove (only for completed tasks)
    if (todo.completed && offsetY < -80) {
      controls.start({
        opacity: 0,
        y: -100,
        transition: { duration: 0.15 }
      });
      onRemove();
      return;
    }
    
    // Swipe left to uncomplete (only for completed tasks)
    if (todo.completed && (offsetX < -100 || velocityX < -500)) {
      resetPosition();
      onToggle();
      return;
    }
    
    // Swipe left to complete (only for incomplete tasks)
    if (!todo.completed && (offsetX < -100 || velocityX < -500)) {
      resetPosition();
      onToggle();
      return;
    }
    
    // Swipe right to edit (only for incomplete tasks)
    if (!todo.completed && (offsetX > 100 || velocityX > 500)) {
      resetPosition();
      const categoryCard = document.querySelector(`[data-category-id="${categoryId}"]`);
      if (categoryCard) {
        (categoryCard as HTMLElement).click();
      }
      return;
    }
    
    // Reset position if threshold not met
    resetPosition();
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: -20 }}
      transition={{ 
        layout: { type: "spring", stiffness: 500, damping: 35, duration: 0.3 },
        delay, 
        duration: 0.3 
      }}
      className="relative overflow-hidden"
      style={{ 
        borderRadius: '16px',
        background: 'rgba(255, 255, 255, 0.02)'
      }}
    >
      {/* Swipe Action Indicators */}
      {/* Left swipe - complete for incomplete, uncomplete for completed */}
      {dragX < -10 && (
        <div 
          className="absolute inset-0 flex items-center justify-end pr-5"
          style={{ 
            background: 'linear-gradient(90deg, transparent 0%, rgba(34, 197, 94, 0.15) 70%, rgba(34, 197, 94, 0.25) 100%)',
            opacity: Math.min(Math.abs(dragX) / 100, 1),
            pointerEvents: 'none'
          }}
        >
          <CheckCircle2 
            className="w-5 h-5" 
            style={{ 
              color: '#22C55E',
              transform: `scale(${0.6 + Math.min(Math.abs(dragX) / 100, 1) * 0.4})`,
              filter: `drop-shadow(0 0 ${Math.min(Math.abs(dragX) / 50, 8)}px rgba(34, 197, 94, 0.6))`
            }} 
          />
        </div>
      )}
      
      {/* Right swipe to edit - only show for incomplete tasks */}
      {!todo.completed && dragX > 10 && (
        <div 
          className="absolute inset-0 flex items-center justify-start pl-5"
          style={{ 
            background: 'linear-gradient(270deg, transparent 0%, rgba(233, 116, 81, 0.15) 70%, rgba(233, 116, 81, 0.25) 100%)',
            opacity: Math.min(Math.abs(dragX) / 100, 1),
            pointerEvents: 'none'
          }}
        >
          <Edit2 
            className="w-5 h-5" 
            style={{ 
              color: accentColor,
              transform: `scale(${0.6 + Math.min(Math.abs(dragX) / 100, 1) * 0.4})`,
              filter: `drop-shadow(0 0 ${Math.min(Math.abs(dragX) / 50, 8)}px rgba(233, 116, 81, 0.6))`
            }} 
          />
        </div>
      )}
      
      {/* Up swipe to remove - only for completed tasks */}
      {todo.completed && dragY < -10 && (
        <div 
          className="absolute inset-0 flex items-start justify-center pt-3"
          style={{ 
            background: 'linear-gradient(0deg, transparent 0%, rgba(255, 59, 48, 0.15) 100%)',
            opacity: Math.min(Math.abs(dragY) / 80, 1),
            pointerEvents: 'none'
          }}
        >
          <X 
            className="w-5 h-5" 
            style={{ 
              color: '#FF3B30',
              transform: `scale(${0.6 + Math.min(Math.abs(dragY) / 80, 1) * 0.4})`
            }} 
          />
        </div>
      )}
      
      {/* Draggable Content */}
      <motion.div
        drag={todo.completed ? true : "x"}
        dragConstraints={todo.completed ? { top: -150, bottom: 0, left: -200, right: 0 } : { left: -200, right: 200 }}
        dragElastic={0.2}
        dragMomentum={false}
        style={{
          x: x,
          y: y,
          background: 'rgba(36, 36, 36, 0.5)',
          backdropFilter: 'blur(12px)',
          cursor: 'grab',
          touchAction: 'none'
        }}
        animate={controls}
        onDrag={(_: any, info: any) => {
          setDragX(info.offset.x);
          setDragY(info.offset.y);
          x.set(info.offset.x);
          y.set(info.offset.y);
        }}
        onDragEnd={handleDragEnd}
        className="relative flex items-center gap-3 p-3"
      >
        {/* Icon */}
        <div 
          className="w-9 h-9 flex items-center justify-center flex-shrink-0"
          style={{ 
            background: 'rgba(255, 255, 255, 0.04)',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}
        >
          <IconComponent 
            className="w-4 h-4" 
            style={{ 
              color: todo.completed ? 'var(--text-tertiary)' : 'var(--text-secondary)',
              transition: 'color 0.3s ease'
            }} 
          />
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <p 
            className="text-sm font-medium mb-0.5 truncate" 
            style={{ 
              color: todo.completed ? 'var(--text-tertiary)' : 'var(--text-primary)',
              textDecoration: todo.completed ? 'line-through' : 'none',
              transition: 'all 0.3s ease'
            }}
          >
            {todo.text}
          </p>
          <div className="flex items-center gap-1.5 text-xs">
            <span style={{ color: 'var(--text-tertiary)', opacity: 0.7 }}>
              {categoryName}
            </span>
            {todo.dueDate && formatDueDate(todo.dueDate) && (
              <>
                <span style={{ color: 'var(--text-tertiary)', opacity: 0.5 }}>•</span>
                <span style={{ color: accentColor, opacity: 0.8 }}>
                  {formatDueDate(todo.dueDate)}
                </span>
              </>
            )}
          </div>
        </div>
        
        {/* Checkbox */}
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
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 relative"
          style={{
            border: `2px solid ${todo.completed ? '#22C55E' : 'rgba(255, 255, 255, 0.2)'}`,
            backgroundColor: todo.completed ? '#22C55E' : 'transparent',
            transition: 'all 0.12s cubic-bezier(0.34, 1.56, 0.64, 1)',
            boxShadow: todo.completed ? '0 0 0 2px rgba(34, 197, 94, 0.2)' : 'none'
          }}
        >
          <AnimatePresence mode="wait">
            {todo.completed && (
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
                className="w-3 h-3 absolute"
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
      </motion.div>
    </motion.div>
  );
}
