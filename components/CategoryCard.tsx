'use client';

import { AnimatePresence } from 'framer-motion';
import { Category as CategoryType } from '@/types';
import {
  Trash2, Briefcase, Home, Target, Dumbbell, BookOpen, Palette,
  ShoppingCart, Plane, Heart, Star, Zap, Coffee, Code, Music, CheckCircle2
} from 'lucide-react';
import { useState } from 'react';

const ICON_MAP: Record<string, any> = {
  briefcase: Briefcase,
  home: Home,
  target: Target,
  dumbbell: Dumbbell,
  book: BookOpen,
  palette: Palette,
  cart: ShoppingCart,
  plane: Plane,
  heart: Heart,
  star: Star,
  zap: Zap,
  coffee: Coffee,
  code: Code,
  music: Music,
};

interface CategoryCardProps {
  category: CategoryType;
  onClick: () => void;
  onDelete: (e: React.MouseEvent) => void;
}

export default function CategoryCard({ category, onClick, onDelete }: CategoryCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Filter out archived todos
  const activeTodos = category.todos.filter(t => !t.archived);
  const completedCount = activeTodos.filter(t => t.completed).length;
  const totalCount = activeTodos.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  
  const IconComponent = ICON_MAP[category.icon] || Star;
  const accentColor = '#E97451'; // Force orange accent for all categories

  return (
    <div
      data-category-id={category.id}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className="relative p-6 bento-card cursor-pointer group overflow-visible transition-all duration-300"
      style={{ 
        borderRadius: '18px',
        transform: isHovered ? 'translateY(-6px) scale(1.02)' : 'translateY(0) scale(1)',
        boxShadow: isHovered 
          ? `0 20px 60px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(233, 116, 81, 0.2), 0 0 40px ${accentColor}30`
          : 'none',
        transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
      }}
    >
      {/* Colored glow effect - Enhanced on hover */}
      <div 
        className="absolute inset-0 transition-opacity duration-500"
        style={{ 
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(circle at 50% 0%, ${accentColor}15, transparent 70%)`,
          borderRadius: '18px',
          pointerEvents: 'none'
        }}
      />
      
      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3.5">
            {/* Icon matching create category modal style */}
            <div 
              className="w-11 h-11 flex items-center justify-center relative"
              style={{ 
                background: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '11px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: 'var(--text-secondary)',
                transform: isHovered ? 'scale(1.1) rotate(5deg)' : 'scale(1) rotate(0deg)',
                transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)'
              }}
            >
              <IconComponent 
                className="w-5 h-5"
                style={{
                  transition: 'all 0.3s ease',
                  filter: isHovered ? 'brightness(1.2)' : 'brightness(1)'
                }}
              />
            </div>
            <div className="flex-1">
              <h3 className="text-base font-semibold mb-0.5" style={{ color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
                {category.name}
              </h3>
              {category.description && (
                <p className="text-xs mb-1 line-clamp-1" style={{ color: 'var(--text-secondary)' }}>
                  {category.description}
                </p>
              )}
              <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--text-tertiary)' }}>
                <span>{completedCount}/{totalCount} tasks</span>
              </div>
            </div>
          </div>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(e);
            }}
            className="transition-all duration-300 p-1.5 rounded-lg"
            style={{ 
              opacity: isHovered ? 1 : 0,
              transform: isHovered ? 'scale(1) rotate(0deg)' : 'scale(0.8) rotate(-90deg)',
              color: 'var(--text-tertiary)',
              background: 'rgba(255, 59, 48, 0.1)',
              transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Progress Bar - iOS Style */}
        <div className="w-full h-1.5 rounded-full overflow-hidden" 
             style={{ 
               backgroundColor: 'rgba(255, 255, 255, 0.06)',
               boxShadow: 'inset 0 0.5px 1px rgba(0, 0, 0, 0.15)',
               transform: isHovered ? 'scaleY(1.2)' : 'scaleY(1)',
               transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
             }}>
          <div
            className="h-full"
            style={{ 
              width: `${progress}%`,
              background: `linear-gradient(90deg, ${accentColor}, ${accentColor}dd)`,
              boxShadow: `0 0 ${isHovered ? '12px' : '8px'} ${accentColor}60`,
              borderRadius: '100px',
              transition: 'all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
              filter: isHovered ? 'brightness(1.2)' : 'brightness(1)'
            }}
          />
        </div>
      </div>
    </div>
  );
}
