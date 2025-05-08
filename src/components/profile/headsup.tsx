'use client';
import { useHeadsUpStore } from '@/stores/headsupStore';
import { InfoCircleOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';

interface HeadsUpProps {
  id: string;
}

interface HeadsUpItem {
  title: string;
  message: string;
  date?: string;
}

interface HeadsUpData {
  overall: {
    records: {
      headsup: HeadsUpItem[];
    };
  };
}

const HeadsUp: React.FC<HeadsUpProps> = ({ id }) => {
  const { headsUp, fetchHeadsUp } = useHeadsUpStore();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  useEffect(() => {
    if (token && id) {
      setLoading(true);
      fetchHeadsUp(id)
        .then(() => setLoading(false))
        .catch((err: any) => {
          setError('Failed to fetch notifications.');
          setLoading(false);
        });
    }
  }, [token, id, fetchHeadsUp]);

  const headsUpList: HeadsUpItem[] = Array.isArray(headsUp) 
    ? headsUp 
    : (headsUp as HeadsUpData)?.overall?.records?.headsup ?? [];

  if (loading) {
    return (
      <div className="p-8 text-center w-160">
        <p className="text-gray-600">Loading heads-up notifications...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center w-160">
        <p className="text-red-600">Error loading notifications: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-8 w-160">
      <div className="grid grid-cols-1 gap-4">
        {headsUpList.length > 0 ? (
          headsUpList.map((item: HeadsUpItem, index: number) => (
            <div key={index} className="rounded-xl shadow p-6 bg-white dark:bg-gray-800">
              <div className="flex items-start gap-4">
                <InfoCircleOutlined className="text-blue-800 text-xl mt-1" />
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white m-0">{item.title}</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{item.message}</p>
                  {item.date && (
                    <p className="text-xs text-gray-500 mt-2">
                      Date: {new Date(item.date).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-xl shadow p-6 bg-white dark:bg-gray-800">
            <p className="text-gray-600 dark:text-gray-300">No heads-up notifications available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HeadsUp;
