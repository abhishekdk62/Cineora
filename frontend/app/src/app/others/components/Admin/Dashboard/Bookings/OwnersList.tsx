// components/OwnersList.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { Lexend } from "next/font/google";
import {
  Search,
  Users,
  Loader2,
  Filter,
  Building,
  CheckCircle,
  XCircle,
  Eye,
} from 'lucide-react';
import { getOwners } from '@/app/others/services/adminServices/ownerServices';
import { useDebounce } from '@/app/others/Utils/debounce';
import toast from 'react-hot-toast';
import { AxiosError } from 'axios';
import { OwnerFilters } from '../Owners/OwnerManager';

const lexend = Lexend({
  weight: "500",
  subsets: ["latin"],
});

const lexendSmall = Lexend({
  weight: "300",
  subsets: ["latin"],
});

interface Owner {
  _id: string;
  name: string;
  email: string;
  isActive: boolean;
  totalTheaters?: number;
}

interface OwnersListProps {
  onOwnerSelect: (owner: Owner) => void;
}

const OwnersList: React.FC<OwnersListProps> = ({ onOwnerSelect }) => {
  const [owners, setOwners] = useState<Owner[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 12;

  const debouncedOwnerSearch = useDebounce(
    (filters, resetPage = true) => {
      handleOwnerFiltersChange(filters, resetPage);
    },
    500
  );

  const handleOwnerFiltersChange = async (
    filters: OwnerFilters,
    resetPage: boolean = true
  ) => {
    const isSearchChange = filters.search !== undefined && filters.search !== searchTerm;

    if (isSearchChange) {
      setSearchTerm(filters.search || "");
      debouncedOwnerSearch(filters, resetPage);
      return;
    }

    if (resetPage) {
      setCurrentPage(1);
      filters = { ...filters, page: 1, limit: itemsPerPage };
    } else {
      filters = { ...filters, limit: itemsPerPage };
    }

    try {
      setIsLoading(true);
      const ownerFiltersWithStatus = {
        ...filters,
        status: "active",
      };
      const response = await getOwners(ownerFiltersWithStatus);
      setOwners((response.data?.owners || response.owners || []).map(owner => ({
        ...owner,
        name: owner.ownerName
      })));

      if (response.data?.meta?.pagination) {
        setTotalPages(response.data.meta.pagination.totalPages);
        setTotalItems(response.data.meta.pagination.total);
        setCurrentPage(response.data.meta.pagination.currentPage);
      } else if (response.meta?.pagination) {
        setTotalPages(response.meta.pagination.totalPages);
        setTotalItems(response.meta.pagination.total);
        setCurrentPage(response.meta.pagination.currentPage);
      }
    } catch (error: unknown) {
      console.error("Filter error:", error);
      if (error instanceof AxiosError) {

        toast.error(error.response?.data?.message || "Failed to load owners");
        setOwners([]);
        setTotalPages(1);
        setTotalItems(0);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    handleOwnerFiltersChange({});
  }, []);

  return (
    <div className="space-y-6">
      {/* Search Section */}
      <div className="bg-gray-800/50 border border-yellow-500/20 rounded-lg p-6 transition-all duration-200">
        <div className="flex items-center gap-3 mb-4">
          <Filter className="text-yellow-400" size={20} />
          <h3 className={`${lexend.className} text-lg text-yellow-400 font-medium`}>
            Search & Filter
          </h3>
        </div>

        <div className="flex flex-col lg:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full max-w-md">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 transition-all duration-200"
              size={18}
            />
            <input
              type="text"
              placeholder="Search owners by name or email..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                debouncedOwnerSearch({ search: e.target.value });
              }}
              className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-yellow-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/20 transition-all duration-200"
            />
          </div>

          <div className="flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <span className="text-yellow-400 font-medium text-sm">
              {totalItems}
            </span>
            <span className="text-gray-300 text-sm">
              owners found
            </span>
          </div>
        </div>
      </div>

      {/* Owners Grid */}
      <div className="bg-gray-800/50 border border-yellow-500/20 rounded-lg p-6 transition-all duration-200">
        <div className="flex items-center gap-3 mb-6">
          <Users className="text-yellow-400" size={20} />
          <h3 className={`${lexend.className} text-lg text-yellow-400 font-medium`}>
            Theater Owners
          </h3>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-3 border-yellow-500 border-t-transparent"></div>
            <p className="text-gray-300 text-sm">Loading owners...</p>
          </div>
        ) : owners.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-700/30 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <Users size={32} className="text-gray-400" />
            </div>
            <h3 className={`${lexend.className} text-xl text-white mb-2`}>
              No owners found
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              {searchTerm
                ? `No owners found matching "${searchTerm}"`
                : "No theater owners found in the system"}
            </p>
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  handleOwnerFiltersChange({});
                }}
                className="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {owners.map((owner) => (
              <div
                key={owner._id}
                onClick={() => onOwnerSelect(owner)}
                className="bg-gray-700/30 border border-yellow-500/20 rounded-lg p-6 hover:bg-gray-600/30 hover:border-yellow-500/40 hover:scale-105 transition-all duration-200 cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-yellow-500/20 p-3 rounded-lg group-hover:bg-yellow-500/30 transition-all duration-200">
                    <Users className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${owner.isActive
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}>
                    {owner.isActive ? <CheckCircle size={12} /> : <XCircle size={12} />}
                    {owner.isActive ? 'Active' : 'Inactive'}
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <h3 className={`${lexend.className} text-lg font-medium text-white group-hover:text-yellow-400 transition-colors line-clamp-1`}>
                    {owner.name}
                  </h3>
                  <p className={`${lexendSmall.className} text-gray-400 text-sm line-clamp-1`}>
                    {owner.email}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-600/50">
                  {owner.totalTheaters ? (
                    <div className="flex items-center gap-2">
                      <Building size={14} className="text-gray-400" />
                      <span className={`${lexendSmall.className} text-xs text-gray-300`}>
                        {owner.totalTheaters} theater{owner.totalTheaters > 1 ? 's' : ''}
                      </span>
                    </div>
                  ) : (
                    <span className={`${lexendSmall.className} text-xs text-gray-500`}>
                      No theaters
                    </span>
                  )}

                  <div className="flex items-center gap-1 text-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Eye size={14} />
                    <span className="text-xs font-medium">View</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnersList;
