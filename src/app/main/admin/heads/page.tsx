// app/admin/heads/page.tsx
'use client';

import HeadFormModal from '@/components/admin/AddHeadModal';
import EmptyState from '@/components/EmptyState';
import LoadingSpinner from '@/components/LoadingSpinner';
import useMembersStore from '@/stores/membersStore';
import { useUserStore } from '@/stores/userStore';
import { isPresident } from '@/utils/roles';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CiEdit } from 'react-icons/ci';
import { FiPlus, FiSearch } from 'react-icons/fi';
import { RiDeleteBin6Line } from 'react-icons/ri';

export default function HeadsPage() {
  const router = useRouter();
  const { user } = useUserStore();
  const { 
    heads, 
    fetchHeads, 
    loading, 
    error, 
    deleteHead,
    addHead,
    updateHead 
  } = useMembersStore();
  
  const [filter, setFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHead, setSelectedHead] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const itemsPerPage = 10;

  // Check admin permissions
  const isAdmin = user && isPresident(user.clubRole);

  useEffect(() => {
    if (!isAdmin) {
      router.push('/dashboard');
      return;
    }
    fetchHeads();
  }, [fetchHeads, isAdmin, router]);

  // Filter and paginate heads
  const filteredHeads = heads.filter(head =>
    `${head.firstName} ${head.lastName}`.toLowerCase().includes(filter.toLowerCase()) ||
    head.division.toLowerCase().includes(filter.toLowerCase()) ||
    head.clubRole.toLowerCase().includes(filter.toLowerCase())
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredHeads.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredHeads.length / itemsPerPage);

  const handleDelete = async (id: string) => {
    if (!isAdmin) return;
    
    if (confirm('Are you sure you want to delete this head?')) {
      try {
        await deleteHead(id);
        // Reset to first page after deletion
        if (currentItems.length === 1 && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        }
      } catch (error) {
        console.error('Failed to delete head:', error);
      }
    }
  };

  const handleEdit = (head) => {
    setSelectedHead(head);
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setSelectedHead(null);
    setIsEditMode(false);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedHead(null);
  };

  if (!isAdmin) return <LoadingSpinner />;
  if (loading) return <LoadingSpinner fullPage />;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;

  return (
    <>
      <div className="flex flex-col w-full h-full bg-white rounded-lg shadow-md">
        {/* Header with search and add button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 border-b border-gray-200 gap-4">
          <h2 className="text-2xl font-semibold text-gray-800">Heads Administration</h2>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search heads..."
                value={filter}
                onChange={(e) => {
                  setFilter(e.target.value);
                  setCurrentPage(1); // Reset to first page when searching
                }}
                className="block w-full pl-10 pr-4 py-2 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>
            
            <button
              onClick={handleAdd}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
            >
              <FiPlus size={18} />
              Add Head
            </button>
          </div>
        </div>

        {/* Main content */}
        <div className="p-6">
          {currentItems.length === 0 ? (
            <EmptyState 
              title="No heads found"
              description={filter ? "Try adjusting your search" : "Add a new head to get started"}
              action={
                <button
                  onClick={handleAdd}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Create Head
                </button>
              }
            />
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Division
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentItems.map((head) => (
                      <tr key={head._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                              {head.profilePicture ? (
                                <img
                                  src={`/uploads/${head.profilePicture}`}
                                  alt={`${head.firstName} ${head.lastName}`}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <span className="text-gray-600 font-medium">
                                  {head.firstName?.charAt(0)}{head.lastName?.charAt(0)}
                                </span>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {head.firstName} {head.lastName}
                              </div>
                              <div className="text-sm text-gray-500">{head.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {head.division}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                            ${head.clubRole === 'Vice President' ? 'bg-purple-100 text-purple-800' : 
                              head.clubRole === 'President' ? 'bg-green-100 text-green-800' : 
                              'bg-blue-100 text-blue-800'}`}
                          >
                            {head.clubRole}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                          <button 
                            onClick={() => handleEdit(head)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                            aria-label="Edit"
                          >
                            <CiEdit size={20} />
                          </button>
                          <button 
                            onClick={() => handleDelete(head._id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                            aria-label="Delete"
                          >
                            <RiDeleteBin6Line size={20} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <div className="text-sm text-gray-700">
                    Page <span className="font-medium">{currentPage}</span> of{' '}
                    <span className="font-medium">{totalPages}</span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                      className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium disabled:opacity-50"
                    >
                      First
                    </button>
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium disabled:opacity-50"
                    >
                      Next
                    </button>
                    <button
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages}
                      className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium disabled:opacity-50"
                    >
                      Last
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modal for adding/editing heads */}
      {isModalOpen && (
        <HeadFormModal
          onClose={handleModalClose}
          initialData={selectedHead}
          isEdit={isEditMode}
          onAddHead={addHead}
          onUpdateHead={updateHead}
        />
      )}
    </>
  );
}