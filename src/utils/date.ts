export type Status = 'planned' | 'ongoing' | 'ended';

export const calculateStatus = (
  startDate?: string | Date | null,
  endDate?: string | Date | null,
  currentDate: Date = new Date()
): Status => {
  const start = parseAnyDate(startDate);
  const end = parseAnyDate(endDate);

  if (!start || !end) return 'planned';
  
  if (currentDate > end) return 'ended';
  if (currentDate >= start && currentDate <= end) return 'ongoing';
  return 'planned';
};

export const getTimeLeft = (
  startDate?: string | Date | null,
  endDate?: string | Date | null,
  currentDate: Date = new Date()
): string => {
  const start = parseAnyDate(startDate);
  const end = parseAnyDate(endDate);

  if (!start || !end) return 'Date not specified';

  // Check if it's the same day
  const isSameDay = start.toDateString() === end.toDateString();

  if (currentDate > end) {
    return 'Session ended';
  }

  if (currentDate >= start) {
    // Session is ongoing - show time left until end
    const diff = end.getTime() - currentDate.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (isSameDay) {
      // For same-day sessions, show the time range
      const startTime = start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const endTime = end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      return `${startTime} - ${endTime}`;
    }
    
    if (hours > 0) {
      return `${hours}h ${minutes}m Remaining`;
    }
    return ` ${minutes}m Remaining`;
  }

  // Session is planned - show time until start
  const diff = start.getTime() - currentDate.getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  if (isSameDay) {
    // For same-day sessions, show the time range
    const startTime = start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const endTime = end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return `${startTime} - ${endTime}`;
  }
  
  if (days > 0) {
    return `${days}d ${hours}h Remaining`;
  }
  return `${hours}h Remaining`;
};

export function formatDisplayDate(dateInput: string | Date | null | undefined): string {
  const date = parseAnyDate(dateInput);
  if (!date || isNaN(date.getTime())) return "Invalid date";

  return date.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
}

export function parseAnyDate(dateStr: string | Date | null | undefined): Date | null {
  if (!dateStr) return null;
  if (dateStr instanceof Date) return dateStr;
  
  // Try ISO format first
  const isoDate = new Date(dateStr);
  if (!isNaN(isoDate.getTime())) return isoDate;

  // Try other common formats
  const formats = [
    // DD/MM/YYYY or DD-MM-YYYY
    /^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})$/,
    // MM/DD/YYYY or MM-DD-YYYY
    /^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})$/,
    // YYYY/MM/DD or YYYY-MM-DD
    /^(\d{4})[\/-](\d{1,2})[\/-](\d{1,2})$/,
    // Month DD, YYYY (e.g., "Jan 15, 2023")
    /^([a-zA-Z]{3,9})\s(\d{1,2}),\s(\d{4})$/
  ];

  for (const format of formats) {
    const match = String(dateStr).match(format);
    if (match) {
      try {
        if (format === formats[0] || format === formats[1]) {
          const day = parseInt(match[1], 10);
          const month = parseInt(match[2], 10) - 1;
          const year = parseInt(match[3], 10);
          return new Date(year, month, day);
        }
        if (format === formats[2]) {
          const year = parseInt(match[1], 10);
          const month = parseInt(match[2], 10) - 1;
          const day = parseInt(match[3], 10);
          return new Date(year, month, day);
        }
        if (format === formats[3]) {
          return new Date(dateStr);
        }
      } catch {
        throw new Error(`Error parsing date: ${dateStr}. Format: ${format}`);
       continue;
      }
        }
  }

  return null;
}