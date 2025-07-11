
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import confetti from 'canvas-confetti';
import { AttendanceRecord } from '@/types/attendance';
import { parseAttendanceData } from '@/utils/attendanceParser';
import { minutesToTimeString } from '@/utils/timeUtils';

export const useAttendanceData = () => {
  const [inputData, setInputData] = useState('');
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [dailyHours, setDailyHours] = useState("08:00");
  const [showCalendarView, setShowCalendarView] = useState(() => {
    const saved = localStorage.getItem('timesheetViewPreference');
    return saved ? JSON.parse(saved) : false;
  });
  const [showCheerUp, setShowCheerUp] = useState(false);

  // Save view preference to localStorage
  useEffect(() => {
    localStorage.setItem('timesheetViewPreference', JSON.stringify(showCalendarView));
  }, [showCalendarView]);

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const triggerCheerUp = () => {
    setShowCheerUp(true);
    setTimeout(() => setShowCheerUp(false), 3000);
  };

  const handleParseData = () => {
    try {
      const records = parseAttendanceData(inputData, dailyHours);
      setAttendanceData(records);
      
      // Calculate overall status for working days only
      let totalWorkingMinutesAhead = 0;
      let totalWorkingMinutesBehind = 0;

      records.forEach(record => {
        const isWorkingDay = !record.isWeekend && !record.isHoliday;
        
        if (isWorkingDay) {
          if (record.differenceMinutes > 0) {
            totalWorkingMinutesAhead += record.differenceMinutes;
          } else if (record.differenceMinutes < 0) {
            totalWorkingMinutesBehind += Math.abs(record.differenceMinutes);
          }
        } else if (record.isWeekend && record.differenceMinutes > 0) {
          // Weekend work counts as ahead
          totalWorkingMinutesAhead += record.differenceMinutes;
        }
      });

      // Trigger animations based on overall working hours status
      const netMinutesDifference = totalWorkingMinutesAhead - totalWorkingMinutesBehind;
      
      if (netMinutesDifference > 0) {
        triggerConfetti();
        toast.success(`Great job! You're ${minutesToTimeString(netMinutesDifference)} ahead!`);
      } else if (netMinutesDifference < 0) {
        triggerCheerUp();
        toast.info(`Keep going! You're ${minutesToTimeString(Math.abs(netMinutesDifference))} behind, but you can catch up!`);
      } else {
        toast.success('Perfect! You\'re right on track!');
      }

    } catch (error) {
      toast.error('Failed to parse data. Please check the format.');
      console.error('Parse error:', error);
    }
  };

  const handleSampleData = () => {
    const sampleData = `Date,Hours
2024-01-01,8.5
2024-01-02,7.5
2024-01-03,8.0
2024-01-04,9.0
2024-01-05,6.5`;
    setInputData(sampleData);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setInputData(content);
      };
      reader.readAsText(file);
    }
  };

  return {
    inputData,
    setInputData,
    attendanceData,
    dailyHours,
    setDailyHours,
    showCalendarView,
    setShowCalendarView,
    showCheerUp,
    handleParseData,
    handleSampleData,
    handleFileUpload
  };
};
