import { useState, useEffect, useCallback } from 'react';
import { Ticket, Search, RefreshCw, AlertCircle } from 'lucide-react';
import { getOwnerCoupons, toggleStatus } from '@/app/others/services/adminServices/couponService';
import CouponModal from './CouponModal';
import CouponCard from './CouponCard';
import { confirmAction } from '../../../utils/ConfirmDialog';
import toast from 'react-hot-toast';

interface Theater {
    _id: string;
    name: string;
    city: string;
    state: string;
    location: {
        type: string;
        coordinates: number[];
    };
}

interface Coupon {
    _id: string;
    name: string;
    uniqueId: string;
    theaterIds: Theater[];
    discountPercentage: number;
    description: string;
    expiryDate: string;
    isActive: boolean;
    isUsed: boolean;
    maxUsageCount: number;
    currentUsageCount: number;
    minAmount: number;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
}

interface ApiResponseData {
    data: Coupon[];
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    totalCount: number;
}

interface ApiResponse {
    success: boolean;
    data: ApiResponseData;
    message: string;
    timestamp: string;
}

interface CouponStats {
    active: number;
    expired: number;
    used: number;
    total: number;
}

interface CouponManagementProps {
    lexend: string;
}

const CouponManagement: React.FC<CouponManagementProps> = ({ lexend }) => {
    const [couponsData, setCouponsData] = useState<Coupon[]>([]);
    const [paginationData, setPaginationData] = useState<{
        currentPage: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
        totalCount: number;
    } | null>(null);
    const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'expired' | 'used'>('all');
    const [ownerFilter, setOwnerFilter] = useState('all');

    const [currentPage, setCurrentPage] = useState(1);
    const [limit] = useState(12);

    const fetchCoupons = useCallback(async (page = 1) => {
        try {
            setLoading(true);
            setError(null);
            const response: ApiResponse = await getOwnerCoupons({ page, limit });
            console.log(response);

            if (response.success && response.data) {
                setCouponsData(response.data.data);
                setPaginationData({
                    currentPage: response.data.currentPage,
                    totalPages: response.data.totalPages,
                    hasNextPage: response.data.hasNextPage,
                    hasPreviousPage: response.data.hasPreviousPage,
                    totalCount: response.data.totalCount
                });
            } else {
                throw new Error(response.message || 'Failed to fetch coupons');
            }
        } catch (error: unknown) {
            setError('Failed to fetch coupons. Please try again.');
            console.error('Error fetching coupons:', err);
        } finally {
            setLoading(false);
        }
    }, [limit]);

    useEffect(() => {
        fetchCoupons(currentPage);
    }, [fetchCoupons, currentPage]);

    const getFilteredCoupons = useCallback((): Coupon[] => {
        if (!couponsData || couponsData.length === 0) return [];

        let filtered = [...couponsData];

        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            filtered = filtered.filter(coupon =>
                coupon.name.toLowerCase().includes(searchLower) ||
                coupon.uniqueId.toLowerCase().includes(searchLower) ||
                coupon.theaterIds.some(theater => theater.name.toLowerCase().includes(searchLower))
            );
        }

        if (statusFilter !== 'all') {
            const now = new Date();
            filtered = filtered.filter(coupon => {
                switch (statusFilter) {
                    case 'active':
                        return coupon.isActive && new Date(coupon.expiryDate) > now && coupon.currentUsageCount < coupon.maxUsageCount;
                    case 'expired':
                        return new Date(coupon.expiryDate) <= now;
                    case 'used':
                        return coupon.currentUsageCount >= coupon.maxUsageCount;
                    default:
                        return true;
                }
            });
        }

        if (ownerFilter !== 'all') {
            filtered = filtered.filter(coupon =>
                coupon.theaterIds.some(theater => theater._id === ownerFilter)
            );
        }

        return filtered;
    }, [couponsData, searchTerm, statusFilter, ownerFilter]);

    const getUniqueTheaters = useCallback(() => {
        if (!couponsData || couponsData.length === 0) return [];

        const theaterMap = new Map();
        couponsData.forEach(coupon => {
            coupon.theaterIds.forEach(theater => {
                if (!theaterMap.has(theater._id)) {
                    theaterMap.set(theater._id, theater);
                }
            });
        });

        return Array.from(theaterMap.values());
    }, [couponsData]);

    const getStats = useCallback((): CouponStats => {
        if (!couponsData || couponsData.length === 0) return { active: 0, expired: 0, used: 0, total: 0 };

        const now = new Date();
        const stats = couponsData.reduce((acc, coupon) => {
            acc.total++;

            if (!coupon.isActive) {
            } else if (new Date(coupon.expiryDate) <= now) {
                acc.expired++;
            } else if (coupon.currentUsageCount >= coupon.maxUsageCount) {
                acc.used++;
            } else {
                acc.active++;
            }

            return acc;
        }, { active: 0, expired: 0, used: 0, total: 0 });

        return stats;
    }, [couponsData]);

    const handleViewDetails = useCallback((coupon: Coupon) => {
        setSelectedCoupon(coupon);
        setIsModalOpen(true);
    }, []);

    const handleToggleStatus = async (couponId: string,f:boolean) => {
        try {
            const confirmed = await confirmAction({
                title: ` Toggle Status?`,
                message: `Are you sure you want to change status of this coupon"?`,
                confirmText: 'Confirm',
                cancelText: "Cancel",
            });
            if (!confirmed) return
            setActionLoading(true);
            console.log(couponId);
let val=!f
            const response = await toggleStatus(couponId,val);
            console.log(response);

            if (response.success || response.data) {
                setCouponsData(prevData =>
                    prevData.map(coupon =>
                        coupon._id === couponId
                            ? { ...coupon, isActive: !coupon.isActive }
                            : coupon
                    )
                );

                if (selectedCoupon?._id === couponId) {
                    setSelectedCoupon(prev => prev ? { ...prev, isActive: !prev.isActive } : null);
                }
            } else {
                throw new Error('Failed to update coupon status');
            }
toast.success('Status changed')
        } catch (error: unknown) {
            setError('Failed to update coupon status. Please try again.');
            console.error('Error toggling coupon status:', err);
        } finally {
            setActionLoading(false);
        }
    }

    const handleRefresh = useCallback(() => {
        fetchCoupons(currentPage);
    }, [fetchCoupons, currentPage]);

    const filteredCoupons = getFilteredCoupons();
    const stats = getStats();
    const uniqueTheaters = getUniqueTheaters();

    if (loading && (!couponsData || couponsData.length === 0)) {
        return (
            <div className="min-h-screen bg-gray-900 p-6 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
                    <p className="text-gray-400" style={{ fontFamily: lexend.style.fontFamily }}>
                        Loading coupons...
                    </p>
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
                                <Ticket className="w-6 h-6 text-yellow-400" />
                            </div>
                            Coupon Management
                        </h1>
                        <p className="text-gray-400" style={{ fontFamily: lexend.style.fontFamily }}>
                            Manage discount coupons, monitor usage, and control availability across theaters.
                        </p>
                    </div>

                    <button
                        onClick={handleRefresh}
                        disabled={loading}
                        className="flex items-center gap-2 px-4 py-3 rounded-xl transition-all duration-300 hover:bg-white/10 text-gray-400 hover:text-white border border-gray-500/30 disabled:opacity-50"
                        style={{ fontFamily: lexend.style.fontFamily }}
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                </div>

                {/* Error Display */}
                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-red-400" />
                        <p className="text-red-400" style={{ fontFamily: lexend.style.fontFamily }}>
                            {error}
                        </p>
                        <button
                            onClick={() => setError(null)}
                            className="ml-auto text-red-400 hover:text-red-300"
                        >
                            ×
                        </button>
                    </div>
                )}

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-gray-800/50 border border-yellow-500/20 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-500/20 rounded-lg">
                                <Ticket className="w-5 h-5 text-green-400" />
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm" style={{ fontFamily: lexend.style.fontFamily }}>
                                    Active
                                </p>
                                <p className={`${lexend.className} text-xl text-green-400 font-bold`}>
                                    {stats.active}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-800/50 border border-yellow-500/20 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-red-500/20 rounded-lg">
                                <Ticket className="w-5 h-5 text-red-400" />
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm" style={{ fontFamily: lexend.style.fontFamily }}>
                                    Expired
                                </p>
                                <p className={`${lexend.className} text-xl text-red-400 font-bold`}>
                                    {stats.expired}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-800/50 border border-yellow-500/20 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-orange-500/20 rounded-lg">
                                <Ticket className="w-5 h-5 text-orange-400" />
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm" style={{ fontFamily: lexend.style.fontFamily }}>
                                    Fully Used
                                </p>
                                <p className={`${lexend.className} text-xl text-orange-400 font-bold`}>
                                    {stats.used}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-800/50 border border-yellow-500/20 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-yellow-500/20 rounded-lg">
                                <Ticket className="w-5 h-5 text-yellow-400" />
                            </div>
                            <div>
                                <p className="text-gray-400 text-sm" style={{ fontFamily: lexend.style.fontFamily }}>
                                    Total
                                </p>
                                <p className={`${lexend.className} text-xl text-yellow-400 font-bold`}>
                                    {stats.total}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="bg-gray-800/50 border border-yellow-500/20 rounded-2xl p-6">
                    <div className="flex flex-col lg:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by coupon name, code, or theater name..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:border-yellow-500/50 focus:outline-none"
                                    style={{ fontFamily: lexend.style.fontFamily }}
                                />
                            </div>
                        </div>

                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as string)}
                            className="px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:border-yellow-500/50 focus:outline-none"
                            style={{ fontFamily: lexend.style.fontFamily }}
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="expired">Expired</option>
                            <option value="used">Fully Used</option>
                        </select>

                        <select
                            value={ownerFilter}
                            onChange={(e) => setOwnerFilter(e.target.value)}
                            className="px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-xl text-white focus:border-yellow-500/50 focus:outline-none"
                            style={{ fontFamily: lexend.style.fontFamily }}
                        >
                            <option value="all">All Theaters</option>
                            {uniqueTheaters.map((theater: Theater) => (
                                <option key={theater._id} value={theater._id}>
                                    {theater.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Coupons Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, index) => (
                            <div key={index} className="bg-gray-800/50 border border-yellow-500/20 rounded-2xl p-6 animate-pulse">
                                <div className="h-6 bg-gray-700 rounded mb-4"></div>
                                <div className="h-4 bg-gray-700 rounded mb-2"></div>
                                <div className="h-4 bg-gray-700 rounded mb-4"></div>
                                <div className="flex gap-2">
                                    <div className="h-10 bg-gray-700 rounded flex-1"></div>
                                    <div className="h-10 bg-gray-700 rounded w-20"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCoupons.map((coupon: Coupon) => (
                            <CouponCard
                                key={coupon._id}
                                coupon={coupon}
                                lexend={lexend}
                                onViewDetails={handleViewDetails}
                                onToggleStatus={handleToggleStatus}
                                loading={actionLoading}
                            />
                        ))}
                    </div>
                )}

                {!loading && filteredCoupons.length === 0 && (
                    <div className="text-center py-12">
                        <Ticket className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400 text-lg" style={{ fontFamily: lexend.style.fontFamily }}>
                            {couponsData.length === 0
                                ? 'No coupons found'
                                : 'No coupons match your search criteria'
                            }
                        </p>
                    </div>
                )}

                {/* Pagination */}
                {paginationData && paginationData.totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={!paginationData.hasPreviousPage || loading}
                            className="px-4 py-2 bg-gray-700/50 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600/50"
                            style={{ fontFamily: lexend.style.fontFamily }}
                        >
                            Previous
                        </button>

                        <span className="text-gray-400 px-4" style={{ fontFamily: lexend.style.fontFamily }}>
                            Page {paginationData.currentPage} of {paginationData.totalPages}
                        </span>

                        <button
                            onClick={() => setCurrentPage(prev => Math.min(paginationData.totalPages, prev + 1))}
                            disabled={!paginationData.hasNextPage || loading}
                            className="px-4 py-2 bg-gray-700/50 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-600/50"
                            style={{ fontFamily: lexend.style.fontFamily }}
                        >
                            Next
                        </button>
                    </div>
                )}

                {/* Total Count Display */}
                {paginationData && (
                    <div className="text-center">
                        <p className="text-gray-400 text-sm" style={{ fontFamily: lexend.style.fontFamily }}>
                            Showing {filteredCoupons.length} of {paginationData.totalCount} total coupons
                        </p>
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && selectedCoupon && (
                <CouponModal
                    coupon={selectedCoupon}
                    lexend={lexend}
                    onClose={() => {
                        setIsModalOpen(false);
                        setSelectedCoupon(null);
                    }}
                    onToggleStatus={handleToggleStatus}
                    loading={actionLoading}
                />
            )}
        </div>
    );
};

export default CouponManagement;
