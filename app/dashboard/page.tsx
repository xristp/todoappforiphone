'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, useMotionValue, useAnimation } from 'framer-motion';
import CategoryCard from '@/components/CategoryCard';
import Button from '@/components/Button';
import Input from '@/components/Input';
import TopNavbar from '@/components/TopNavbar';
import SearchBar from '@/components/SearchBar';
import DataManager from '@/components/DataManager';
import QuickPeekTodo from '@/components/QuickPeekTodo';
import SearchResultItem from '@/components/SearchResultItem';
import TodoCheckbox from '@/components/TodoCheckbox';
import TodoDetailsFields from '@/components/TodoDetailsFields';
import { useTodoActions } from '@/hooks/useTodoActions';
import { 
  Plus, LogOut, X, Briefcase, Home, Target, Dumbbell, 
  BookOpen, Palette, ShoppingCart, Plane, Heart, Star, 
  Zap, Coffee, Code, Music, Search, Calendar, StickyNote,
  Edit2, Copy, Archive, ChevronDown, ChevronUp, Eye, Clock, User, CheckCircle2, Trash2,
  Download, Upload, Database, Save
} from 'lucide-react';
import { Category } from '@/types';

const ICON_OPTIONS = [
  { name: 'briefcase', icon: Briefcase, label: 'Work' },
  { name: 'home', icon: Home, label: 'Home' },
  { name: 'target', icon: Target, label: 'Goals' },
  { name: 'dumbbell', icon: Dumbbell, label: 'Fitness' },
  { name: 'book', icon: BookOpen, label: 'Learning' },
  { name: 'palette', icon: Palette, label: 'Creative' },
  { name: 'cart', icon: ShoppingCart, label: 'Shopping' },
  { name: 'plane', icon: Plane, label: 'Travel' },
  { name: 'heart', icon: Heart, label: 'Health' },
  { name: 'star', icon: Star, label: 'Important' },
  { name: 'zap', icon: Zap, label: 'Urgent' },
  { name: 'coffee', icon: Coffee, label: 'Break' },
  { name: 'code', icon: Code, label: 'Development' },
  { name: 'music', icon: Music, label: 'Entertainment' },
];

// Use the existing accent color from your design system
const getColorForIcon = (iconName: string): string => {
  return '#E97451'; // var(--accent-orange)
};

export default function DashboardPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewCategory, setShowNewCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDescription, setNewCategoryDescription] = useState('');
  const [selectedIcon, setSelectedIcon] = useState(ICON_OPTIONS[0].name);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showLogout, setShowLogout] = useState(false);
  const [hoveredIcon, setHoveredIcon] = useState<string | null>(null);
  const [removedTodoIds, setRemovedTodoIds] = useState<Set<string>>(new Set());
  const [showDataManager, setShowDataManager] = useState(false);
  const router = useRouter();
  
  // Use the custom hook for todo actions
  const { toggleTodo, archiveTodo } = useTodoActions(categories, setCategories);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/auth/session');
      if (!res.ok) {
        router.push('/');
        return;
      }
      fetchCategories();
    } catch {
      router.push('/');
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      alert('Please enter a category name');
      return;
    }

    console.log('Creating category:', {
      name: newCategoryName,
      description: newCategoryDescription,
      icon: selectedIcon,
      color: getColorForIcon(selectedIcon),
    });

    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: newCategoryName,
          description: newCategoryDescription,
          icon: selectedIcon,
          color: getColorForIcon(selectedIcon),
        }),
      });

      console.log('Response status:', res.status);

      if (res.ok) {
        const newCategory = await res.json();
        console.log('Category created:', newCategory);
        setCategories([...categories, newCategory]);
        setNewCategoryName('');
        setNewCategoryDescription('');
        setShowNewCategory(false);
        setSelectedIcon(ICON_OPTIONS[0].name);
      } else {
        const errorText = await res.text();
        console.error('Failed to create category:', errorText);
        alert('Failed to create category: ' + errorText);
      }
    } catch (error) {
      console.error('Failed to create category:', error);
      alert('Error creating category: ' + error);
    }
  };

  const handleDeleteCategory = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      const res = await fetch(`/api/categories?id=${id}`, { 
        method: 'DELETE',
        credentials: 'include'
      });
      if (res.ok) {
        setCategories(categories.filter(cat => cat.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete category:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 rounded-full"
          style={{
            border: '4px solid rgba(249, 113, 80, 0.2)',
            borderTopColor: 'var(--accent-coral)'
          }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Top Navbar */}
      <TopNavbar
        showSearch={showSearch}
        showDataManager={showDataManager}
        showLogout={showLogout}
        onSearchToggle={() => {
          setShowSearch(!showSearch);
          if (showSearch) {
            setSearchQuery('');
          }
        }}
        onDataManagerToggle={() => setShowDataManager(!showDataManager)}
        onLogoutToggle={() => setShowLogout(!showLogout)}
        onLogout={handleLogout}
      />

      {/* Search Bar */}
      <SearchBar
        showSearch={showSearch}
        searchQuery={searchQuery}
        categories={categories}
        onSearchChange={setSearchQuery}
        onClose={() => {
          setShowSearch(false);
          setSearchQuery('');
        }}
      />

      {/* Data Manager Modal */}
      <DataManager
        show={showDataManager}
        categories={categories}
        onClose={() => setShowDataManager(false)}
        onImport={(importedCategories) => setCategories(importedCategories)}
      />

      {/* Click outside handler to close search and logout */}
      {(showSearch || showLogout) && !searchQuery && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={(e) => {
            // Only close if clicking the backdrop, not the search results
            if (e.target === e.currentTarget) {
              setShowSearch(false);
              setSearchQuery('');
              setShowLogout(false);
            }
          }}
        />
      )}
      
      {/* Backdrop for logout only when search has results */}
      {showLogout && searchQuery && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowLogout(false);
            }
          }}
        />
      )}

      <div className="max-w-4xl mx-auto pt-32 pb-16 px-6">
        
        {/* Quick Peek - Upcoming Tasks */}
        {!searchQuery && categories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <h2 className="text-sm font-semibold uppercase tracking-wide mb-4" style={{ color: 'var(--text-tertiary)' }}>
              Up Next
            </h2>
            <div className="space-y-2">
              <AnimatePresence mode="sync">
                {categories
                  .flatMap(cat => 
                    cat.todos
                      .filter(todo => !todo.archived)
                      .map(todo => ({ ...todo, categoryName: cat.name, categoryIcon: cat.icon, categoryId: cat.id }))
                  )
                  .filter(todo => !removedTodoIds.has(todo.id))
                  .sort((a, b) => {
                    // Sort by due date only - don't reorder based on completion status
                    if (a.dueDate && b.dueDate) return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
                    if (a.dueDate) return -1;
                    if (b.dueDate) return 1;
                    return 0;
                  })
                  .slice(0, 3)
                  .map((todo, index) => (
                    <QuickPeekTodo 
                      key={`${todo.categoryId}-${todo.id}`}
                      todo={todo}
                      categoryName={todo.categoryName}
                      categoryIcon={todo.categoryIcon}
                      categoryId={todo.categoryId}
                      onToggle={() => {
                        // Use the hook for toggle
                        toggleTodo(todo.categoryId, todo.id);
                        
                        // If uncompleting, remove from removed list so it shows in Quick Peek again
                        if (todo.completed) {
                          setRemovedTodoIds(prev => {
                            const newSet = new Set(prev);
                            newSet.delete(todo.id);
                            return newSet;
                          });
                        }
                      }}
                      onRemove={() => {
                        // Just hide from Quick Peek, don't delete or archive
                        setRemovedTodoIds(prev => new Set(prev).add(todo.id));
                      }}
                      delay={index * 0.05}
                    />
                  ))}
              </AnimatePresence>
              {categories.flatMap(cat => cat.todos.filter(t => !t.archived)).filter(t => !removedTodoIds.has(t.id)).length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8 rounded-2xl"
                  style={{ background: 'rgba(255, 255, 255, 0.03)' }}
                >
                  <p style={{ color: 'var(--text-tertiary)' }}>All caught up! 🎉</p>
                </motion.div>
              )}
            </div>
          </motion.div>
        )}
        
        {/* Search Results */}
        {searchQuery && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 relative z-50"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-sm font-semibold uppercase tracking-wide mb-4" style={{ color: 'var(--text-tertiary)' }}>
              Search Results for "{searchQuery}"
            </h2>
            <div className="space-y-2">
              <AnimatePresence mode="sync">
                {(() => {
                  const searchLower = searchQuery.toLowerCase();
                  const results = categories.flatMap(cat => 
                    cat.todos
                      .filter(todo => 
                        !todo.archived &&
                        (todo.text.toLowerCase().includes(searchLower) ||
                        todo.notes?.toLowerCase().includes(searchLower) ||
                        todo.assignedTo?.toLowerCase().includes(searchLower) ||
                        cat.name.toLowerCase().includes(searchLower))
                      )
                      .map(todo => ({ ...todo, categoryName: cat.name, categoryIcon: cat.icon, categoryId: cat.id }))
                  );

                  if (results.length === 0) {
                    return (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-12 rounded-2xl"
                        style={{ background: 'rgba(255, 255, 255, 0.03)' }}
                      >
                        <Search className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--text-tertiary)', opacity: 0.3 }} />
                        <p className="text-sm" style={{ color: 'var(--text-tertiary)' }}>No results found for "{searchQuery}"</p>
                      </motion.div>
                    );
                  }

                  return results.slice(0, 10).map((todo, index) => (
                    <SearchResultItem
                      key={`${todo.categoryId}-${todo.id}`}
                      todo={todo}
                      categoryName={todo.categoryName}
                      categoryIcon={todo.categoryIcon}
                      categoryId={todo.categoryId}
                      index={index}
                      onToggle={() => toggleTodo(todo.categoryId, todo.id)}
                      onDelete={async () => {
                        await archiveTodo(todo.categoryId, todo.id);
                        await fetchCategories(); // Refresh from server
                      }}
                      onOpenCategory={() => {
                        const category = categories.find(c => c.id === todo.categoryId);
                        if (category) setSelectedCategory(category);
                      }}
                    />
                  ));
                })()}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* Add Category Button - Centered */}
        {!searchQuery && categories.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <motion.button
              whileHover={{ scale: 1.02, y: -4 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowNewCategory(true)}
              className="bento-card p-12 flex flex-col items-center justify-center gap-5 max-w-sm w-full"
              style={{ 
                borderRadius: '24px',
                border: '2px dashed rgba(233, 116, 81, 0.3)',
                background: 'rgba(36, 36, 36, 0.4)'
              }}
            >
              <motion.div 
                whileHover={{ scale: 1.15, rotate: 180 }}
                transition={{ 
                  type: "spring",
                  stiffness: 300,
                  damping: 20
                }}
                className="w-20 h-20 flex items-center justify-center"
                style={{ 
                  background: 'linear-gradient(135deg, rgba(233, 116, 81, 0.2), rgba(124, 92, 219, 0.2))',
                  border: '0.5px solid rgba(233, 116, 81, 0.3)',
                  borderRadius: '20px',
                  backdropFilter: 'blur(20px)'
                }}
              >
                <Plus className="w-10 h-10" style={{ color: 'var(--accent-coral)' }} />
              </motion.div>
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Create your first category</h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Organize your tasks by creating categories</p>
              </div>
            </motion.button>
          </motion.div>
        ) : (
          <>
            {!searchQuery && (
              <>
                {/* Categories Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                  <AnimatePresence mode="popLayout">
                    {categories.map((category, index) => (
                      <motion.div
                        key={category.id}
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -10 }}
                        transition={{ 
                          duration: 0.3,
                          delay: index * 0.05,
                          ease: [0.4, 0, 0.2, 1]
                        }}
                      >
                        <CategoryCard
                          category={category}
                          onClick={() => setSelectedCategory(category)}
                          onDelete={(e) => handleDeleteCategory(category.id, e)}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                {/* Add Another Category - Centered */}
                <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.3 }}
              className="flex justify-center"
            >
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                transition={{ 
                  type: "spring",
                  stiffness: 400,
                  damping: 25
                }}
                onClick={() => setShowNewCategory(true)}
                className="px-8 py-4 rounded-full flex items-center gap-3 transition-all shadow-lg"
                style={{ 
                  background: 'linear-gradient(135deg, rgba(233, 116, 81, 0.15), rgba(233, 116, 81, 0.1))',
                  border: '1px solid rgba(233, 116, 81, 0.3)',
                  color: 'var(--accent-coral)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <Plus className="w-5 h-5" />
                <span className="font-semibold">New Category</span>
              </motion.button>
            </motion.div>
              </>
            )}
          </>
        )}

        {/* New Category Modal */}
        <AnimatePresence>
          {showNewCategory && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
              onClick={() => setShowNewCategory(false)}
            >
              <motion.div
                initial={{ scale: 0.92, opacity: 0, y: 30 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                onClick={(e) => e.stopPropagation()}
                className="bento-card p-8 max-w-md w-full"
                style={{ borderRadius: '22px' }}
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold" style={{ color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
                    New Category
                  </h2>
                  <motion.button
                    whileTap={{ scale: 0.92 }}
                    transition={{ 
                      type: "spring",
                      stiffness: 500,
                      damping: 25
                    }}
                    onClick={() => setShowNewCategory(false)}
                    className="p-2 rounded-full transition-all hover:bg-white hover:bg-opacity-10"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-xs font-medium mb-2 uppercase tracking-wide" style={{ color: 'var(--text-tertiary)' }}>
                      Name
                    </label>
                    <input
                      placeholder="Work, Personal, Goals..."
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      autoFocus
                      className="w-full px-4 py-3 rounded-xl border-0 transition-all focus:outline-none"
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        color: 'var(--text-primary)',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                      }}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-3" style={{ color: 'var(--text-tertiary)' }}>
                      ICON
                    </label>
                    <div className="grid grid-cols-7 gap-2">
                      {ICON_OPTIONS.map((iconOption) => {
                        const IconComponent = iconOption.icon;
                        return (
                          <div key={iconOption.name} className="relative">
                            <button
                              onClick={() => setSelectedIcon(iconOption.name)}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'scale(1.1)';
                                setHoveredIcon(iconOption.name);
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1)';
                                setHoveredIcon(null);
                              }}
                              className="p-3 rounded-lg transition-all w-full"
                              style={{
                                background: selectedIcon === iconOption.name 
                                  ? 'rgba(233, 116, 81, 0.15)' 
                                  : 'rgba(255, 255, 255, 0.05)',
                                border: selectedIcon === iconOption.name
                                  ? '1.5px solid rgba(233, 116, 81, 0.5)'
                                  : '1px solid rgba(255, 255, 255, 0.1)',
                                color: selectedIcon === iconOption.name 
                                  ? '#E97451' 
                                  : 'var(--text-secondary)',
                                transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
                              }}
                            >
                              <IconComponent className="w-5 h-5" />
                            </button>
                            
                            {/* Tooltip */}
                            <AnimatePresence>
                              {hoveredIcon === iconOption.name && (
                                <div
                                  className="absolute px-3 py-1.5 rounded-lg whitespace-nowrap pointer-events-none"
                                  style={{
                                    bottom: '-40px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    background: 'rgba(36, 36, 36, 0.95)',
                                    border: '1px solid rgba(233, 116, 81, 0.4)',
                                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.7), 0 0 0 0.5px rgba(255, 255, 255, 0.1) inset',
                                    color: 'var(--text-primary)',
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    letterSpacing: '0.3px',
                                    zIndex: 9999,
                                    animation: 'tooltipFadeIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
                                    backdropFilter: 'blur(20px)'
                                  }}
                                >
                                  {iconOption.label}
                                  {/* Tooltip arrow */}
                                  <div 
                                    style={{
                                      position: 'absolute',
                                      top: '-4px',
                                      left: '50%',
                                      width: '8px',
                                      height: '8px',
                                      transform: 'translateX(-50%) rotate(45deg)',
                                      background: 'rgba(36, 36, 36, 0.95)',
                                      border: '1px solid rgba(233, 116, 81, 0.4)',
                                      borderBottom: 'none',
                                      borderRight: 'none'
                                    }}
                                  />
                                </div>
                              )}
                            </AnimatePresence>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-2" style={{ color: 'var(--text-tertiary)' }}>
                      DESCRIPTION (OPTIONAL)
                    </label>
                    <textarea
                      placeholder="Brief description of this category..."
                      value={newCategoryDescription}
                      onChange={(e) => setNewCategoryDescription(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 rounded-xl border-0 transition-all focus:outline-none resize-none"
                      style={{
                        background: 'rgba(255, 255, 255, 0.05)',
                        color: 'var(--text-primary)',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                      }}
                    />
                  </div>

                  <button
                    onClick={handleCreateCategory}
                    className="w-full text-white font-medium py-3 mt-2 transition-all duration-200"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'scale(1.02)';
                      e.currentTarget.style.boxShadow = '0 8px 24px rgba(233, 116, 81, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                    style={{ 
                      background: 'var(--accent-coral)',
                      borderRadius: '12px',
                      border: 'none',
                      transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
                    }}
                  >
                    Create Category
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Category Detail Modal */}
        <AnimatePresence>
          {selectedCategory && (
            <CategoryDetailModal
              category={selectedCategory}
              onClose={() => setSelectedCategory(null)}
              onUpdate={fetchCategories}
              onRemoveFromQuickPeek={(todoId: string) => {
                setRemovedTodoIds(prev => {
                  const newSet = new Set(prev);
                  newSet.delete(todoId);
                  return newSet;
                });
              }}
              onToggleTodo={toggleTodo}
              onDeleteTodo={archiveTodo}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// Category Detail Component
function CategoryDetailModal({
  category,
  onClose,
  onUpdate,
  onRemoveFromQuickPeek,
  onToggleTodo,
  onDeleteTodo,
}: {
  category: Category;
  onClose: () => void;
  onUpdate: () => void;
  onRemoveFromQuickPeek: (todoId: string) => void;
  onToggleTodo: (categoryId: string, todoId: string) => Promise<void>;
  onDeleteTodo: (categoryId: string, todoId: string) => Promise<void>;
}) {
  const [newTodoText, setNewTodoText] = useState('');
  const [newTodoNotes, setNewTodoNotes] = useState('');
  const [newTodoDueDate, setNewTodoDueDate] = useState('');
  const [newTodoDueTime, setNewTodoDueTime] = useState('');
  const [newTodoAssignedTo, setNewTodoAssignedTo] = useState('');
  const [localCategory, setLocalCategory] = useState({
    ...category,
    todos: category.todos.filter(t => !t.archived)
  });
  const [expandedTodos, setExpandedTodos] = useState<Set<string>>(new Set());
  const [editingTodo, setEditingTodo] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [editNotes, setEditNotes] = useState('');
  const [editDueDate, setEditDueDate] = useState('');
  const [editDueTime, setEditDueTime] = useState('');
  const [editAssignedTo, setEditAssignedTo] = useState('');
  const [viewingNotes, setViewingNotes] = useState<string | null>(null);
  const [showDetailsFields, setShowDetailsFields] = useState(false);
  const accentColor = '#E97451'; // Force orange accent for all categories

  // Update localCategory when category prop changes (after refresh)
  useEffect(() => {
    setLocalCategory({
      ...category,
      todos: category.todos.filter(t => !t.archived)
    });
  }, [category]);

  const handleAddTodo = async () => {
    if (!newTodoText.trim()) return;

    try {
      const res = await fetch(`/api/categories/${category.id}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text: newTodoText,
          notes: newTodoNotes,
          dueDate: newTodoDueDate || undefined,
          dueTime: newTodoDueTime || undefined,
          assignedTo: newTodoAssignedTo || undefined
        }),
      });

      if (res.ok) {
        const newTodo = await res.json();
        setLocalCategory({
          ...localCategory,
          todos: [...localCategory.todos, newTodo],
        });
        setNewTodoText('');
        setNewTodoNotes('');
        setNewTodoDueDate('');
        setNewTodoDueTime('');
        setNewTodoAssignedTo('');
        setShowDetailsFields(false);
        onUpdate();
      }
    } catch (error) {
      console.error('Failed to add todo:', error);
    }
  };

  const handleQuickTime = (type: 'hour' | 'day' | 'week') => {
    const now = new Date();
    let dueDate: Date;
    let timeText: string;
    let dateText: string;
    
    switch(type) {
      case 'hour':
        dueDate = new Date(now.getTime() + 60 * 60 * 1000);
        timeText = dueDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
        dateText = 'today';
        break;
      case 'day':
        dueDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);
        timeText = dueDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
        dateText = 'tomorrow';
        break;
      case 'week':
        dueDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        dateText = `next ${days[dueDate.getDay()]}`;
        timeText = dueDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
        break;
    }
    
    setNewTodoDueDate(dateText);
    setNewTodoDueTime(timeText);
  };

  const handleToggleTodo = async (todoId: string, completed: boolean) => {
    // Use the centralized hook
    await onToggleTodo(category.id, todoId);
    
    // If uncompleting (was completed, now incomplete), remove from removed list
    if (completed) {
      onRemoveFromQuickPeek(todoId);
    }
    
    // Refresh local state
    onUpdate();
  };

  const handleDeleteTodo = async (todoId: string) => {
    console.log('handleDeleteTodo called with:', todoId);
    
    // Optimistically update local state
    setLocalCategory({
      ...localCategory,
      todos: localCategory.todos.filter(t => t.id !== todoId)
    });
    
    // Use the centralized hook
    await onDeleteTodo(category.id, todoId);
    console.log('Delete completed, calling onUpdate');
    onUpdate();
  };

  const handleArchiveTodo = async (todoId: string) => {
    console.log('handleArchiveTodo called with:', todoId);
    
    // Optimistically update local state
    setLocalCategory({
      ...localCategory,
      todos: localCategory.todos.map(t =>
        t.id === todoId ? { ...t, archived: true } : t
      )
    });
    
    // Use the centralized hook
    await onDeleteTodo(category.id, todoId);
    console.log('Archive completed, calling onUpdate');
    onUpdate();
  };

  const handleDuplicateTodo = async (todo: any) => {
    try {
      const res = await fetch(`/api/categories/${category.id}/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          text: todo.text + ' (Copy)',
          notes: todo.notes,
          dueDate: todo.dueDate
        }),
      });

      if (res.ok) {
        const newTodo = await res.json();
        setLocalCategory({
          ...localCategory,
          todos: [...localCategory.todos, newTodo],
        });
        onUpdate();
      }
    } catch (error) {
      console.error('Failed to duplicate todo:', error);
    }
  };

  const handleEditTodo = async (todoId: string) => {
    if (!editText.trim()) return;
    
    try {
      const updates: any = { 
        text: editText,
        notes: editNotes || undefined,
        dueDate: editDueDate || undefined,
        dueTime: editDueTime || undefined,
        assignedTo: editAssignedTo || undefined
      };

      const res = await fetch(`/api/categories/${category.id}/todos`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ todoId, ...updates }),
      });

      if (res.ok) {
        setLocalCategory({
          ...localCategory,
          todos: localCategory.todos.map(t =>
            t.id === todoId ? { ...t, ...updates } : t
          ),
        });
        setEditingTodo(null);
        setEditText('');
        setEditNotes('');
        setEditDueDate('');
        setEditDueTime('');
        setEditAssignedTo('');
        onUpdate();
      }
    } catch (error) {
      console.error('Failed to edit todo:', error);
    }
  };

  const toggleExpand = (todoId: string) => {
    const newExpanded = new Set(expandedTodos);
    if (newExpanded.has(todoId)) {
      newExpanded.delete(todoId);
    } else {
      newExpanded.add(todoId);
    }
    setExpandedTodos(newExpanded);
  };

  const getNextDueTodo = () => {
    const uncompletedWithDates = localCategory.todos
      .filter(t => !t.completed && !t.archived && t.dueDate)
      .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime());
    return uncompletedWithDates[0];
  };

  const isOverdue = (dueDate?: string) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  const formatDueDate = (dueDate?: string) => {
    if (!dueDate) return '';
    const date = new Date(dueDate);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === tomorrow.toDateString()) return 'Tomorrow';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const nextDue = getNextDueTodo();
  const activeTodos = localCategory.todos.filter(todo => !todo.archived); // Filter out archived todos

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 flex items-center justify-center p-4 z-50"
      style={{ background: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(20px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, y: 20, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.95, y: 20, opacity: 0 }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="bento-card max-w-2xl w-full max-h-[85vh]"
        style={{ padding: '0', display: 'flex', flexDirection: 'column' }}
      >
        {/* Header - Fixed */}
        <div className="px-8 pt-8 pb-6" style={{ 
          background: 'rgba(36, 36, 36, 0.95)',
          borderBottom: '0.5px solid rgba(255, 255, 255, 0.1)',
          position: 'relative',
          zIndex: 1,
          borderTopLeftRadius: '22px',
          borderTopRightRadius: '22px'
        }}>
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              <div 
                className="w-11 h-11 flex items-center justify-center"
                style={{ 
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '11px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: 'var(--text-secondary)'
                }}
              >
                {(() => {
                  const ICON_MAP: { [key: string]: any } = {
                    briefcase: Briefcase, home: Home, target: Target, dumbbell: Dumbbell,
                    book: BookOpen, palette: Palette, cart: ShoppingCart, plane: Plane,
                    heart: Heart, star: Star, zap: Zap, coffee: Coffee, code: Code, music: Music
                  };
                  const IconComponent = ICON_MAP[localCategory.icon] || Briefcase;
                  return <IconComponent className="w-5 h-5" />;
                })()}
              </div>
              <div>
                <h2 className="text-2xl font-semibold mb-1" style={{ color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                  {localCategory.name}
                </h2>
                {localCategory.description && (
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {localCategory.description}
                  </p>
                )}
                <div className="flex items-center gap-3 mt-1">
                  <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>
                    {activeTodos.filter(t => t.completed).length} of {activeTodos.length} completed
                  </p>
                  {nextDue && (
                    <>
                      <span style={{ color: 'var(--text-tertiary)' }}>•</span>
                      <div className="flex items-center gap-1 text-xs" style={{ color: isOverdue(nextDue.dueDate) ? '#FF3B30' : accentColor }}>
                        <Calendar className="w-3 h-3" />
                        <span>Next: {formatDueDate(nextDue.dueDate)}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-full transition-all hover:bg-white hover:bg-opacity-10"
              style={{ color: 'var(--text-secondary)' }}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 relative" style={{ overflow: 'visible' }}>
          <div className="px-8 py-6 h-full" style={{ overflowY: 'auto', overflowX: 'visible' }}>
            {/* Add Todo */}
            <div className="mb-6" style={{ position: 'relative', zIndex: 50 }}>
            <div className="flex gap-3 mb-3">
              <input
                placeholder="Add a new todo..."
                value={newTodoText}
                onChange={(e) => setNewTodoText(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleAddTodo()}
                className="flex-1 px-4 py-3 rounded-xl border-0 transition-all focus:outline-none"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: 'var(--text-primary)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              />
              {/* Edit Details Button - Icon Only */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowDetailsFields(!showDetailsFields)}
                className="px-3 py-3 rounded-xl transition-all"
                style={{
                  color: showDetailsFields ? accentColor : 'var(--text-secondary)',
                  background: showDetailsFields ? 'rgba(233, 116, 81, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                  border: showDetailsFields ? '1px solid rgba(233, 116, 81, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)'
                }}
              >
                <Edit2 className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleAddTodo}
                className="px-5 py-3 rounded-xl transition-all"
                style={{ 
                  background: accentColor,
                  color: 'white',
                  fontWeight: 500,
                }}
              >
                <Plus className="w-5 h-5" />
              </motion.button>
            </div>
            
            {/* Details Fields - Collapsible */}
            <AnimatePresence>
              {showDetailsFields && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ 
                    type: "spring",
                    stiffness: 400,
                    damping: 30
                  }}
                  className="pt-3"
                >
                  <TodoDetailsFields
                    notes={newTodoNotes}
                    setNotes={setNewTodoNotes}
                    dueDate={newTodoDueDate}
                    setDueDate={setNewTodoDueDate}
                    dueTime={newTodoDueTime}
                    setDueTime={setNewTodoDueTime}
                    assignedTo={newTodoAssignedTo}
                    setAssignedTo={setNewTodoAssignedTo}
                    accentColor={accentColor}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Todo List */}
          <div 
            className="space-y-3 overflow-y-auto pr-2" 
            style={{ 
              position: 'relative', 
              zIndex: 1,
              maxHeight: 'calc(100vh - 400px)',
              paddingBottom: '20px'
            }}
          >
            <AnimatePresence>
              {activeTodos.map((todo, index) => {
                const isExpanded = expandedTodos.has(todo.id);
                const isEditing = editingTodo === todo.id;
                
                return (
                  <motion.div
                    key={todo.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: index * 0.03 }}
                    className="rounded-xl group transition-all overflow-visible"
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      position: 'relative',
                      zIndex: isEditing ? 50 : 1,
                      marginBottom: isEditing ? '20px' : '0',
                    }}
                  >
                    <div className="flex items-start gap-3 p-4">
                      {!isEditing && (
                        <TodoCheckbox
                          completed={todo.completed}
                          onToggle={(e: React.MouseEvent) => {
                            e.stopPropagation();
                            handleToggleTodo(todo.id, todo.completed);
                          }}
                          size="md"
                        />
                      )}

                      <div className="flex-1 min-w-0">
                        {isEditing ? (
                          <div className="space-y-3 w-full p-3 rounded-lg" style={{
                            background: 'rgba(28, 28, 30, 0.95)',
                            border: '1px solid rgba(233, 116, 81, 0.2)',
                            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                          }}>
                            <input
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              onKeyPress={(e) => {
                                if (e.key === 'Enter') handleEditTodo(todo.id);
                                if (e.key === 'Escape') setEditingTodo(null);
                              }}
                              autoFocus
                              placeholder="Task name"
                              className="w-full px-3 py-2 rounded-lg border-0 outline-none text-base"
                              style={{ 
                                color: 'var(--text-primary)',
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(255, 255, 255, 0.1)'
                              }}
                            />
                            
                            <TodoDetailsFields
                              notes={editNotes}
                              setNotes={setEditNotes}
                              dueDate={editDueDate}
                              setDueDate={setEditDueDate}
                              dueTime={editDueTime}
                              setDueTime={setEditDueTime}
                              assignedTo={editAssignedTo}
                              setAssignedTo={setEditAssignedTo}
                              accentColor={accentColor}
                            />
                            
                            <div className="flex gap-2 pt-1">
                              <button
                                onClick={() => handleEditTodo(todo.id)}
                                className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                                style={{ 
                                  background: accentColor,
                                  color: 'white'
                                }}
                              >
                                Save Changes
                              </button>
                              <button
                                onClick={() => {
                                  setEditingTodo(null);
                                  setEditText('');
                                  setEditNotes('');
                                  setEditDueDate('');
                                  setEditDueTime('');
                                  setEditAssignedTo('');
                                }}
                                className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                                style={{ 
                                  background: 'rgba(255, 255, 255, 0.1)',
                                  color: 'var(--text-secondary)'
                                }}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span
                                className="transition-all"
                                style={{
                                  color: todo.completed ? 'var(--text-tertiary)' : 'var(--text-primary)',
                                  textDecoration: todo.completed ? 'line-through' : 'none',
                                  opacity: todo.completed ? 0.5 : 1,
                                }}
                              >
                                {todo.text}
                              </span>
                              {todo.dueDate && (
                                <span 
                                  className="text-xs px-2 py-0.5 rounded-full flex items-center gap-1"
                                  style={{ 
                                    background: isOverdue(todo.dueDate) ? 'rgba(255, 59, 48, 0.15)' : 'rgba(233, 116, 81, 0.15)',
                                    color: isOverdue(todo.dueDate) ? '#FF3B30' : accentColor,
                                    border: `1px solid ${isOverdue(todo.dueDate) ? 'rgba(255, 59, 48, 0.3)' : 'rgba(233, 116, 81, 0.3)'}`
                                  }}
                                >
                                  <Calendar className="w-3 h-3" />
                                  {formatDueDate(todo.dueDate)}
                                  {todo.dueTime && (
                                    <>
                                      <span style={{ opacity: 0.5 }}>•</span>
                                      {todo.dueTime}
                                    </>
                                  )}
                                </span>
                              )}
                              {todo.assignedTo && (
                                <span 
                                  className="text-xs px-2 py-0.5 rounded-full flex items-center gap-1"
                                  style={{ 
                                    background: 'rgba(91, 141, 239, 0.15)',
                                    color: '#5B8DEF',
                                    border: '1px solid rgba(91, 141, 239, 0.3)'
                                  }}
                                >
                                  <User className="w-3 h-3" />
                                  {todo.assignedTo}
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Quick Actions - Hidden when editing */}
                      {!isEditing && (
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all" style={{ position: 'relative', zIndex: 10 }}>
                          {todo.notes && (
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => setViewingNotes(viewingNotes === todo.id ? null : todo.id)}
                              className="p-1.5 rounded-lg transition-all"
                              style={{ 
                                color: viewingNotes === todo.id ? accentColor : 'var(--text-secondary)',
                                background: viewingNotes === todo.id ? 'rgba(233, 116, 81, 0.1)' : 'transparent'
                              }}
                            >
                              <Eye className="w-4 h-4" />
                            </motion.button>
                          )}
                          <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingTodo(todo.id);
                            setEditText(todo.text);
                            setEditNotes(todo.notes || '');
                            setEditDueDate(todo.dueDate || '');
                            setEditDueTime(todo.dueTime || '');
                            setEditAssignedTo(todo.assignedTo || '');
                          }}
                          className="p-1.5 rounded-lg transition-all"
                          style={{ color: 'var(--text-secondary)' }}
                        >
                          <Edit2 className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDuplicateTodo(todo);
                          }}
                          className="p-1.5 rounded-lg transition-all"
                          style={{ color: 'var(--text-secondary)' }}
                        >
                          <Copy className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onPointerDown={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                          }}
                          onMouseDown={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            console.log('Archive clicked for todo:', todo.id);
                            handleArchiveTodo(todo.id);
                          }}
                          className="p-1.5 rounded-lg transition-all"
                          style={{
                            background: 'rgba(233, 116, 81, 0.1)',
                            color: accentColor
                          }}
                        >
                          <Archive className="w-4 h-4" />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.15, rotate: 10 }}
                          whileTap={{ scale: 0.85 }}
                          transition={{ 
                            type: "spring",
                            stiffness: 500,
                            damping: 20
                          }}
                          onPointerDown={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                          }}
                          onMouseDown={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            console.log('Delete clicked for todo:', todo.id);
                            handleDeleteTodo(todo.id);
                          }}
                          className="p-1.5 rounded-lg transition-all"
                          style={{
                            background: 'rgba(255, 59, 48, 0.1)',
                            color: '#FF3B30'
                          }}
                        >
                          <X className="w-4 h-4" />
                        </motion.button>
                        </div>
                      )}
                    </div>

                    {/* Expanded Notes - Eye Icon Trigger */}
                    <AnimatePresence>
                      {viewingNotes === todo.id && todo.notes && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ 
                            type: "spring",
                            stiffness: 400,
                            damping: 30
                          }}
                          className="px-4 pb-4"
                        >
                          <div 
                            className="p-4 rounded-lg text-sm"
                            style={{ 
                              background: 'rgba(233, 116, 81, 0.08)',
                              border: '1px solid rgba(233, 116, 81, 0.2)',
                              color: 'var(--text-primary)'
                            }}
                          >
                            <div className="flex items-start gap-3">
                              <div 
                                className="w-8 h-8 flex items-center justify-center flex-shrink-0 rounded-lg"
                                style={{ 
                                  background: 'rgba(233, 116, 81, 0.15)',
                                  border: '1px solid rgba(233, 116, 81, 0.3)'
                                }}
                              >
                                <StickyNote className="w-4 h-4" style={{ color: accentColor }} />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium mb-1 text-xs uppercase tracking-wide" style={{ color: 'var(--text-tertiary)' }}>Notes</p>
                                <p className="leading-relaxed">{todo.notes}</p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {activeTodos.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                  style={{ 
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}
                >
                  <Plus className="w-8 h-8" style={{ color: 'var(--text-tertiary)' }} />
                </div>
                <p style={{ color: 'var(--text-tertiary)' }}>No todos yet</p>
                <p className="text-sm mt-1" style={{ color: 'var(--text-tertiary)', opacity: 0.6 }}>
                  Add your first task above
                </p>
              </motion.div>
            )}
          </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
