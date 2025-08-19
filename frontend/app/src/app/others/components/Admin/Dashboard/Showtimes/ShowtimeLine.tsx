import React from "react";
import { IShowtime } from "./index";
import { confirmAction } from "@/app/others/Utils/ConfirmDialog";
import { toggleleShowTime } from "@/app/others/services/adminServices/showTimeServices";
import toast from "react-hot-toast";
import { ShowtimeFilters } from "./ShowtimesModal";

interface ShowtimeLineProps {
  showtime: IShowtime;
  fetchShowtimes: (page: number, currentFilters: ShowtimeFilters) => void
}

const ShowtimeLine: React.FC<ShowtimeLineProps> = ({
  fetchShowtimes,


  showtime }) => {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  const handleToggleShowTimeStatus = async (showtimeId: string, isActive: boolean) => {

    let verb = isActive ? 'disable' : 'enable'
    let capitalVerb = verb.toUpperCase()

    const confirmed = await confirmAction({
      title: `${capitalVerb} Owner?`,
      message: `Are you sure you want to ${verb} this show?`,
      confirmText: capitalVerb,
      cancelText: "Cancel",
    });
    if (!confirmed) return;
    try {
      const data = await toggleleShowTime(showtimeId, isActive)
      console.log(data);

      toast.success(`Screen succusfully ${verb}d`)
      fetchShowtimes(0, {})


    } catch (error) {
      console.log(error);

    }

  }
  const getMovieTitle = (): string => {
    if (typeof showtime.movieId === 'object' && showtime.movieId !== null) {
      return showtime.movieId.title || 'Unknown Movie';
    }
    return showtime.movieId || 'Unknown Movie';
  };

  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center bg-[#2a2a2a] rounded py-3 px-4 gap-2">
      <div className="text-white">
        <div className="font-bold">
          {formatDate(showtime.showDate)} {showtime.showTime}-{showtime.endTime}
        </div>
        <div className="text-sm">
          Movie: <span className="font-semibold text-[#e78f03]">{getMovieTitle()}</span>
        </div>
      </div>
      <div className="flex gap-7">
        <div className="flex items-center">
          <button

            onClick={() => handleToggleShowTimeStatus(showtime._id, showtime.isActive)}
            className={`py-1 rounded-sm px-2 ${showtime.isActive ? 'bg-red-500 text-white' : 'bg-green-400 text-black'}`}>
            {showtime.isActive ? 'Disable' : 'Enable'}
          </button>
        </div>
        <div className="text-sm text-gray-400 flex flex-col sm:text-right">
          <div>Format: {showtime.format} | Language: {showtime.language}</div>
          <div>
            Available: <span className="text-green-400">{showtime.availableSeats}</span>/
            <span className="text-gray-300">{showtime.totalSeats}</span> seats
          </div>
          <div className="text-xs">
            Status: <span className={showtime.isActive ? "text-green-400" : "text-red-400"}>
              {showtime.isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowtimeLine;
