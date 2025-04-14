
import { useState } from 'react';
import { TaskProvider } from '@/context/TaskContext';
import Header from '@/components/Header';
import FilterBar from '@/components/FilterBar';
import TaskList from '@/components/TaskList';

const Index = () => {
  return (
    <TaskProvider>
      <div className="min-h-screen bg-background text-foreground p-4 md:p-6 max-w-4xl mx-auto">
        <Header />
        <div className="glass border-border/50 rounded-xl p-4 md:p-6 shadow-lg">
          <FilterBar />
          <TaskList />
        </div>
      </div>
    </TaskProvider>
  );
};

export default Index;
