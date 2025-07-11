
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, CheckCircle, Calendar } from 'lucide-react';
import { AttendanceRecord } from '@/types/attendance';
import { minutesToTimeString } from '@/utils/timeUtils';

interface SummaryDashboardProps {
  data: AttendanceRecord[];
}

export const SummaryDashboard: React.FC<SummaryDashboardProps> = ({ data }) => {
  const stats = data.reduce((acc, record) => {
    acc.totalDays++;
    acc.totalMinutesLogged += record.loggedMinutes;
    
    // Only include working days in the calculations
    const isWorkingDay = !record.isWeekend && !record.isHoliday;
    
    if (isWorkingDay) {
      acc.workingDays++;
      acc.totalDifferenceMinutes += record.differenceMinutes;
    } else if (record.isWeekend && record.loggedMinutes > 0) {
      // Weekend work counts as ahead
      acc.totalDifferenceMinutes += record.loggedMinutes;
    }

    switch (record.status) {
      case 'ahead':
        if (isWorkingDay) acc.daysAhead++;
        break;
      case 'lagging':
        if (isWorkingDay) acc.daysLagging++;
        break;
      case 'ontrack':
        if (isWorkingDay) acc.daysOnTrack++;
        break;
      case 'weekend':
        acc.weekends++;
        break;
      case 'holiday':
        acc.holidays++;
        break;
    }

    return acc;
  }, {
    totalDays: 0,
    workingDays: 0,
    daysAhead: 0,
    daysLagging: 0,
    daysOnTrack: 0,
    weekends: 0,
    holidays: 0,
    totalMinutesLogged: 0,
    totalDifferenceMinutes: 0
  });

  const formatTimeDifference = (minutes: number) => {
    const sign = minutes > 0 ? '+' : '';
    return `${sign}${minutesToTimeString(minutes)}`;
  };

  const getOverallStatus = () => {
    if (stats.totalDifferenceMinutes > 0) {
      return { status: 'ahead', color: 'text-green-600', bgColor: 'bg-green-50' };
    } else if (stats.totalDifferenceMinutes < 0) {
      return { status: 'behind', color: 'text-red-600', bgColor: 'bg-red-50' };
    } else {
      return { status: 'on track', color: 'text-yellow-600', bgColor: 'bg-yellow-50' };
    }
  };

  const overallStatus = getOverallStatus();

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Working Days</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.workingDays}</div>
          <p className="text-xs text-muted-foreground">
            Out of {stats.totalDays} total days
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Hours Ahead</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {stats.totalDifferenceMinutes > 0 ? formatTimeDifference(stats.totalDifferenceMinutes) : '0 min'}
          </div>
          <div className="flex items-center gap-2">
            <p className="text-xs text-muted-foreground">Extra working time</p>
            <Badge className="bg-green-100 text-green-800 text-xs">
              {stats.workingDays > 0 ? ((stats.daysAhead / stats.workingDays) * 100).toFixed(0) : 0}%
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Hours Behind</CardTitle>
          <TrendingDown className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">
            {stats.totalDifferenceMinutes < 0 ? formatTimeDifference(stats.totalDifferenceMinutes) : '0 min'}
          </div>
          <div className="flex items-center gap-2">
            <p className="text-xs text-muted-foreground">Missing working time</p>
            <Badge className="bg-red-100 text-red-800 text-xs">
              {stats.workingDays > 0 ? ((stats.daysLagging / stats.workingDays) * 100).toFixed(0) : 0}%
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card className={overallStatus.bgColor}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Overall Status</CardTitle>
          <CheckCircle className={`h-4 w-4 ${overallStatus.color}`} />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${overallStatus.color}`}>
            {formatTimeDifference(stats.totalDifferenceMinutes)}
          </div>
          <p className="text-xs text-muted-foreground">
            Total time {overallStatus.status}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
