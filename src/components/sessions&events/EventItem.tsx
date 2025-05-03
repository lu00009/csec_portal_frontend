import { calculateStatus, getTimeLeft } from '@/utils/date';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

type EventItemProps = {
  item: {
    status: 'planned' | 'ongoing' | 'ended';
    category: string;
    eventTitle: string;
    startDate: string;
    endDate: string;
    visibility: 'public' | 'members';
    timeRemaining: string;
    venue: string;
    _id: string;
    groups: string[];
    startTime: string;
    endTime: string;
    division: string;
    attendance: string; 
  };
  onEdit: (item: EventItemProps['item']) => void;
  onDelete: (id: string) => void;
};

const EventItem = ({ item, onEdit, onDelete }: EventItemProps) => {
  const statusColors = {
    planned: 'bg-yellow-50 text-yellow-400',
    ongoing: 'bg-blue-50 text-blue-400',
    ended: 'bg-red-50 text-red-400'
  };
   const status = calculateStatus(item.startDate, item.endDate);
    const timeRemaining = getTimeLeft(item.startDate, item.endDate);
    const statusColorsDark = {
      active: 'bg-green-800 text-green-100',
      upcoming: 'bg-blue-800 text-blue-100',
      completed: 'bg-gray-700 text-gray-200',
      cancelled: 'bg-red-800 text-red-100',
    };
   

    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 md:p-6 dark:shadow-xl dark:border dark:border-gray-700">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-start gap-4">
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              <div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[status]} dark:${
                  statusColorsDark[status] || 'bg-gray-700 text-gray-200'
                }`}>
                  {status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown'}
                </span>
              </div>
              <div>
                <h2 className="text-lg md:text-xl font-bold dark:text-gray-100">{item.eventTitle}</h2>
              </div>
            </div>
            <p className="font-medium mt-2 text-gray-800 dark:text-gray-300">{item.division}</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{item.startDate}</p>
            <div className="mt-2">
              <span className={`text-xs px-2 py-1 rounded ${
                item.visibility === 'public' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' 
                  : 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100'
              }`}>
                {item.visibility === 'public' ? 'Public' : 'Members Only'}
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="font-bold text-sm md:text-base dark:text-gray-200">{timeRemaining}</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Venue: {item.venue}</p>
          </div>
        </div>
        
        <div className="mt-4 flex justify-end">
          <div className="flex gap-2">
            <button 
              onClick={() => onEdit(item)}
              className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
            >
              <FiEdit2 size={18} />
            </button>
            <button 
              onClick={() => onDelete(item._id)}
              className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200"
            >
              <FiTrash2 size={18} />
            </button>
          </div>
        </div>
      </div>
    );
  };
export default EventItem;