/**
 * Data Manager - Handles export, import, and backup of all app data
 * Provides a solid, reusable structure for data portability
 */

import { Category } from '@/types';

export interface DataExport {
  version: string;
  exportDate: string;
  metadata: {
    totalCategories: number;
    totalTodos: number;
    activeTodos: number;
    completedTodos: number;
  };
  categories: Category[];
}

export interface DataImportResult {
  success: boolean;
  message: string;
  imported?: {
    categories: number;
    todos: number;
  };
  errors?: string[];
}

/**
 * Export all categories to a structured JSON format
 */
export function exportData(categories: Category[]): DataExport {
  const allTodos = categories.flatMap(cat => cat.todos);
  
  return {
    version: '1.0.0',
    exportDate: new Date().toISOString(),
    metadata: {
      totalCategories: categories.length,
      totalTodos: allTodos.length,
      activeTodos: allTodos.filter(t => !t.archived && !t.completed).length,
      completedTodos: allTodos.filter(t => t.completed).length,
    },
    categories: categories.map(cat => ({
      ...cat,
      todos: cat.todos.map(todo => ({
        ...todo,
        // Ensure all fields are properly serialized
        dueDate: todo.dueDate || undefined,
        assignedTo: todo.assignedTo || undefined,
        notes: todo.notes || undefined,
      })),
    })),
  };
}

/**
 * Download data as JSON file
 */
export function downloadDataAsJSON(data: DataExport, filename?: string): void {
  const timestamp = new Date().toISOString().split('T')[0];
  const fileName = filename || `todo-backup-${timestamp}.json`;
  
  const jsonString = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Validate imported data structure
 */
function validateImportData(data: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!data.version) errors.push('Missing version field');
  if (!data.categories || !Array.isArray(data.categories)) {
    errors.push('Missing or invalid categories array');
  }
  
  if (data.categories) {
    data.categories.forEach((cat: any, index: number) => {
      if (!cat.id) errors.push(`Category ${index}: missing id`);
      if (!cat.name) errors.push(`Category ${index}: missing name`);
      if (!cat.icon) errors.push(`Category ${index}: missing icon`);
      if (!Array.isArray(cat.todos)) errors.push(`Category ${index}: invalid todos array`);
      
      if (cat.todos) {
        cat.todos.forEach((todo: any, todoIndex: number) => {
          if (!todo.id) errors.push(`Category ${index}, Todo ${todoIndex}: missing id`);
          if (!todo.text) errors.push(`Category ${index}, Todo ${todoIndex}: missing text`);
          if (typeof todo.completed !== 'boolean') {
            errors.push(`Category ${index}, Todo ${todoIndex}: invalid completed field`);
          }
        });
      }
    });
  }
  
  return { valid: errors.length === 0, errors };
}

/**
 * Import data from JSON (validates and sanitizes)
 */
export function importData(jsonData: string): DataImportResult {
  try {
    const data = JSON.parse(jsonData);
    
    // Validate structure
    const validation = validateImportData(data);
    if (!validation.valid) {
      return {
        success: false,
        message: 'Invalid data format',
        errors: validation.errors,
      };
    }
    
    // Count imported items
    const categoryCount = data.categories.length;
    const todoCount = data.categories.reduce(
      (sum: number, cat: Category) => sum + cat.todos.length,
      0
    );
    
    return {
      success: true,
      message: 'Data imported successfully',
      imported: {
        categories: categoryCount,
        todos: todoCount,
      },
    };
  } catch (error) {
    return {
      success: false,
      message: 'Failed to parse JSON',
      errors: [error instanceof Error ? error.message : 'Unknown error'],
    };
  }
}

/**
 * Read file from input element
 */
export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        resolve(e.target.result as string);
      } else {
        reject(new Error('Failed to read file'));
      }
    };
    reader.onerror = () => reject(new Error('File reading error'));
    reader.readAsText(file);
  });
}

/**
 * Save data to localStorage as backup
 */
export function saveLocalBackup(categories: Category[]): void {
  const data = exportData(categories);
  const backupKey = `todo-backup-${Date.now()}`;
  
  try {
    localStorage.setItem(backupKey, JSON.stringify(data));
    localStorage.setItem('todo-latest-backup', backupKey);
    
    // Keep only last 5 backups
    cleanOldBackups();
  } catch (error) {
    console.error('Failed to save local backup:', error);
  }
}

/**
 * Clean old backups, keep only the last 5
 */
function cleanOldBackups(): void {
  const backupKeys = Object.keys(localStorage)
    .filter(key => key.startsWith('todo-backup-'))
    .sort()
    .reverse();
  
  // Remove all but the 5 most recent
  backupKeys.slice(5).forEach(key => {
    localStorage.removeItem(key);
  });
}

/**
 * Get the latest backup from localStorage
 */
export function getLatestBackup(): DataExport | null {
  try {
    const latestKey = localStorage.getItem('todo-latest-backup');
    if (!latestKey) return null;
    
    const data = localStorage.getItem(latestKey);
    if (!data) return null;
    
    return JSON.parse(data);
  } catch (error) {
    console.error('Failed to retrieve backup:', error);
    return null;
  }
}

/**
 * Get all available backups
 */
export function getAllBackups(): Array<{ key: string; date: string; metadata: any }> {
  const backupKeys = Object.keys(localStorage)
    .filter(key => key.startsWith('todo-backup-'))
    .sort()
    .reverse();
  
  return backupKeys.map(key => {
    try {
      const data = JSON.parse(localStorage.getItem(key) || '{}');
      return {
        key,
        date: data.exportDate || 'Unknown',
        metadata: data.metadata || {},
      };
    } catch {
      return {
        key,
        date: 'Corrupted',
        metadata: {},
      };
    }
  });
}

/**
 * Restore from a specific backup
 */
export function restoreFromBackup(backupKey: string): Category[] | null {
  try {
    const data = localStorage.getItem(backupKey);
    if (!data) return null;
    
    const parsed = JSON.parse(data);
    return parsed.categories || null;
  } catch (error) {
    console.error('Failed to restore backup:', error);
    return null;
  }
}

/**
 * Merge imported data with existing data
 */
export function mergeData(
  existing: Category[],
  imported: Category[],
  strategy: 'replace' | 'merge' | 'keep-existing' = 'merge'
): Category[] {
  if (strategy === 'replace') {
    return imported;
  }
  
  if (strategy === 'keep-existing') {
    return existing;
  }
  
  // Merge strategy: combine and deduplicate by ID
  const categoryMap = new Map<string, Category>();
  
  // Add existing categories
  existing.forEach(cat => {
    categoryMap.set(cat.id, cat);
  });
  
  // Merge imported categories
  imported.forEach(importedCat => {
    const existingCat = categoryMap.get(importedCat.id);
    
    if (!existingCat) {
      // New category, add it
      categoryMap.set(importedCat.id, importedCat);
    } else {
      // Merge todos
      const todoMap = new Map(existingCat.todos.map(t => [t.id, t]));
      
      importedCat.todos.forEach(todo => {
        if (!todoMap.has(todo.id)) {
          todoMap.set(todo.id, todo);
        }
      });
      
      categoryMap.set(importedCat.id, {
        ...existingCat,
        todos: Array.from(todoMap.values()),
      });
    }
  });
  
  return Array.from(categoryMap.values());
}
