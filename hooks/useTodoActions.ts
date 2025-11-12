import { useState } from 'react';
import { Category } from '@/types';

/**
 * Custom hook for handling all todo CRUD operations
 * Provides optimistic updates with automatic rollback on error
 */
export function useTodoActions(
  categories: Category[],
  setCategories: (categories: Category[]) => void
) {
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Toggle todo completion status
   */
  const toggleTodo = async (categoryId: string, todoId: string) => {
    setIsLoading(true);
    
    // Find the current todo state
    const category = categories.find(c => c.id === categoryId);
    const todo = category?.todos.find(t => t.id === todoId);
    if (!todo) return;

    // Optimistic update
    const updatedCategories = categories.map(cat =>
      cat.id === categoryId
        ? {
            ...cat,
            todos: cat.todos.map(t =>
              t.id === todoId ? { ...t, completed: !t.completed } : t
            ),
          }
        : cat
    );
    setCategories(updatedCategories);

    // Sync with server
    try {
      const response = await fetch(`/api/categories/${categoryId}/todos`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          todoId: todoId,
          completed: !todo.completed,
        }),
      });

      if (!response.ok) {
        // Revert on error
        setCategories(categories);
        console.error('Failed to update todo');
      }
    } catch (error) {
      console.error('Error updating todo:', error);
      // Revert on error
      setCategories(categories);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Archive (delete) a todo
   */
  const archiveTodo = async (categoryId: string, todoId: string) => {
    setIsLoading(true);

    // Optimistic update
    const updatedCategories = categories.map(cat =>
      cat.id === categoryId
        ? {
            ...cat,
            todos: cat.todos.map(t =>
              t.id === todoId ? { ...t, archived: true } : t
            ),
          }
        : cat
    );
    setCategories(updatedCategories);

    // Sync with server
    try {
      const response = await fetch(`/api/categories/${categoryId}/todos`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          todoId: todoId,
          archived: true,
        }),
      });

      if (!response.ok) {
        // Revert on error
        setCategories(categories);
        console.error('Failed to archive todo');
      }
    } catch (error) {
      console.error('Error archiving todo:', error);
      // Revert on error
      setCategories(categories);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Update todo properties (text, notes, etc.)
   */
  const updateTodo = async (
    categoryId: string,
    todoId: string,
    updates: Partial<any>
  ) => {
    setIsLoading(true);

    // Optimistic update
    const updatedCategories = categories.map(cat =>
      cat.id === categoryId
        ? {
            ...cat,
            todos: cat.todos.map(t =>
              t.id === todoId ? { ...t, ...updates } : t
            ),
          }
        : cat
    );
    setCategories(updatedCategories);

    // Sync with server
    try {
      const response = await fetch(`/api/categories/${categoryId}/todos`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          todoId: todoId,
          ...updates,
        }),
      });

      if (!response.ok) {
        // Revert on error
        setCategories(categories);
        console.error('Failed to update todo');
      }
    } catch (error) {
      console.error('Error updating todo:', error);
      // Revert on error
      setCategories(categories);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    toggleTodo,
    archiveTodo,
    updateTodo,
    isLoading,
  };
}
