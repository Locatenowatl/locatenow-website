import { addDays, format, isAfter, isBefore, startOfDay } from 'date-fns';

export function formatDateRange(dateString: string): string {
  const [from, to] = dateString.split('|');
  const fromDate = new Date(from);
  const toDate = to ? new Date(to) : null;

  if (toDate) {
    return `${format(fromDate, 'MM/dd/yyyy')} - ${format(toDate, 'MM/dd/yyyy')}`;
  }
  return format(fromDate, 'MM/dd/yyyy');
}

export function isValidDateRange(dateString: string): boolean {
  try {
    const [from, to] = dateString.split('|');
    const fromDate = new Date(from);
    const toDate = to ? new Date(to) : null;

    if (isNaN(fromDate.getTime())) return false;
    if (toDate && isNaN(toDate.getTime())) return false;
    if (toDate && isBefore(toDate, fromDate)) return false;

    const today = startOfDay(new Date());
    const maxDate = addDays(today, 365);

    if (isBefore(fromDate, today) || isAfter(fromDate, maxDate)) return false;
    if (toDate && (isBefore(toDate, today) || isAfter(toDate, maxDate))) return false;

    return true;
  } catch {
    return false;
  }
}