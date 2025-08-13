import { addDays, isWeekend, isSameDay } from 'date-fns';

// Brazilian national holidays (fixed and moving)
const FIXED_HOLIDAYS = [
  { month: 0, day: 1 },   // New Year's Day
  { month: 3, day: 21 },  // Tiradentes
  { month: 4, day: 1 },   // Labor Day
  { month: 8, day: 7 },   // Independence Day
  { month: 9, day: 12 },  // Our Lady of Aparecida
  { month: 10, day: 2 },  // All Souls' Day
  { month: 10, day: 15 }, // Proclamation of the Republic
  { month: 11, day: 25 }, // Christmas
];

// Calculate Easter date using the algorithm
const calculateEaster = (year) => {
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

// Get all Brazilian holidays for a given year
export const getBrazilianHolidays = (year) => {
  const holidays = [];
  
  // Add fixed holidays
  FIXED_HOLIDAYS?.forEach(({ month, day }) => {
    holidays?.push(new Date(year, month, day));
  });
  
  // Calculate Easter and related holidays
  const easter = calculateEaster(year);
  
  // Good Friday (2 days before Easter)
  const goodFriday = addDays(easter, -2);
  holidays?.push(goodFriday);
  
  // Carnival Monday (48 days before Easter)
  const carnivalMonday = addDays(easter, -48);
  holidays?.push(carnivalMonday);
  
  // Carnival Tuesday (47 days before Easter)
  const carnivalTuesday = addDays(easter, -47);
  holidays?.push(carnivalTuesday);
  
  // Corpus Christi (60 days after Easter)
  const corpusChristi = addDays(easter, 60);
  holidays?.push(corpusChristi);
  
  return holidays;
};

// Check if a date is a Brazilian holiday
export const isBrazilianHoliday = (date) => {
  const year = date?.getFullYear();
  const holidays = getBrazilianHolidays(year);
  
  return holidays?.some(holiday => isSameDay(holiday, date));
};

// Check if a date is a business day (not weekend or holiday)
export const isBusinessDay = (date) => {
  return !isWeekend(date) && !isBrazilianHoliday(date);
};

// Move date to next business day if it falls on weekend or holiday
export const moveToNextBusinessDay = (date) => {
  let adjustedDate = new Date(date);
  
  while (!isBusinessDay(adjustedDate)) {
    adjustedDate = addDays(adjustedDate, 1);
  }
  
  return adjustedDate;
};

// Move date to previous business day if it falls on weekend or holiday
export const moveToPreviousBusinessDay = (date) => {
  let adjustedDate = new Date(date);
  
  while (!isBusinessDay(adjustedDate)) {
    adjustedDate = addDays(adjustedDate, -1);
  }
  
  return adjustedDate;
};

// Get business days between two dates
export const getBusinessDaysBetween = (startDate, endDate) => {
  const businessDays = [];
  let currentDate = new Date(startDate);
  
  while (currentDate <= endDate) {
    if (isBusinessDay(currentDate)) {
      businessDays?.push(new Date(currentDate));
    }
    currentDate = addDays(currentDate, 1);
  }
  
  return businessDays;
};

// Calculate business days count between two dates
export const countBusinessDaysBetween = (startDate, endDate) => {
  return getBusinessDaysBetween(startDate, endDate)?.length;
};

// Get holiday information with names (PT-BR)
export const getHolidayInfo = (date) => {
  const year = date?.getFullYear();
  const easter = calculateEaster(year);
  
  // Check for fixed holidays
  const month = date?.getMonth();
  const day = date?.getDate();
  
  const fixedHolidays = {
    '0-1': 'Confraternização Universal',
    '3-21': 'Tiradentes',
    '4-1': 'Dia do Trabalho',
    '8-7': 'Independência do Brasil',
    '9-12': 'Nossa Senhora Aparecida',
    '10-2': 'Finados',
    '10-15': 'Proclamação da República',
    '11-25': 'Natal',
  };
  
  const key = `${month}-${day}`;
  if (fixedHolidays?.[key]) {
    return {
      isHoliday: true,
      name: fixedHolidays?.[key],
      type: 'fixed'
    };
  }
  
  // Check for moving holidays
  if (isSameDay(date, addDays(easter, -2))) {
    return { isHoliday: true, name: 'Sexta-feira Santa', type: 'moving' };
  }
  if (isSameDay(date, addDays(easter, -48))) {
    return { isHoliday: true, name: 'Segunda-feira de Carnaval', type: 'moving' };
  }
  if (isSameDay(date, addDays(easter, -47))) {
    return { isHoliday: true, name: 'Terça-feira de Carnaval', type: 'moving' };
  }
  if (isSameDay(date, addDays(easter, 60))) {
    return { isHoliday: true, name: 'Corpus Christi', type: 'moving' };
  }
  
  return { isHoliday: false, name: null, type: null };
};

// Get upcoming holidays within a given period
export const getUpcomingHolidays = (fromDate, daysAhead = 30) => {
  const endDate = addDays(fromDate, daysAhead);
  const holidays = [];
  
  let currentDate = new Date(fromDate);
  while (currentDate <= endDate) {
    const holidayInfo = getHolidayInfo(currentDate);
    if (holidayInfo?.isHoliday) {
      holidays?.push({
        date: new Date(currentDate),
        ...holidayInfo,
        daysUntil: Math.ceil((currentDate - fromDate) / (1000 * 60 * 60 * 24))
      });
    }
    currentDate = addDays(currentDate, 1);
  }
  
  return holidays;
};

export default {
  getBrazilianHolidays,
  isBrazilianHoliday,
  isBusinessDay,
  moveToNextBusinessDay,
  moveToPreviousBusinessDay,
  getBusinessDaysBetween,
  countBusinessDaysBetween,
  getHolidayInfo,
  getUpcomingHolidays,
};