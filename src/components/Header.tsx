
import { useState } from 'react';
import { useTaskContext } from '../context/TaskContext';
import { Search, Plus, Filter, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import TaskForm from './TaskForm';

const Header = () => {
  const { tasks, updateFilterOptions, filterOptions } = useTaskContext();
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFilterOptions({ searchQuery: e.target.value });
  };

  return (
    <div className="bg-card glass border border-border/50 rounded-xl p-4 mb-6 shadow-lg">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="flex items-center">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">TaskFlow</h1>
            <div className="text-sm text-muted-foreground mt-1">
              <span>{totalTasks} tasks • </span>
              <span className="text-green-400">{completedTasks} completed • </span>
              <span className="text-amber-400">{pendingTasks} pending</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {isSearchOpen ? (
            <div className="flex items-center gap-2 w-full animate-fade-in">
              <div className="relative w-full">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search tasks..."
                  className="bg-secondary/50 border-none pl-8 w-full"
                  value={filterOptions.searchQuery}
                  onChange={handleSearchChange}
                />
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => {
                  setIsSearchOpen(false);
                  updateFilterOptions({ searchQuery: '' });
                }}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <>
              <Button 
                variant="outline" 
                size="sm" 
                className="bg-secondary/50 border-secondary flex gap-2 items-center"
                onClick={() => setIsSearchOpen(true)}
              >
                <Search className="h-4 w-4" />
                <span className="hidden sm:inline">Search</span>
              </Button>
              
              <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
                <DialogTrigger asChild>
                  <Button 
                    className="flex gap-2 items-center"
                    size="sm"
                  >
                    <Plus className="h-4 w-4" />
                    <span className="hidden sm:inline">Add Task</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card border-border max-w-lg">
                  <DialogTitle>Add New Task</DialogTitle>
                  <TaskForm onSuccess={() => setIsAddTaskOpen(false)} />
                </DialogContent>
              </Dialog>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
