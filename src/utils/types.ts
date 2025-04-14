
export type Priority = "low" | "medium" | "high";

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: Priority;
  completed: boolean;
  category: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

export type SortOption = 
  | "dueDate-asc" 
  | "dueDate-desc" 
  | "priority-asc" 
  | "priority-desc" 
  | "alphabetical-asc" 
  | "alphabetical-desc" 
  | "createdAt-asc" 
  | "createdAt-desc";

export type FilterStatus = "all" | "completed" | "pending";
export type FilterPriority = "all" | Priority;
export type FilterDueDate = "all" | "today" | "upcoming" | "overdue";

export interface FilterOptions {
  status: FilterStatus;
  priority: FilterPriority;
  dueDate: FilterDueDate;
  category: string;
  searchQuery: string;
}
