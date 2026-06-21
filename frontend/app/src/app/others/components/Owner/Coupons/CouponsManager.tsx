"use client";
import React, { useEffect, useState } from "react";
import CouponList from "./CouponList";
import CouponForm from "./CouponForm";
import {
  createCoupon,
  updateCoupon,
} from "@/app/others/services/ownerServices/couponServices";
import {
  CouponResponseDto,
  CreateCouponRequestDto,
  UpdateCouponRequestDto,
} from "@/app/others/dtos/coupon.dto";
import { TheaterResponseDto } from "@/app/others/dtos/theater.dto";
import { getApiErrorMessage } from "@/app/others/types/common.types";
import { Ticket } from "lucide-react";
import { getTheatersByOwnerId } from "@/app/others/services/ownerServices/theaterServices";
import toast from "react-hot-toast";

const CouponsManager: React.FC = () => {
  const [editingCoupon, setEditingCoupon] = useState<CouponResponseDto | null>(null);
  const [saving, setSaving] = useState(false);
  const [refreshFlag, setRefreshFlag] = useState(false);
  const [theaters, setTheaters] = useState<TheaterResponseDto[]>([]);

  const onCreate = async (data: CreateCouponRequestDto) => {
    setSaving(true);
    try {
      await createCoupon(data);
      setEditingCoupon(null);
      setRefreshFlag((prev) => !prev);
      toast.success("Coupon created successfully");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to create coupon"));
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    getTheatersByownerId();
  }, []);

  const getTheatersByownerId = async () => {
    try {
      const response = await getTheatersByOwnerId();
      setTheaters(response.data?.theaters ?? []);
    } catch (error) {
      console.error(getApiErrorMessage(error, "Failed to load theaters"));
    }
  };

  const onUpdate = async (data: UpdateCouponRequestDto) => {
    if (!editingCoupon) return;
    setSaving(true);
    try {
      await updateCoupon(editingCoupon._id, data);
      setEditingCoupon(null);
      setRefreshFlag((prev) => !prev);
      toast.success("Coupon updated successfully");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to update coupon"));
    } finally {
      setSaving(false);
    }
  };

  const onCancel = () => {
    setEditingCoupon(null);
  };

  const handleCreateNew = () => {
    setEditingCoupon({
      _id: "",
      name: "",
      uniqueId: "",
      theaterIds: [],
      discountPercentage: 10,
      description: "",
      expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      isActive: true,
      isUsed: false,
      maxUsageCount: 1,
      currentUsageCount: 0,
      createdBy: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  };

  const handleCouponSubmit = async (
    data: CreateCouponRequestDto | UpdateCouponRequestDto
  ) => {
    if (editingCoupon?._id) {
      await onUpdate(data as UpdateCouponRequestDto);
    } else {
      await onCreate(data as CreateCouponRequestDto);
    }
  };

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8 bg-black/40 backdrop-blur-lg rounded-3xl p-8 border border-white/10">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl">
              <Ticket className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-white bg-clip-text text-transparent">
              Coupon Management
            </h1>
          </div>
          {!editingCoupon && (
            <button
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 rounded-2xl text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              onClick={handleCreateNew}
            >
              + Create New Coupon
            </button>
          )}
        </div>

        {editingCoupon ? (
          <CouponForm
            initialData={editingCoupon}
            theaterOptions={theaters.map((t) => ({ id: t._id, name: t.name }))}
            onSubmit={handleCouponSubmit}
            onCancel={onCancel}
            saving={saving}
            isEditing={!!editingCoupon._id}
          />
        ) : (
          <CouponList onEdit={setEditingCoupon} refreshFlag={refreshFlag} />
        )}
      </div>
    </div>
  );
};

export default CouponsManager;
