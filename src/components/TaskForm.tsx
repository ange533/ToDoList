import React, { useState, useEffect } from 'react';
import { Task, TaskStatus, TaskPriority } from '../types';
import { useTaskContext } from '../context/TaskContext';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { TextArea } from './ui/TextArea';
import { Select } from './ui/Select';
import { UserSelector } from './UserSelector';
import { formatISO } from 'date-fns';

interface TaskFormProps {
  task?: Task;
  onSubmit: () => void;
}

interface FormErrors {
  title?: string;
  description?: string;
  assignedTo?: string;
  dueDate?: string;
}

export const TaskForm: React.FC<TaskFormProps> = ({ task, onSubmit }) => {
  const { createTask, updateTask } = useTaskContext();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  // Initialize form with task data or default values
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    status: task?.status || TaskStatus.TODO,
    priority: task?.priority || TaskPriority.MEDIUM,
    assignedTo: task?.assignedTo || '',
    dueDate: task?.dueDate 
      ? new Date(task.dueDate).toISOString().slice(0, 10) 
      : formatISO(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)).slice(0, 10),
  });

  // Update form data when task prop changes
  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        assignedTo: task.assignedTo,
        dueDate: new Date(task.dueDate).toISOString().slice(0, 10),
      });
    }
  }, [task]);

  // Handle input change
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error for the field being changed
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  // Handle select change
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle user selection
  const handleUserSelect = (userId: string) => {
    setFormData((prev) => ({ ...prev, assignedTo: userId }));
    
    // Clear error
    if (errors.assignedTo) {
      setErrors((prev) => ({ ...prev, assignedTo: undefined }));
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!formData.assignedTo) {
      newErrors.assignedTo = 'Please assign this task to a user';
    }

    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setIsSubmitting(true);
      
      if (task) {
        // Update existing task
        await updateTask({
          ...task,
          title: formData.title,
          description: formData.description,
          status: formData.status as TaskStatus,
          priority: formData.priority as TaskPriority,
          assignedTo: formData.assignedTo,
          dueDate: new Date(formData.dueDate).toISOString(),
        });
      } else {
        // Create new task
        await createTask({
          title: formData.title,
          description: formData.description,
          status: formData.status as TaskStatus,
          priority: formData.priority as TaskPriority,
          assignedTo: formData.assignedTo,
          dueDate: new Date(formData.dueDate).toISOString(),
        });
      }

      onSubmit();
    } catch (error) {
      console.error('Error saving task:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Title"
        name="title"
        value={formData.title}
        onChange={handleChange}
        placeholder="Enter task title"
        error={errors.title}
        required
      />

      <TextArea
        label="Description"
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Enter task description"
        error={errors.description}
        rows={4}
        required
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Status"
          name="status"
          value={formData.status}
          onChange={(value) => handleSelectChange('status', value)}
          options={[
            { value: TaskStatus.TODO, label: 'To Do' },
            { value: TaskStatus.IN_PROGRESS, label: 'In Progress' },
            { value: TaskStatus.COMPLETED, label: 'Completed' },
          ]}
        />

        <Select
          label="Priority"
          name="priority"
          value={formData.priority}
          onChange={(value) => handleSelectChange('priority', value)}
          options={[
            { value: TaskPriority.LOW, label: 'Low' },
            { value: TaskPriority.MEDIUM, label: 'Medium' },
            { value: TaskPriority.HIGH, label: 'High' },
          ]}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <UserSelector
          label="Assigned To"
          selectedUserId={formData.assignedTo}
          onSelect={handleUserSelect}
          error={errors.assignedTo}
        />

        <Input
          label="Due Date"
          name="dueDate"
          type="date"
          value={formData.dueDate}
          onChange={handleChange}
          error={errors.dueDate}
          required
        />
      </div>

      <div className="flex justify-end space-x-3 pt-4 border-t">
        <Button
          type="button"
          variant="outline"
          onClick={onSubmit}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          {task ? 'Update Task' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
};