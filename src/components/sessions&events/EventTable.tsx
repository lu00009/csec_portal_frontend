import { FiEdit2, FiTrash2 } from 'react-icons/fi';

type EventTableProps = {
  items: { id: string; date: string; title: string; category: string; visibility: 'public' | 'members'; status: 'planned' | 'ongoing' | 'ended'; venue: string }[];
  onEdit: (item: { id: string; date: string; title: string; category: string; visibility: 'public' | 'members'; status: 'planned' | 'ongoing' | 'ended'; venue: string }) => void;
  onDelete: (id: string) => void;
};

const EventTable = ({ items, onEdit, onDelete }: EventTableProps) => {
  const statusColors = {
    planned: 'bg-yellow-50 text-yellow-400',
    ongoing: 'bg-blue-50 text-blue-400',
    ended: 'bg-red-50 text-red-400'
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Visibility</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Venue</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {items.map((item) => (
              <tr key={item.id}>
                <td className="px-4 py-4 whitespace-nowrap text-sm">{item.date}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">{item.title}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm">{item.category}</td>
                <td className="px-4 py-4 whitespace-nowrap text-sm">
                  <span className={`px-2 py-1 rounded text-xs ${item.visibility === 'public' ? 'bg-green-100 text-green-800' : 'bg-purple-100 text-purple-800'}`}>
                    {item.visibility === 'public' ? 'Public' : 'Members'}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[item.status]}`}>
                  {item.status ? item.status.charAt(0).toUpperCase() + item.status.slice(1) : 'Unknown'}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm">{item.venue}</td>
                <td className="px-4 py-4 whitespace-nowrap flex gap-2">
                  <button 
                    onClick={() => onEdit(item)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <FiEdit2 size={18} />
                  </button>
                  <button 
                    onClick={() => onDelete(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FiTrash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EventTable;