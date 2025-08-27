// components/tickets/TicketsList.tsx
'use client';

import { getTicketsApi } from '@/app/others/services/userServices/ticketServices';
import React, { useEffect, useState } from 'react';
import TicketCard from './TicketCard';
import TicketDetailsModal from './TicketDetailsModal';
import Loader from '../../../utils/Loader';


// Lexend font classes
const lexendBold = { className: "font-bold" };
const lexendSmall = { className: "font-normal text-sm" };

// Updated interface to match your backend data structure
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

const TicketsList: React.FC = () => {
    const [ticketsData, setTicketsData] = useState<TicketsResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedTicket, setSelectedTicket] = useState<TicketData | null>(null);
    const [showModal, setShowModal] = useState(false);

    const getTickets = async () => {
        try {
            setLoading(true);
            const response = await getTicketsApi();
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
        getTickets();
    }, []);

    // Group tickets by booking to show multiple seats together
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
            return {
                ...firstTicket,
                seats: ticketGroup.map(t => `${t.seatRow}${t.seatNumber}`),
                allTickets: ticketGroup,
                totalPrice: ticketGroup.reduce((sum, ticket) => sum + ticket.price, 0)
            };
        });
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

    const bookings = ticketsData?.tickets ? groupTicketsByBooking(ticketsData.tickets) : [];

    return (
        <div className="min-h-screen bg-transparent p-12">
            <div className="mx-auto max-w-5xl space-y-7">
                {/* Header Section */}
                <div className="mb-10">
                    <h1 className={`${lexendBold.className} text-4xl text-white mb-2`}>
                        My Tickets
                    </h1>
                    <p className={`${lexendSmall.className} text-gray-400`}>
                        Manage your movie bookings and ticket history ({ticketsData?.total || 0} tickets)
                    </p>
                </div>

                {/* Tickets List */}
                {bookings.map((booking) => (
                    <TicketCard
                        key={booking._id}
                        booking={booking}
                        onViewDetails={handleViewDetails}
                    />
                ))}

                {/* Empty State */}
                {bookings.length === 0 && (
                    <div className="text-center bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/10 rounded-2xl p-12 backdrop-blur-xl">
                        <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                            </svg>
                        </div>
                        <h3 className={`${lexendBold.className} text-xl text-white mb-2`}>
                            No Tickets Found
                        </h3>
                        <p className={`${lexendSmall.className} text-gray-400 mb-6`}>
                            You haven't booked any movie tickets yet. Start exploring movies!
                        </p>
                        <button className={`${lexendBold.className} bg-white text-black px-6 py-3 rounded-xl hover:bg-white/90 transition-colors`}>
                            Browse Movies
                        </button>
                    </div>
                )}

                {showModal && selectedTicket && (
                    <TicketDetailsModal
                        ticket={selectedTicket}
                        onClose={handleCloseModal}
                    />
                )}
            </div>
        </div>
    );
};

export default TicketsList;
