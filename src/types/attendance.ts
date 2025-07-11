
export interface AttendanceRecord {
  date: string;
  loggedMinutes: number;
  loggedHoursDisplay: string;
  status: 'ahead' | 'lagging' | 'ontrack' | 'weekend' | 'holiday';
  differenceMinutes: number;
  differenceDisplay: string;
  isWeekend?: boolean;
  isHoliday?: boolean;
}
