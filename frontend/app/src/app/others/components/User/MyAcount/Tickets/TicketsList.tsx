// @ts-nocheck
'use client';
import { getTicketsApi } from '@/app/others/services/userServices/ticketServices';
import React, { useEffect, useState, useCallback } from 'react';
import TicketCard from './TicketCard';
import TicketDetailsModal from './TicketDetailsModal';
import Loader from '../../../utils/Loader';
import TabNavigation from './TabNavigation';
import EmptyState from './EmptyState';
import ReviewModal from './ReviewModal';
import toast from 'react-hot-toast';
import { addReview } from '@/app/others/services/userServices/reviewServices';

const lexendBold = { className: "font-bold" };

interface TicketData {
    _id: string;
    ticketId: string;
    bookingId: string;
    userId: string;
    movieId: {
        _id: string;
        title: string;
        poster: string;
    };
    theaterId: {
        _id: string;
        name: string;
    };
    screenId: {
        _id: string;
        name: string;
    };
    seatNumber: string;
    seatRow: string;
    seatType: string;
    price: number;
    showDate: string;
    showTime: string;
    showtimeId: {
        showTime: string;
        endTime: string;
        _id: string;
    };
    status: 'confirmed' | 'cancelled' | 'used' | 'expired';
    qrCode: string;
    isUsed: boolean;
    createdAt: string;
    updatedAt: string;
}

interface TicketsResponse {
    success: boolean;
    message: string;
    data: {
        tickets: TicketData[];
        total: number;
        page: number;
        totalPages: number;
    };
}

type TabType = 'upcoming' | 'history';

const TicketsList: React.FC = () => {
    const [ticketsData, setTicketsData] = useState<TicketsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedTicket, setSelectedTicket] = useState<TicketData | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [activeTab, setActiveTab] = useState<TabType>('upcoming');
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [rating, setRating] = useState(0);
    const [selectedBookingForReview, setSelectedBookingForReview] = useState('');
    const [reviewText, setReviewText] = useState('');
    const [submittingReview, setSubmittingReview] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [reviewType, setReviewType] = useState<'movie' | 'theater' | 'experience'>('movie');
    const [limit] = useState(10);
    const [hasMore, setHasMore] = useState(true);
    const [allTickets, setAllTickets] = useState<TicketData[]>([]);

    const getTickets = async (pageNumber: number = 1, filterType?: string, append: boolean = false) => {
        try {
            if (pageNumber === 1) {
                setLoading(true);
            } else {
                setLoadingMore(true);
            }

            let typeParam: string;
            if (filterType) {
                typeParam = filterType;
            } else {
                typeParam = activeTab === 'upcoming' ? 'upcoming' : 'past';
            }

            const response = await getTicketsApi(pageNumber, limit, typeParam);
            console.log(response);

            if (response.success) {
                if (append && pageNumber > 1) {
                    setAllTickets(prev => [...prev, ...response.data]);
                } else {
                    setAllTickets(response.data);
                }

                setTicketsData(response);
                setHasMore(pageNumber < response.meta
                    .totalPages);
                setError(null);
            } else {
                setError(response.message || 'Failed to load tickets');
            }
        } catch (error) {
            console.error('Error fetching tickets:', error);
            setError('Failed to load tickets');
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    };

    const loadMoreTickets = useCallback(() => {
        if (!loadingMore && hasMore && !loading) {
            const nextPage = currentPage + 1;
            setCurrentPage(nextPage);
            getTickets(nextPage, undefined, true);
        }
    }, [loadingMore, hasMore, loading, currentPage]);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;

            if (scrollTop + windowHeight >= documentHeight - 300) {
                loadMoreTickets();
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [loadMoreTickets]);

    useEffect(() => {
        setCurrentPage(1);
        setAllTickets([]);
        getTickets(1);
    }, [activeTab]);

    const groupTicketsByBooking = (tickets: TicketData[]) => {
        if (!tickets || tickets.length === 0) return [];

        const grouped = tickets.reduce((acc, ticket) => {
            if (!acc[ticket.bookingId]) {
                acc[ticket.bookingId] = [];
            }
            acc[ticket.bookingId].push(ticket);
            return acc;
        }, {} as Record<string, TicketData[]>);

        return Object.values(grouped).map(ticketGroup => {
            const firstTicket = ticketGroup[0];
            const baseTotal = ticketGroup.reduce((sum, ticket) => sum + ticket.price, 0);
            const tax = baseTotal * 0.18;
            const convenience = baseTotal * 0.05;
            const totalPrice = baseTotal + tax + convenience;

            return {
                ...firstTicket,
                seats: ticketGroup.map(t => `${t.seatRow}${t.seatNumber}`),
                allTickets: ticketGroup,
                totalPrice: totalPrice
            };
        });
    };

    const getFilteredBookings = () => {
        return groupTicketsByBooking(allTickets);
    };

    const getTabCounts = () => {
        return {
            upcoming: activeTab === 'upcoming' ? ticketsData?.data?.total || 0 : 0,
            history: activeTab === 'history' ? ticketsData?.data?.total || 0 : 0
        };
    };

    const handleViewDetails = (ticket: any) => {
        setSelectedTicket(ticket);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedTicket(null);
    };

    const handleAddReview = (booking: any) => {
        setSelectedBookingForReview(booking);
        setShowReviewModal(true);
    };

    const handleSubmitReview = async () => {
        if (rating === 0) {
            toast.error('Please select a rating');
            return;
        }

        const movieId = selectedBookingForReview.movie?._id || selectedBookingForReview.movieId?._id || selectedBookingForReview.movieId;
        const theaterId = selectedBookingForReview.theater?._id || selectedBookingForReview.theaterId?._id || selectedBookingForReview.theaterId;

        let reviewData = {
            movieId: movieId,
            theaterId: theaterId,
            bookingId: selectedBookingForReview.bookingId,
            rating: rating,
            reviewText: reviewText,
            reviewType: reviewType,
        };
        try {
            setSubmittingReview(true);
            const data = await addReview(reviewData);
            toast.success('Review submitted successfully!');
            setShowReviewModal(false);
            setRating(0);
            setReviewText('');
            setCurrentPage(1);
            setAllTickets([]);
            getTickets(1);
        } catch (error) {
            if (error.response.data.message.includes('already reviewed')) {
                toast('You have already reviewed this show!',
                    {
                        style: {
                            borderRadius: '10px',
                            background: '#333',
                            color: '#fff',
                        },
                    }
                );

                return
            }
            console.error('Failed to submit review:', error);
            toast.error('Failed to submit review. Please try again.');
        } finally {
            setSubmittingReview(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-transparent p-12 flex items-center justify-center">
                <div className="text-white text-xl">
                    <Loader text='Loading your tickets' />
                </div>
            </div>
        );
    }

    if (error && allTickets.length === 0) {
        return (
            <div className="min-h-screen bg-transparent p-12 flex items-center justify-center">
                <div className="text-red-400 text-xl">{error}</div>
            </div>
        );
    }

    const filteredBookings = getFilteredBookings();
    const tabCounts = getTabCounts();

    return (
        <div className="min-h-screen bg-transparent p-12">
            <div className="mx-auto max-w-5xl space-y-7">
                <div className="mb-10">
                    <h1 className={`${lexendBold.className} text-5xl text-center text-white mb-2`}>
                        My Tickets
                    </h1>
                </div>

                <TabNavigation
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    tabCounts={tabCounts}
                />

                {filteredBookings.map((booking) => (
                    <TicketCard
                        handleAddReview={handleAddReview}
                        getTickets={() => {
                            setCurrentPage(1);
                            setAllTickets([]);
                            getTickets(1);
                        }}
                        activeTab={activeTab}
                        key={booking._id}
                        booking={booking}
                        onViewDetails={handleViewDetails}
                    />
                ))}

                {loadingMore && (
                    <div className="flex justify-center mt-8">
                        <div className="flex items-center gap-2 text-white">
                            <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                            <span>Loading more tickets...</span>
                        </div>
                    </div>
                )}

                {hasMore && !loading && !loadingMore && (
                    <div className="flex justify-center mt-8">
                        <button
                            onClick={loadMoreTickets}
                            className="px-8 py-3 bg-white/10 border border-white/20 text-white rounded-xl hover:bg-white/20 hover:border-white/40 transition-all duration-200"
                        >
                            Load More
                        </button>
                    </div>
                )}

                {!hasMore && filteredBookings.length > 0 && (
                    <div className="text-center text-gray-400 text-sm py-8">
                        You've reached the end of your tickets
                    </div>
                )}

                {filteredBookings.length === 0 && !loading && (
                    <EmptyState activeTab={activeTab} />
                )}

                {ticketsData?.data && filteredBookings.length > 0 && (
                    <div className="text-center text-gray-400 text-sm">
                        Showing {filteredBookings.length} of {ticketsData.data.total} bookings
                    </div>
                )}

                {showModal && selectedTicket && (
                    <TicketDetailsModal
                        activeTab={activeTab}
                        ticket={selectedTicket}
                        onClose={handleCloseModal}
                    />
                )}

                <ReviewModal
                    setReviewType={setReviewType}
                    reviewType={reviewType}
                    isOpen={showReviewModal}
                    onClose={() => setShowReviewModal(false)}
                    selectedBooking={selectedBookingForReview}
                    rating={rating}
                    setRating={setRating}
                    reviewText={reviewText}
                    setReviewText={setReviewText}
                    onSubmit={handleSubmitReview}
                    submittingReview={submittingReview}
                />
            </div>
        </div>
    );
};

export default TicketsList;
