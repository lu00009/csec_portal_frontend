// utils/dateUtils.ts

// Detect and parse any common date format
export function parseAnyDate(dateStr: string): Date | null {
  if (!dateStr) return null;
  
  // Try different formats in order of likelihood
  const formats = [
    // DD/MM/YY or DD/MM/YYYY
    /^(\d{1,2})[\/-](\d{1,2})[\/-](\d{2,4})$/,
    // YYYY-MM-DD (ISO)
    /^(\d{4})[\/-](\d{1,2})[\/-](\d{1,2})$/,
    // Month DD, YYYY (e.g., "Jan 15, 2023")
    /^([a-zA-Z]{3,9})\s(\d{1,2}),\s(\d{4})$/,
    // Timestamp
    /^\d{10,13}$/
  ];

  for (const format of formats) {
    const match = dateStr.match(format);
    if (match) {
      // Handle different format types
      if (format === formats[0]) { // DD/MM/YY or DD/MM/YYYY
        let day = parseInt(match[1], 10);
        let month = parseInt(match[2], 10) - 1;
        let year = parseInt(match[3], 10);
        if (year < 100) year += 2000;
        return new Date(year, month, day);
      }
      // Add handling for other formats...
    }
  }

  // Fallback to native Date parsing
  const parsed = new Date(dateStr);
  return isNaN(parsed.getTime()) ? null : parsed;
}

// Format date consistently for display
export function formatDisplayDate(dateInput: string | Date): string {
  const date = typeof dateInput === 'string' ? parseAnyDate(dateInput) : dateInput;
  if (!date || isNaN(date.getTime())) return "Invalid date";

  return date.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
}

// Format for API (YYYY-MM-DD)
export function formatApiDate(dateInput: string | Date): string {
  const date = typeof dateInput === 'string' ? parseAnyDate(dateInput) : dateInput;
  if (!date || isNaN(date.getTime())) return "";

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

// Calculate time remaining
export function getTimeLeft(endDateInput: string | Date): string {
  const endDate = typeof endDateInput === 'string' ? parseAnyDate(endDateInput) : endDateInput;
  if (!endDate || isNaN(endDate.getTime())) return "Invalid date";

  const now = new Date();
  const diffMs = endDate.getTime() - now.getTime();
  if (diffMs <= 0) return "Ended";

  const totalMinutes = Math.floor(diffMs / 60000);
  const days = Math.floor(totalMinutes / (24 * 60));
  const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
  const minutes = totalMinutes % 60;

  return `${days}d ${hours}h ${minutes}m left`;
}