
import Papa from 'papaparse';
import { AttendanceRecord } from '@/types/attendance';
import { parseTimeToMinutes, parseTimeStringToMinutes, minutesToTimeString, formatDifferenceTime } from './timeUtils';

export const parseAttendanceData = (data: string, dailyHours: string, selectedMonth: number, selectedYear: number): AttendanceRecord[] => {
  const records: AttendanceRecord[] = [];

  // Check if input contains time format (hrs, min)
  if (data.includes('hrs') || data.includes('min')) {
    // Parse time-based input
    const timeEntries = data.split('\t').map(entry => entry.trim()).filter(entry => entry);
    const currentDate = new Date();
    const currentMonth = selectedMonth ?? currentDate.getMonth();
    const currentYear = selectedYear ?? currentDate.getFullYear();
    const dailyMinutes = parseTimeStringToMinutes(dailyHours);
    
    timeEntries.forEach((timeEntry, index) => {
      const dayOfMonth = index + 1;
      const date = new Date(currentYear, currentMonth, dayOfMonth);
      const dayOfWeek = date.getDay();
      const loggedMinutes = parseTimeToMinutes(timeEntry);
      
      // Determine if it's a working day, weekend, or holiday
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; // Sunday = 0, Saturday = 6
      const isHoliday = loggedMinutes === 0 && !isWeekend; // 0 min on weekday = holiday
      
      let status: 'ahead' | 'lagging' | 'ontrack' | 'weekend' | 'holiday';
      let differenceMinutes = 0;
      
      if (isWeekend) {
        status = loggedMinutes > 0 ? 'ahead' : 'weekend';
        differenceMinutes = loggedMinutes; // Any minutes on weekend are extra
      } else if (isHoliday) {
        status = 'holiday';
        differenceMinutes = 0;
      } else {
        // Regular working day
        differenceMinutes = loggedMinutes - dailyMinutes;
        if (differenceMinutes > 0) {
          status = 'ahead';
        } else if (differenceMinutes < 0) {
          status = 'lagging';
        } else {
          status = 'ontrack';
        }
      }

      records.push({
        date: date.toLocaleDateString('en-CA'),
        loggedMinutes,
        loggedHoursDisplay: minutesToTimeString(loggedMinutes),
        status: status as 'ahead' | 'lagging' | 'ontrack',
        differenceMinutes,
        differenceDisplay: formatDifferenceTime(differenceMinutes),
        isWeekend,
        isHoliday
      });
    });
  } else {
    // Try to parse as CSV
    const result = Papa.parse(data, {
      header: true,
      skipEmptyLines: true,
      transform: (value) => value.trim()
    });

    if (result.errors.length > 0) {
      throw new Error('CSV parsing failed');
    }

    const dailyMinutes = parseTimeStringToMinutes(dailyHours);
    result.data.forEach((row: any) => {
      // Handle different possible column names
      const dateField = row.Date || row.date || row.DATE || Object.values(row)[0];
      const hoursField = row.Hours || row.hours || row.Attendance || row.attendance || 
                        row['Logged Hours'] || row['logged hours'] || Object.values(row)[1];

      if (dateField && hoursField) {
        const loggedHours = parseFloat(hoursField.toString().replace(/[^\d.]/g, ''));
        if (!isNaN(loggedHours)) {
          const loggedMinutes = Math.round(loggedHours * 60);
          const differenceMinutes = loggedMinutes - dailyMinutes;
          let status: 'ahead' | 'lagging' | 'ontrack';
          
          if (differenceMinutes > 0) {
            status = 'ahead';
          } else if (differenceMinutes < 0) {
            status = 'lagging';
          } else {
            status = 'ontrack';
          }

          records.push({
            date: dateField.toString(),
            loggedMinutes,
            loggedHoursDisplay: minutesToTimeString(loggedMinutes),
            status,
            differenceMinutes,
            differenceDisplay: formatDifferenceTime(differenceMinutes)
          });
        }
      }
    });
  }

  if (records.length === 0) {
    throw new Error('No valid attendance data found');
  }

  return records;
};
