// Task Status Enum
export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed',
}

// Task Priority Enum
export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

// Task Interface
export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignedTo: string;
  dueDate: string;
  createdAt: string;
  updatedAt: string;
}

// User Interface
export interface User {
  id: string;
  name: string;
  email: string;
  avatarColor: string;
}

// Task Filter Interface
export interface TaskFilter {
  status: TaskStatus | 'all';
  priority: TaskPriority | 'all';
  assignedTo: string | 'all';
  searchQuery: string;
}

// Toast Interface
export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

// Context Type
export interface TaskContextType {
  tasks: Task[];
  users: User[];
  isLoading: boolean;
  error: string | null;
  filters: TaskFilter;
  toasts: Toast[];
  // Task CRUD
  getTask: (id: string) => Task | undefined;
  createTask: (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateTask: (task: Task) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  // Filters
  setFilters: (filters: Partial<TaskFilter>) => void;
  resetFilters: () => void;
  // Toasts
  addToast: (message: string, type: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}