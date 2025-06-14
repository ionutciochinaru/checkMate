import { useMemo } from 'react';

export type FilterType = 'Today' | 'Tomorrow' | 'This Week' | 'All';

export function useTaskFilter(tasks: any[], selectedFilter: FilterType) {
  const filteredTasks = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

    switch (selectedFilter) {
      case 'Today':
        return tasks.filter(task => {
          const reminderDate = task.reminderTime instanceof Date ? task.reminderTime : new Date(task.reminderTime);
          if (isNaN(reminderDate.getTime())) return false;
          const taskDate = new Date(reminderDate.getFullYear(), reminderDate.getMonth(), reminderDate.getDate());
          return taskDate.getTime() === today.getTime();
        });
      case 'Tomorrow':
        return tasks.filter(task => {
          const reminderDate = task.reminderTime instanceof Date ? task.reminderTime : new Date(task.reminderTime);
          if (isNaN(reminderDate.getTime())) return false;
          const taskDate = new Date(reminderDate.getFullYear(), reminderDate.getMonth(), reminderDate.getDate());
          return taskDate.getTime() === tomorrow.getTime();
        });
      case 'This Week':
        return tasks.filter(task => {
          const reminderDate = task.reminderTime instanceof Date ? task.reminderTime : new Date(task.reminderTime);
          if (isNaN(reminderDate.getTime())) return false;
          const taskDate = new Date(reminderDate.getFullYear(), reminderDate.getMonth(), reminderDate.getDate());
          return taskDate.getTime() >= today.getTime() && taskDate.getTime() < nextWeek.getTime();
        });
      case 'All':
      default:
        return tasks;
    }
  }, [tasks, selectedFilter]);

  const pendingTasks = useMemo(() => 
    filteredTasks.filter(task => !task.isCompleted), 
    [filteredTasks]
  );

  const completedTasks = useMemo(() => 
    filteredTasks.filter(task => task.isCompleted), 
    [filteredTasks]
  );

  return {
    filteredTasks,
    pendingTasks,
    completedTasks
  };
}