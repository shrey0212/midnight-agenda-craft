
import { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { Task, Category, FilterOptions, SortOption } from '../utils/types';
import { filterTasks, sortTasks, generateId } from '../utils/helpers';
import { useToast } from '@/components/ui/use-toast';

interface TaskContextProps {
  tasks: Task[];
  filteredTasks: Task[];
  categories: Category[];
  filterOptions: FilterOptions;
  sortOption: SortOption;
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  toggleTaskCompletion: (taskId: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  deleteCategory: (categoryId: string) => void;
  updateFilterOptions: (updates: Partial<FilterOptions>) => void;
  updateSortOption: (option: SortOption) => void;
  clearFilters: () => void;
}

const TaskContext = createContext<TaskContextProps | undefined>(undefined);

// Default categories
const defaultCategories: Category[] = [
  { id: 'work', name: 'Work', color: '#9b87f5' },
  { id: 'personal', name: 'Personal', color: '#7E69AB' },
  { id: 'shopping', name: 'Shopping', color: '#4682B4' },
  { id: 'health', name: 'Health', color: '#6A5ACD' },
];

// Default filter options
const defaultFilterOptions: FilterOptions = {
  status: 'all',
  priority: 'all',
  dueDate: 'all',
  category: 'all',
  searchQuery: '',
};

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const { toast } = useToast();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [filterOptions, setFilterOptions] = useState<FilterOptions>(defaultFilterOptions);
  const [sortOption, setSortOption] = useState<SortOption>('dueDate-asc');
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('tasks');
    const savedCategories = localStorage.getItem('categories');
    
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    }
    
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories));
    }
  }, []);

  // Update localStorage when tasks or categories change
  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);
  
  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  // Update filtered tasks when tasks, filter options, or sort option changes
  useEffect(() => {
    const filtered = filterTasks(tasks, filterOptions);
    const sorted = sortTasks(filtered, sortOption);
    setFilteredTasks(sorted);
  }, [tasks, filterOptions, sortOption]);

  // Add a new task
  const addTask = (task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...task,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    
    setTasks(prevTasks => [...prevTasks, newTask]);
    toast({
      title: "Task added",
      description: `"${task.title}" has been added to your tasks.`,
    });
  };

  // Update an existing task
  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, ...updates } : task
      )
    );
    toast({
      title: "Task updated",
      description: "Your task has been updated successfully.",
    });
  };

  // Delete a task
  const deleteTask = (taskId: string) => {
    const taskToDelete = tasks.find(task => task.id === taskId);
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    toast({
      title: "Task deleted",
      description: taskToDelete ? `"${taskToDelete.title}" has been deleted.` : "Task has been deleted.",
      variant: "destructive",
    });
  };

  // Toggle task completion status
  const toggleTaskCompletion = (taskId: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Add a new category
  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCategory: Category = {
      ...category,
      id: generateId(),
    };
    
    setCategories(prevCategories => [...prevCategories, newCategory]);
    toast({
      title: "Category added",
      description: `"${category.name}" category has been created.`,
    });
  };

  // Delete a category
  const deleteCategory = (categoryId: string) => {
    const categoryToDelete = categories.find(cat => cat.id === categoryId);
    setCategories(prevCategories => 
      prevCategories.filter(category => category.id !== categoryId)
    );
    
    // Update tasks that were using this category to use no category
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.category === categoryId ? { ...task, category: '' } : task
      )
    );
    
    toast({
      title: "Category deleted",
      description: categoryToDelete ? `"${categoryToDelete.name}" category has been deleted.` : "Category has been deleted.",
      variant: "destructive",
    });
  };

  // Update filter options
  const updateFilterOptions = (updates: Partial<FilterOptions>) => {
    setFilterOptions(prevOptions => ({ ...prevOptions, ...updates }));
  };

  // Update sort option
  const updateSortOption = (option: SortOption) => {
    setSortOption(option);
  };

  // Clear all filters
  const clearFilters = () => {
    setFilterOptions(defaultFilterOptions);
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        filteredTasks,
        categories,
        filterOptions,
        sortOption,
        addTask,
        updateTask,
        deleteTask,
        toggleTaskCompletion,
        addCategory,
        deleteCategory,
        updateFilterOptions,
        updateSortOption,
        clearFilters,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};
