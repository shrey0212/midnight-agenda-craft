
import { useRef, useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  CalendarClock, 
  MoreVertical, 
  Trash2, 
  Edit, 
  Tag
} from 'lucide-react';
import { useTaskContext } from '../context/TaskContext';
import { formatDate, getPriorityClass, isToday, isPast } from '../utils/helpers';
import { Task } from '../utils/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogDescription,
  DialogClose
} from '@/components/ui/dialog';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import TaskForm from './TaskForm';

interface TaskItemProps {
  task: Task;
}

const TaskItem = ({ task }: TaskItemProps) => {
  const { 
    toggleTaskCompletion, 
    deleteTask, 
    categories 
  } = useTaskContext();
  
  const [showDetails, setShowDetails] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const category = categories.find(c => c.id === task.category);
  const taskRef = useRef<HTMLDivElement>(null);

  const handleToggleComplete = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleTaskCompletion(task.id);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowEditDialog(true);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteDialog(true);
  };

  return (
    <>
      <div
        ref={taskRef}
        className={`
          p-4 mb-3 rounded-lg task-item-hover transition-all
          ${task.completed ? 'bg-secondary/40 opacity-75' : 'bg-secondary/60'}
          border border-border/40 animate-slide-in
        `}
        onClick={() => setShowDetails(true)}
      >
        <div className="flex items-start gap-3">
          {/* Checkbox */}
          <div className="mt-1">
            <button onClick={handleToggleComplete} className="focus:outline-none">
              {task.completed ? (
                <CheckCircle2 className="h-5 w-5 text-primary" />
              ) : (
                <Circle className="h-5 w-5 text-muted-foreground" />
              )}
            </button>
          </div>
          
          {/* Task content */}
          <div className="flex-1 min-w-0">
            <h3 className={`font-medium line-clamp-1 ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
              {task.title}
            </h3>
            
            {task.description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                {task.description}
              </p>
            )}
            
            {/* Task details */}
            <div className="flex flex-wrap items-center gap-2 mt-2">
              {/* Priority badge */}
              <Badge className={`${getPriorityClass(task.priority)} text-[10px]`}>
                {task.priority}
              </Badge>
              
              {/* Category badge */}
              {category && (
                <Badge 
                  variant="outline" 
                  className="flex items-center gap-1 text-[10px] border-border/60"
                >
                  <span 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: category.color }} 
                  />
                  {category.name}
                </Badge>
              )}
              
              {/* Due date badge */}
              {task.dueDate && (
                <Badge 
                  variant="outline" 
                  className={`
                    flex items-center gap-1 text-[10px] border-border/60
                    ${isPast(task.dueDate) && !task.completed ? 'text-red-400 border-red-400/30' : ''}
                    ${isToday(task.dueDate) ? 'text-orange-400 border-orange-400/30' : ''}
                  `}
                >
                  <CalendarClock className="h-3 w-3" />
                  {formatDate(task.dueDate)}
                </Badge>
              )}
            </div>
          </div>
          
          {/* Actions */}
          <div onClick={(e) => e.stopPropagation()}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                align="end"
                className="bg-card border-border"
              >
                <DropdownMenuItem onClick={handleEdit}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={handleDelete}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      
      {/* Task details dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="bg-card border-border max-w-lg">
          <DialogHeader>
            <DialogTitle className={task.completed ? 'line-through opacity-75' : ''}>
              {task.title}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {/* Description */}
            {task.description && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Description:</h4>
                <p className="text-sm">{task.description}</p>
              </div>
            )}
            
            {/* Due Date */}
            {task.dueDate && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Due Date:</h4>
                <div className="flex items-center gap-2">
                  <CalendarClock className="h-4 w-4" />
                  <span className="text-sm">
                    {formatDate(task.dueDate)}
                    {isToday(task.dueDate) && <span className="ml-2 text-orange-400">(Today)</span>}
                    {isPast(task.dueDate) && !task.completed && <span className="ml-2 text-red-400">(Overdue)</span>}
                  </span>
                </div>
              </div>
            )}
            
            {/* Priority */}
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Priority:</h4>
              <Badge className={`${getPriorityClass(task.priority)}`}>
                {task.priority}
              </Badge>
            </div>
            
            {/* Category */}
            {category && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-1">Category:</h4>
                <div className="flex items-center gap-2">
                  <span 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: category.color }} 
                  />
                  <span className="text-sm">{category.name}</span>
                </div>
              </div>
            )}
            
            {/* Status */}
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Status:</h4>
              <div className="flex items-center gap-2">
                {task.completed ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : (
                  <Circle className="h-4 w-4" />
                )}
                <span className="text-sm">{task.completed ? 'Completed' : 'Pending'}</span>
              </div>
            </div>
          </div>
          
          <DialogFooter className="flex sm:justify-between gap-2 mt-4">
            <div className="flex gap-2">
              <Button 
                variant="outline"
                size="sm"
                onClick={handleEdit}
                className="bg-secondary/60 border-secondary"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button 
                variant="destructive"
                size="sm"
                onClick={handleDelete}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
            <Button 
              onClick={handleToggleComplete}
              size="sm"
            >
              {task.completed ? (
                <>
                  <Circle className="h-4 w-4 mr-2" />
                  Mark as Pending
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Mark as Completed
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit task dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="bg-card border-border max-w-lg">
          <DialogTitle>Edit Task</DialogTitle>
          <TaskForm task={task} onSuccess={() => setShowEditDialog(false)} />
        </DialogContent>
      </Dialog>
      
      {/* Delete confirmation dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="bg-card border-border max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Task</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this task? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0 mt-4">
            <DialogClose asChild>
              <Button variant="outline" className="bg-secondary/60 border-secondary">
                Cancel
              </Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={() => {
                deleteTask(task.id);
                setShowDeleteDialog(false);
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TaskItem;
