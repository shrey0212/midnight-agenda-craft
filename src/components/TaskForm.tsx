
import { useState, useEffect } from 'react';
import { useTaskContext } from '../context/TaskContext';
import { Task, Priority } from '../utils/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { 
  AlertCircle, 
  CalendarClock, 
  CheckCircle, 
  CircleAlert,
  Tag, 
  AlertTriangle 
} from 'lucide-react';

interface TaskFormProps {
  task?: Task;
  onSuccess?: () => void;
}

const TaskForm = ({ task, onSuccess }: TaskFormProps) => {
  const { addTask, updateTask, categories } = useTaskContext();
  
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [dueDate, setDueDate] = useState(task?.dueDate || '');
  const [priority, setPriority] = useState<Priority>(task?.priority || 'medium');
  const [category, setCategory] = useState(task?.category || '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isEditing = !!task;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    const taskData = {
      title,
      description,
      dueDate,
      priority,
      category,
      completed: task?.completed || false,
    };
    
    if (isEditing && task) {
      updateTask(task.id, taskData);
    } else {
      addTask(taskData);
    }
    
    if (onSuccess) {
      onSuccess();
    }
  };

  // Format today's date in YYYY-MM-DD for the date input min attribute
  const today = new Date().toISOString().split('T')[0];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title" className="text-sm">
          Title <span className="text-destructive">*</span>
        </Label>
        <div>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title"
            className={`bg-secondary/40 border-border/50 ${errors.title ? 'border-destructive' : ''}`}
          />
          {errors.title && (
            <p className="text-xs text-destructive mt-1 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" />
              {errors.title}
            </p>
          )}
        </div>
      </div>
      
      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description" className="text-sm">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Add details about your task"
          className="bg-secondary/40 border-border/50 min-h-[80px]"
        />
      </div>
      
      {/* Due Date */}
      <div className="space-y-2">
        <Label htmlFor="dueDate" className="text-sm flex items-center gap-1">
          <CalendarClock className="h-4 w-4" />
          Due Date
        </Label>
        <Input
          id="dueDate"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          min={today}
          className="bg-secondary/40 border-border/50"
        />
      </div>
      
      {/* Priority */}
      <div className="space-y-2">
        <Label htmlFor="priority" className="text-sm flex items-center gap-1">
          <AlertTriangle className="h-4 w-4" />
          Priority
        </Label>
        <Select value={priority} onValueChange={(value) => setPriority(value as Priority)}>
          <SelectTrigger className="bg-secondary/40 border-border/50">
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="high" className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full priority-high"></span>
                High
              </div>
            </SelectItem>
            <SelectItem value="medium" className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full priority-medium"></span>
                Medium
              </div>
            </SelectItem>
            <SelectItem value="low" className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full priority-low"></span>
                Low
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Category */}
      <div className="space-y-2">
        <Label htmlFor="category" className="text-sm flex items-center gap-1">
          <Tag className="h-4 w-4" />
          Category
        </Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="bg-secondary/40 border-border/50">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent className="bg-card border-border">
            <SelectItem value="">No Category</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id} className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <span 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: cat.color }}
                  ></span>
                  {cat.name}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Submit Button */}
      <div className="pt-2 flex justify-end">
        <Button type="submit">
          {isEditing ? 'Update Task' : 'Add Task'}
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;
