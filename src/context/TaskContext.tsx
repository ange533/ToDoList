import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  Task, 
  User, 
  TaskStatus, 
  TaskPriority, 
  TaskFilter, 
  Toast, 
  TaskContextType 
} from '../types';
import { api } from '../utils/mockData';

// Create context with default values
const TaskContext = createContext<TaskContextType | undefined>(undefined);

// Initial filter state
const initialFilters: TaskFilter = {
  status: 'all',
  priority: 'all',
  assignedTo: 'all',
  searchQuery: '',
};

// Provider component
export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<TaskFilter>(initialFilters);
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [tasksData, usersData] = await Promise.all([
          api.getTasks(),
          api.getUsers(),
        ]);
        setTasks(tasksData);
        setUsers(usersData);
        setError(null);
      } catch (err) {
        setError('Failed to fetch data');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Get a single task by ID
  const getTask = (id: string): Task | undefined => {
    return tasks.find((task) => task.id === id);
  };

  // Create a new task
  const createTask = async (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<void> => {
    try {
      setIsLoading(true);
      const newTask = await api.createTask(taskData);
      setTasks((prevTasks) => [newTask, ...prevTasks]);
      addToast('Task created successfully', 'success');
    } catch (err) {
      setError('Failed to create task');
      addToast('Failed to create task', 'error');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Update an existing task
  const updateTask = async (updatedTask: Task): Promise<void> => {
    try {
      setIsLoading(true);
      const result = await api.updateTask(updatedTask);
      setTasks((prevTasks) =>
        prevTasks.map((task) => (task.id === result.id ? result : task))
      );
      addToast('Task updated successfully', 'success');
    } catch (err) {
      setError('Failed to update task');
      addToast('Failed to update task', 'error');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a task
  const deleteTask = async (id: string): Promise<void> => {
    try {
      setIsLoading(true);
      await api.deleteTask(id);
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
      addToast('Task deleted successfully', 'success');
    } catch (err) {
      setError('Failed to delete task');
      addToast('Failed to delete task', 'error');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Update filters
  const updateFilters = (newFilters: Partial<TaskFilter>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  // Reset filters
  const resetFilters = () => {
    setFilters(initialFilters);
  };

  // Add a toast notification
  const addToast = (message: string, type: 'success' | 'error' | 'info') => {
    const id = Date.now().toString();
    const newToast: Toast = { id, message, type };
    setToasts((prev) => [...prev, newToast]);

    // Auto remove toast after 3 seconds
    setTimeout(() => {
      removeToast(id);
    }, 3000);
  };

  // Remove a toast notification
  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const contextValue: TaskContextType = {
    tasks,
    users,
    isLoading,
    error,
    filters,
    toasts,
    getTask,
    createTask,
    updateTask,
    deleteTask,
    setFilters: updateFilters,
    resetFilters,
    addToast,
    removeToast,
  };

  return (
    <TaskContext.Provider value={contextValue}>{children}</TaskContext.Provider>
  );
};

// Custom hook to use the task context
export const useTaskContext = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};