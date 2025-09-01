'use client';

import { getTicketsApi } from '@/app/others/services/userServices/ticketServices';
import React, { useEffect, useState } from 'react';
import TicketCard from './TicketCard';
import TicketDetailsModal from './TicketDetailsModal';
import Loader from '../../../utils/Loader';
import Pagination from '../../../utils/Pagination';

const lexendBold = { className: "font-bold" };
const lexendSmall = { className: "font-normal text-sm" };
const lexendMedium = { className: "font-medium" };

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
    tickets: TicketData[];
    total: number;
    page: number;
    totalPages: number;
}

type TabType = 'upcoming' | 'history';

const TicketsList: React.FC = () => {
    const [ticketsData, setTicketsData] = useState<TicketsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedTicket, setSelectedTicket] = useState<TicketData | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [activeTab, setActiveTab] = useState<TabType>('upcoming');

    const [currentPage, setCurrentPage] = useState(1);
    const [limit] = useState(4); 

    const getTickets = async (pageNumber: number = 1) => {
        try {
            setLoading(true);
            const response = await getTicketsApi(
            );
            console.log(response.data);
            setTicketsData(response.data);
            setError(null);
        } catch (error) {
            console.log(error);
            setError('Failed to load tickets');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getTickets(currentPage);
    }, [currentPage]);

    useEffect(() => {
        if (currentPage !== 1) {
            setCurrentPage(1);
        } else {
            getTickets(1);
        }
    }, [activeTab]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const isShowInPast = (showDate: string, endTime: string) => {
        const showDateTime = new Date(showDate);
        const [hours, minutes] = endTime.split(':');
        showDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);

        return showDateTime < new Date();
    };

    const groupTicketsByBooking = (tickets: TicketData[]) => {
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
        if (!ticketsData?.tickets) return [];

        const allBookings = groupTicketsByBooking(ticketsData.tickets);

        return allBookings.filter(booking => {
            const endTime = booking.showtimeId?.endTime || booking.showTime;
            const isPast = isShowInPast(booking.showDate, endTime)||booking.status=='cancelled';
            

            return activeTab === 'upcoming' ? !isPast : isPast;
        });
    };

    const getTabCounts = () => {
        if (!ticketsData?.tickets) return { upcoming: 0, history: 0 };

        const allBookings = groupTicketsByBooking(ticketsData.tickets);
        let upcoming = 0;
        let history = 0;

        allBookings.forEach(booking => {
            const endTime = booking.showtimeId?.endTime || booking.showTime;
            const isPast = isShowInPast(booking.showDate, endTime)||booking.status=='cancelled';

            if (isPast) {
                history++;
            } else {
                upcoming++;
            }
        });

        return { upcoming, history };
    };

    const handleViewDetails = (ticket: any) => {
        setSelectedTicket(ticket);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedTicket(null);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-transparent p-12 flex items-center justify-center">
                <div className="text-white text-xl"><Loader text='Loading your tickets' /></div>
            </div>
        );
    }

    if (error) {
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
                {/* Header Section */}
                <div className="mb-10">
                    <h1 className={`${lexendBold.className} text-5xl text-center text-white mb-2`}>
                        My Tickets
                    </h1>
                </div>

                {/* Tab Navigation */}
                <div className="flex items-center justify-center gap-4 mb-8">
                    <button
                        onClick={() => setActiveTab('upcoming')}
                        className={`${lexendMedium.className} border px-6 py-3 rounded-xl transition-all duration-200 flex items-center gap-2 ${activeTab === 'upcoming'
                                ? 'bg-transparent border-white text-white'
                                : 'bg-white/10 text-gray-300 border-white/20 hover:bg-white/20 hover:text-white'
                            }`}
                    >
                        <p
                            className="tracking-[0.3em] text-sm font-extralight relative z-10"
                            style={{
                                textShadow: activeTab === 'upcoming'
                                    ? '0 0 10px rgba(6, 182, 212, 0.3)'
                                    : 'none',
                            }}
                        >
                            UPCOMING
                        </p>
                        {tabCounts.upcoming > 0 && (
                            <span className={`px-2 py-1 rounded-full text-xs ${activeTab === 'upcoming'
                                    ? 'bg-gray-500 text-white border border-white'
                                    : 'bg-white/20 text-white'
                                }`}>
                                {tabCounts.upcoming}
                            </span>
                        )}
                    </button>

                    <button
                        onClick={() => setActiveTab('history')}
                        className={`${lexendMedium.className} border px-6 py-3 rounded-xl transition-all duration-200 flex items-center gap-2 ${activeTab === 'history'
                                ? 'bg-transparent border-white text-white'
                                : 'bg-white/10 text-gray-300 border-white/20 hover:bg-white/20 hover:text-white'
                            }`}
                    >
                        <p
                            className="tracking-[0.3em] text-sm font-extralight relative z-10"
                            style={{
                                textShadow: activeTab === 'history'
                                    ? '0 0 10px rgba(6, 182, 212, 0.3)'
                                    : 'none',
                            }}
                        >
                            HISTORY
                        </p>
                        {tabCounts.history > 0 && (
                            <span className={`px-2 py-1 rounded-full text-xs ${activeTab === 'history'
                                    ? 'bg-gray-500 text-white border border-white'
                                    : 'bg-white/20 text-white'
                                }`}>
                                {tabCounts.history}
                            </span>
                        )}
                    </button>
                </div>

                {/* Tickets List */}
                {filteredBookings.map((booking) => (
                    <TicketCard
                    getTickets={getTickets}
                        activeTab={activeTab}
                        key={booking._id}
                        booking={booking}
                        onViewDetails={handleViewDetails}
                    />
                ))}

                {/* Empty State */}
                {filteredBookings.length === 0 && (
                    <div className="text-center bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/10 rounded-2xl p-12 backdrop-blur-xl">
                        <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                            {activeTab === 'upcoming' ? (
                                <svg className="w-8 h-8 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            ) : (
                                <svg className="w-8 h-8 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            )}
                        </div>
                        <h3 className={`${lexendBold.className} text-xl text-white mb-2`}>
                            {activeTab === 'upcoming' ? 'No Upcoming Shows' : 'No Show History'}
                        </h3>
                        <p className={`${lexendSmall.className} text-gray-400 mb-6`}>
                            {activeTab === 'upcoming'
                                ? "You don't have any upcoming movie shows. Start exploring movies!"
                                : "You don't have any completed shows yet."
                            }
                        </p>
                        {activeTab === 'upcoming' && (
                            <button className={`${lexendBold.className} bg-white text-black px-6 py-3 rounded-xl hover:bg-white/90 transition-colors`}>
                                Browse Movies
                            </button>
                        )}
                    </div>
                )}

                {/* Pagination Component
                {ticketsData && ticketsData.totalPages > 1 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={ticketsData.totalPages}
                        onPageChange={handlePageChange}
                        className="pt-10"
                    />
                )} */}

                {/* Modal */}
                {showModal && selectedTicket && (
                    <TicketDetailsModal
                    activeTab={activeTab}
                        ticket={selectedTicket}
                        onClose={handleCloseModal}
                    />
                )}
            </div>
        </div>
    );
};

export default TicketsList;
