// components/profile/Resources.tsx
"use client";

import React, { useEffect } from 'react';
import { useMemberResourceStore } from '@/stores/profileResourceStore';

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
    <div className="bg-white rounded-lg shadow-sm p-6 mt-6 w-160">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <tbody className="bg-white divide-y divide-gray-200">
            {resources.map((resource, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {resource.resourceName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:underline">
                  <a
                    href={resource.resourceLink}
                    target="_blank"
                    rel="noopener noreferrer"
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
