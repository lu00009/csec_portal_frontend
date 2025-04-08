// components/CalendarSidebar.tsx
'use client';

import { useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

const CalendarSidebar = () => {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 6, 6)); // July 6, 2025
  const [events] = useState([
    {
      date: new Date(2025, 6, 6), // July 6, 2025
      events: [
        { time: '09:30', division: 'CPD', title: 'Contest in CPD Division' },
        { time: '12:00', division: 'Development Division', title: 'Development Weekly Sessions' },
        { time: '01:30', division: 'Cyber', title: 'Cyber Weekly Sessions' },
      ],
    },
    {
      date: new Date(2025, 6, 7), // July 7, 2025
      events: [
        { time: '09:30', division: 'Data Science', title: 'Data Science Weekly Sessions' },
        { time: '11:00', division: 'CPD', title: 'Contest Analysis in CPD Division' },
      ],
    },
  ]);

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const renderCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);

    const days = [];
    
    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="w-8 h-8"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const isCurrentDay = day === currentDate.getDate() && month === new Date().getMonth() && year === new Date().getFullYear();
      days.push(
        <div 
          key={`day-${day}`}
          className={`w-8 h-8 flex items-center justify-center rounded-full ${
            isCurrentDay ? 'bg-blue-500 text-white' : 'hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  const changeMonth = (increment: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + increment, 1));
  };

  const currentEvents = events.find(event => 
    event.date.getDate() === currentDate.getDate() && 
    event.date.getMonth() === currentDate.getMonth() && 
    event.date.getFullYear() === currentDate.getFullYear()
  )?.events || [];

  return (
    <div className="w-full p-4">
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">Session</h2>
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => changeMonth(-1)} className="p-1 rounded-full hover:bg-blue-300 dark:hover:bg-blue-300">
            <FiChevronLeft />
          </button>
          <span className="font-medium">
            {monthNames[currentDate.getMonth()]}, {currentDate.getFullYear()}
          </span>
          <button onClick={() => changeMonth(1)} className="p-1 rounded-full hover:bg-blue-300 dark:hover:bg-blue-300">
            <FiChevronRight />
          </button>
        </div>
        
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map(day => (
            <div key={day} className="text-center text-[12px] font-medium w-8">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-1 text-[13px]">
          {renderCalendar()}
        </div>
      </div>
      <div className="mt-6">
        <h3 className="font-bold mb-2 text-[15px]">
          {currentDate.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </h3>
        
        {currentEvents.length > 0 ? (
          <div className="space-y-4">
            {currentEvents.map((event, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-3 py-1">
                <div className="font-medium text-[15px]">{event.time} <span className="text-blue-500">{event.division}</span></div>
                <div className="text-sm text-gray-600 dark:text-gray-300 ">{event.title}</div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">No events scheduled</p>
        )}
      </div>
    </div>
  );
};

export default CalendarSidebar;