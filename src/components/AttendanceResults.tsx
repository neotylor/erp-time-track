
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
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

  return (
    <>
      <SummaryDashboard data={data} />

      <Card>
        <CardHeader>
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
          {data.length > 0 ? (
            showCalendarView ? (
              <TimesheetCalendar data={data} />
            ) : (
              <TimesheetTable data={data} />
            )
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No data available
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};
