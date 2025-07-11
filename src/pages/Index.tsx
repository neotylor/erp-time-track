import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Upload, Calendar, Table, TrendingUp, TrendingDown, CheckCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { toast } from 'sonner';
import Papa from 'papaparse';
import { TimesheetTable } from '@/components/TimesheetTable';
import { TimesheetCalendar } from '@/components/TimesheetCalendar';
import { SummaryDashboard } from '@/components/SummaryDashboard';
import { CheerUpAnimation } from '@/components/CheerUpAnimation';

// Configuration - In a real app, this would come from environment variables
const DEFAULT_DAILY_HOURS = "08:00";

export interface AttendanceRecord {
  date: string;
  loggedHours: number;
  loggedHoursDisplay: string;
  status: 'ahead' | 'lagging' | 'ontrack' | 'weekend' | 'holiday';
  difference: number;
  differenceDisplay: string;
  isWeekend?: boolean;
  isHoliday?: boolean;
}

const Index = () => {
  const [inputData, setInputData] = useState('');
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [dailyHours, setDailyHours] = useState(DEFAULT_DAILY_HOURS);
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

  const parseTimeToHours = (timeStr: string): number => {
    if (timeStr.trim() === '0 min') return 0;
    
    const hourMatch = timeStr.match(/(\d+)\s*hrs?/);
    const minMatch = timeStr.match(/(\d+)\s*min/);
    
    const hours = hourMatch ? parseInt(hourMatch[1]) : 0;
    const minutes = minMatch ? parseInt(minMatch[1]) : 0;
    
    return hours + (minutes / 60);
  };

  const parseTimeStringToMinutes = (timeStr: string): number => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const minutesToTimeString = (minutes: number): string => {
    const hours = Math.floor(Math.abs(minutes) / 60);
    const mins = Math.abs(minutes) % 60;
    
    if (minutes === 0) return '0 min';
    if (hours === 0) return `${minutes < 0 ? '-' : ''}${mins} min`;
    if (mins === 0) return `${minutes < 0 ? '-' : ''}${hours} hr${hours !== 1 ? 's' : ''}`;
    
    return `${minutes < 0 ? '-' : ''}${hours} hr${hours !== 1 ? 's' : ''}, ${mins} min`;
  };

  const formatDifferenceTime = (minutes: number): string => {
    if (minutes === 0) return '0 min';
    const sign = minutes > 0 ? '+' : '';
    return `${sign}${minutesToTimeString(minutes)}`;
  };

  const parseAttendanceData = (data: string) => {
    try {
      const records: AttendanceRecord[] = [];
      let totalWorkingMinutesAhead = 0;
      let totalWorkingMinutesBehind = 0;

      // Check if input contains time format (hrs, min)
      if (data.includes('hrs') || data.includes('min')) {
        // Parse time-based input
        const timeEntries = data.split('\t').map(entry => entry.trim()).filter(entry => entry);
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth();
        const currentYear = currentDate.getFullYear();
        const dailyMinutes = parseTimeStringToMinutes(dailyHours);
        
        timeEntries.forEach((timeEntry, index) => {
          const dayOfMonth = index + 1;
          const date = new Date(currentYear, currentMonth, dayOfMonth);
          const dayOfWeek = date.getDay();
          const loggedHours = parseTimeToHours(timeEntry);
          const loggedMinutes = Math.round(loggedHours * 60);
          
          // Determine if it's a working day, weekend, or holiday
          const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; // Sunday = 0, Saturday = 6
          const isHoliday = loggedMinutes === 0 && !isWeekend; // 0 min on weekday = holiday
          
          let status: 'ahead' | 'lagging' | 'ontrack' | 'weekend' | 'holiday';
          let differenceMinutes = 0;
          
          if (isWeekend) {
            status = loggedMinutes > 0 ? 'ahead' : 'weekend';
            differenceMinutes = loggedMinutes; // Any minutes on weekend are extra
            if (loggedMinutes > 0) {
              totalWorkingMinutesAhead += loggedMinutes;
            }
          } else if (isHoliday) {
            status = 'holiday';
            differenceMinutes = 0;
          } else {
            // Regular working day
            differenceMinutes = loggedMinutes - dailyMinutes;
            if (differenceMinutes > 0) {
              status = 'ahead';
              totalWorkingMinutesAhead += differenceMinutes;
            } else if (differenceMinutes < 0) {
              status = 'lagging';
              totalWorkingMinutesBehind += Math.abs(differenceMinutes);
            } else {
              status = 'ontrack';
            }
          }

          records.push({
            date: date.toLocaleDateString('en-CA'),
            loggedHours,
            loggedHoursDisplay: minutesToTimeString(loggedMinutes),
            status: status as 'ahead' | 'lagging' | 'ontrack',
            difference: differenceMinutes / 60, // Keep for backward compatibility
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
                totalWorkingMinutesAhead += differenceMinutes;
              } else if (differenceMinutes < 0) {
                status = 'lagging';
                totalWorkingMinutesBehind += Math.abs(differenceMinutes);
              } else {
                status = 'ontrack';
              }

              records.push({
                date: dateField.toString(),
                loggedHours,
                loggedHoursDisplay: minutesToTimeString(loggedMinutes),
                status,
                difference: differenceMinutes / 60, // Keep for backward compatibility
                differenceDisplay: formatDifferenceTime(differenceMinutes)
              });
            }
          }
        });
      }

      if (records.length === 0) {
        throw new Error('No valid attendance data found');
      }

      setAttendanceData(records);
      
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

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">ERP Timesheet Calculator</h1>
          <p className="text-muted-foreground">
            Upload your attendance data and track your progress against expected hours
          </p>
        </div>

        {/* Input Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Input Attendance Data
            </CardTitle>
            <CardDescription>
              Upload CSV file or paste attendance data from your ERP portal
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Label htmlFor="dailyHours">Expected Daily Hours:</Label>
              <Input
                id="dailyHours"
                type="time"
                value={dailyHours}
                onChange={(e) => setDailyHours(e.target.value || DEFAULT_DAILY_HOURS)}
                className="w-32"
              />
            </div>
            
            <div className="flex gap-2">
              <Input
                type="file"
                accept=".csv,.txt"
                onChange={handleFileUpload}
                className="flex-1"
              />
              <Button onClick={handleSampleData} variant="outline">
                Load Sample
              </Button>
            </div>

            <Textarea
              placeholder="Or paste your CSV data here...&#10;Example:&#10;Date,Hours&#10;2024-01-01,8.5&#10;2024-01-02,7.5"
              value={inputData}
              onChange={(e) => setInputData(e.target.value)}
              rows={6}
            />

            <Button onClick={() => parseAttendanceData(inputData)} className="w-full">
              Calculate Timesheet
            </Button>
          </CardContent>
        </Card>

        {/* Results Section */}
        {attendanceData.length > 0 && (
          <>
            <SummaryDashboard data={attendanceData} />

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Attendance Results</CardTitle>
                  <div className="flex items-center gap-2">
                    <Label htmlFor="view-toggle">Calendar View</Label>
                    <Switch
                      id="view-toggle"
                      checked={showCalendarView}
                      onCheckedChange={setShowCalendarView}
                    />
                  </div>
                </div>
                <CardDescription>
                  <div className="flex gap-4 items-center flex-wrap">
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Ahead</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-sm">Lagging</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm">On Track</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">Weekend</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                      <span className="text-sm">Holiday</span>
                    </div>
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                {showCalendarView ? (
                  <TimesheetCalendar data={attendanceData} />
                ) : (
                  <TimesheetTable data={attendanceData} />
                )}
              </CardContent>
            </Card>
          </>
        )}

        {/* Cheer Up Animation */}
        {showCheerUp && <CheerUpAnimation />}
      </div>
    </div>
  );
};

export default Index;