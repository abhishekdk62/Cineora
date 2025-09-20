//@ts-nocheck
"use client";

import React, { useState, useEffect } from "react";
import { Plus, Calendar, Clock, Film } from "lucide-react";
import { IShowtime } from "./showtime.interfaces";
import ShowtimeForm from "./ShowtimeForm";
import ShowtimeList from "./ShowtimeList";
import { createShowtimeOwner, editShowtimeOwner, getShowTimesOwner } from "@/app/others/services/ownerServices/showtimeServices";
import toast from "react-hot-toast";
import { log } from "node:console";
import { ShowtimeResponseDto } from "@/app/others/dtos";
import { lexendMedium, lexendSmall } from "@/app/others/Utils/fonts";
import { ShowtimeData } from "@/app/book/tickets/[showtimeId]/page";

interface ShowtimeManagerProps {

}

const ShowtimeManager: React.FC<ShowtimeManagerProps> = ({

}) => {
  const [showtimes, setShowtimes] = useState<ShowtimeResponseDto[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingShowtime, setEditingShowtime] = useState<ShowtimeResponseDto | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [activeTodayCount, setActiveTodayCount] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit" | "view">("create");
  const [page, setPage] = useState(1);
  const [items, setItems] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [scrollLoading, setScrollLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const ITEMS_PER_PAGE = 10;


  useEffect(() => {
    setMounted(true);
    fetchShowtimes(1, true);
  }, []);


  useEffect(() => {
    if (mounted && showtimes.length > 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayCount = showtimes.filter((s) => {
        const showDate = new Date(s.showDate);
        showDate.setHours(0, 0, 0, 0);
        return showDate.getTime() === today.getTime() && s.isActive;
      }).length;
      setActiveTodayCount(todayCount);
    }
  }, [showtimes, mounted]);
useEffect(() => {
  let timeoutId: NodeJS.Timeout;

  function handleScroll() {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 100 &&
        hasMore &&
        !loading &&
        !scrollLoading
      ) {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchShowtimes(nextPage, false);
      }
    }, 100); 
  }

  window.addEventListener('scroll', handleScroll);
  return () => {
    window.removeEventListener('scroll', handleScroll);
    clearTimeout(timeoutId);
  };
}, [hasMore, loading, scrollLoading, page]);

const fetchShowtimes = async (pageNumber = 1, reset = false) => {
  if (loading && !reset) {
    return;
  }

  try {
    if (reset) {
      setLoading(true);
    } else {
      setScrollLoading(true);
    }

    const data = await getShowTimesOwner({
      page: pageNumber,
      limit: ITEMS_PER_PAGE,
    });
    
    console.log('the showtime data:', data);

    const newShowtimes = data.data || [];
    const total = data?.meta?.pagination?.total 
    const currentPage = data?.meta?.pagination?.currentPage || pageNumber; 
    const hasNextPage = data?.meta?.pagination?.hasNextPage || false; 

    console.log(`📦 Received ${newShowtimes.length} items`);

    if (reset || pageNumber === 1) {
      setShowtimes(newShowtimes);
    } else {
      setShowtimes(prev => {
        const existingIds = prev.map(item => item._id);
        const filteredNew = newShowtimes.filter((item: ShowtimeData) => !existingIds.includes(item._id));
        console.log(`✅ Added ${filteredNew.length} new items`);
        return [...prev, ...filteredNew];
      });
    }


if (total !== undefined) {
  setTotalCount(total);
} else {
  setTotalCount(0); 
}

    
    setHasMore(hasNextPage);
    

  } catch (error) {
    console.error("❌ Error fetching showtimes:", error);
    toast.error("Failed to fetch showtimes");
  } finally {
    if (reset) {
      setLoading(false);
    } else {
      setScrollLoading(false);
    }
  }
};




  const handleAddShowtime = () => {
    setEditingShowtime(null);
    setFormMode("create");
    setIsFormOpen(true);
  };
  const handleEditShowtime = (showtime: ShowtimeResponseDto) => {
    const now = new Date();
    const showDate = new Date(showtime.showDate).toISOString().split('T')[0];
    const showDateTime = new Date(`${showDate}T${showtime.showTime}:00`);
    if (showDateTime < now) {
      toast.error("Cannot edit past showtimes");
      return;
    }
    const daysUntilShow = Math.ceil((showDateTime.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    if (daysUntilShow < 7) {
      toast.error("Cannot edit showtime within 7 days of show date");
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
        console.log('the data is   :', data);



        const result = await editShowtimeOwner(data.showtime)
        console.log(result);

        toast.success("Showtime updated successfully");
      } else if (formMode === "create") {
        const result = await createShowtimeOwner(data);
        if (result.success) {
          if (data.showtimes && Array.isArray(data.showtimes)) {
            const created = result?.data?.created || 0;
            const skipped = result?.data?.skipped || 0;
            toast.success(`Successfully created ${created} showtimes`);
            if (skipped > 0) {
              toast.error(`${skipped} showtimes were skipped due to conflicts`);
            }
          } else {
            toast.success("Showtime created successfully");
          }
        } else {
          throw new Error(result.message || "Failed to create showtime(s)");
        }
      }
      fetchShowtimes();
      handleCloseForm();
    } catch (error: unknown) {

      console.error("Error saving showtime:", error);
      toast.error(error.response.data.message || "Failed to save showtime");
    } finally {
      setSubmitting(false);
    }
  };
  const getUpcomingShowtimes = () => {
    const today = new Date();
    return showtimes.filter(s => new Date(s.showDate) >= today && s.isActive).length;
  };
  const getTotalAvailableSeats = () => {
    return showtimes.reduce((acc, s) => acc + (s.availableSeats || 0), 0);
  };
  if (loading) {
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-green-400" />
              <div>
                <p className={`${lexendSmall.className} text-gray-400 text-xs`}>
                  Total Showtimes
                </p>
                <p className={`${lexendMedium.className} text-white text-lg`}>
                  {totalCount > 0 ? totalCount : showtimes.length}
                </p>

              </div>
            </div>
          </div>
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-blue-400" />
              <div>
                <p className={`${lexendSmall.className} text-gray-400 text-xs`}>
                  Active Today
                </p>
                <p className={`${lexendMedium.className} text-white text-lg`}>
                  {mounted ? activeTodayCount : 0}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white/5 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <Film className="w-5 h-5 text-purple-400" />
              <div>
                <p className={`${lexendSmall.className} text-gray-400 text-xs`}>
                  Upcoming Shows
                </p>
                <p className={`${lexendMedium.className} text-white text-lg`}>
                  {mounted ? getUpcomingShowtimes() : 0}
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
      <ShowtimeList
        showtimes={showtimes}
        onEdit={handleEditShowtime}
        onView={handleViewShowtime}
        onRefresh={() => {
          setPage(1);
          fetchShowtimes(1, true);
        }}
        lexendMedium={lexendMedium}
        lexendSmall={lexendSmall}
      />

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
      {hasMore && showtimes.length > 0 && (
        <div className="flex items-center justify-center py-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-gray-400">Loading more showtimes...</span>
        </div>
      )}

      {!hasMore && showtimes.length > 0 && (
        <div className="text-center py-4">
          <p className="text-gray-400">No more showtimes to load</p>
        </div>
      )}

    </div>
  );
};

export default ShowtimeManager;
