import React from 'react';
import { FiUsers, FiLayers, FiCalendar, FiClock } from 'react-icons/fi';

interface StatsCardProps {
  title: string;
  value: number | string;
  percentage: number;
  updateDate: string;
  icon: React.ReactNode;
  iconBgColor: string;
  iconColor: string;
  percentageColor: string;
  percentageBgColor: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  percentage,
  updateDate,
  icon,
  iconBgColor,
  iconColor,
  percentageColor,
  percentageBgColor
}) => {
  return (
    <div className="bg-white p-6 rounded-sm shadow-md w-64 h-40">
      <div className='flex flex-row'>
        <div className={`${iconBgColor} w-[40px] h-[40px] rounded-md flex items-center justify-center`}>
          {React.cloneElement(icon as React.ReactElement, { className: `${iconColor} text-lg` })}
        </div>
        <div className="text-black text-sm font-medium ml-3 mt-2">{title}</div>
      </div>
      
      <div className='flex flex-row justify-between items-center mt-4'>
        <h1 className="text-3xl font-bold text-black">{value}</h1>
        <div className={`flex flex-row gap-1 ${percentageBgColor} px-2 py-1 rounded-md`}>
          {percentage >= 0 ? (
            <span className={`${percentageColor} text-xs font-medium`}>+{percentage}%</span>
          ) : (
            <span className={`${percentageColor} text-xs font-medium`}>{percentage}%</span>
          )}
        </div>
      </div>
      
      <div className="text-gray-400 text-xs mt-4">Update: {updateDate}</div>
    </div>
  );
};

const StatsPage = () => {
  return (
  
    <div className="grid sm:grid-cols-2 w-[550px] gap-3 m-6">
       <StatsCard 
          title="Total Members"
          value={162}
          percentage={12}
          updateDate="July 16, 2025"
          icon={<FiUsers />}
          iconBgColor="bg-[#7152F30D]"
          iconColor="text-[#7152F3]"
          percentageColor="text-[#30BE82]"
          percentageBgColor="bg-[#30BE821A]"
        />
        
        <StatsCard 
          title="Total Divisions"
          value={5}
          percentage={5}
          updateDate="July 14, 2025"
          icon={<FiLayers />}
          iconBgColor="bg-[#FF7A2F0D]"
          iconColor="text-[#FF7A2F]"
          percentageColor="text-[#FF7A2F]"
          percentageBgColor="bg-[#FF7A2F1A]"
        />
        
        <StatsCard 
          title="Attendance Rate"
          value="68%"
          percentage={8}
          updateDate="July 14, 2023"
          icon={<FiCalendar />}
          iconBgColor="bg-[#3AC9D60D]"
          iconColor="text-[#3AC9D6]"
          percentageColor="text-[#3AC9D6]"
          percentageBgColor="bg-[#3AC9D61A]"
        />
        
        <StatsCard 
          title="Upcoming Sessions"
          value={12}
          percentage={12}
          updateDate="July 10, 2025"
          icon={<FiClock />}
          iconBgColor="bg-[#FFC7360D]"
          iconColor="text-[#FFC736]"
          percentageColor="text-[#FFC736]"
          percentageBgColor="bg-[#FFC7361A]"
        />
      </div>
  
  );
};

export default StatsPage;