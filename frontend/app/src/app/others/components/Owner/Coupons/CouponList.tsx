"use client";
import React, { useEffect, useState } from "react";
import { CouponResponseDto, GetCouponsQueryDto, GetCouponsResponseDto } from "@/app/others/dtos/coupon.dto";
import { getOwnerCoupons, deleteCoupon, toggleStatusCoupon } from "@/app/others/services/ownerServices/couponServices";
import { Tag, Calendar, Percent, Info, Trash2, Edit, MapPin, Users, Clock, CirclePower } from "lucide-react";
import { confirmAction } from "../../utils/ConfirmDialog";
import toast from "react-hot-toast";

interface Props {
  onEdit: (coupon: CouponResponseDto) => void;
  refreshFlag: boolean;
}

const CouponList: React.FC<Props> = ({ onEdit, refreshFlag }) => {
  const [coupons, setCoupons] = useState<CouponResponseDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [totalPages, setTotalPages] = useState(1);

  const fetchCoupons = async (pageNumber: number) => {
    setLoading(true);
    setError(null);
    try {
      const query: GetCouponsQueryDto = { page: pageNumber, limit };
      const response: GetCouponsResponseDto = await getOwnerCoupons(query);
      console.log('the rspo cooupon', response);

      setCoupons(response.data.data);
      setTotalPages(response.data.totalPages);
      setPage(response.data.currentPage);
    } catch {
      setError("Failed to fetch coupons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons(page);
  }, [page, refreshFlag]);

  const handleDelete = async (id: string) => {
    const confirmed = await confirmAction({
      title: "Delete Movie?",
      message: `Are you sure you want to delete coupon"?`,
      confirmText: "Delete",
      cancelText: "Cancel",
    });
    if (!confirmed) return;

    try {
      await deleteCoupon(id);
      fetchCoupons(page);
    } catch {
      toast.error("Failed to delete coupon");
    }
  };
  const handleToggleStatus = async (id: string, isActive: boolean) => {
    const confirmed = await confirmAction({
      title: "Delete Movie?",
      message: `Are you sure you want to ${isActive ? 'Disable' : 'Enable'} coupon"?`,
      confirmText: 'Confirm',
      cancelText: "Cancel",
    });
    if (!confirmed) return;
    try {
      let data = { isActive: !isActive }
      let d = await toggleStatusCoupon(id, data);
      console.log(d);

      fetchCoupons(page);
    } catch {
      toast.error("Failed to delete coupon");
    }
  };

  if (loading) {
    return (
      <div className="bg-black/40 backdrop-blur-lg border border-white/10 rounded-3xl p-12 text-white flex justify-center items-center">
        <div className="flex items-center gap-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-400"></div>
          <p className="text-lg text-gray-300">Loading coupons...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-black/40 backdrop-blur-lg border border-red-500/30 rounded-3xl p-8 text-red-400 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Info className="w-5 h-5" />
          <span className="font-semibold">Error</span>
        </div>
        {error}
      </div>
    );
  }

  if (coupons.length === 0) {
    return (
      <div className="bg-black/40 backdrop-blur-lg border border-white/10 rounded-3xl p-16 text-center">
        <Tag className="mx-auto mb-6 w-16 h-16 text-gray-500" />
        <h3 className="text-xl font-semibold text-gray-400 mb-2">No Coupons Found</h3>
        <p className="text-gray-500">Create your first coupon to get started with promotional offers.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Coupons Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {coupons.map(coupon => (
          <div
            key={coupon._id}
            className="bg-black/40 backdrop-blur-lg border border-white/10 rounded-3xl p-6 hover:border-blue-500/30 transition-all duration-300 group"
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                  <Tag className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-bold text-xl text-white">{coupon.name}</h4>
                  <p className="text-sm text-gray-400 font-mono">{coupon.uniqueId}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 bg-gradient-to-r from-green-500/20 to-blue-500/20 px-3 py-1 rounded-full border border-green-500/30">
                <Percent className="w-4 h-4 text-green-400" />
                <span className="text-green-400 font-bold">{coupon.discountPercentage}%</span>
              </div>
            </div>

            {/* Description */}
            {coupon.description && (
              <p className="text-gray-300 text-sm mb-4 line-clamp-2">{coupon.description}</p>
            )}

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Calendar className="w-4 h-4" />
                <span>Expires {new Date(coupon.expiryDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Users className="w-4 h-4" />
                <span>{coupon.currentUsageCount}/{coupon.maxUsageCount} used</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <MapPin className="w-4 h-4" />
                <span>{coupon.theaterIds?.length || 0} theaters</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Clock className="w-4 h-4" />
                <span className={coupon.isActive ? "text-green-400" : "text-red-400"}>
                  {coupon.isActive ? "Active" : "Inactive"}
                </span>
              </div>
            </div>


            <div className="flex gap-3 pt-4 border-t border-white/10">
              <button
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/30 transition-all duration-300"
                onClick={() => onEdit(coupon)}
                aria-label="Edit Coupon"
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
              <button
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 transition-all duration-300"
                onClick={() => handleDelete(coupon._id)}
                aria-label="Delete Coupon"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
              <button
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl ${coupon.isActive?'bg-red-600/20 hover:bg-red-600/30 text-red-400 border-red-500/30':'bg-green-600/20 hover:bg-green-600/30 text-green-400 border-green-500/30'}  border  transition-all duration-300`}
                onClick={() => handleToggleStatus(coupon._id, coupon.isActive)}
                aria-label="toggle Coupon"
              >
                <CirclePower className={`w-4 h-4 ${coupon.isActive?'text-red-500':'text-green-400'}`} />
                Toggle
              </button>
            </div>
          </div>
        ))}
      </div>


      <div className="flex justify-center items-center gap-6 mt-8 bg-black/40 backdrop-blur-lg rounded-2xl p-4 border border-white/10">
        <button
          className="px-6 py-2 border border-white/20 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-all duration-300 text-white"
          disabled={page === 1}
          onClick={() => setPage(page - 1)}
        >
          Previous
        </button>
        <span className="text-gray-300 font-medium">
          Page {page} of {totalPages}
        </span>
        <button
          className="px-6 py-2 border border-white/20 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white/10 transition-all duration-300 text-white"
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CouponList;
