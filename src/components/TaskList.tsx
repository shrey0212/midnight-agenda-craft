
import { useMemo } from 'react';
import { useTaskContext } from '../context/TaskContext';
import TaskItem from './TaskItem';
import { Card } from '@/components/ui/card';
import { CircleAlert, ListChecks, CircleX } from 'lucide-react';

const TaskList = () => {
  const { filteredTasks, filterOptions } = useTaskContext();
  
  const emptyStateMessage = useMemo(() => {
    if (filteredTasks.length === 0) {
      const isFiltered = filterOptions.status !== 'all' || 
                         filterOptions.priority !== 'all' || 
                         filterOptions.dueDate !== 'all' || 
                         filterOptions.category !== 'all' ||
                         filterOptions.searchQuery !== '';
      
      if (isFiltered) {
        return {
          icon: <CircleAlert className="h-12 w-12 text-muted-foreground" />,
          title: 'No matching tasks',
          description: 'Try adjusting your filter settings to see more tasks.'
        };
      } else {
        return {
          icon: <ListChecks className="h-12 w-12 text-muted-foreground" />,
          title: 'No tasks yet',
          description: 'Add your first task to get started on your to-do list.'
        };
      }
    }
    return null;
  }, [filteredTasks, filterOptions]);

  return (
    <div className="mt-4">
      {emptyStateMessage ? (
        <Card className="flex flex-col items-center justify-center p-8 bg-secondary/40 border-border/40">
          {emptyStateMessage.icon}
          <h3 className="mt-4 text-xl font-medium">{emptyStateMessage.title}</h3>
          <p className="mt-2 text-muted-foreground text-center">
            {emptyStateMessage.description}
          </p>
        </Card>
      ) : (
        <div>
          {filteredTasks.map(task => (
            <TaskItem key={task.id} task={task} />
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;
