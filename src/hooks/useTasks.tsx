import { useMemo } from 'react';
import { Task, TaskFilter } from '../types';
import { useTaskContext } from '../context/TaskContext';

export const useTasks = () => {
  const { tasks, filters } = useTaskContext();

  // Filter and sort tasks based on current filters
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Filter by status
      if (filters.status !== 'all' && task.status !== filters.status) {
        return false;
      }

      // Filter by priority
      if (filters.priority !== 'all' && task.priority !== filters.priority) {
        return false;
      }

      // Filter by assigned user
      if (filters.assignedTo !== 'all' && task.assignedTo !== filters.assignedTo) {
        return false;
      }

      // Filter by search query
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        return (
          task.title.toLowerCase().includes(query) ||
          task.description.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [tasks, filters]);

  // Group tasks by status
  const tasksByStatus = useMemo(() => {
    const grouped = {
      todo: filteredTasks.filter((task) => task.status === 'todo'),
      'in-progress': filteredTasks.filter((task) => task.status === 'in-progress'),
      completed: filteredTasks.filter((task) => task.status === 'completed'),
    };
    return grouped;
  }, [filteredTasks]);

  // Get tasks statistics
  const taskStats = useMemo(() => {
    const total = tasks.length;
    const todo = tasks.filter((task) => task.status === 'todo').length;
    const inProgress = tasks.filter((task) => task.status === 'in-progress').length;
    const completed = tasks.filter((task) => task.status === 'completed').length;

    return {
      total,
      todo,
      inProgress,
      completed,
      percentCompleted: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  }, [tasks]);

  return {
    filteredTasks,
    tasksByStatus,
    taskStats,
  };
};