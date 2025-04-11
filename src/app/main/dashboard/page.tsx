import CalendarSidebar from "@/components/home/CalendarSidebar";
import StatsPage from "@/components/home/statsCard";
import UpcomingEvent from "@/components/home/UpcomingEvent";
import AttendanceOverview from "@/components/home/attendanceOverview";

export default function Dashboard() {
  return (
    <div className="bg-gray-50 min-h-screen flex">
   
    
    {/* Main content area */}
    <div className="flex-1 w-[800px] h-[50px]">
     
      <UpcomingEvent />
      <StatsPage />
      <AttendanceOverview />
      <div className="absolute right-0 top-20 h-full w-[300px] bg-white  shadow-sm border-l border-gray-200  overflow-y-auto ">
      <CalendarSidebar />
    </div>
    </div>
  </div>
  );
}