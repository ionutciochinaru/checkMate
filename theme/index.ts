export * from './types';
export * from './base';
export { lightTheme } from './lightTheme';
export { darkTheme } from './darkTheme';
export { lightHighContrastTheme, darkHighContrastTheme } from './highContrastThemes';

// Theme utilities
export const getCardColor = (index: number, theme: import('./types').Theme, isCompleted: boolean = false): string => {
  if (isCompleted) {
    return theme.colors.cardCompleted;
  }
  
  const colors = theme.colors.cardPrimary;
  return colors[index % colors.length];
};

export const getTaskCardColor = (taskId: string, theme: import('./types').Theme, isCompleted: boolean = false): string => {
  // Generate consistent index from task ID
  const index = Math.abs(taskId.split('').reduce((a, b) => a + b.charCodeAt(0), 0));
  return getCardColor(index, theme, isCompleted);
};