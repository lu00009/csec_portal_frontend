"use client";

import React from 'react';

type RecordItem = {
  _id: string;
  date: string;
  status: 'Present' | 'Absent' | 'Excused';
  sessionTitle: string;
  startTime: string;
  endTime: string;
};

type AttendanceData = {
  week?: { records: RecordItem[] };
  month?: { records: RecordItem[] };
  overall?: { records: RecordItem[] };
};

type AttendanceProps = {
  records: AttendanceData | null;
};

const Attendance: React.FC<AttendanceProps> = ({ records }) => {
  console.log('Received attendance data:', records);

  if (!records) {
    return <div>No attendance records available.</div>;
  }

  const allRecords: RecordItem[] = [
    ...(records.week?.records || []),
    ...(records.month?.records || []),
    ...(records.overall?.records || [])
  ];

  // Deduplicate by _id
  const uniqueRecords = allRecords.filter((record, index, self) =>
    index === self.findIndex((r) => r._id === record._id)
  );

  if (uniqueRecords.length === 0) {
    return <div>No attendance records available.</div>;
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mt-3 overflow-x-auto">
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
