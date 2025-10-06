"use client";

import React, { useState, useEffect } from 'react';
import { Users, UserCheck, UserX, Plus } from 'lucide-react';
import { getAllStaffs, toggleStatus } from '@/app/others/services/ownerServices/staffServices';
import { lexendBold, lexendMedium, lexendSmall } from '@/app/others/Utils/fonts';
import OwnerStaffFilters from './StaffFilters';
import StaffPagination from './StaffPagination';
import OwnerStaffModal from './StaffModal';
import StaffList from './StaffList';

interface StaffMember {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isActive: boolean;
  theaterId?: {
    _id: string;
    name: string;
    address: string;
    city: string;
    state: string;
    screens: number;
    facilities: string[];
  };
  createdAt?: string;
  updatedAt?: string;
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

const OwnerStaffManager: React.FC = () => {
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
  const [mounted, setMounted] = useState(false);
  
  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [selectedTheater, setSelectedTheater] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);

  // Get unique theaters from staff data
  const getUniqueTheaters = () => {
    const theaters = staffData.staffs
      .filter(staff => staff.theaterId)
      .map(staff => staff.theaterId!)
      .filter((theater, index, self) => 
        index === self.findIndex(t => t._id === theater._id)
      );
    return theaters;
  };

  useEffect(() => {
    setMounted(true);
    fetchStaffData(1, true);
  }, []);

  useEffect(() => {
    if (mounted) {
      fetchStaffData(currentPage, false);
    }
  }, [searchTerm, activeFilter, selectedTheater, currentPage, mounted]);

  const fetchStaffData = async (pageNumber = 1, reset = false) => {
    if (loading && !reset) return;

    try {
      if (reset) {
        setLoading(true);
      }

      const queryParams: any = {
        page: pageNumber,
        limit: 10
      };

      if (searchTerm) queryParams.search = searchTerm;
      if (activeFilter !== 'all') queryParams.isActive = activeFilter === 'active';
      if (selectedTheater !== 'all') queryParams.theaterId = selectedTheater;

      const result = await getAllStaffs(queryParams);
      console.log('da',result);
      

      if (result.success) {
        setStaffData(result.data);
      }
    } catch (error) {
      console.error('Error fetching staff data:', error);
    } finally {
      if (reset) {
        setLoading(false);
      }
    }
  };

  const handleToggleStatus = async (staffId: string) => {
    try {
      const response = await toggleStatus(staffId);
      if (response.success) {
        fetchStaffData(currentPage, false);
      }
    } catch (error) {
      console.error('Error toggling staff status:', error);
    }
  };

  const handleViewDetails = (staff: StaffMember) => {
    setSelectedStaff(staff);
    setShowModal(true);
  };

  const handleRefresh = () => {
    setCurrentPage(1);
    fetchStaffData(1, true);
  };

  if (loading) {
    return (
      <div className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h1 className={`${lexendMedium.className} text-2xl text-white`}>
                Staff Manager
              </h1>
              <p className={`${lexendSmall.className} text-gray-400 text-sm`}>
                Manage your theater staff members
              </p>
            </div>
          </div>
      
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-green-400" />
              <div>
                <p className={`${lexendSmall.className} text-gray-400 text-xs`}>
                  Total Staff
                </p>
                <p className={`${lexendMedium.className} text-white text-lg`}>
                  {staffData.pagination.totalCount || staffData.staffs.length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <UserCheck className="w-5 h-5 text-blue-400" />
              <div>
                <p className={`${lexendSmall.className} text-gray-400 text-xs`}>
                  Active Staff
                </p>
                <p className={`${lexendMedium.className} text-white text-lg`}>
                  {mounted ? staffData.staffs.filter(s => s.isActive).length : 0}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <UserX className="w-5 h-5 text-purple-400" />
              <div>
                <p className={`${lexendSmall.className} text-gray-400 text-xs`}>
                  Inactive Staff
                </p>
                <p className={`${lexendMedium.className} text-white text-lg`}>
                  {mounted ? staffData.staffs.filter(s => !s.isActive).length : 0}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-orange-400" />
              <div>
                <p className={`${lexendSmall.className} text-gray-400 text-xs`}>
                  Theaters
                </p>
                <p className={`${lexendMedium.className} text-white text-lg`}>
                  {mounted ? getUniqueTheaters().length : 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Staff List */}
      <StaffList
        staffs={staffData.staffs}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        selectedTheater={selectedTheater}
        setSelectedTheater={setSelectedTheater}
        theaters={getUniqueTheaters()}
        totalCount={staffData.pagination.totalCount}
        onEdit={handleViewDetails}
        onView={handleViewDetails}
        onToggleStatus={handleToggleStatus}
        onRefresh={handleRefresh}
        lexendMedium={lexendMedium}
        lexendSmall={lexendSmall}
      />

      {/* Pagination */}
      {staffData.pagination.totalPages > 1 && (
        <StaffPagination
          currentPage={staffData.pagination.currentPage}
          totalPages={staffData.pagination.totalPages}
          hasNext={staffData.pagination.hasNext}
          hasPrevious={staffData.pagination.hasPrevious}
          onPageChange={setCurrentPage}
        />
      )}

      {/* Staff Details Modal */}
      {showModal && selectedStaff && (
        <OwnerStaffModal
          staff={selectedStaff}
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setSelectedStaff(null);
          }}
          onToggleStatus={handleToggleStatus}
          lexendMedium={lexendMedium}
          lexendSmall={lexendSmall}
        />
      )}
    </div>
  );
};

export default OwnerStaffManager;
