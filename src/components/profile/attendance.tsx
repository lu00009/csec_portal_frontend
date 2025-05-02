'use client';

import React, { useEffect } from 'react';
import { useAttendanceStore } from '@/stores/profileAttendancsStore';

type AttendanceProps = {
  id: string;
};

const Attendance: React.FC<AttendanceProps> = ({ id }) => {
  const { records, loading, fetchRecords } = useAttendanceStore();

  useEffect(() => {
    if (id) fetchRecords(id);
  }, [id, fetchRecords]);

  const uniqueRecords = records.filter(
    (record, index, self) => index === self.findIndex((r) => r._id === record._id)
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
    <div className="bg-white rounded-lg shadow-sm p-6 mt-3 overflow-x-auto w-160">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Session</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Time</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">End Time</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {uniqueRecords.map((record) => (
            <tr key={record._id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {formatDate(record.date)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {record.sessionTitle}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {record.startTime}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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
