"use client";
import React, { useEffect, useState } from "react";
import { CouponResponseDto, GetCouponsQueryDto, GetCouponsResponseDto } from "@/app/others/dtos/coupon.dto";
import { getAllCoupons } from "@/app/others/services/userServices/couponServices";
import CouponCard from "./CouponCard";
import { lexendBold } from "@/app/others/Utils/fonts";

const CouponManager: React.FC = () => {
  const [coupons, setCoupons] = useState<CouponResponseDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [totalPages, setTotalPages] = useState(1);
  const [filterActive, setFilterActive] = useState<'all' | 'active' | 'expired'>('all');

  const fetchCoupons = async (pageNumber: number) => {
    setLoading(true);
    setError(null);
    const query: GetCouponsQueryDto = { page: pageNumber, limit };
    try {
      const response = await getAllCoupons(query);
      console.log(response);
      
      setCoupons(response.data.data);
      setTotalPages(response.data.totalPages);
      setPage(response.data.currentPage);
    } catch {
      setError("Failed to load coupons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons(page);
  }, [page]);

  // Helper function to check if coupon is expired
  const isCouponExpired = (coupon: CouponResponseDto): boolean => {
    const now = new Date();
    const expiryDate = new Date(coupon.expiryDate);
    
    return (
      !coupon.isActive || 
      now > expiryDate || 
      coupon.currentUsageCount >= coupon.maxUsageCount
    );
  };

  const filteredCoupons = coupons.filter(coupon => {
    const isExpired = isCouponExpired(coupon);
    
    const matchesFilter = filterActive === 'all' ||
      (filterActive === 'active' && !isExpired) ||
      (filterActive === 'expired' && isExpired);
    
    return matchesFilter;
  });

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <span className={`${lexendBold.className} text-5xl text-white`}>
            My Coupons
          </span>
          <p className="text-gray-300 text-lg mt-4">
            Discover and use your exclusive movie deals
          </p>
        </div>

        {/* Tab-style Filter Buttons */}
        <div className="   p-6 mb-8">
          <div className="flex justify-center">
            <div className="flex gap-8">
              {/* Active Tab Button */}
              <button
                onClick={() => setFilterActive('active')}
                className={`relative py-2 px-1 transition-all duration-300 ${
                  filterActive === 'active' ? 'text-white' : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                <p
                  className="tracking-[0.3em] text-sm font-extralight relative z-10"
                  style={{
                    textShadow: filterActive === 'active'
                      ? '0 0 10px rgba(249, 115, 22, 0.5)'
                      : 'none',
                  }}
                >
                  ACTIVE
                </p>
                {/* Animated underline */}
                <div
                  className={`absolute bottom-0 left-0 right-0 h-0.5 bg-white transition-all duration-300 ${
                    filterActive === 'active' 
                      ? 'opacity-100 scale-x-100' 
                      : 'opacity-0 scale-x-0'
                  }`}
                  style={{
                    boxShadow: filterActive === 'active' 
                      ? '0 0 8px rgba(249, 115, 22, 0.6)' 
                      : 'none'
                  }}
                />
              </button>

              {/* Expired/Used Tab Button */}
              <button
                onClick={() => setFilterActive('expired')}
                className={`relative py-2 px-1 transition-all duration-300 ${
                  filterActive === 'expired' ? 'text-white' : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                <p
                  className="tracking-[0.3em] text-sm font-extralight relative z-10"
                  style={{
                    textShadow: filterActive === 'expired'
                      ? '0 0 10px rgba(249, 115, 22, 0.5)'
                      : 'none',
                  }}
                >
                  EXPIRED
                </p>
                {/* Animated underline */}
                <div
                  className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-300 ${
                    filterActive === 'expired' 
                      ? 'opacity-100 scale-x-100' 
                      : 'opacity-0 scale-x-0'
                  }`}
                  style={{
                    boxShadow: filterActive === 'expired' 
                      ? '0 0 8px rgba(249, 115, 22, 0.6)' 
                      : 'none'
                  }}
                />
              </button>

              {/* All Tab Button */}
              <button
                onClick={() => setFilterActive('all')}
                className={`relative py-2 px-1 transition-all duration-300 ${
                  filterActive === 'all' ? 'text-white' : 'text-gray-400 hover:text-gray-300'
                }`}
              >
                <p
                  className="tracking-[0.3em] text-sm font-extralight relative z-10"
                  style={{
                    textShadow: filterActive === 'all'
                      ? '0 0 10px rgba(249, 115, 22, 0.5)'
                      : 'none',
                  }}
                >
                  ALL
                </p>
                {/* Animated underline */}
                <div
                  className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-300 ${
                    filterActive === 'all' 
                      ? 'opacity-100 scale-x-100' 
                      : 'opacity-0 scale-x-0'
                  }`}
                  style={{
                    boxShadow: filterActive === 'all' 
                      ? '0 0 8px rgba(249, 115, 22, 0.6)' 
                      : 'none'
                  }}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-orange-500/30 rounded-full"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <span className="ml-4 text-white text-lg">Loading your amazing deals...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-2xl p-8 text-center">
            <div className="text-red-400 text-6xl mb-4">⚠️</div>
            <h3 className="text-red-400 text-xl font-semibold mb-2">Oops! Something went wrong</h3>
            <p className="text-red-300">{error}</p>
            <button
              onClick={() => fetchCoupons(page)}
              className="mt-4 px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-colors"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredCoupons.length === 0 && (
          <div className="text-center py-20">
            <div className="text-gray-400 text-8xl mb-6">🎫</div>
            <h3 className="text-2xl font-semibold text-gray-300 mb-4">
              {filterActive !== 'all' ? 'No matching coupons found' : 'No coupons available yet'}
            </h3>
            <p className="text-gray-400 mb-8">
              {filterActive !== 'all'
                ? 'Try selecting a different filter option'
                : 'Check back later for exciting deals and discounts!'
              }
            </p>
          </div>
        )}

        {/* Coupons List */}
        {!loading && !error && filteredCoupons.length > 0 && (
          <>
            <div className="flex flex-col gap-8">
              {filteredCoupons.map((coupon, index) => (
                <CouponCard
                  key={coupon._id}
                  coupon={coupon}
                  index={index}
                  isExpired={isCouponExpired(coupon)}
                />
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-12">
                <button
                  className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  ← Previous
                </button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNumber;
                    if (totalPages <= 5) {
                      pageNumber = i + 1;
                    } else if (page <= 3) {
                      pageNumber = i + 1;
                    } else if (page >= totalPages - 2) {
                      pageNumber = totalPages - 4 + i;
                    } else {
                      pageNumber = page - 2 + i;
                    }

                    return (
                      <button
                        key={pageNumber}
                        onClick={() => setPage(pageNumber)}
                        className={`w-10 h-10 rounded-lg font-medium transition-all ${page === pageNumber
                            ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white'
                            : 'bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 text-gray-300'
                          }`}
                      >
                        {pageNumber}
                      </button>
                    );
                  })}
                </div>

                <button
                  className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  disabled={page === totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CouponManager;
