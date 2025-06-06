import React from 'react';
import { TaskPriority, TaskStatus } from '../../types';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'status' | 'priority';
  value: string;
}

export const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'status', 
  value 
}) => {
  // Get background color based on status or priority
  const getBgColor = () => {
    if (variant === 'status') {
      switch (value) {
        case TaskStatus.TODO:
          return 'bg-gray-100 text-gray-800';
        case TaskStatus.IN_PROGRESS:
          return 'bg-blue-100 text-blue-800';
        case TaskStatus.COMPLETED:
          return 'bg-green-100 text-green-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    } else {
      switch (value) {
        case TaskPriority.LOW:
          return 'bg-green-100 text-green-800';
        case TaskPriority.MEDIUM:
          return 'bg-yellow-100 text-yellow-800';
        case TaskPriority.HIGH:
          return 'bg-red-100 text-red-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBgColor()}`}
    >
      {children}
    </span>
  );
};