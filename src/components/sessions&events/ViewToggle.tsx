import { FiList, FiGrid } from 'react-icons/fi';

type ViewToggleProps = {
  viewMode: 'list' | 'table';
  onViewModeChange: (mode: 'list' | 'table') => void;
};

const ViewToggle = ({ viewMode, onViewModeChange }: ViewToggleProps) => {
  return (
    <div className="flex bg-gray-100 rounded-lg p-1">
      <button 
        onClick={() => onViewModeChange('list')}
        className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow' : ''}`}
      >
        <FiList size={20} />
      </button>
      <button 
        onClick={() => onViewModeChange('table')}
        className={`p-2 rounded ${viewMode === 'table' ? 'bg-white shadow' : ''}`}
      >
        <FiGrid size={20} />
      </button>
    </div>
  );
};

export default ViewToggle;