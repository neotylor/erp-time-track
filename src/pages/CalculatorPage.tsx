import React from 'react';
import { useAttendanceData } from '@/hooks/useAttendanceData';
import { AttendanceInput } from '@/components/AttendanceInput';
import { AttendanceResults } from '@/components/AttendanceResults';
import { CheerUpAnimation } from '@/components/CheerUpAnimation';

const CalculatorPage = () => {
  const {
    inputData,
    setInputData,
    attendanceData,
    dailyHours,
    setDailyHours,
    selectedMonth,
    setSelectedMonth,
    selectedYear,
    setSelectedYear,
    showCalendarView,
    setShowCalendarView,
    showCheerUp,
    handleParseData,
    handleSampleData,
    handleFileUpload
  } = useAttendanceData();

  return (
    <div className="min-h-screen bg-background p-4 pb-20 md:pb-4">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">ERP Timesheet Calculator</h1>
          <p className="text-muted-foreground">
            Upload your attendance data and track your progress against expected hours
          </p>
        </div>

        <AttendanceInput
          inputData={inputData}
          setInputData={setInputData}
          dailyHours={dailyHours}
          setDailyHours={setDailyHours}
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          onParseData={handleParseData}
          onFileUpload={handleFileUpload}
          onLoadSample={handleSampleData}
        />

        {attendanceData.length > 0 && (
          <AttendanceResults
            data={attendanceData}
            showCalendarView={showCalendarView}
            onViewToggle={setShowCalendarView}
          />
        )}

        {showCheerUp && <CheerUpAnimation />}
      </div>
    </div>
  );
};

export default CalculatorPage;