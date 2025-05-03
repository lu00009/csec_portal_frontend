import { FiGrid, FiList } from 'react-icons/fi';

type ViewToggleProps = {
  viewMode: 'list' | 'table';
  onViewModeChange: (mode: 'list' | 'table') => void;
};

const ViewToggle = ({ viewMode, onViewModeChange }: ViewToggleProps) => {
  return (
    <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
      <button 
        onClick={() => onViewModeChange('list')}
        className={`p-2 rounded transition-colors duration-200 ${
          viewMode === 'list' 
            ? 'bg-white shadow dark:bg-gray-700 dark:shadow-gray-900' 
            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
        }`}
      >
        <FiList size={20} className="text-current" />
      </button>
      <button 
        onClick={() => onViewModeChange('table')}
        className={`p-2 rounded transition-colors duration-200 ${
          viewMode === 'table' 
            ? 'bg-white shadow dark:bg-gray-700 dark:shadow-gray-900' 
            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
        }`}
      >
        <FiGrid size={20} className="text-current" />
      </button>
    </div>
  );
};

export default ViewToggle;