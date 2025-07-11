
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Upload } from 'lucide-react';

interface AttendanceInputProps {
  inputData: string;
  setInputData: (data: string) => void;
  dailyHours: string;
  setDailyHours: (hours: string) => void;
  onParseData: () => void;
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onLoadSample: () => void;
}

export const AttendanceInput: React.FC<AttendanceInputProps> = ({
  inputData,
  setInputData,
  dailyHours,
  setDailyHours,
  onParseData,
  onFileUpload,
  onLoadSample
}) => {
  return (
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
            onChange={(e) => setDailyHours(e.target.value || "08:00")}
            className="w-32"
          />
        </div>
        
        <div className="flex gap-2">
          <Input
            type="file"
            accept=".csv,.txt"
            onChange={onFileUpload}
            className="flex-1"
          />
          <Button onClick={onLoadSample} variant="outline">
            Load Sample
          </Button>
        </div>

        <Textarea
          placeholder="Or paste your CSV data here...&#10;Example:&#10;Date,Hours&#10;2024-01-01,8.5&#10;2024-01-02,7.5"
          value={inputData}
          onChange={(e) => setInputData(e.target.value)}
          rows={6}
        />

        <Button onClick={onParseData} className="w-full">
          Calculate Timesheet
        </Button>
      </CardContent>
    </Card>
  );
};
