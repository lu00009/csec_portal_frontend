import { calculateStatus, getTimeLeft, Status } from '@/utils/date';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

type SessionItemProps = {
  item: {
    status?: Status; // Make it optional since we'll calculate it
    division: string;
    sessionTitle: string;
    startDate: string;
    endDate: string;
    visibility: 'public' | 'members';
    venue: string;
    groups?: string[];
    id: string;
    date: string;
  };
  onEdit: (item: SessionItemProps['item']) => void;
  onDelete: (id: string) => void;
};

const SessionItem = ({ item, onEdit, onDelete }: SessionItemProps) => {
  // Calculate status based on current time
  const status = calculateStatus(item.startDate, item.endDate) as keyof typeof statusColors;
  const timeRemaining = getTimeLeft(item.startDate, item.endDate);
  
  const statusColors = {
    planned: 'bg-yellow-50 text-yellow-400',
    ongoing: 'bg-blue-50 text-blue-400',
    ended: 'bg-red-50 text-red-400'
  };
  const statusColorsDark = {
    active: 'bg-green-900 text-green-100',
    upcoming: 'bg-blue-900 text-blue-100',
    ended: 'bg-gray-700 text-gray-200',
    // ... other status variants
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 md:p-6 dark:shadow-lg dark:border dark:border-gray-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-start gap-4">
        <div className="flex-1">
          <div className="flex flex-col md:flex-row md:items-center gap-3">
            <div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[status]} dark:${statusColorsDark[status]}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </span>
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold dark:text-white">{item.division}</h2>
            </div>
          </div>
          <p className="font-medium mt-2 text-gray-800 dark:text-gray-100">{item.sessionTitle}</p>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{item.date}</p>
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
      
      <div className="mt-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
        {item.groups && (
          <div className="flex flex-wrap gap-2">
            {item.groups.map((group: string, index: number) => (
              <span 
                key={index} 
                className="bg-gray-100 dark:bg-gray-700 dark:text-gray-200 px-2 py-1 rounded-full text-xs"
              >
                {group}
              </span>
            ))}
          </div>
        )}
        <div className="flex gap-2 ml-auto">
          <button 
            onClick={() => onEdit(item)}
            className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
          >
            <FiEdit2 size={18} />
          </button>
          <button 
            onClick={() => onDelete(item.id)}
            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200"
          >
            <FiTrash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SessionItem;