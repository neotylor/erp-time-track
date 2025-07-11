import React from 'react';
import { AttendanceRecord } from '@/pages/Index';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface TimesheetCalendarProps {
  data: AttendanceRecord[];
}

export const TimesheetCalendar: React.FC<TimesheetCalendarProps> = ({ data }) => {
  // Group data by month for better organization
  const groupedData = data.reduce((acc, record) => {
    const date = new Date(record.date);
    const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
    if (!acc[monthKey]) {
      acc[monthKey] = [];
    }
    acc[monthKey].push(record);
    return acc;
  }, {} as Record<string, AttendanceRecord[]>);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ahead':
        return 'bg-green-500 hover:bg-green-600';
      case 'lagging':
        return 'bg-red-500 hover:bg-red-600';
      case 'ontrack':
        return 'bg-yellow-500 hover:bg-yellow-600';
      case 'weekend':
        return 'bg-blue-500 hover:bg-blue-600';
      case 'holiday':
        return 'bg-purple-500 hover:bg-purple-600';
      default:
        return 'bg-muted';
    }
  };

  const getStatusEmoji = (status: string) => {
    switch (status) {
      case 'ahead':
        return '🟢';
      case 'lagging':
        return '🔴';
      case 'ontrack':
        return '🟡';
      case 'weekend':
        return '🏖️';
      case 'holiday':
        return '🏝️';
      default:
        return '⚪';
    }
  };

  const formatTooltipContent = (record: AttendanceRecord) => {
    return `${record.date}\nLogged: ${record.loggedHoursDisplay}\nDifference: ${record.differenceDisplay}\nStatus: ${record.status}`;
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {Object.entries(groupedData).map(([monthKey, records]) => {
          const firstDate = new Date(records[0].date);
          const monthName = firstDate.toLocaleString('default', { month: 'long', year: 'numeric' });

          return (
            <div key={monthKey} className="space-y-3">
              <h3 className="text-lg font-semibold">{monthName}</h3>
              <div className="grid grid-cols-7 gap-2">
                {/* Day headers */}
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
                    {day}
                  </div>
                ))}
                
                {/* Calendar days */}
                {records.map((record, index) => {
                  const date = new Date(record.date);
                  const dayOfWeek = date.getDay();
                  
                  return (
                    <React.Fragment key={index}>
                      {/* Add empty cells for proper alignment if needed (only for first item) */}
                      {index === 0 && [...Array(dayOfWeek)].map((_, i) => (
                        <div key={`empty-${i}`} className="p-2"></div>
                      ))}
                      
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className={`
                            relative p-3 rounded-lg cursor-pointer transition-all duration-200 text-center
                            ${getStatusColor(record.status)} text-white min-h-[60px] flex flex-col items-center justify-center
                          `}>
                            <div className="text-xs font-medium">
                              {date.getDate()}
                            </div>
                            <div className="text-lg">
                              {getStatusEmoji(record.status)}
                            </div>
                            <div className="text-xs">
                              {record.loggedHoursDisplay}
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="whitespace-pre-line">
                            {formatTooltipContent(record)}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </TooltipProvider>
  );
};