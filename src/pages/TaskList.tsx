import React, { useState } from 'react';
import { Task } from '../types';
import { useTaskContext } from '../context/TaskContext';
import { useTasks } from '../hooks/useTasks';
import { TaskCard } from '../components/TaskCard';
import { TaskFilters } from '../components/TaskFilters';
import { TaskForm } from '../components/TaskForm';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { Plus, List, Grid, Loader } from 'lucide-react';

export const TaskList: React.FC = () => {
  const { isLoading } = useTaskContext();
  const { tasksByStatus, taskStats } = useTasks();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Handle edit task
  const handleEditTask = (task: Task) => {
    setEditTask(task);
  };

  // Handle form close
  const handleFormClose = () => {
    setIsCreateModalOpen(false);
    setEditTask(null);
  };

  // Toggle view mode
  const toggleViewMode = () => {
    setViewMode(viewMode === 'grid' ? 'list' : 'grid');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader className="animate-spin text-blue-500\" size={32} />
        <span className="ml-2 text-gray-600">Loading tasks...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Task Manager</h1>
          <p className="text-gray-600 mt-1">
            {taskStats.total} tasks ({taskStats.completed} completed)
          </p>
        </div>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            onClick={toggleViewMode}
            leftIcon={viewMode === 'grid' ? <List size={16} /> : <Grid size={16} />}
          >
            {viewMode === 'grid' ? 'List View' : 'Grid View'}
          </Button>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            leftIcon={<Plus size={16} />}
          >
            New Task
          </Button>
        </div>
      </div>

      <TaskFilters />

      <div className="space-y-8">
        {/* To Do Tasks */}
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <span className="w-3 h-3 bg-gray-400 rounded-full mr-2"></span>
            To Do
            <span className="ml-2 text-sm text-gray-500 font-normal">
              ({tasksByStatus.todo.length})
            </span>
          </h2>
          {tasksByStatus.todo.length > 0 ? (
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
              : 'space-y-4'
            }>
              {tasksByStatus.todo.map((task) => (
                <TaskCard key={task.id} task={task} onEdit={handleEditTask} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">No tasks to do</p>
          )}
        </div>

        {/* In Progress Tasks */}
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <span className="w-3 h-3 bg-blue-400 rounded-full mr-2"></span>
            In Progress
            <span className="ml-2 text-sm text-gray-500 font-normal">
              ({tasksByStatus['in-progress'].length})
            </span>
          </h2>
          {tasksByStatus['in-progress'].length > 0 ? (
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
              : 'space-y-4'
            }>
              {tasksByStatus['in-progress'].map((task) => (
                <TaskCard key={task.id} task={task} onEdit={handleEditTask} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">No tasks in progress</p>
          )}
        </div>

        {/* Completed Tasks */}
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <span className="w-3 h-3 bg-green-400 rounded-full mr-2"></span>
            Completed
            <span className="ml-2 text-sm text-gray-500 font-normal">
              ({tasksByStatus.completed.length})
            </span>
          </h2>
          {tasksByStatus.completed.length > 0 ? (
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
              : 'space-y-4'
            }>
              {tasksByStatus.completed.map((task) => (
                <TaskCard key={task.id} task={task} onEdit={handleEditTask} />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">No completed tasks</p>
          )}
        </div>
      </div>

      {/* Create Task Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={handleFormClose}
        title="Create New Task"
        size="lg"
      >
        <TaskForm onSubmit={handleFormClose} />
      </Modal>

      {/* Edit Task Modal */}
      <Modal
        isOpen={!!editTask}
        onClose={handleFormClose}
        title="Edit Task"
        size="lg"
      >
        {editTask && <TaskForm task={editTask} onSubmit={handleFormClose} />}
      </Modal>
    </div>
  );
};