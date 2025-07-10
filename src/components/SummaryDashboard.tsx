import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, CheckCircle, Calendar } from 'lucide-react';
import { AttendanceRecord } from '@/pages/Index';

interface SummaryDashboardProps {
  data: AttendanceRecord[];
}

export const SummaryDashboard: React.FC<SummaryDashboardProps> = ({ data }) => {
  const stats = data.reduce((acc, record) => {
    acc.totalDays++;
    acc.totalHoursLogged += record.loggedHours;
    acc.totalDifference += record.difference;

    switch (record.status) {
      case 'ahead':
        acc.daysAhead++;
        break;
      case 'lagging':
        acc.daysLagging++;
        break;
      case 'ontrack':
        acc.daysOnTrack++;
        break;
    }

    return acc;
  }, {
    totalDays: 0,
    daysAhead: 0,
    daysLagging: 0,
    daysOnTrack: 0,
    totalHoursLogged: 0,
    totalDifference: 0
  });

  const formatHoursDifference = (hours: number) => {
    const sign = hours > 0 ? '+' : '';
    return `${sign}${hours.toFixed(1)}h`;
  };

  const getOverallStatus = () => {
    if (stats.totalDifference > 0) {
      return { status: 'ahead', color: 'text-green-600', bgColor: 'bg-green-50' };
    } else if (stats.totalDifference < 0) {
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
          <CardTitle className="text-sm font-medium">Total Days</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalDays}</div>
          <p className="text-xs text-muted-foreground">
            Days analyzed
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Days Ahead</CardTitle>
          <TrendingUp className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{stats.daysAhead}</div>
          <div className="flex items-center gap-2">
            <p className="text-xs text-muted-foreground">Days with extra hours</p>
            <Badge className="bg-green-100 text-green-800 text-xs">
              {((stats.daysAhead / stats.totalDays) * 100).toFixed(0)}%
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Days Behind</CardTitle>
          <TrendingDown className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{stats.daysLagging}</div>
          <div className="flex items-center gap-2">
            <p className="text-xs text-muted-foreground">Days with fewer hours</p>
            <Badge className="bg-red-100 text-red-800 text-xs">
              {((stats.daysLagging / stats.totalDays) * 100).toFixed(0)}%
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
            {formatHoursDifference(stats.totalDifference)}
          </div>
          <p className="text-xs text-muted-foreground">
            Total hours {overallStatus.status}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};