import { DateFormat, DateSeparator, TimeFormat } from '../types/task';

const SHORT_MONTH_NAMES = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export const formatDateWithPreference = (
  date: Date | string, 
  format: DateFormat, 
  useMonthNames: boolean = false, 
  separator: DateSeparator = '-'
): string => {
  const dateObj = date instanceof Date ? date : new Date(date);
  if (isNaN(dateObj.getTime())) {
    return 'Invalid Date';
  }

  const day = dateObj.getDate().toString().padStart(2, '0');
  const monthNum = (dateObj.getMonth() + 1).toString().padStart(2, '0');
  const monthName = SHORT_MONTH_NAMES[dateObj.getMonth()];
  const year = dateObj.getFullYear().toString();

  const month = useMonthNames ? monthName : monthNum;

  switch (format) {
    case 'DD-MM-YYYY':
      return `${day}${separator}${month}${separator}${year}`;
    case 'MM-DD-YYYY':
      return `${month}${separator}${day}${separator}${year}`;
    case 'YYYY-MM-DD':
      return `${year}${separator}${month}${separator}${day}`;
    default:
      return `${day}${separator}${month}${separator}${year}`;
  }
};

export const formatTime = (date: Date | string, timeFormat: TimeFormat = '24H'): string => {
  const dateObj = date instanceof Date ? date : new Date(date);
  if (isNaN(dateObj.getTime())) {
    return 'Invalid Time';
  }
  
  if (timeFormat === '12H') {
    return dateObj.toLocaleTimeString('en-US', { 
      hour12: true, 
      hour: 'numeric', 
      minute: '2-digit' 
    });
  } else {
    return dateObj.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  }
};

export const getDateFormatDisplayName = (
  format: DateFormat, 
  useMonthNames: boolean = false, 
  separator: DateSeparator = '-'
): string => {
  const sampleDate = new Date(2024, 11, 25); // December 25, 2024
  const example = formatDateWithPreference(sampleDate, format, useMonthNames, separator);
  return `${format.replace(/-/g, separator)} (e.g., ${example})`;
};

export const availableDateFormats: DateFormat[] = [
  'DD-MM-YYYY',
  'MM-DD-YYYY', 
  'YYYY-MM-DD'
];

export const availableSeparators: DateSeparator[] = ['-', '/'];

export const availableTimeFormats: TimeFormat[] = ['24H', '12H'];

export const getTimeFormatDisplayName = (format: TimeFormat): string => {
  const sampleDate = new Date(2024, 11, 25, 14, 30); // 2:30 PM
  const example = formatTime(sampleDate, format);
  return `${format} (e.g., ${example})`;
};