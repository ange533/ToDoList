import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTaskContext } from '../context/TaskContext';
import { Task } from '../types';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { TaskForm } from '../components/TaskForm';
import {
  ArrowLeft,
  Edit,
  Trash2,
  User,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';
import { formatDistanceToNow, format, isPast, parseISO } from 'date-fns';

export const TaskDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getTask, users, deleteTask, isLoading } = useTaskContext();
  const [task, setTask] = useState<Task | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Find task and assigned user
  useEffect(() => {
    if (id) {
      const foundTask = getTask(id);
      if (foundTask) {
        setTask(foundTask);
      } else {
        // Task not found, redirect to task list
        navigate('/');
      }
    }
  }, [id, getTask, navigate]);

  // Find assigned user
  const assignedUser = task
    ? users.find((user) => user.id === task.assignedTo)
    : null;

  // Handle task deletion
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      if (task) {
        deleteTask(task.id);
        navigate('/');
      }
    }
  };

  // Format dates
  const formatTaskDate = (dateString: string) => {
    const date = parseISO(dateString);
    return {
      relative: formatDistanceToNow(date, { addSuffix: true }),
      formatted: format(date, 'PPP'),
    };
  };

  // Check if due date is past
  const isDueDatePast = (dateString: string) => {
    return isPast(parseISO(dateString)) && task?.status !== 'completed';
  };

  // Handle edit modal close
  const handleEditModalClose = () => {
    setIsEditModalOpen(false);
    // Refresh task data
    if (id) {
      const updatedTask = getTask(id);
      if (updatedTask) {
        setTask(updatedTask);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-gray-600">Loading task...</span>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-medium text-gray-900 mb-2">Task not found</h2>
        <p className="text-gray-600 mb-6">The task you're looking for doesn't exist or has been deleted.</p>
        <Button onClick={() => navigate('/')} leftIcon={<ArrowLeft size={16} />}>
          Back to Task List
        </Button>
      </div>
    );
  }

  // Format status and priority for display
  const formatStatus = (status: string) => {
    switch (status) {
      case 'todo':
        return 'To Do';
      case 'in-progress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      default:
        return status;
    }
  };

  const formatPriority = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'Low';
      case 'medium':
        return 'Medium';
      case 'high':
        return 'High';
      default:
        return priority;
    }
  };

  const createdDate = formatTaskDate(task.createdAt);
  const updatedDate = formatTaskDate(task.updatedAt);
  const dueDate = formatTaskDate(task.dueDate);
  const isOverdue = isDueDatePast(task.dueDate);

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-6">
        <Button
          variant="outline"
          onClick={() => navigate('/')}
          leftIcon={<ArrowLeft size={16} />}
        >
          Back to Tasks
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <div className="flex justify-between items-start mb-6">
          <div className="flex space-x-2">
            <Badge variant="status" value={task.status}>
              {formatStatus(task.status)}
            </Badge>
            <Badge variant="priority" value={task.priority}>
              {formatPriority(task.priority)}
            </Badge>
          </div>
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => setIsEditModalOpen(true)}
              leftIcon={<Edit size={16} />}
            >
              Edit
            </Button>
            <Button
              variant="outline"
              onClick={handleDelete}
              leftIcon={<Trash2 size={16} />}
              className="text-red-600 hover:text-red-700 hover:border-red-500"
            >
              Delete
            </Button>
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-4">{task.title}</h1>

        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-2">Description</h2>
          <p className="text-gray-700 whitespace-pre-line">{task.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-4">
            <h2 className="text-lg font-medium text-gray-900">Details</h2>
            
            <div className="flex items-start">
              <User size={18} className="text-gray-500 mt-0.5 mr-2" />
              <div>
                <p className="text-sm text-gray-500">Assigned To</p>
                {assignedUser ? (
                  <div className="flex items-center mt-1">
                    <Avatar name={assignedUser.name} color={assignedUser.avatarColor} size="sm" />
                    <div className="ml-2">
                      <p className="text-gray-900 font-medium">{assignedUser.name}</p>
                      <p className="text-gray-500 text-sm">{assignedUser.email}</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-700">Unassigned</p>
                )}
              </div>
            </div>

            <div className="flex items-start">
              {isOverdue ? (
                <AlertTriangle size={18} className="text-red-500 mt-0.5 mr-2" />
              ) : task.status === 'completed' ? (
                <CheckCircle size={18} className="text-green-500 mt-0.5 mr-2" />
              ) : (
                <Calendar size={18} className="text-gray-500 mt-0.5 mr-2" />
              )}
              <div>
                <p className="text-sm text-gray-500">Due Date</p>
                <p className={`font-medium ${isOverdue ? 'text-red-600' : 'text-gray-900'}`}>
                  {dueDate.formatted}
                  {isOverdue && ' (Overdue)'}
                </p>
                <p className="text-gray-500 text-sm">{dueDate.relative}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-medium text-gray-900">Activity</h2>
            
            <div className="flex items-start">
              <Clock size={18} className="text-gray-500 mt-0.5 mr-2" />
              <div>
                <p className="text-sm text-gray-500">Created</p>
                <p className="text-gray-900">{createdDate.formatted}</p>
                <p className="text-gray-500 text-sm">{createdDate.relative}</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <Clock size={18} className="text-gray-500 mt-0.5 mr-2" />
              <div>
                <p className="text-sm text-gray-500">Last Updated</p>
                <p className="text-gray-900">{updatedDate.formatted}</p>
                <p className="text-gray-500 text-sm">{updatedDate.relative}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Task Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={handleEditModalClose}
        title="Edit Task"
        size="lg"
      >
        <TaskForm task={task} onSubmit={handleEditModalClose} />
      </Modal>
    </div>
  );
};