import React, { useState } from 'react';
import { TaskStatus, TaskPriority } from '../types';
import { useTaskContext } from '../context/TaskContext';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { Button } from './ui/Button';
import { UserSelector } from './UserSelector';
import { 
  Search, 
  Filter, 
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export const TaskFilters: React.FC = () => {
  const { filters, setFilters, resetFilters, users } = useTaskContext();
  const [isExpanded, setIsExpanded] = useState(false);

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ searchQuery: e.target.value });
  };

  // Handle status filter change
  const handleStatusChange = (value: string) => {
    setFilters({ status: value as TaskStatus | 'all' });
  };

  // Handle priority filter change
  const handlePriorityChange = (value: string) => {
    setFilters({ priority: value as TaskPriority | 'all' });
  };

  // Handle user filter change
  const handleUserChange = (userId: string) => {
    setFilters({ assignedTo: userId });
  };

  // Handle filter reset
  const handleReset = () => {
    resetFilters();
  };

  // Toggle expanded filters
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-900">Filters</h2>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={toggleExpanded}
          rightIcon={isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        >
          {isExpanded ? 'Hide Filters' : 'Show Filters'}
        </Button>
      </div>

      <div className="flex flex-col space-y-4">
        <div className="relative">
          <Input
            placeholder="Search tasks..."
            value={filters.searchQuery}
            onChange={handleSearchChange}
            className="pl-10"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
        </div>

        {isExpanded && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
            <Select
              label="Status"
              value={filters.status}
              onChange={handleStatusChange}
              options={[
                { value: 'all', label: 'All Statuses' },
                { value: TaskStatus.TODO, label: 'To Do' },
                { value: TaskStatus.IN_PROGRESS, label: 'In Progress' },
                { value: TaskStatus.COMPLETED, label: 'Completed' },
              ]}
            />

            <Select
              label="Priority"
              value={filters.priority}
              onChange={handlePriorityChange}
              options={[
                { value: 'all', label: 'All Priorities' },
                { value: TaskPriority.LOW, label: 'Low' },
                { value: TaskPriority.MEDIUM, label: 'Medium' },
                { value: TaskPriority.HIGH, label: 'High' },
              ]}
            />

            <UserSelector
              label="Assigned To"
              selectedUserId={filters.assignedTo}
              onSelect={handleUserChange}
              includeAllOption
            />
          </div>
        )}

        {isExpanded && (
          <div className="flex justify-end pt-4 border-t border-gray-100">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleReset}
              leftIcon={<X size={14} />}
            >
              Reset Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};