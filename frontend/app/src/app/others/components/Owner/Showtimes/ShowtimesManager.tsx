"use client";

import React, { useState, useEffect } from "react";
import { Plus, Calendar, Film, ChevronLeft, ChevronRight } from "lucide-react";
import ShowtimeForm from "./ShowtimeForm";
import ShowtimeList from "./ShowtimeList";
import { createShowtimeOwner, editShowtimeOwner, getShowTimesOwner } from "@/app/others/services/ownerServices/showtimeServices";
import toast from "react-hot-toast";
import { ShowtimeResponseDto } from "@/app/others/dtos";
import { lexendMedium, lexendSmall } from "@/app/others/Utils/fonts";
import { ShowtimeData } from "@/app/book/tickets/[showtimeId]/page";

interface ShowtimeManagerProps { }

const ShowtimeManager: React.FC<ShowtimeManagerProps> = ({ }) => {
  const [showtimes, setShowtimes] = useState<ShowtimeResponseDto[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingShowtime, setEditingShowtime] = useState<ShowtimeResponseDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit" | "view">("create");
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [showtimeFilter, setShowtimeFilter] = useState<"upcoming" | "past">("upcoming");
  const ITEMS_PER_PAGE = 10;
  useEffect(() => {
    setMounted(true);
    fetchShowtimes(1);
  }, []);
  const fetchShowtimes = async (
    pageNumber: number,
    filter: "upcoming" | "past" = showtimeFilter
  ) => {
    try {
      setLoading(true);

      const data = await getShowTimesOwner({
        page: pageNumber,
        limit: ITEMS_PER_PAGE,
        filter: filter,
      });

      console.log('the showtime data:', data);

      const newShowtimes = data.data || [];
      const total = data?.meta?.pagination?.total || 0;

      setShowtimes(newShowtimes);
      setTotalCount(total);
      setTotalPages(Math.ceil(total / ITEMS_PER_PAGE));
      setPage(pageNumber);

    } catch (error) {
      console.error("Error fetching showtimes:", error);
      toast.error("Failed to fetch showtimes");
    } finally {
      setLoading(false);
    }
  };

  const handleAddShowtime = () => {
    setEditingShowtime(null);
    setFormMode("create");
    setIsFormOpen(true);
  };

  const handleEditShowtime = (showtime: ShowtimeResponseDto) => {
    const now = new Date();
    const showDate = new Date(showtime.showDate);
    const [hours, minutes] = showtime.showTime.split(':');
    const showDateTime = new Date(showDate);
    showDateTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    if (showDateTime < now) {
      toast.error("Cannot edit past showtimes");
      return;
    }
    const hasBookings = (showtime.totalSeats - showtime.availableSeats) > 0;
    if (hasBookings) {
      toast.error("Cannot edit showtimes with bookings. Please cancel the showtime to refund customers.");
      return;
    }
    const hoursUntilShow = (showDateTime.getTime() - now.getTime()) / (1000 * 60 * 60);
    if (hoursUntilShow < 24) {
      toast.error(`Cannot edit within 24 hours of showtime (${hoursUntilShow.toFixed(1)} hours remaining)`);
      return;
    }
    setEditingShowtime(showtime);
    setFormMode("edit");
    setIsFormOpen(true);
  };


  const handleViewShowtime = (showtime: ShowtimeResponseDto) => {
    setEditingShowtime(showtime);
    setFormMode("view");
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingShowtime(null);
    setFormMode("create");
  };

  const handleFormSubmit = async (data: ShowtimeData) => {
  try {
    setSubmitting(true);

    if (formMode === "edit") {
      const result = await editShowtimeOwner(data.showtime);
      toast.success("Showtime updated successfully");
    } else if (formMode === "create") {
      const result = await createShowtimeOwner(data);
      console.log('Result:', result);

      const created = result?.data?.created || 0;
      const skipped = result?.data?.skipped || 0;

      // ✅ Show success message ONLY if some were created
      if (created > 0) {
        toast.success(`Successfully created ${created} showtime${created !== 1 ? 's' : ''}`);
      }

      // ✅ Show detailed errors if any were skipped
      if (skipped > 0 && result?.data?.errors && Array.isArray(result.data.errors)) {
        result.data.errors.forEach((error: string) => {
          toast.error(error, { duration: 6000 });
        });
      }

      // ✅ If ALL failed and no success, show warning
      if (created === 0 && skipped > 0) {
        toast.warning(`All ${skipped} showtimes were skipped. See errors above.`, { duration: 5000 });
      }

      // ✅ Only throw if result.success is false AND no errors array exists
      if (!result.success && (!result.data?.errors || result.data.errors.length === 0)) {
        throw new Error(result.message || "Failed to create showtime(s)");
      }
    }

    fetchShowtimes(page);
    handleCloseForm();
  } catch (error: any) {
    console.error("Error saving showtime:", error);
    
    // ✅ Check if error has the errors array in response
    const errorsArray = error?.response?.data?.data?.errors;
    
    if (errorsArray && Array.isArray(errorsArray) && errorsArray.length > 0) {
      // ✅ Show each detailed error
      errorsArray.forEach((errorMsg: string) => {
        toast.error(errorMsg, { duration: 6000 });
      });
      
      // ✅ Show summary
      toast.warning(`All ${errorsArray.length} showtimes were skipped. See errors above.`, { 
        duration: 5000 
      });
    } else {
      // ✅ Show generic error if no errors array
      const errorMessage = error?.response?.data?.message || error?.message || "Failed to save showtime";
      toast.error(errorMessage, { duration: 5000 });
    }
  } finally {
    setSubmitting(false);
  }
};



  const getTotalAvailableSeats = () => {
    return showtimes.reduce((acc, s) => acc + (s.availableSeats || 0), 0);
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      fetchShowtimes(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      fetchShowtimes(page + 1);
    }
  };

  const handlePageClick = (pageNum: number) => {
    fetchShowtimes(pageNum);
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let startPage = Math.max(1, page - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => handlePageClick(i)}
          disabled={loading}
          className={`px-4 py-2 rounded-lg transition-all duration-300 ${i === page
            ? "bg-blue-500 text-white"
            : "bg-white/5 text-gray-400 hover:bg-white/10"
            } disabled:opacity-50`}
        >
          {i}
        </button>
      );
    }

    return pages;
  };

  if (loading && !mounted) {
    return (
      <div className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center">
              <Film className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h1 className={`${lexendMedium.className} text-2xl text-white`}>
                Showtime Manager
              </h1>
              <p className={`${lexendSmall.className} text-gray-400 text-sm`}>
                Manage movie showtimes across theaters
              </p>
            </div>
          </div>
          <button
            onClick={handleAddShowtime}
            disabled={submitting}
            className="bg-white text-black flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
            ) : (
              <Plus className="w-4 h-4" />
            )}
            <span className={`${lexendSmall.className}`}>
              {submitting ? "Creating..." : "Add Showtimes"}
            </span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-green-400" />
              <div>
                <p className={`${lexendSmall.className} text-gray-400 text-xs`}>
                  {showtimeFilter === "upcoming" ? "Upcoming Showtimes" : "Past Showtimes"}
                </p>
                <p className={`${lexendMedium.className} text-white text-lg`}>
                  {totalCount}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <Film className="w-5 h-5 text-purple-400" />
              <div>
                <p className={`${lexendSmall.className} text-gray-400 text-xs`}>
                  Current Page
                </p>
                <p className={`${lexendMedium.className} text-white text-lg`}>
                  {showtimes.length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-orange-400" />
              <div>
                <p className={`${lexendSmall.className} text-gray-400 text-xs`}>
                  Available Seats
                </p>
                <p className={`${lexendMedium.className} text-white text-lg`}>
                  {mounted ? getTotalAvailableSeats() : 0}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-4">
        <div className="flex items-center gap-3">
          <p className={`${lexendSmall.className} text-gray-400 text-sm`}>
            Show:
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setShowtimeFilter("upcoming");
                fetchShowtimes(1, "upcoming");
              }}
              disabled={loading}
              className={`${lexendSmall.className} px-4 py-2 rounded-lg transition-all duration-300 ${showtimeFilter === "upcoming"
                ? "bg-blue-500 text-white"
                : "bg-white/5 text-gray-400 hover:bg-white/10"
                } disabled:opacity-50`}
            >
              Upcoming Showtimes
            </button>
            <button
              onClick={() => {
                setShowtimeFilter("past");
                fetchShowtimes(1, "past");
              }}
              disabled={loading}
              className={`${lexendSmall.className} px-4 py-2 rounded-lg transition-all duration-300 ${showtimeFilter === "past"
                ? "bg-gray-500 text-white"
                : "bg-white/5 text-gray-400 hover:bg-white/10"
                } disabled:opacity-50`}
            >
              Past Showtimes
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-6">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        </div>
      ) : (
        <ShowtimeList
          showtimeFilter={showtimeFilter}
          showtimes={showtimes}
          onEdit={handleEditShowtime}
          onView={handleViewShowtime}
          onRefresh={() => fetchShowtimes(page)}
          lexendMedium={lexendMedium}
          lexendSmall={lexendSmall}
        />
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-2xl p-4">
          <div className="flex items-center justify-between">
            <p className={`${lexendSmall.className} text-gray-400 text-sm`}>
              Showing {((page - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(page * ITEMS_PER_PAGE, totalCount)} of {totalCount} showtimes
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePreviousPage}
                disabled={page === 1 || loading}
                className="px-3 py-2 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex gap-2">
                {renderPageNumbers()}
              </div>

              <button
                onClick={handleNextPage}
                disabled={page === totalPages || loading}
                className="px-3 py-2 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {isFormOpen && (
        <ShowtimeForm
          submitting={submitting}
          showtime={editingShowtime}
          mode={formMode}
          onClose={handleCloseForm}
          onSubmit={handleFormSubmit}
          lexendMedium={lexendMedium}
          lexendSmall={lexendSmall}
        />
      )}
    </div>
  );
};

export default ShowtimeManager;
