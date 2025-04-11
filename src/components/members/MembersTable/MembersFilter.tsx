// components/members/MembersFilter.tsx
'use client';

import { useState } from 'react';
import { FiFilter, FiX } from 'react-icons/fi';

interface MembersFilterProps {
  divisions: string[];
  groups: string[];
  statuses: string[];
  campusStatuses: string[];
  onFilter: (filters: {
    search: string;
    division: string;
    group: string;
    status: string;
    campusStatus: string;
  }) => void;
  onReset: () => void;
}

export default function MembersFilter({
  divisions,
  groups,
  statuses,
  campusStatuses,
  onFilter,
  onReset
}: MembersFilterProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: '',
    division: '',
    group: '',
    status: '',
    campusStatus: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    onFilter(filters);
    setShowFilters(false);
  };

  const resetFilters = () => {
    setFilters({
      search: '',
      division: '',
      group: '',
      status: '',
      campusStatus: ''
    });
    onReset();
    setShowFilters(false);
  };

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between ">
        {/* Filter Toggle Button */}
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`ml-4 flex items-center px-4 py-2 rounded-md ${showFilters ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'} hover:bg-blue-50 transition-colors`}
        >
          <FiFilter className="mr-2" />
          Filters
        </button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="mt-4 p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Division Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Division</label>
              <select
                name="division"
                value={filters.division}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Divisions</option>
                {divisions.map(division => (
                  <option key={division} value={division}>{division}</option>
                ))}
              </select>
            </div>

            {/* Group Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Group</label>
              <select
                name="group"
                value={filters.group}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Groups</option>
                {groups.map(group => (
                  <option key={group} value={group}>{group}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                name="status"
                value={filters.status}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Statuses</option>
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>

            {/* Campus Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Campus Status</label>
              <select
                name="campusStatus"
                value={filters.campusStatus}
                onChange={handleInputChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">All Campus Statuses</option>
                {campusStatuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 mt-4">
            <button
              type="button"
              onClick={resetFilters}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center"
            >
              <FiX className="mr-1" />
              Reset
            </button>
            <button
              type="button"
              onClick={applyFilters}
              className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
}