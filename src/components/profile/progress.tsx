'use client';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useAttendanceStore } from '@/stores/progressStore';
import { AlertCircle } from "lucide-react";
import { useEffect } from 'react';

interface AttendanceProgressProps {
  id: string;
}

export default function AttendanceProgress({ id }: AttendanceProgressProps) {
  const { attendanceData, loading, error, fetchAttendanceData } = useAttendanceStore();

  useEffect(() => {
    if (id) fetchAttendanceData(id);
  }, [id, fetchAttendanceData]);

  if (loading) {
    return <div className='w-160'>Loading attendance data...</div>;
  }

  if (error) {
    return (
      <Alert variant="destructive" className="w-160">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  const overallPercentage = attendanceData
    ? Math.round(((attendanceData?.lastWeek || 0) + (attendanceData?.lastMonth || 0)) / 2)
    : 75;

  const presentPercentage = attendanceData?.overall || 0;
  const absentPercentage = 100 - presentPercentage;

  const progressData = attendanceData?.progressData || [
    {
      label: 'Heads Up',
      percent: 50,
      color: '#003087',
      par: `1 notifications`,
    },
    {
      label: 'Present',
      percent: presentPercentage,
      color: '#003087',
      par: `0/2 sessions`,
    },
    {
      label: 'Absent',
      percent: absentPercentage,
      color: '#003087',
      par: `2 sessions`,
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 max-w-3xl rounded-xl shadow-md p-6 w-160 dark:border dark:border-gray-700 transition-colors duration-200">
      {/* Main Progress Section */}
      <div className="text-center mb-8">
        <h3 className="text-xl font-semibold mb-6 dark:text-white">Overall Attendance Progress</h3>

        {/* Big Circle Progress */}
        <div className="relative w-48 h-48 mx-auto">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              className="text-gray-200 dark:text-gray-700"
              strokeWidth="10"
              stroke="currentColor"
              fill="transparent"
              r="90"
              cx="96"
              cy="96"
            />
            <circle
              className="text-blue-900 dark:text-blue-400"
              strokeWidth="10"
              strokeDasharray={565.48}
              strokeDashoffset={565.48 - (565.48 * overallPercentage) / 100}
              strokeLinecap="round"
              stroke="currentColor"
              fill="transparent"
              r="90"
              cx="96"
              cy="96"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <p className="text-3xl font-bold text-black dark:text-white">{overallPercentage}%</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Overall</p>
          </div>
        </div>

        {/* Week/Month Stats */}
        <div className="flex justify-around mt-8">
          <div className="text-center">
            <p className="text-lg font-semibold text-black dark:text-white">
              {attendanceData?.lastWeek}%
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Last week</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-black dark:text-white">
              {attendanceData?.lastMonth}%
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Last month</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {progressData.map((item, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 h-full flex flex-col items-center dark:shadow-gray-900/50 dark:border dark:border-gray-700"
          >
            {/* Small Circle Progress */}
            <div className="relative w-20 h-20 mb-2">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  className="text-gray-200 dark:text-gray-700"
                  strokeWidth="8"
                  stroke="currentColor"
                  fill="transparent"
                  r="36"
                  cx="40"
                  cy="40"
                />
                <circle
                  className=""
                  strokeWidth="8"
                  strokeDasharray={226.2}
                  strokeDashoffset={226.2 - (226.2 * item.percent) / 100}
                  strokeLinecap="round"
                  stroke={item.color}
                  fill="transparent"
                  r="36"
                  cx="40"
                  cy="40"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-semibold text-sm dark:text-white">{item.percent}%</span>
              </div>
            </div>

            <h4 className="text-md font-semibold mb-1 dark:text-gray-200">{item.label}</h4>
          </div>
        ))}
      </div>
    </div>
  );
}