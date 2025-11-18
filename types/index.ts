export interface Todo {
  id: string;
  title: string;
  completed: boolean;
  createdAt?: string;
  dueDate?: string;
  dueTime?: string;
  notes?: string;
  archived?: boolean;
  priority?: string;
  assignedTo?: string;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  color: string;
  icon: string;
  todos: Todo[];
  createdAt: string;
}

export interface User {
  email: string;
}
