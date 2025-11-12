export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
  dueDate?: string;
  dueTime?: string;
  notes?: string;
  archived?: boolean;
  order?: number;
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
