// components/profile/Resources.tsx
"use client";

import { useMemberResourceStore } from '@/stores/profileResourceStore';
import React, { useEffect } from 'react';

interface ResourcesProps {
  id: string;
}

const Resources: React.FC<ResourcesProps> = ({ id }) => {
  const { resources, loading, error, fetchResources } = useMemberResourceStore();

  useEffect(() => {
    if (id) {
      fetchResources(id);
    }
  }, [id, fetchResources]);

  if (loading) {
    return <div className="w-160">Loading resources...</div>;
  }

  if (error) {
    return <div className="w-160 text-red-500">{error}</div>;
  }

  if (!Array.isArray(resources) || resources.length === 0) {
    console.log('No resources available:', resources);
    return <div className="w-160">No resources available.</div>;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mt-6 w-160 dark:border dark:border-gray-700">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {resources.map((resource, index) => (
              <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                  {resource.resourceName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 dark:text-blue-400 hover:underline">
                  <a
                    href={resource.resourceLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="transition-colors duration-200"
                  >
                    {resource.resourceLink}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Resources;
