import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, CheckCircle } from 'lucide-react';
import { AttendanceRecord } from '@/pages/Index';

interface TimesheetTableProps {
  data: AttendanceRecord[];
}

export const TimesheetTable: React.FC<TimesheetTableProps> = ({ data }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ahead':
        return <TrendingUp className="h-4 w-4 text-green-600" />;
      case 'lagging':
        return <TrendingDown className="h-4 w-4 text-red-600" />;
      case 'ontrack':
        return <CheckCircle className="h-4 w-4 text-yellow-600" />;
      case 'weekend':
        return <span className="text-blue-600">🏖️</span>;
      case 'holiday':
        return <span className="text-purple-600">🏖️</span>;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ahead':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Ahead</Badge>;
      case 'lagging':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Lagging</Badge>;
      case 'ontrack':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">On Track</Badge>;
      case 'weekend':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Weekend</Badge>;
      case 'holiday':
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Holiday</Badge>;
      default:
        return null;
    }
  };

  const formatDifference = (difference: number) => {
    const sign = difference > 0 ? '+' : '';
    return `${sign}${difference.toFixed(1)}h`;
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Logged Hours</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Difference</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((record, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{record.date}</TableCell>
              <TableCell>{record.loggedHours.toFixed(1)}h</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {getStatusIcon(record.status)}
                  {getStatusBadge(record.status)}
                </div>
              </TableCell>
              <TableCell>
                <span className={`font-medium ${
                  record.difference > 0 ? 'text-green-600' : 
                  record.difference < 0 ? 'text-red-600' : 'text-yellow-600'
                }`}>
                  {formatDifference(record.difference)}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};