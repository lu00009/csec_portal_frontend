import { FiEdit2, FiTrash2 } from 'react-icons/fi';
import { calculateStatus, getTimeLeft } from '@/utils/date';

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
    
   

  return (
    <div className="bg-white rounded-lg shadow p-4 md:p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-start gap-4">
        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
              {status ?status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown'}
              </span>
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold">{item.eventTitle}</h2>
            </div>
          </div>
          <p className="font-medium mt-2 text-gray-800">{item.division}</p>
          <p className="text-gray-500 text-sm mt-1">{item.startDate}</p>
          <div className="mt-2">
            <span className={`text-xs px-2 py-1 rounded ${item.visibility === 'public' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'}`}>
              {item.visibility === 'public' ? 'Public' : 'Members Only'}
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="font-bold text-sm md:text-base">{timeRemaining}</p>
          <p className="text-gray-500 text-sm mt-1">Venue: {item.venue}</p>
        </div>
      </div>
      
      <div className="mt-4 flex justify-end">
        <div className="flex gap-2">
          <button 
            onClick={() => onEdit(item)}
            className="text-blue-500 hover:text-blue-700"
          >
            <FiEdit2 size={18} />
          </button>
          <button 
            onClick={() => onDelete(item._id)}
            className="text-red-500 hover:text-red-700"
          >
            <FiTrash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventItem;