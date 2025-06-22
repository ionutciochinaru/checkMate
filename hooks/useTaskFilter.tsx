import { useMemo } from 'react';

export type FilterType = 'Today' | 'Tomorrow' | 'This Week' | 'All' | 'Focus' | 'Sprint' | 'Attention' | 'Work Hours' | 'After Hours' | 'Weekend' | 'Quick Wins';

export interface FilterPreset {
  id: string;
  name: string;
  primaryFilter: FilterType;
  additionalFilters: FilterType[];
  filterLogic: 'AND' | 'OR';
  searchText: string;
  createdAt: Date;
  lastUsed?: Date;
}

export interface AdvancedSearchTerm {
  type: 'property' | 'date' | 'number' | 'text';
  key: string;
  operator: string;
  value: string;
}

interface TaskFilterOptions {
  searchText?: string;
  workingHoursStart?: string;
  workingHoursEnd?: string;
  additionalFilters?: FilterType[];
  filterLogic?: 'AND' | 'OR';
}

export function useTaskFilter(tasks: any[], selectedFilter: FilterType, options: TaskFilterOptions = {}) {
  const { 
    searchText = '', 
    workingHoursStart = '09:00', 
    workingHoursEnd = '17:00',
    additionalFilters = [],
    filterLogic = 'AND'
  } = options;
  
  const filteredTasks = useMemo(() => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    
    const isOverdue = (task: any) => {
      const reminderDate = task.reminderTime instanceof Date ? task.reminderTime : new Date(task.reminderTime);
      return reminderDate < now && !task.isCompleted;
    };
    
    const isInWorkingHours = (task: any) => {
      const reminderDate = task.reminderTime instanceof Date ? task.reminderTime : new Date(task.reminderTime);
      const hours = reminderDate.getHours();
      const minutes = reminderDate.getMinutes();
      const timeInMinutes = hours * 60 + minutes;
      
      const [startHour, startMin] = workingHoursStart.split(':').map(Number);
      const [endHour, endMin] = workingHoursEnd.split(':').map(Number);
      const startMinutes = startHour * 60 + startMin;
      const endMinutes = endHour * 60 + endMin;
      
      return timeInMinutes >= startMinutes && timeInMinutes <= endMinutes;
    };
    
    const isWeekend = (task: any) => {
      const reminderDate = task.reminderTime instanceof Date ? task.reminderTime : new Date(task.reminderTime);
      const dayOfWeek = reminderDate.getDay();
      return dayOfWeek === 0 || dayOfWeek === 6; // Sunday or Saturday
    };
    
    const parseAdvancedSearch = (searchText: string): { normalText: string; advancedTerms: AdvancedSearchTerm[] } => {
      const normalText: string[] = [];
      const advancedTerms: AdvancedSearchTerm[] = [];
      
      const tokens = searchText.match(/(?:[^\s"]+|"[^"]*")+/g) || [];
      
      tokens.forEach(token => {
        if (token.includes(':')) {
          const [key, ...valueParts] = token.split(':');
          const value = valueParts.join(':').replace(/"/g, '');
          
          switch (key.toLowerCase()) {
            case 'is':
              advancedTerms.push({ type: 'property', key: 'is', operator: '=', value: value.toLowerCase() });
              break;
            case 'due':
              advancedTerms.push({ type: 'date', key: 'due', operator: '=', value: value.toLowerCase() });
              break;
            case 'delays':
              const match = value.match(/^(\d+)(\+?)$/);
              if (match) {
                const [, number, plus] = match;
                advancedTerms.push({ 
                  type: 'number', 
                  key: 'delays', 
                  operator: plus ? '>=' : '=', 
                  value: number 
                });
              }
              break;
            case 'time':
              advancedTerms.push({ type: 'date', key: 'time', operator: '=', value: value.toLowerCase() });
              break;
            case 'title':
            case 'description':
              advancedTerms.push({ type: 'text', key: key.toLowerCase(), operator: 'contains', value: value.toLowerCase() });
              break;
            default:
              normalText.push(token);
          }
        } else {
          normalText.push(token);
        }
      });
      
      return { normalText: normalText.join(' '), advancedTerms };
    };

    const matchesAdvancedSearch = (task: any, searchText: string) => {
      const { normalText, advancedTerms } = parseAdvancedSearch(searchText);
      
      if (normalText.trim()) {
        const normalLower = normalText.toLowerCase();
        const normalMatch = (
          task.title.toLowerCase().includes(normalLower) ||
          (task.description && task.description.toLowerCase().includes(normalLower))
        );
        if (!normalMatch) return false;
      }
      
      for (const term of advancedTerms) {
        let termMatch = false;
        
        switch (term.key) {
          case 'is':
            switch (term.value) {
              case 'overdue':
                termMatch = isOverdue(task);
                break;
              case 'completed':
                termMatch = task.isCompleted;
                break;
              case 'pending':
                termMatch = !task.isCompleted;
                break;
              case 'recurring':
                termMatch = task.isRecurring;
                break;
              case 'delayed':
                termMatch = task.delayCount > 0;
                break;
              case 'weekend':
                termMatch = isWeekend(task);
                break;
              case 'workhours':
                termMatch = isInWorkingHours(task);
                break;
            }
            break;
            
          case 'due':
            const reminderDate = task.reminderTime instanceof Date ? task.reminderTime : new Date(task.reminderTime);
            const taskDate = new Date(reminderDate.getFullYear(), reminderDate.getMonth(), reminderDate.getDate());
            
            switch (term.value) {
              case 'today':
                termMatch = taskDate.getTime() === today.getTime();
                break;
              case 'tomorrow':
                termMatch = taskDate.getTime() === tomorrow.getTime();
                break;
              case 'this-week':
                termMatch = taskDate.getTime() >= today.getTime() && taskDate.getTime() < nextWeek.getTime();
                break;
            }
            break;
            
          case 'delays':
            const delayCount = task.delayCount || 0;
            const targetCount = parseInt(term.value);
            
            if (term.operator === '>=') {
              termMatch = delayCount >= targetCount;
            } else {
              termMatch = delayCount === targetCount;
            }
            break;
            
          case 'time':
            const taskHour = (task.reminderTime instanceof Date ? task.reminderTime : new Date(task.reminderTime)).getHours();
            
            switch (term.value) {
              case 'morning':
                termMatch = taskHour >= 6 && taskHour < 12;
                break;
              case 'afternoon':
                termMatch = taskHour >= 12 && taskHour < 17;
                break;
              case 'evening':
                termMatch = taskHour >= 17 && taskHour < 22;
                break;
              case 'night':
                termMatch = taskHour >= 22 || taskHour < 6;
                break;
            }
            break;
            
          case 'title':
            termMatch = task.title.toLowerCase().includes(term.value);
            break;
            
          case 'description':
            termMatch = task.description && task.description.toLowerCase().includes(term.value);
            break;
        }
        
        if (!termMatch) return false;
      }
      
      return true;
    };

    const matchesSearch = (task: any) => {
      if (!searchText.trim()) return true;
      return matchesAdvancedSearch(task, searchText);
    };
    
    const applyFilter = (tasks: any[], filter: FilterType): any[] => {
      switch (filter) {
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
          
        case 'Focus':
          return tasks.filter(task => {
            if (task.isCompleted) return false;
            const reminderDate = task.reminderTime instanceof Date ? task.reminderTime : new Date(task.reminderTime);
            return isOverdue(task) || (reminderDate <= twoHoursFromNow && reminderDate >= now);
          });
          
        case 'Sprint':
          const overdueTasks = tasks.filter(task => !task.isCompleted && isOverdue(task));
          const upcomingTasks = tasks
            .filter(task => !task.isCompleted && !isOverdue(task))
            .sort((a, b) => {
              const dateA = a.reminderTime instanceof Date ? a.reminderTime : new Date(a.reminderTime);
              const dateB = b.reminderTime instanceof Date ? b.reminderTime : new Date(b.reminderTime);
              return dateA.getTime() - dateB.getTime();
            })
            .slice(0, 3);
          return [...overdueTasks, ...upcomingTasks];
          
        case 'Attention':
          return tasks.filter(task => {
            if (task.isCompleted) return false;
            return isOverdue(task) || (task.delayCount && task.delayCount >= 3);
          });
          
        case 'Work Hours':
          return tasks.filter(task => isInWorkingHours(task));
          
        case 'After Hours':
          return tasks.filter(task => !isInWorkingHours(task));
          
        case 'Weekend':
          return tasks.filter(task => isWeekend(task));
          
        case 'Quick Wins':
          return tasks.filter(task => {
            if (task.isCompleted) return false;
            return !task.delayCount || task.delayCount <= 1;
          });
          
        case 'All':
        default:
          return tasks;
      }
    };

    let filtered = tasks.filter(matchesSearch);

    if (selectedFilter !== 'All') {
      filtered = applyFilter(filtered, selectedFilter);
    }

    if (additionalFilters.length > 0) {
      const additionalResults = additionalFilters.map(filter => applyFilter(tasks.filter(matchesSearch), filter));
      
      if (filterLogic === 'OR') {
        const allResults = [filtered, ...additionalResults];
        const uniqueTasks = new Map();
        allResults.flat().forEach(task => uniqueTasks.set(task.id, task));
        filtered = Array.from(uniqueTasks.values());
      } else {
        additionalResults.forEach(result => {
          const resultIds = new Set(result.map(task => task.id));
          filtered = filtered.filter(task => resultIds.has(task.id));
        });
      }
    }

    return filtered;
  }, [tasks, selectedFilter, searchText, workingHoursStart, workingHoursEnd, additionalFilters, filterLogic]);

  const getFilterCount = (filter: FilterType): number => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const twoHoursFromNow = new Date(now.getTime() + 2 * 60 * 60 * 1000);
    
    const isOverdue = (task: any) => {
      const reminderDate = task.reminderTime instanceof Date ? task.reminderTime : new Date(task.reminderTime);
      return reminderDate < now && !task.isCompleted;
    };
    
    const isInWorkingHours = (task: any) => {
      const reminderDate = task.reminderTime instanceof Date ? task.reminderTime : new Date(task.reminderTime);
      const hours = reminderDate.getHours();
      const minutes = reminderDate.getMinutes();
      const timeInMinutes = hours * 60 + minutes;
      
      const [startHour, startMin] = workingHoursStart.split(':').map(Number);
      const [endHour, endMin] = workingHoursEnd.split(':').map(Number);
      const startMinutes = startHour * 60 + startMin;
      const endMinutes = endHour * 60 + endMin;
      
      return timeInMinutes >= startMinutes && timeInMinutes <= endMinutes;
    };
    
    const isWeekend = (task: any) => {
      const reminderDate = task.reminderTime instanceof Date ? task.reminderTime : new Date(task.reminderTime);
      const dayOfWeek = reminderDate.getDay();
      return dayOfWeek === 0 || dayOfWeek === 6;
    };
    
    const searchFiltered = tasks.filter(task => {
      if (!searchText.trim()) return true;
      const searchLower = searchText.toLowerCase();
      return (
        task.title.toLowerCase().includes(searchLower) ||
        (task.description && task.description.toLowerCase().includes(searchLower))
      );
    });
    
    switch (filter) {
      case 'Today':
        return searchFiltered.filter(task => {
          const reminderDate = task.reminderTime instanceof Date ? task.reminderTime : new Date(task.reminderTime);
          if (isNaN(reminderDate.getTime())) return false;
          const taskDate = new Date(reminderDate.getFullYear(), reminderDate.getMonth(), reminderDate.getDate());
          return taskDate.getTime() === today.getTime();
        }).length;
        
      case 'Tomorrow':
        return searchFiltered.filter(task => {
          const reminderDate = task.reminderTime instanceof Date ? task.reminderTime : new Date(task.reminderTime);
          if (isNaN(reminderDate.getTime())) return false;
          const taskDate = new Date(reminderDate.getFullYear(), reminderDate.getMonth(), reminderDate.getDate());
          return taskDate.getTime() === tomorrow.getTime();
        }).length;
        
      case 'This Week':
        return searchFiltered.filter(task => {
          const reminderDate = task.reminderTime instanceof Date ? task.reminderTime : new Date(task.reminderTime);
          if (isNaN(reminderDate.getTime())) return false;
          const taskDate = new Date(reminderDate.getFullYear(), reminderDate.getMonth(), reminderDate.getDate());
          return taskDate.getTime() >= today.getTime() && taskDate.getTime() < nextWeek.getTime();
        }).length;
        
      case 'Focus':
        return searchFiltered.filter(task => {
          if (task.isCompleted) return false;
          const reminderDate = task.reminderTime instanceof Date ? task.reminderTime : new Date(task.reminderTime);
          return isOverdue(task) || (reminderDate <= twoHoursFromNow && reminderDate >= now);
        }).length;
        
      case 'Sprint':
        const overdueTasks = searchFiltered.filter(task => !task.isCompleted && isOverdue(task));
        const upcomingTasks = searchFiltered
          .filter(task => !task.isCompleted && !isOverdue(task))
          .sort((a, b) => {
            const dateA = a.reminderTime instanceof Date ? a.reminderTime : new Date(a.reminderTime);
            const dateB = b.reminderTime instanceof Date ? b.reminderTime : new Date(b.reminderTime);
            return dateA.getTime() - dateB.getTime();
          })
          .slice(0, 3);
        return [...overdueTasks, ...upcomingTasks].length;
        
      case 'Attention':
        return searchFiltered.filter(task => {
          if (task.isCompleted) return false;
          return isOverdue(task) || (task.delayCount && task.delayCount >= 3);
        }).length;
        
      case 'Work Hours':
        return searchFiltered.filter(task => isInWorkingHours(task)).length;
        
      case 'After Hours':
        return searchFiltered.filter(task => !isInWorkingHours(task)).length;
        
      case 'Weekend':
        return searchFiltered.filter(task => isWeekend(task)).length;
        
      case 'Quick Wins':
        return searchFiltered.filter(task => {
          if (task.isCompleted) return false;
          return !task.delayCount || task.delayCount <= 1;
        }).length;
        
      case 'All':
      default:
        return searchFiltered.length;
    }
  };

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
    completedTasks,
    getFilterCount
  };
}