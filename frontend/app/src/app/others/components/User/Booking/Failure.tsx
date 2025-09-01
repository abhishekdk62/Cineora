'use client';

import React from 'react';
import { XCircle, RotateCcw, Calendar, Clock, Users, ArrowRight, AlertTriangle } from 'lucide-react';
import { useRouter } from 'next/navigation';

const lexendBold = { className: "font-bold" };
const lexendMedium = { className: "font-medium" };
const lexendSmall = { className: "font-normal text-sm" };

interface PaymentFailureProps {
  bookingDetails?: {
    movieTitle: string;
    theaterName: string;
    screenName: string;
    showDate: string;
    showTime: string;
    seats: string[];
    totalAmount: number;
    attemptedAmount?: number;
  };
  errorDetails?: {
    message: string;
    code?: string;
    reason?: string;
  };
}

const PaymentFailurePage: React.FC<PaymentFailureProps> = ({
  bookingDetails,
  errorDetails
}) => {
  const router = useRouter();

  const handleTryAgain = () => {
    router.back();
  };

  const handleBrowseMovies = () => {
    router.push('/search/movies');
  };

  return (
    <div className="min-h-screen bg-transparent p-6 flex items-center justify-center">
      <div className="max-w-md w-full space-y-8">

        {/* Failure Icon and Header */}
        <div className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center">
            <XCircle className="w-12 h-12 text-red-400" />
          </div>

          <div className="space-y-2">
            <h1 className={`${lexendBold.className} text-3xl text-white`}>
              Payment Failed!
            </h1>
            <p className={`${lexendSmall.className} text-gray-400`}>
              Your booking could not be completed
            </p>
          </div>
        </div>



        {/* Booking Details Card (if available) */}
        {bookingDetails && (
          <div className="backdrop-blur-sm bg-black/20 rounded-2xl p-6 border border-gray-500/30 space-y-4">
            <h3 className={`${lexendMedium.className} text-white text-lg mb-4`}>
              Attempted Booking Details
            </h3>

            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-gray-400" />
                </div>
                <div>
                  <p className={`${lexendSmall.className} text-gray-400`}>Movie & Theater</p>
                  <p className={`${lexendMedium.className} text-white text-sm`}>
                    {bookingDetails.movieTitle}
                  </p>
                  <p className={`${lexendSmall.className} text-gray-300 text-xs`}>
                    {bookingDetails.theaterName} - {bookingDetails.screenName}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 text-gray-400" />
                </div>
                <div>
                  <p className={`${lexendSmall.className} text-gray-400`}>Show Time</p>
                  <p className={`${lexendMedium.className} text-white text-sm`}>
                    {bookingDetails.showDate} at {bookingDetails.showTime}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-gray-400" />
                </div>
                <div>
                  <p className={`${lexendSmall.className} text-gray-400`}>Seats</p>
                  <p className={`${lexendMedium.className} text-white text-sm`}>
                    {bookingDetails.seats.join(', ')}
                  </p>
                </div>
              </div>
            </div>

            {/* Failed Amount */}
            <div className="flex justify-between items-center p-4 bg-red-500/5 rounded-xl border border-red-500/20 mt-4">
              <span className={`${lexendBold.className} text-white text-lg`}>AMOUNT FAILED</span>
              <span className={`${lexendBold.className} text-red-400 text-xl`}>
                ₹{bookingDetails.attemptedAmount || bookingDetails.totalAmount}
              </span>
            </div>

            {/* Reassurance Message */}
            <div className="text-center pt-2">
              <p className={`${lexendSmall.className} text-gray-400`}>
                Don't worry, no money has been deducted
              </p>
              <p className={`${lexendSmall.className} text-gray-500 text-xs`}>
                Your seats are still available for booking
              </p>
            </div>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={handleBrowseMovies}
            className={`${lexendMedium.className} w-full bg-white text-black px-6 py-4 rounded-xl hover:bg-gradient-to-tr hover:from-violet-300 hover:to-yellow-100 transition-all duration-200 transform hover:scale-[1.02] flex items-center justify-center gap-2`}
          >

            Try Booking Again
            <ArrowRight className="w-4 h-4" />
          </button>

        </div>

        {/* Support Message */}
        <div className="text-center space-y-2">
          <p className={`${lexendSmall.className} text-gray-400`}>
            Need help? Contact our support team
          </p>
          <p className={`${lexendSmall.className} text-gray-500`}>
            support@cineora.com | +91 12345 67890
          </p>
        </div>
      </div>
    </div>
  );
};

export default PaymentFailurePage;
