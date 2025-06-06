import React from 'react';
import { Task, User } from '../types';
import { Badge } from './ui/Badge';
import { Avatar } from './ui/Avatar';
import { Button } from './ui/Button';
import { 
  Calendar, 
  Edit, 
  Trash2, 
  CheckCircle,
  Clock
} from 'lucide-react';
import { useTaskContext } from '../context/TaskContext';
import { formatDistanceToNow, isPast, parseISO } from 'date-fns';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit }) => {
  const { users, deleteTask } = useTaskContext();

  // Find assigned user
  const assignedUser = users.find((user) => user.id === task.assignedTo);

  // Format due date
  const formatDueDate = (dateString: string) => {
    const date = parseISO(dateString);
    const isOverdue = isPast(date) && task.status !== 'completed';
    const formattedDate = formatDistanceToNow(date, { addSuffix: true });
    
    return {
      formatted: formattedDate,
      isOverdue,
    };
  };

  const dueDate = formatDueDate(task.dueDate);

  // Handle delete with confirmation
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask(task.id);
    }
  };

  // Format status for display
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

  // Format priority for display
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

  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200 hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-start mb-3">
        <div>
          <Badge variant="status" value={task.status}>
            {formatStatus(task.status)}
          </Badge>
          <Badge variant="priority" value={task.priority} className="ml-2">
            {formatPriority(task.priority)}
          </Badge>
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(task)}
            leftIcon={<Edit size={14} />}
            className="px-2"
          >
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            leftIcon={<Trash2 size={14} />}
            className="px-2 text-red-600 hover:text-red-700 hover:border-red-700"
          >
            Delete
          </Button>
        </div>
      </div>
      
      <h3 className="font-medium text-lg mb-2 text-gray-900">{task.title}</h3>
      <p className="text-gray-600 mb-4 line-clamp-2">{task.description}</p>
      
      <div className="border-t border-gray-100 pt-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {assignedUser && (
              <div className="flex items-center">
                <Avatar name={assignedUser.name} color={assignedUser.avatarColor} size="sm" />
                <span className="ml-2 text-sm text-gray-600">{assignedUser.name}</span>
              </div>
            )}
          </div>
          <div className="flex items-center">
            {task.status === 'completed' ? (
              <div className="flex items-center text-sm text-green-600">
                <CheckCircle size={14} className="mr-1" />
                <span>Completed</span>
              </div>
            ) : (
              <div className={`flex items-center text-sm ${dueDate.isOverdue ? 'text-red-600' : 'text-gray-600'}`}>
                {dueDate.isOverdue ? (
                  <Clock size={14} className="mr-1" />
                ) : (
                  <Calendar size={14} className="mr-1" />
                )}
                <span>{dueDate.formatted}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};