
import { useState } from 'react';
import { useTaskContext } from '../context/TaskContext';
import { 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Tag, 
  Filter, 
  X, 
  ChevronDown, 
  SlidersHorizontal, 
  CalendarClock, 
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { getPriorityClass } from '@/utils/helpers';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SortOption } from '@/utils/types';

const FilterBar = () => {
  const { 
    filterOptions, 
    updateFilterOptions, 
    clearFilters, 
    categories, 
    sortOption, 
    updateSortOption 
  } = useTaskContext();
  
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  const isFiltered = filterOptions.status !== 'all' || 
                     filterOptions.priority !== 'all' || 
                     filterOptions.dueDate !== 'all' || 
                     filterOptions.category !== 'all';

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'dueDate-asc', label: 'Due Date (Earliest First)' },
    { value: 'dueDate-desc', label: 'Due Date (Latest First)' },
    { value: 'priority-desc', label: 'Priority (High to Low)' },
    { value: 'priority-asc', label: 'Priority (Low to High)' },
    { value: 'alphabetical-asc', label: 'Title (A-Z)' },
    { value: 'alphabetical-desc', label: 'Title (Z-A)' },
    { value: 'createdAt-desc', label: 'Created (Newest First)' },
    { value: 'createdAt-asc', label: 'Created (Oldest First)' },
  ];

  const currentSortLabel = sortOptions.find(option => option.value === sortOption)?.label || 'Sort';

  const handleStatusFilter = (status: 'all' | 'completed' | 'pending') => {
    updateFilterOptions({ status });
  };

  const handlePriorityFilter = (priority: 'all' | 'high' | 'medium' | 'low') => {
    updateFilterOptions({ priority });
  };

  const handleDueDateFilter = (dueDate: 'all' | 'today' | 'upcoming' | 'overdue') => {
    updateFilterOptions({ dueDate });
  };

  const handleCategoryFilter = (category: string) => {
    updateFilterOptions({ category });
  };

  return (
    <div className="pb-4">
      {/* Larger screen filters */}
      <div className="hidden md:flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Status Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="bg-secondary/50 border-secondary flex gap-1">
                <CheckCircle2 className="h-4 w-4" />
                <span>Status</span>
                <ChevronDown className="h-3 w-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="bg-card border-border">
              <DropdownMenuItem 
                onClick={() => handleStatusFilter('all')}
                className={filterOptions.status === 'all' ? 'bg-secondary/70' : ''}
              >
                All
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleStatusFilter('completed')}
                className={filterOptions.status === 'completed' ? 'bg-secondary/70' : ''}
              >
                Completed
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleStatusFilter('pending')}
                className={filterOptions.status === 'pending' ? 'bg-secondary/70' : ''}
              >
                Pending
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Priority Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="bg-secondary/50 border-secondary flex gap-1">
                <AlertTriangle className="h-4 w-4" />
                <span>Priority</span>
                <ChevronDown className="h-3 w-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="bg-card border-border">
              <DropdownMenuItem 
                onClick={() => handlePriorityFilter('all')}
                className={filterOptions.priority === 'all' ? 'bg-secondary/70' : ''}
              >
                All
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handlePriorityFilter('high')}
                className={filterOptions.priority === 'high' ? 'bg-secondary/70' : ''}
              >
                <div className="w-3 h-3 rounded-full priority-high mr-2" />
                High
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handlePriorityFilter('medium')}
                className={filterOptions.priority === 'medium' ? 'bg-secondary/70' : ''}
              >
                <div className="w-3 h-3 rounded-full priority-medium mr-2" />
                Medium
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handlePriorityFilter('low')}
                className={filterOptions.priority === 'low' ? 'bg-secondary/70' : ''}
              >
                <div className="w-3 h-3 rounded-full priority-low mr-2" />
                Low
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Due Date Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="bg-secondary/50 border-secondary flex gap-1">
                <CalendarClock className="h-4 w-4" />
                <span>Due Date</span>
                <ChevronDown className="h-3 w-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="bg-card border-border">
              <DropdownMenuItem 
                onClick={() => handleDueDateFilter('all')}
                className={filterOptions.dueDate === 'all' ? 'bg-secondary/70' : ''}
              >
                All
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleDueDateFilter('today')}
                className={filterOptions.dueDate === 'today' ? 'bg-secondary/70' : ''}
              >
                Today
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleDueDateFilter('upcoming')}
                className={filterOptions.dueDate === 'upcoming' ? 'bg-secondary/70' : ''}
              >
                Upcoming
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleDueDateFilter('overdue')}
                className={filterOptions.dueDate === 'overdue' ? 'bg-secondary/70' : ''}
              >
                Overdue
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Categories Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="bg-secondary/50 border-secondary flex gap-1">
                <Tag className="h-4 w-4" />
                <span>Category</span>
                <ChevronDown className="h-3 w-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="bg-card border-border">
              <DropdownMenuItem 
                onClick={() => handleCategoryFilter('all')}
                className={filterOptions.category === 'all' ? 'bg-secondary/70' : ''}
              >
                All Categories
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border" />
              {categories.map(category => (
                <DropdownMenuItem 
                  key={category.id}
                  onClick={() => handleCategoryFilter(category.id)}
                  className={filterOptions.category === category.id ? 'bg-secondary/70' : ''}
                >
                  <span 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: category.color }} 
                  />
                  {category.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {isFiltered && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={clearFilters} 
              className="text-muted-foreground hover:text-primary"
            >
              <X className="h-4 w-4 mr-1" />
              Clear Filters
            </Button>
          )}
        </div>
        
        {/* Sort Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="bg-secondary/50 border-secondary flex gap-1">
              <SlidersHorizontal className="h-4 w-4" />
              <span>Sort: {currentSortLabel}</span>
              <ChevronDown className="h-3 w-3 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-card border-border w-64">
            <DropdownMenuLabel>Sort Tasks</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border" />
            {sortOptions.map(option => (
              <DropdownMenuItem 
                key={option.value}
                onClick={() => updateSortOption(option.value)}
                className={sortOption === option.value ? 'bg-secondary/70' : ''}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Mobile filters */}
      <div className="flex md:hidden items-center justify-between mb-4">
        <Sheet open={isFilterSheetOpen} onOpenChange={setIsFilterSheetOpen}>
          <SheetTrigger asChild>
            <Button 
              variant="outline" 
              size="sm"
              className="bg-secondary/50 border-secondary flex gap-1"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
              {isFiltered && <Badge variant="outline" className="ml-1 bg-primary/20 border-primary/40">Active</Badge>}
            </Button>
          </SheetTrigger>
          <SheetContent className="bg-card border-border">
            <SheetHeader>
              <SheetTitle>Filters & Sorting</SheetTitle>
              <SheetDescription>
                Filter and sort your tasks
              </SheetDescription>
            </SheetHeader>
            <Separator className="my-4 bg-border" />
            
            <div className="space-y-6">
              {/* Status */}
              <div>
                <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4" /> Status
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  <Button 
                    variant={filterOptions.status === 'all' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => handleStatusFilter('all')}
                    className={filterOptions.status !== 'all' ? 'bg-secondary/50 border-secondary' : ''}
                  >
                    All
                  </Button>
                  <Button 
                    variant={filterOptions.status === 'completed' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => handleStatusFilter('completed')}
                    className={filterOptions.status !== 'completed' ? 'bg-secondary/50 border-secondary' : ''}
                  >
                    Completed
                  </Button>
                  <Button 
                    variant={filterOptions.status === 'pending' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => handleStatusFilter('pending')}
                    className={filterOptions.status !== 'pending' ? 'bg-secondary/50 border-secondary' : ''}
                  >
                    Pending
                  </Button>
                </div>
              </div>
              
              {/* Priority */}
              <div>
                <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" /> Priority
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant={filterOptions.priority === 'all' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => handlePriorityFilter('all')}
                    className={filterOptions.priority !== 'all' ? 'bg-secondary/50 border-secondary' : ''}
                  >
                    All
                  </Button>
                  <Button 
                    variant={filterOptions.priority === 'high' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => handlePriorityFilter('high')}
                    className={`flex items-center gap-1 ${filterOptions.priority !== 'high' ? 'bg-secondary/50 border-secondary' : ''}`}
                  >
                    <div className="w-2 h-2 rounded-full priority-high" />
                    High
                  </Button>
                  <Button 
                    variant={filterOptions.priority === 'medium' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => handlePriorityFilter('medium')}
                    className={`flex items-center gap-1 ${filterOptions.priority !== 'medium' ? 'bg-secondary/50 border-secondary' : ''}`}
                  >
                    <div className="w-2 h-2 rounded-full priority-medium" />
                    Medium
                  </Button>
                  <Button 
                    variant={filterOptions.priority === 'low' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => handlePriorityFilter('low')}
                    className={`flex items-center gap-1 ${filterOptions.priority !== 'low' ? 'bg-secondary/50 border-secondary' : ''}`}
                  >
                    <div className="w-2 h-2 rounded-full priority-low" />
                    Low
                  </Button>
                </div>
              </div>
              
              {/* Due Date */}
              <div>
                <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <CalendarClock className="h-4 w-4" /> Due Date
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant={filterOptions.dueDate === 'all' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => handleDueDateFilter('all')}
                    className={filterOptions.dueDate !== 'all' ? 'bg-secondary/50 border-secondary' : ''}
                  >
                    All
                  </Button>
                  <Button 
                    variant={filterOptions.dueDate === 'today' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => handleDueDateFilter('today')}
                    className={filterOptions.dueDate !== 'today' ? 'bg-secondary/50 border-secondary' : ''}
                  >
                    Today
                  </Button>
                  <Button 
                    variant={filterOptions.dueDate === 'upcoming' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => handleDueDateFilter('upcoming')}
                    className={filterOptions.dueDate !== 'upcoming' ? 'bg-secondary/50 border-secondary' : ''}
                  >
                    Upcoming
                  </Button>
                  <Button 
                    variant={filterOptions.dueDate === 'overdue' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => handleDueDateFilter('overdue')}
                    className={filterOptions.dueDate !== 'overdue' ? 'bg-secondary/50 border-secondary' : ''}
                  >
                    Overdue
                  </Button>
                </div>
              </div>
              
              {/* Category */}
              <div>
                <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <Tag className="h-4 w-4" /> Category
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    variant={filterOptions.category === 'all' ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => handleCategoryFilter('all')}
                    className={filterOptions.category !== 'all' ? 'bg-secondary/50 border-secondary' : ''}
                  >
                    All
                  </Button>
                  {categories.map(category => (
                    <Button 
                      key={category.id}
                      variant={filterOptions.category === category.id ? 'default' : 'outline'} 
                      size="sm"
                      onClick={() => handleCategoryFilter(category.id)}
                      className={`flex items-center gap-1 ${filterOptions.category !== category.id ? 'bg-secondary/50 border-secondary' : ''}`}
                    >
                      <span 
                        className="w-2 h-2 rounded-full" 
                        style={{ backgroundColor: category.color }} 
                      />
                      {category.name}
                    </Button>
                  ))}
                </div>
              </div>

              <Separator className="my-4 bg-border" />
              
              {/* Sort Options */}
              <div>
                <h3 className="text-sm font-medium mb-2 flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4" /> Sort By
                </h3>
                <div className="space-y-1">
                  {sortOptions.map(option => (
                    <Button 
                      key={option.value}
                      variant="ghost" 
                      size="sm"
                      onClick={() => updateSortOption(option.value)}
                      className={`w-full justify-start ${sortOption === option.value ? 'bg-secondary/70' : ''}`}
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>
              
              {isFiltered && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={clearFilters} 
                  className="w-full mt-4"
                >
                  <X className="h-4 w-4 mr-2" />
                  Clear All Filters
                </Button>
              )}
            </div>
          </SheetContent>
        </Sheet>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              size="sm"
              className="bg-secondary/50 border-secondary flex gap-1"
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span>Sort</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-card border-border w-64">
            <DropdownMenuLabel>Sort Tasks</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border" />
            {sortOptions.map(option => (
              <DropdownMenuItem 
                key={option.value}
                onClick={() => updateSortOption(option.value)}
                className={sortOption === option.value ? 'bg-secondary/70' : ''}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Active filter badges */}
      {isFiltered && (
        <div className="flex flex-wrap gap-2 mb-4">
          {filterOptions.status !== 'all' && (
            <Badge variant="secondary" className="px-2 py-1 text-xs">
              Status: {filterOptions.status}
              <X 
                className="h-3 w-3 ml-1 cursor-pointer" 
                onClick={() => updateFilterOptions({ status: 'all' })} 
              />
            </Badge>
          )}

          {filterOptions.priority !== 'all' && (
            <Badge variant="secondary" className="px-2 py-1 text-xs">
              Priority: {filterOptions.priority}
              <X 
                className="h-3 w-3 ml-1 cursor-pointer" 
                onClick={() => updateFilterOptions({ priority: 'all' })} 
              />
            </Badge>
          )}

          {filterOptions.dueDate !== 'all' && (
            <Badge variant="secondary" className="px-2 py-1 text-xs">
              Due: {filterOptions.dueDate}
              <X 
                className="h-3 w-3 ml-1 cursor-pointer" 
                onClick={() => updateFilterOptions({ dueDate: 'all' })} 
              />
            </Badge>
          )}

          {filterOptions.category !== 'all' && (
            <Badge variant="secondary" className="px-2 py-1 text-xs">
              Category: {categories.find(c => c.id === filterOptions.category)?.name || ''}
              <X 
                className="h-3 w-3 ml-1 cursor-pointer" 
                onClick={() => updateFilterOptions({ category: 'all' })} 
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default FilterBar;
