import { TaskPriority, TaskStatus, Task, User } from '../types';

// Generate a random color for user avatars
const getRandomColor = () => {
  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-red-500',
    'bg-orange-500',
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Mock users data
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatarColor: getRandomColor(),
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    avatarColor: getRandomColor(),
  },
  {
    id: '3',
    name: 'Robert Johnson',
    email: 'robert.johnson@example.com',
    avatarColor: getRandomColor(),
  },
  {
    id: '4',
    name: 'Emily Davis',
    email: 'emily.davis@example.com',
    avatarColor: getRandomColor(),
  },
  {
    id: '5',
    name: 'Michael Wilson',
    email: 'michael.wilson@example.com',
    avatarColor: getRandomColor(),
  },
];

// Generate random date within the past month
const getRandomDate = (pastDays = 30) => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * pastDays));
  return date.toISOString();
};

// Generate random future date for due dates
const getRandomFutureDate = (futureDays = 14) => {
  const date = new Date();
  date.setDate(date.getDate() + Math.floor(Math.random() * futureDays) + 1);
  return date.toISOString();
};

// Mock tasks data
export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Complete project proposal',
    description: 'Draft and finalize the project proposal for the new client',
    status: TaskStatus.TODO,
    priority: TaskPriority.HIGH,
    assignedTo: '1',
    dueDate: getRandomFutureDate(7),
    createdAt: getRandomDate(10),
    updatedAt: getRandomDate(5),
  },
  {
    id: '2',
    title: 'Review code changes',
    description: 'Review the pull request for the new feature implementation',
    status: TaskStatus.IN_PROGRESS,
    priority: TaskPriority.MEDIUM,
    assignedTo: '2',
    dueDate: getRandomFutureDate(3),
    createdAt: getRandomDate(15),
    updatedAt: getRandomDate(2),
  },
  {
    id: '3',
    title: 'Fix navigation bug',
    description: 'Address the navigation issue reported by the QA team',
    status: TaskStatus.COMPLETED,
    priority: TaskPriority.HIGH,
    assignedTo: '3',
    dueDate: getRandomDate(2),
    createdAt: getRandomDate(20),
    updatedAt: getRandomDate(1),
  },
  {
    id: '4',
    title: 'Update documentation',
    description: 'Update the API documentation with the recent changes',
    status: TaskStatus.TODO,
    priority: TaskPriority.LOW,
    assignedTo: '4',
    dueDate: getRandomFutureDate(10),
    createdAt: getRandomDate(25),
    updatedAt: getRandomDate(25),
  },
  {
    id: '5',
    title: 'Prepare for client meeting',
    description: 'Compile reports and prepare slides for the upcoming client meeting',
    status: TaskStatus.IN_PROGRESS,
    priority: TaskPriority.MEDIUM,
    assignedTo: '5',
    dueDate: getRandomFutureDate(1),
    createdAt: getRandomDate(12),
    updatedAt: getRandomDate(7),
  },
  {
    id: '6',
    title: 'Implement search functionality',
    description: 'Add search feature to the dashboard',
    status: TaskStatus.TODO,
    priority: TaskPriority.HIGH,
    assignedTo: '1',
    dueDate: getRandomFutureDate(5),
    createdAt: getRandomDate(18),
    updatedAt: getRandomDate(10),
  },
  {
    id: '7',
    title: 'Design new landing page',
    description: 'Create mockups for the new website landing page',
    status: TaskStatus.COMPLETED,
    priority: TaskPriority.MEDIUM,
    assignedTo: '2',
    dueDate: getRandomDate(1),
    createdAt: getRandomDate(30),
    updatedAt: getRandomDate(15),
  },
  {
    id: '8',
    title: 'Optimize database queries',
    description: 'Improve performance of the main dashboard queries',
    status: TaskStatus.IN_PROGRESS,
    priority: TaskPriority.HIGH,
    assignedTo: '3',
    dueDate: getRandomFutureDate(2),
    createdAt: getRandomDate(22),
    updatedAt: getRandomDate(3),
  },
];

// Simulate API calls with delays
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Mock API functions
export const api = {
  // Get all tasks
  getTasks: async (): Promise<Task[]> => {
    await delay(800);
    return [...mockTasks];
  },

  // Get a single task by ID
  getTaskById: async (id: string): Promise<Task | undefined> => {
    await delay(500);
    return mockTasks.find((task) => task.id === id);
  },

  // Create a new task
  createTask: async (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> => {
    await delay(1000);
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    mockTasks.unshift(newTask);
    return newTask;
  },

  // Update an existing task
  updateTask: async (updatedTask: Task): Promise<Task> => {
    await delay(800);
    const index = mockTasks.findIndex((task) => task.id === updatedTask.id);
    if (index !== -1) {
      mockTasks[index] = {
        ...updatedTask,
        updatedAt: new Date().toISOString(),
      };
      return mockTasks[index];
    }
    throw new Error('Task not found');
  },

  // Delete a task
  deleteTask: async (id: string): Promise<boolean> => {
    await delay(600);
    const index = mockTasks.findIndex((task) => task.id === id);
    if (index !== -1) {
      mockTasks.splice(index, 1);
      return true;
    }
    return false;
  },

  // Get all users
  getUsers: async (): Promise<User[]> => {
    await delay(500);
    return [...mockUsers];
  },

  // Get a single user by ID
  getUserById: async (id: string): Promise<User | undefined> => {
    await delay(300);
    return mockUsers.find((user) => user.id === id);
  },
};