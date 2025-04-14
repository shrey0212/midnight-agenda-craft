
import { Priority, SortOption, Task, FilterOptions } from './types';

// Generate a unique ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 11);
};

// Format a date for display
export const formatDate = (dateString: string): string => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

// Check if a date is today
export const isToday = (dateString: string): boolean => {
  if (!dateString) return false;
  
  const date = new Date(dateString);
  const today = new Date();
  
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
};

// Check if a date is in the future
export const isFuture = (dateString: string): boolean => {
  if (!dateString) return false;
  
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return date > today;
};

// Check if a date is in the past
export const isPast = (dateString: string): boolean => {
  if (!dateString) return false;
  
  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  return date < today;
};

// Get color class based on priority
export const getPriorityClass = (priority: Priority): string => {
  switch (priority) {
    case 'high':
      return 'priority-high';
    case 'medium':
      return 'priority-medium';
    case 'low':
      return 'priority-low';
    default:
      return 'priority-low';
  }
};

// Filter tasks based on filter options
export const filterTasks = (tasks: Task[], filters: FilterOptions): Task[] => {
  return tasks.filter(task => {
    // Filter by status
    if (filters.status === 'completed' && !task.completed) return false;
    if (filters.status === 'pending' && task.completed) return false;
    
    // Filter by priority
    if (filters.priority !== 'all' && task.priority !== filters.priority) return false;
    
    // Filter by category
    if (filters.category && filters.category !== 'all' && task.category !== filters.category) return false;
    
    // Filter by due date
    if (filters.dueDate === 'today' && !isToday(task.dueDate)) return false;
    if (filters.dueDate === 'upcoming' && !isFuture(task.dueDate)) return false;
    if (filters.dueDate === 'overdue' && (!isPast(task.dueDate) || task.completed)) return false;
    
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
};

// Sort tasks based on sort option
export const sortTasks = (tasks: Task[], sortOption: SortOption): Task[] => {
  const sortedTasks = [...tasks];
  
  switch (sortOption) {
    case 'dueDate-asc':
      return sortedTasks.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
    case 'dueDate-desc':
      return sortedTasks.sort((a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime());
    case 'priority-asc':
      return sortedTasks.sort((a, b) => getPriorityValue(a.priority) - getPriorityValue(b.priority));
    case 'priority-desc':
      return sortedTasks.sort((a, b) => getPriorityValue(b.priority) - getPriorityValue(a.priority));
    case 'alphabetical-asc':
      return sortedTasks.sort((a, b) => a.title.localeCompare(b.title));
    case 'alphabetical-desc':
      return sortedTasks.sort((a, b) => b.title.localeCompare(a.title));
    case 'createdAt-asc':
      return sortedTasks.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    case 'createdAt-desc':
      return sortedTasks.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    default:
      return sortedTasks;
  }
};

// Helper function to convert priority to numeric value for sorting
const getPriorityValue = (priority: Priority): number => {
  switch (priority) {
    case 'high': return 3;
    case 'medium': return 2;
    case 'low': return 1;
    default: return 0;
  }
};
