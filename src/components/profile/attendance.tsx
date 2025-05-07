'use client';

import { useProfileAttendanceStore } from '@/stores/profileAttendanceStore';
import React, { useEffect } from 'react';

type AttendanceProps = {
  id: string;
};

type RecordItem = {
  _id: string;
  date: string;
  status: 'Present' | 'Absent' | 'Excused';
  sessionTitle: string;
  startTime: string;
  endTime: string;
};

const Attendance: React.FC<AttendanceProps> = ({ id }) => {
  const { records, loading, fetchRecords } = useProfileAttendanceStore();

  useEffect(() => {
    if (id) fetchRecords(id);
  }, [id, fetchRecords]);

  const uniqueRecords = records.filter(
    (record: RecordItem, index: number, self: RecordItem[]) => index === self.findIndex((r) => r._id === record._id)
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (loading) {
    return <div className="text-center p-4 w-160">Loading attendance...</div>;
  }

  if (uniqueRecords.length === 0) {
    return <div className="text-center p-4 w-160">No attendance records available.</div>;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mt-3 overflow-x-auto w-160 dark:shadow-gray-900/50">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-900">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Session</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Start Time</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">End Time</th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {uniqueRecords.map((record: RecordItem) => (
            <tr key={record._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                {formatDate(record.date)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {record.sessionTitle}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {record.startTime}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                {record.endTime}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default Attendance;
