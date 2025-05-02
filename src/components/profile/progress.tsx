'use client';
import { useAttendanceStore } from '@/stores/progressStore';
import { useEffect } from 'react';

interface AttendanceProgressProps {
  id: string;
}

export default function AttendanceProgress({ id }: AttendanceProgressProps) {
  const { attendanceData, loading, fetchAttendanceData } = useAttendanceStore();

  useEffect(() => {
    console.log('AttendanceProgress component mounted with id:', id);
    if (id) {
      fetchAttendanceData(id);
    }
  }, [id, fetchAttendanceData]);

  if (loading) {
    return <div className='w-160'>Loading attendance data...</div>;
  }

  const overallPercentage = attendanceData
    ? Math.round(((attendanceData?.lastWeek || 0) + (attendanceData?.lastMonth || 0)) / 2)
    : 75;

  const presentPercentage = attendanceData?.overall?.percentage || 0;
  const absentPercentage = 100 - presentPercentage;

  const progressData = [
    {
      label: 'Heads Up',
      percent: attendanceData?.overall?.headsUp?.percentage || 50,
      color: '#003087',
      par: `${attendanceData?.overall?.headsUp?.count || 1} notifications`,
    },
    {
      label: 'Present',
      percent: presentPercentage,
      color: '#003087',
      par: `${attendanceData?.overall?.present || 0}/${attendanceData?.overall?.total || 2} sessions`,
    },
    {
      label: 'Absent',
      percent: absentPercentage,
      color: '#003087',
      par: `${(attendanceData?.overall?.total || 2) - (attendanceData?.overall?.present || 0)} sessions`,
    },
  ];

  return (
    <div className="bg-white max-w-3xl rounded-xl shadow-md p-6 w-160">
      {/* Main Progress Section */}
      <div className="text-center mb-8">
        <h3 className="text-xl font-semibold mb-6">Overall Attendance Progress</h3>

        {/* Big Circle Progress */}
        <div className="relative w-48 h-48 mx-auto">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              className="text-gray-200"
              strokeWidth="10"
              stroke="currentColor"
              fill="transparent"
              r="90"
              cx="96"
              cy="96"
            />
            <circle
              className="text-blue-900"
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
            <p className="text-3xl font-bold text-black">{overallPercentage}%</p>
            <p className="text-gray-500 text-sm">Overall</p>
          </div>
        </div>

        {/* Week/Month Stats */}
        <div className="flex justify-around mt-8">
          <div className="text-center">
            <p className="text-lg font-semibold text-black">
              {attendanceData?.lastWeek}%
            </p>
            <p className="text-gray-500 text-sm">Last week</p>
          </div>
          <div className="text-center">
            <p className="text-lg font-semibold text-black">
              {attendanceData?.lastMonth}%
            </p>
            <p className="text-gray-500 text-sm">Last month</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {progressData.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow p-4 h-full flex flex-col items-center"
          >
            {/* Small Circle Progress */}
            <div className="relative w-20 h-20 mb-2">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  className="text-gray-200"
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
                <span className="font-semibold text-sm">{item.percent}%</span>
              </div>
            </div>

            <h4 className="text-md font-semibold mb-1">{item.label}</h4>
          </div>
        ))}
      </div>
    </div>
  );
}
