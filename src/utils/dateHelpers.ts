/**
 * Utility functions for safely handling date conversions
 */

/**
 * Safely converts a value to a Date object
 * @param value Value to convert to date (Date, string, number, etc.)
 * @param fallback Optional fallback value if conversion fails
 * @returns A Date object or the fallback value
 */
export function toDate(value: unknown, fallback: Date | null = null): Date | null {
  if (value === null || value === undefined) {
    return fallback;
  }

  // Already a date
  if (value instanceof Date) {
    return value;
  }

  // ISO string
  if (typeof value === 'string') {
    try {
      const date = new Date(value);
      return isNaN(date.getTime()) ? fallback : date;
    } catch (e) {
      console.error('Failed to convert string to date:', value, e);
      return fallback;
    }
  }

  // Timestamp
  if (typeof value === 'number') {
    try {
      const date = new Date(value);
      return isNaN(date.getTime()) ? fallback : date;
    } catch (e) {
      console.error('Failed to convert number to date:', value, e);
      return fallback;
    }
  }

  return fallback;
}

/**
 * Formats a date to ISO string, safely handling various input types
 * @param value Date value to format
 * @param fallback Optional fallback value if conversion fails
 * @returns ISO string or fallback
 */
export function toISOString(value: unknown, fallback: string = ''): string {
  const date = toDate(value);
  return date ? date.toISOString() : fallback;
}

/**
 * Formats a date to a specific format string
 * @param value Date value to format
 * @param formatStr Format string or function
 * @param fallback Optional fallback value if conversion fails
 * @returns Formatted date string or fallback
 */
export function formatDate(
  value: unknown, 
  formatStr: string | ((date: Date) => string) = 'yyyy-MM-dd',
  fallback: string = ''
): string {
  const date = toDate(value);
  if (!date) return fallback;

  try {
    if (typeof formatStr === 'function') {
      return formatStr(date);
    }

    // Simple formatter - can be replaced with date-fns or other libraries
    const options: Intl.DateTimeFormatOptions = {};
    if (formatStr.includes('yyyy')) options.year = 'numeric';
    if (formatStr.includes('MM')) options.month = '2-digit';
    if (formatStr.includes('dd')) options.day = '2-digit';
    if (formatStr.includes('HH')) options.hour = '2-digit';
    if (formatStr.includes('mm')) options.minute = '2-digit';
    if (formatStr.includes('ss')) options.second = '2-digit';

    return date.toLocaleDateString(undefined, options);
  } catch (e) {
    console.error('Failed to format date:', value, e);
    return fallback;
  }
}

/**
 * Extracts just the date portion from a date value, removing time
 * @param value Date value 
 * @returns Date with time set to midnight
 */
export function dateOnly(value: unknown): Date | null {
  const date = toDate(value);
  if (!date) return null;

  const newDate = new Date(date);
  newDate.setHours(0, 0, 0, 0);
  return newDate;
}

/**
 * Safely compares two dates
 * @param date1 First date
 * @param date2 Second date
 * @returns -1 if date1 < date2, 0 if equal, 1 if date1 > date2, or null if invalid
 */
export function compareDate(date1: unknown, date2: unknown): number | null {
  const d1 = toDate(date1);
  const d2 = toDate(date2);

  if (!d1 || !d2) return null;

  const t1 = d1.getTime();
  const t2 = d2.getTime();

  if (t1 < t2) return -1;
  if (t1 > t2) return 1;
  return 0;
} 