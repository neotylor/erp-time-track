
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TimesheetTable } from './TimesheetTable';
import { TimesheetCalendar } from './TimesheetCalendar';
import { SummaryDashboard } from './SummaryDashboard';
import { AttendanceRecord } from '@/types/attendance';

interface AttendanceResultsProps {
  data: AttendanceRecord[];
  showCalendarView: boolean;
  onViewToggle: (value: boolean) => void;
}

export const AttendanceResults: React.FC<AttendanceResultsProps> = ({
  data,
  showCalendarView,
  onViewToggle
}) => {
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const years = useMemo(() => {
    const uniqueYears = new Set<number>();
    data.forEach(record => {
      const year = new Date(record.date).getFullYear();
      uniqueYears.add(year);
    });
    const sortedYears = Array.from(uniqueYears).sort((a, b) => b - a);
    if (sortedYears.length === 0) {
      return [currentDate.getFullYear()];
    }
    return sortedYears;
  }, [data]);

  const filteredData = useMemo(() => {
    return data.filter(record => {
      const recordDate = new Date(record.date);
      return recordDate.getMonth() === selectedMonth && 
             recordDate.getFullYear() === selectedYear;
    });
  }, [data, selectedMonth, selectedYear]);

  return (
    <>
      <SummaryDashboard data={filteredData} />

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <CardTitle>Attendance Results</CardTitle>
              <div className="flex items-center gap-2">
                <Label htmlFor="view-toggle">Calendar View</Label>
                <Switch
                  id="view-toggle"
                  checked={showCalendarView}
                  onCheckedChange={onViewToggle}
                />
              </div>
            </div>
            
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Label>Month:</Label>
                <Select value={selectedMonth.toString()} onValueChange={(value) => setSelectedMonth(parseInt(value))}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((month, index) => (
                      <SelectItem key={index} value={index.toString()}>
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-2">
                <Label>Year:</Label>
                <Select value={selectedYear.toString()} onValueChange={(value) => setSelectedYear(parseInt(value))}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
          {filteredData.length > 0 ? (
            showCalendarView ? (
              <TimesheetCalendar data={filteredData} />
            ) : (
              <TimesheetTable data={filteredData} />
            )
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No data available for {months[selectedMonth]} {selectedYear}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};
