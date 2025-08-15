import { addDays, isWeekend, isSameDay } from 'date-fns';

// Brazilian holidays calculation (simplified for 2025+)
const getBrazilianHolidays = (year) => {
  const holidays = [
    new Date(year, 0, 1),   // New Year
    new Date(year, 3, 21),  // Tiradentes
    new Date(year, 4, 1),   // Labor Day
    new Date(year, 8, 7),   // Independence Day
    new Date(year, 9, 12),  // Our Lady of Aparecida
    new Date(year, 10, 2),  // All Souls' Day
    new Date(year, 10, 15), // Proclamation of the Republic
    new Date(year, 11, 25), // Christmas
  ];
  
  // Add Easter-based holidays (simplified calculation)
  const easter = getEaster(year);
  holidays?.push(
    new Date(easter.getTime() - 2 * 24 * 60 * 60 * 1000), // Good Friday
    new Date(easter.getTime() + 60 * 24 * 60 * 60 * 1000), // Corpus Christi
  );
  
  return holidays;
};

const getEaster = (year) => {
  // Simplified Easter calculation
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const n = Math.floor((h + l - 7 * m + 114) / 31);
  const p = (h + l - 7 * m + 114) % 31;
  return new Date(year, n - 1, p + 1);
};

// Adjust date to next business day
export const adjustToBusinessDay = (date) => {
  if (!date) return date;
  
  const year = new Date(date)?.getFullYear();
  const holidays = getBrazilianHolidays(year);
  let adjustedDate = new Date(date);
  
  while (isWeekend(adjustedDate) || holidays?.some(holiday => isSameDay(holiday, adjustedDate))) {
    adjustedDate = addDays(adjustedDate, 1);
  }
  
  return adjustedDate?.toISOString();
};