import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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
  // Initialize with the first date's month/year or current date
  const initialDate = data.length > 0 ? new Date(data[0].date) : new Date();
  const [selectedMonth, setSelectedMonth] = useState(initialDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(initialDate.getFullYear());

  // Get available years from data
  const availableYears = useMemo(() => {
    const years = new Set<number>();
    data.forEach(record => {
      const date = new Date(record.date);
      years.add(date.getFullYear());
    });
    return Array.from(years).sort((a, b) => a - b);
  }, [data]);

  // Filter data based on selected month and year
  const filteredData = useMemo(() => {
    return data.filter(record => {
      const date = new Date(record.date);
      return date.getMonth() === selectedMonth && date.getFullYear() === selectedYear;
    });
  }, [data, selectedMonth, selectedYear]);

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const handlePreviousMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear(prev => prev - 1);
    } else {
      setSelectedMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear(prev => prev + 1);
    } else {
      setSelectedMonth(prev => prev + 1);
    }
  };

  return (
    <>
      <SummaryDashboard data={data} />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-4">
            <CardTitle>Attendance Results</CardTitle>
            <div className="flex items-center gap-4 flex-wrap">
              {/* Month/Year Navigation */}
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handlePreviousMonth}
                  className="h-8 w-8"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <Select
                  value={selectedMonth.toString()}
                  onValueChange={(value) => setSelectedMonth(parseInt(value))}
                >
                  <SelectTrigger className="w-[130px] h-8">
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

                <Select
                  value={selectedYear.toString()}
                  onValueChange={(value) => setSelectedYear(parseInt(value))}
                >
                  <SelectTrigger className="w-[100px] h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableYears.map((year) => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleNextMonth}
                  className="h-8 w-8"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              {/* View Toggle */}
              <div className="flex items-center gap-2">
                <Label htmlFor="view-toggle">Calendar View</Label>
                <Switch
                  id="view-toggle"
                  checked={showCalendarView}
                  onCheckedChange={onViewToggle}
                />
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
