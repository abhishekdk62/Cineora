import React, { useState, useEffect } from 'react';
import { Users, Search, Filter, UserCheck, UserX } from 'lucide-react';
import { Lexend } from 'next/font/google';
import StaffFilters from './StaffFilters';
import StaffCard from './StaffCard';
import StaffModal from './StaffModal';
import { getAllStaffs, toggleStatus } from '@/app/others/services/adminServices/staffServices';
import { confirmAction } from '../../../utils/ConfirmDialog';
import toast from 'react-hot-toast';

const lexend = Lexend({ subsets: ['latin'] });

interface StaffMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isActive: boolean;
  ownerId?: string;
  theaterId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface StaffPagination {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

interface StaffResponse {
  staffs: StaffMember[];
  pagination: StaffPagination;
}
const StaffManager: React.FC = () => {
  const [staffData, setStaffData] = useState<StaffResponse>({
    staffs: [],
    pagination: {
      currentPage: 1,
      totalPages: 0,
      totalCount: 0,
      hasNext: false,
      hasPrevious: false
    }
  });
  const [loading, setLoading] = useState(true);
  const [selectedStaff, setSelectedStaff] = useState<StaffMember | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  useEffect(() => {
    fetchStaffData();
  }, [searchTerm, activeFilter, currentPage]);

  const fetchStaffData = async () => {
    try {
      setLoading(true);

      // Build query object
      const queryParams: any = {
        page: currentPage,
        limit: 10
      };

      // Add search if exists
      if (searchTerm) {
        queryParams.search = searchTerm;
      }

      // Add isActive filter if not 'all'
      if (activeFilter !== 'all') {
        queryParams.isActive = activeFilter === 'active';
      }

      // Pass query params to getAllStaffs
      const result = await getAllStaffs(queryParams);
      console.log(result);

      if (result.success) {
        setStaffData(result.data);
      }
    } catch (error) {
      console.error('Error fetching staff data:', error);
    } finally {
      setLoading(false);
    }
  };


  const handleToggleStatus = async (staffId: string) => {
    try {
      const confirmed = await confirmAction({
        title: ` Toggle Status?`,
        message: `Are you sure you want to change status of this status"?`,
        confirmText: 'Confirm',
        cancelText: "Cancel",
      });
      if (!confirmed) return
      const response = await toggleStatus(staffId)
        fetchStaffData(); 
      toast.success('status cahged')
    } catch (error) {
      toast.error('Something went wrong')
      console.error('Error toggling staff status:', error);
    }
  };

  const handleViewDetails = (staff: StaffMember) => {
    setSelectedStaff(staff);
    setShowModal(true);
  };

  if (loading && staffData.staffs.length === 0) {
    return (
      <div className="min-h-screen bg-gray-900 p-6 flex items-center justify-center">
        <div className="text-white text-xl" style={{ fontFamily: lexend.style.fontFamily }}>
          Loading staff members...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className={`${lexend.className} text-3xl text-white mb-2 flex items-center gap-2`}>
              <div className="p-3 bg-yellow-500/20 rounded-xl">
                <Users className="w-6 h-6 text-yellow-400" />
              </div>
              Staff Management
            </h1>
            <p className="text-gray-400" style={{ fontFamily: lexend.style.fontFamily }}>
              Manage your staff members, view their details and control access.
            </p>
          </div>

          <div className="flex items-center gap-2 text-white">
            <UserCheck className="w-5 h-5 text-green-400" />
            <span className="text-green-400" style={{ fontFamily: lexend.style.fontFamily }}>
              {staffData.staffs.filter(s => s.isActive).length} Active
            </span>
            <span className="text-gray-500 mx-2">|</span>
            <UserX className="w-5 h-5 text-red-400" />
            <span className="text-red-400" style={{ fontFamily: lexend.style.fontFamily }}>
              {staffData.staffs.filter(s => !s.isActive).length} Inactive
            </span>
          </div>
        </div>

        {/* Filters Section */}
        <StaffFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          totalCount={staffData.pagination.totalCount}
        />

        {/* Staff Cards Grid */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="text-yellow-400" style={{ fontFamily: lexend.style.fontFamily }}>
                Loading...
              </div>
            </div>
          ) : staffData.staffs.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg" style={{ fontFamily: lexend.style.fontFamily }}>
                No staff members found
              </p>
              <p className="text-gray-500 text-sm mt-2" style={{ fontFamily: lexend.style.fontFamily }}>
                {searchTerm ? 'Try adjusting your search criteria' : 'Add your first staff member to get started'}
              </p>
            </div>
          ) : (
            <>
              {staffData.staffs.map((staff) => (
                <StaffCard
                  key={staff._id}
                  staff={staff}
                  onViewDetails={handleViewDetails}
                  onToggleStatus={handleToggleStatus}
                />
              ))}

              {/* Pagination */}
              {staffData.pagination.totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 py-6">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={!staffData.pagination.hasPrevious}
                    className="px-4 py-2 rounded-lg bg-gray-800 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
                    style={{ fontFamily: lexend.style.fontFamily }}
                  >
                    Previous
                  </button>

                  <span className="text-gray-400" style={{ fontFamily: lexend.style.fontFamily }}>
                    Page {staffData.pagination.currentPage} of {staffData.pagination.totalPages}
                  </span>

                  <button
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    disabled={!staffData.pagination.hasNext}
                    className="px-4 py-2 rounded-lg bg-gray-800 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
                    style={{ fontFamily: lexend.style.fontFamily }}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Staff Details Modal */}
      {showModal && selectedStaff && (
        <StaffModal
          staff={selectedStaff}
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setSelectedStaff(null);
          }}
          onToggleStatus={handleToggleStatus}
        />
      )}
    </div>
  );
};

export default StaffManager;
