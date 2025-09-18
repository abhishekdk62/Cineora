// @ts-nocheck
"use client";
import React, { useState, useEffect } from 'react';
import { Lexend } from "next/font/google";
import { 
  Search, 
  MapPin, 
  Phone, 
  Building, 
  Eye, 
  Loader2,
  Filter,
  SortAsc,
  RotateCcw,
  Shield,
  CheckCircle,
  XCircle,
  Star,
} from 'lucide-react';
import { getTheatersByOwnerIdAdmin } from '@/app/others/services/adminServices/theaterServices';
import toast from 'react-hot-toast';
import { useDebounce } from '@/app/others/Utils/debounce';

const lexend = Lexend({
  weight: "500",
  subsets: ["latin"],
});

const lexendSmall = Lexend({
  weight: "300",
  subsets: ["latin"],
});

interface Owner {
  id?:string;
  _id: string;
  name: string;
  email: string;
  isActive: boolean;
}

interface Theater {
  _id: string;
  name: string;
  city: string;
  state: string;
  phone: string;
  screens: number;
  facilities: string[];
  isActive: boolean;
  isVerified: boolean;
}

interface TheatersListProps {
  selectedOwner: Owner;
  onTheaterSelect: (theater: Theater) => void;
}

const TheatersList: React.FC<TheatersListProps> = ({ selectedOwner, onTheaterSelect }) => {
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  const debouncedFetchTheaters = useDebounce(
    (filters) => {
      fetchTheaters(filters);
    },
    500
  );

  const fetchTheaters = async (filters: string = {}) => {
    try {
      setIsLoading(true);

      const theaterFilters = {
        ownerId: selectedOwner.id,
        status: "active",
        page: currentPage,
        limit: itemsPerPage,
        sortBy,
        sortOrder,
        ...filters,
      };

      if(selectedOwner.id)
      {


      const response = await getTheatersByOwnerIdAdmin(selectedOwner.id, theaterFilters);
      console.log(response.data?.theaters || response.theaters);
      
      setTheaters(response.data?.theaters || response.theaters || []);
      
      if (response.data?.meta?.pagination) {
        setTotalPages(response.data.meta.pagination.totalPages);
        setTotalItems(response.data.meta.pagination.total);
        setCurrentPage(response.data.meta.pagination.currentPage);
      } else if (response.meta?.pagination) {
        setTotalPages(response.meta.pagination.totalPages);
        setTotalItems(response.meta.pagination.total);
        setCurrentPage(response.meta.pagination.currentPage);
      } else {
        setTotalPages(1);
        setTotalItems(theaters.length);
      }
    }
    } catch (error: string) {
      console.error("Error fetching theaters:", error);
      toast.error(error.response?.data?.message || "Failed to load theaters");
      setTheaters([]);
      setTotalPages(1);
      setTotalItems(0);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
    fetchTheaters({
      ownerId: selectedOwner._id,
      search: searchTerm,
      sortBy: newSortBy,
      sortOrder,
    });
  };

  useEffect(() => {
    fetchTheaters();
  }, [selectedOwner._id]);

  return (
    <div className="space-y-6">
      {/* Search and Filters Section */}
      <div className="bg-gray-800/50 border border-yellow-500/20 rounded-lg p-6 transition-all duration-200">
        <div className="flex items-center gap-3 mb-4">
          <Filter className="text-yellow-400" size={20} />
          <h3 className={`${lexend.className} text-lg text-yellow-400 font-medium`}>
            Search & Filters
          </h3>
        </div>

        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 transition-all duration-200"
                size={18}
              />
              <input
                type="text"
                placeholder="Search theaters by name, location..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                  debouncedFetchTheaters({
                    ownerId: selectedOwner._id,
                    search: e.target.value,
                    sortBy,
                    sortOrder,
                    page: 1,
                  });
                }}
                className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-yellow-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/20 transition-all duration-200"
              />
            </div>
          </div>

          <div className="flex gap-3">
            {/* Sort Dropdown */}
            <div className="relative">
              <SortAsc className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="appearance-none bg-gray-800/50 border border-yellow-500/30 rounded-lg text-white pl-10 pr-8 py-3 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/20 transition-all duration-200 min-w-[180px] cursor-pointer hover:bg-gray-700/50"
              >
                <option value="createdAt">Sort by Date</option>
                <option value="theaterName">Sort by Name</option>
                <option value="verifiedAt">Sort by Verified Date</option>
                <option value="totalScreens">Sort by Screens</option>
                <option value="totalSeats">Sort by Seats</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            {/* Refresh Button */}
            <button
              onClick={() =>
                fetchTheaters({ ownerId: selectedOwner._id, search: searchTerm, sortBy, sortOrder })
              }
              className="flex items-center gap-2 bg-gray-700 hover:bg-gray-600 border border-yellow-500/30 hover:border-yellow-500/50 text-white px-4 py-3 rounded-lg transition-all duration-200"
              disabled={isLoading}
            >
              <RotateCcw size={16} className={isLoading ? "animate-spin" : ""} />
              {isLoading ? "Loading..." : "Refresh"}
            </button>
          </div>
        </div>

        {/* Results Counter */}
        <div className="mt-4 flex items-center gap-2 px-4 py-2 bg-yellow-500/10 border border-yellow-500/20 rounded-lg w-fit">
          <span className="text-yellow-400 font-medium text-sm">
            {totalItems}
          </span>
          <span className="text-gray-300 text-sm">
            theaters found
          </span>
        </div>
      </div>

      {/* Theaters List */}
      <div className="bg-gray-800/50 border border-yellow-500/20 rounded-lg p-6 transition-all duration-200">
        <div className="flex items-center gap-3 mb-6">
          <Building className="text-yellow-400" size={20} />
          <h3 className={`${lexend.className} text-lg text-yellow-400 font-medium`}>
            {selectedOwner.name}'s Theaters
          </h3>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-3 border-yellow-500 border-t-transparent"></div>
            <p className="text-gray-300 text-sm">Loading theaters...</p>
          </div>
        ) : theaters.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-gray-700/30 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
              <Building size={32} className="text-gray-400" />
            </div>
            <h3 className={`${lexend.className} text-xl text-white mb-2`}>
              No theaters found
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              {searchTerm
                ? `No theaters found matching "${searchTerm}"`
                : "No theaters found for this owner"}
            </p>
            {searchTerm && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setCurrentPage(1);
                  fetchTheaters({ ownerId: selectedOwner._id, sortBy, sortOrder, page: 1 });
                }}
                className="bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium"
              >
                Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {theaters.map((theater) => (
              <div
                key={theater._id}
                className="bg-gray-700/30 border border-yellow-500/20 rounded-lg p-6 hover:bg-gray-600/30 hover:border-yellow-500/30 transition-all duration-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <h3 className={`${lexend.className} text-xl font-medium text-white`}>
                        {theater.name}
                      </h3>
                      <div className="bg-yellow-500/20 p-1 rounded">
                        <Building className="text-yellow-400" size={16} />
                      </div>
                      {theater.isVerified && (
                        <span className="bg-green-500/20 text-green-400 border border-green-500/30 px-3 py-1 text-xs rounded-full flex items-center gap-1 font-medium">
                          <Shield size={12} />
                          Verified
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center gap-2 p-3 bg-gray-600/20 rounded-lg">
                        <MapPin size={16} className="text-gray-400" />
                        <div>
                          <span className="text-gray-400 text-xs">Location</span>
                          <p className={`${lexendSmall.className} text-sm text-white`}>
                            {theater.city}, {theater.state}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-3 bg-gray-600/20 rounded-lg">
                        <Phone size={16} className="text-gray-400" />
                        <div>
                          <span className="text-gray-400 text-xs">Contact</span>
                          <p className={`${lexendSmall.className} text-sm text-white`}>
                            {theater.phone}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 p-3 bg-gray-600/20 rounded-lg">
                        <Building size={16} className="text-gray-400" />
                        <div>
                          <span className="text-gray-400 text-xs">Screens</span>
                          <p className={`${lexendSmall.className} text-sm text-white`}>
                            {theater.screens} Screens
                          </p>
                        </div>
                      </div>
                    </div>

                    {theater.facilities && theater.facilities.length > 0 && (
                      <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Star className="text-yellow-400" size={16} />
                          <span className="text-gray-400 text-sm">Facilities</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {theater.facilities.slice(0, 4).map((facility, index) => (
                            <span
                              key={index}
                              className="bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 px-3 py-1 text-xs rounded-full font-medium"
                            >
                              {facility}
                            </span>
                          ))}
                          {theater.facilities.length > 4 && (
                            <span className="bg-gray-600/30 text-gray-300 px-3 py-1 text-xs rounded-full font-medium">
                              +{theater.facilities.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center gap-4">
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-lg ${
                        theater.isActive 
                          ? "bg-green-500/20 text-green-400 border border-green-500/30" 
                          : "bg-red-500/20 text-red-400 border border-red-500/30"
                      }`}>
                        {theater.isActive ? <CheckCircle size={14} /> : <XCircle size={14} />}
                        <span className="text-sm font-medium">
                          {theater.isActive ? "Active" : "Inactive"}
                        </span>
                      </div>
                      
                      <div className={`flex items-center gap-2 px-3 py-1 rounded-lg ${
                        theater.isVerified 
                          ? "bg-blue-500/20 text-blue-400 border border-blue-500/30" 
                          : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                      }`}>
                        <Shield size={14} />
                        <span className="text-sm font-medium">
                          {theater.isVerified ? "Verified" : "Pending Verification"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="ml-6">
                    <button
                      onClick={() => {
                        console.log(theater);
                        onTheaterSelect(theater);
                      }}
                      className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-400 text-black px-4 py-3 rounded-lg transition-all duration-200 font-medium"
                    >
                      <Eye size={16} />
                      <span className={`${lexendSmall.className} text-sm`}>
                        View Analytics
                      </span>
                    </button>
               
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

export default TheatersList;
