"use client";

import React, { useState, useEffect } from "react";
import { X, Building, Film, Monitor } from "lucide-react";
import { IRowPricing, IShowtime } from "./showtime.interfaces";
import TheaterSelectionModal from "./TheaterSelectionModal";
import MovieSelectionModal from "./MovieSelectionModal";
import ScreenSelectionModal from "./ScreenSelectionModal";
import toast from "react-hot-toast";

// Utility functions (unchanged)
function getDatesInRange(startStr: string, endStr: string): string[] {
  const result: string[] = [];
  let start = new Date(startStr);
  let end = new Date(endStr);
  while (start <= end) {
    result.push(start.toISOString().split("T")[0]);
    start.setDate(start.getDate() + 1);
  }
  return result;
}
function toMinutes(t: string) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

interface ShowtimeFormProps {
  showtime?: IShowtime | null;
  onClose: () => void;
  onSubmit: (data: any) => void;
  lexendMedium: any;
  lexendSmall: any;
  submitting: any;
  mode: "create" | "edit" | "view";
}

const ShowtimeForm: React.FC<ShowtimeFormProps> = ({
  showtime,
  onClose,
  onSubmit,
  lexendMedium,
  lexendSmall,
  submitting,
  mode
}) => {
  const [formData, setFormData] = useState({
    movieId: "",
    theaterId: "",
    screenId: "",
    format: "2D",
    language: "",
    rowPricing: [] as IRowPricing[],
  });

  // For create/bulk
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: "",
    end: "",
  });
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [newTimeSlot, setNewTimeSlot] = useState("");

  // For edit/view single
  const [singleDate, setSingleDate] = useState("");
  const [singleTime, setSingleTime] = useState("");

  const [selectedTheater, setSelectedTheater] = useState<any>(null);
  const [selectedMovie, setSelectedMovie] = useState<any>(null);
  const [selectedScreen, setSelectedScreen] = useState<any>(null);

  const [isTheaterModalOpen, setIsTheaterModalOpen] = useState(false);
  const [isMovieModalOpen, setIsMovieModalOpen] = useState(false);
  const [isScreenModalOpen, setIsScreenModalOpen] = useState(false);

  useEffect(() => {
    if (showtime) {
      const getId = (value: any) =>
        typeof value === "object" && value !== null ? value._id : value;

      setFormData({
        movieId: getId(showtime.movieId),
        theaterId: getId(showtime.theaterId),
        screenId: getId(showtime.screenId),
        format: showtime.format,
        language: showtime.language,
        rowPricing: showtime.rowPricing || [],
      });

      if (typeof showtime.movieId === "object" && showtime.movieId !== null) {
        setSelectedMovie(showtime.movieId);
      }
      if (typeof showtime.theaterId === "object" && showtime.theaterId !== null) {
        setSelectedTheater(showtime.theaterId);
      }
      if (typeof showtime.screenId === "object" && showtime.screenId !== null) {
        setSelectedScreen(showtime.screenId);
      }

      const formatDateInput = (d: any) => {
        if (!d) return "";
        if (typeof d === "string") return d.slice(0, 10);
        if (d instanceof Date) return d.toISOString().slice(0, 10);
        return "";
      };

      if (mode === "edit" || mode === "view") {
        setSingleDate(formatDateInput(showtime.showDate));
        setSingleTime(showtime.showTime || "");
      } else {
        setDateRange({
          start: formatDateInput(showtime.showDate),
          end: formatDateInput(showtime.showDate),
        });
        setTimeSlots(showtime.showTime ? [showtime.showTime] : []);
      }
    }
  }, [showtime, mode]);

  const handleTheaterSelect = (theater: any) => {
    if (mode === "view") return;
    setSelectedTheater(theater);
    setFormData((prev) => ({ ...prev, theaterId: theater._id }));
    setIsTheaterModalOpen(false);
    setSelectedScreen(null);
    setFormData((prev) => ({ ...prev, screenId: "" }));
  };

  const handleMovieSelect = (movie: any) => {
    if (mode === "view") return;
    setSelectedMovie(movie);
    setFormData((prev) => ({
      ...prev,
      movieId: movie._id,
      language: movie.language || "",
    }));
    setIsMovieModalOpen(false);
  };

  const handleScreenSelect = (screen: any) => {
    if (mode === "view") return;
    setSelectedScreen(screen);
    setFormData((prev) => ({ ...prev, screenId: screen._id }));
    setIsScreenModalOpen(false);
    if (screen.layout) {
      populateRowPricing(screen.layout);
    }
  };

  const populateRowPricing = (layout: any) => {
    if (!layout || !layout.advancedLayout || !layout.advancedLayout.rows) {
      console.error("Invalid layout structure:", layout);
      return;
    }
    const rowPricing: IRowPricing[] = layout.advancedLayout.rows.map((row: any) => {
      const firstSeat = row.seats && row.seats.length > 0 ? row.seats[0] : null;
      const seatType = firstSeat ? firstSeat.type : "Normal";
      const basePrice = firstSeat ? firstSeat.price : 0;
      return {
        rowLabel: row.rowLabel,
        seatType,
        basePrice,
        showtimePrice: basePrice,
        totalSeats: row.seats.length,
        availableSeats: row.seats.length,
        bookedSeats: [],
      };
    });
    setFormData((prev) => ({ ...prev, rowPricing }));
  };

  const updateRowPricing = (index: number, field: string, value: any) => {
    if (mode === "view") return;
    const updatedRows = [...formData.rowPricing];
    if (field === "showtimePrice" || field === "basePrice" || field === "totalSeats") {
      value = value === "" ? 0 : Number(value);
    }
    updatedRows[index] = { ...updatedRows[index], [field]: value };
    if (field === "totalSeats") {
      updatedRows[index].availableSeats = Number(value);
    }
    setFormData((prev) => ({ ...prev, rowPricing: updatedRows }));
  };

  const calculateTotalSeats = () => {
    return formData.rowPricing.reduce((total, row) => total + Number(row.totalSeats), 0);
  };

  const calculateEndTime = (showTime: string, durationMinutes: number) => {
    if (!showTime || !durationMinutes) return "";
    const [hours, minutes] = showTime.split(":").map(Number);
    const showDateTime = new Date();
    showDateTime.setHours(hours, minutes, 0, 0);
    const totalMinutes = durationMinutes + 15;
    showDateTime.setMinutes(showDateTime.getMinutes() + totalMinutes);
    return showDateTime.toTimeString().slice(0, 5);
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (mode === "view") return;

  // Get today's date for validation
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // JS-only validation
  if (!selectedMovie?._id || !selectedTheater?._id || !selectedScreen?._id) {
    toast.error("Please select movie, theater, and screen.");
    return;
  }
  if (!formData.theaterId) return toast.error("Please select a theater");
  if (!formData.movieId) return toast.error("Please select a movie");
  if (!formData.screenId) return toast.error("Please select a screen");
  if (!formData.format) return toast.error("Please select a format");
  if (!formData.language) return toast.error("Movie language is not set");
  if (!formData.rowPricing || formData.rowPricing.length === 0)
    return toast.error("Row pricing is not set");

  for (let row of formData.rowPricing) {
    const showtimePrice = Number(row.showtimePrice);
    const basePrice = Number(row.basePrice);
    if (isNaN(showtimePrice) || showtimePrice < basePrice)
      return toast.error(
        `Showtime price for row ${row.rowLabel} must be at least base price (${basePrice})`
      );
    if (row.totalSeats <= 0)
      return toast.error(`Row ${row.rowLabel} must have at least one seat`);
  }

  if (mode === "edit") {
    if (!singleDate) return toast.error("Please select a date");
    if (!singleTime) return toast.error("Please select a time");

    const selectedDate = new Date(singleDate);
    selectedDate.setHours(0, 0, 0, 0);
    if (selectedDate <= today) {
      return toast.error("Show date must be at least from tomorrow");
    }

    const endTime = calculateEndTime(singleTime, selectedMovie?.duration || 0);
    const editData = {
      ...formData,
      _id: showtime?._id,
      movieId: selectedMovie?._id,
      theaterId: selectedTheater?._id,
      screenId: selectedScreen?._id,
      showDate: singleDate,
      showTime: singleTime,
      endTime,
      totalSeats: calculateTotalSeats(),
      availableSeats: calculateTotalSeats(),
      bookedSeats: [],
      blockedSeats: [],
      isActive: true,
    };

    onSubmit({ showtime: editData });
  } else {
    if (!dateRange.start || !dateRange.end)
      return toast.error("Select start and end date");
    if (timeSlots.length === 0)
      return toast.error("Add at least one showtime slot");


    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);
    if (startDate <= today || endDate <= today) {
      return toast.error("Show dates must be at least tomorrow");
    }

    const dateList = getDatesInRange(dateRange.start, dateRange.end);
    const minShowDate = new Date();
    minShowDate.setHours(0, 0, 0, 0);
    for (let d of dateList) {
      if (new Date(d) < minShowDate)
        return toast.error("Show dates must be in the future");
    }

    let bulkShowtimes: any[] = [];
    for (const day of dateList) {
      let daySlots = [...timeSlots].sort();
      let lastEndTime = null;
      for (const time of daySlots) {
        const endTime = calculateEndTime(time, selectedMovie?.duration || 0);
        if (lastEndTime) {
          const gap = toMinutes(time) - toMinutes(lastEndTime);
          if (gap < 30)
            return toast.error(`Shows on ${day} have less than 30 min gap in between`);
        }
        bulkShowtimes.push({
          ...formData,
          movieId: selectedMovie?._id,
          theaterId: selectedTheater?._id,
          screenId: selectedScreen?._id,
          showDate: day,
          showTime: time,
          endTime,
          totalSeats: calculateTotalSeats(),
          availableSeats: calculateTotalSeats(),
          bookedSeats: [],
          blockedSeats: [],
          isActive: true,
        });
        lastEndTime = endTime;
      }
    }

    if (bulkShowtimes.length === 0)
      return toast.error("No valid showtimes to submit");

    onSubmit({ showtimes: bulkShowtimes });
  }
};

  const headerLabel =
    mode === "edit"
      ? "Edit Showtime"
      : mode === "create"
      ? "Add Bulk Showtimes"
      : "View Showtime";

  const submitLabel =
    submitting
      ? "Please wait"
      : mode === "edit"
      ? "Update Showtime"
      : "Create Bulk Showtimes";

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-black/90 border border-gray-500/30 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-500/30">
          <h2 className={`${lexendMedium.className} text-xl text-white`}>{headerLabel}</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6" noValidate>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              type="button"
              onClick={() => setIsTheaterModalOpen(true)}
              className="flex items-center gap-3 p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-gray-500/30 transition-colors text-left"
              disabled={mode === "view" || mode === "edit"}
            >
              <Building className="w-6 h-6 text-blue-400" />
              <div className="flex-1 min-w-0">
                <p className={`${lexendSmall.className} text-gray-400 text-xs`}>Theater</p>
                <p className={`${lexendMedium.className} text-white truncate`}>
                  {selectedTheater ? selectedTheater.name : "Select Theater"}
                </p>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setIsMovieModalOpen(true)}
              className="flex items-center gap-3 p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-gray-500/30 transition-colors text-left"
              disabled={mode === "view" || mode === "edit"}
            >
              <Film className="w-6 h-6 text-green-400" />
              <div className="flex-1 min-w-0">
                <p className={`${lexendSmall.className} text-gray-400 text-xs`}>Movie</p>
                <p className={`${lexendMedium.className} text-white truncate`}>
                  {selectedMovie ? selectedMovie.title : "Select Movie"}
                </p>
              </div>
            </button>
            <button
              type="button"
              onClick={() => setIsScreenModalOpen(true)}
              disabled={!selectedTheater || mode === "view" || mode === "edit"}
              className="flex items-center gap-3 p-4 bg-white/5 hover:bg-white/10 rounded-xl border border-gray-500/30 transition-colors text-left disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Monitor className="w-6 h-6 text-purple-400" />
              <div className="flex-1 min-w-0">
                <p className={`${lexendSmall.className} text-gray-400 text-xs`}>Screen</p>
                <p className={`${lexendMedium.className} text-white truncate`}>
                  {selectedScreen ? selectedScreen.name : "Select Screen"}
                </p>
              </div>
            </button>
          </div>

          {mode === "create" ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={`${lexendSmall.className} text-gray-300 text-sm block mb-2`}>Start Date</label>
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={e => setDateRange(r => ({ ...r, start: e.target.value }))}
                    className="w-full p-3 bg-white/5 border border-gray-500/30 rounded-xl text-white"
                  />
                </div>
                <div>
                  <label className={`${lexendSmall.className} text-gray-300 text-sm block mb-2`}>End Date</label>
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={e => setDateRange(r => ({ ...r, end: e.target.value }))}
                    className="w-full p-3 bg-white/5 border border-gray-500/30 rounded-xl text-white"
                  />
                </div>
              </div>

              <div className="my-4">
                <label className={`${lexendSmall.className} text-gray-300 text-sm block mb-2`}>Add Showtimes (HH:mm):</label>
                <div className="flex space-x-2">
                  <input
                    type="time"
                    value={newTimeSlot}
                    onChange={e => setNewTimeSlot(e.target.value)}
                    className="p-2 bg-white/5 border border-gray-500/30 rounded-lg text-white text-sm"
                  />
                  <button
                    type="button"
                    className="px-2 py-1 bg-blue-500 text-white rounded"
                    onClick={() => {
                      if (newTimeSlot && !timeSlots.includes(newTimeSlot)) setTimeSlots(ts => [...ts, newTimeSlot]);
                      setNewTimeSlot("");
                    }}
                  >
                    Add Time
                  </button>
                </div>
                <div className="mt-2">
                  {timeSlots.map(slot => (
                    <span key={slot} className="mr-2 px-2 py-1 bg-white/10 text-blue-300 rounded">
                      {slot}
                      <button
                        type="button"
                        className="ml-1 text-red-400"
                        onClick={() => setTimeSlots(ts => ts.filter(t => t !== slot))}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={`${lexendSmall.className} text-gray-300 text-sm block mb-2`}>Show Date</label>
                <input
                  type="date"
                  value={singleDate}
                  onChange={e => setSingleDate(e.target.value)}
                  className="w-full p-3 bg-white/5 border border-gray-500/30 rounded-xl text-white"
                  disabled={mode === "view"}
                />
              </div>
              <div>
                <label className={`${lexendSmall.className} text-gray-300 text-sm block mb-2`}>Show Time</label>
                <input
                  type="time"
                  value={singleTime}
                  onChange={e => setSingleTime(e.target.value)}
                  className="w-full p-3 bg-white/5 border border-gray-500/30 rounded-xl text-white"
                  disabled={mode === "view"}
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={`${lexendSmall.className} text-gray-300 text-sm block mb-2`}>Format</label>
              <select
                value={formData.format}
                onChange={e => setFormData(prev => ({ ...prev, format: e.target.value }))}
                className="w-full p-3 bg-white/5 border border-gray-500/30 rounded-xl text-white"
                disabled={mode === "view"}
              >
                <option value="2D">2D</option>
                <option value="3D">3D</option>
                <option value="IMAX">IMAX</option>
                <option value="4DX">4DX</option>
                <option value="Dolby Atmos">Dolby Atmos</option>
              </select>
            </div>
            <div>
              <label className={`${lexendSmall.className} text-gray-300 text-sm block mb-2`}>Language</label>
              <input
                type="text"
                value={formData.language}
                className="w-full p-3 bg-white/10 border border-gray-500/30 rounded-xl text-white cursor-not-allowed"
                placeholder={selectedMovie ? "Auto-populated from movie" : "Select a movie first"}
                readOnly
              />
            </div>
          </div>

          <div className="space-y-3">
            <h3 className={`${lexendMedium.className} text-lg text-white`}>Row Pricing</h3>
            {formData.rowPricing.map((row, index) => (
              <div key={index} className="bg-white/5 rounded-xl p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  <div>
                    <label className={`${lexendSmall.className} text-gray-400 text-xs block mb-1`}>Row Label</label>
                    <input
                      type="text"
                      className="w-full p-2 bg-white/10 border border-gray-500/30 rounded-lg text-white text-sm cursor-not-allowed"
                      value={row.rowLabel}
                      readOnly
                    />
                  </div>
                  <div>
                    <label className={`${lexendSmall.className} text-gray-400 text-xs block mb-1`}>Seat Type</label>
                    <input
                      type="text"
                      className="w-full p-2 bg-white/10 border border-gray-500/30 rounded-lg text-white text-sm cursor-not-allowed"
                      value={row.seatType}
                      readOnly
                    />
                  </div>
                  <div>
                    <label className={`${lexendSmall.className} text-gray-400 text-xs block mb-1`}>Base Price</label>
                    <input
                      type="number"
                      className="w-full p-2 bg-white/10 border border-gray-500/30 rounded-lg text-white text-sm cursor-not-allowed"
                      value={row.basePrice}
                      readOnly
                    />
                  </div>
                  <div>
                    <label className={`${lexendSmall.className} text-gray-400 text-xs block mb-1`}>Showtime Price</label>
                    <input
                      type="number"
                      className="w-full p-2 bg-white/10 border border-amber-300 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500"
                      value={row.showtimePrice === 0 ? "" : row.showtimePrice}
                      min={row.basePrice}
                      onChange={e => updateRowPricing(index, "showtimePrice", e.target.value)}
                      disabled={mode === "view"}
                    />
                  </div>
                </div>
              </div>
            ))}
            {formData.rowPricing.length > 0 && (
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                <p className={`${lexendMedium.className} text-blue-400`}>
                  Total Seats: {calculateTotalSeats()}
                </p>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-500/30 text-gray-300 rounded-xl hover:bg-white/5 transition-colors"
            >
              Close
            </button>
            {mode !== "view" && (
              <button
                type="submit"
                disabled={!selectedTheater || !selectedMovie || !selectedScreen || submitting}
                className="px-6 py-3 bg-white hover:bg-gray-200 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:text-white text-black rounded-xl transition-colors"
              >
                {submitLabel}
              </button>
            )}
          </div>
        </form>
      </div>
      {isTheaterModalOpen && (
        <TheaterSelectionModal
          onSelect={handleTheaterSelect}
          onClose={() => setIsTheaterModalOpen(false)}
          lexendMedium={lexendMedium}
          lexendSmall={lexendSmall}
        />
      )}
      {isMovieModalOpen && (
        <MovieSelectionModal
          onSelect={handleMovieSelect}
          onClose={() => setIsMovieModalOpen(false)}
          lexendMedium={lexendMedium}
          lexendSmall={lexendSmall}
        />
      )}
      {isScreenModalOpen && selectedTheater && (
        <ScreenSelectionModal
          theaterId={selectedTheater._id}
          onSelect={handleScreenSelect}
          onClose={() => setIsScreenModalOpen(false)}
          lexendMedium={lexendMedium}
          lexendSmall={lexendSmall}
        />
      )}
    </div>
  );
};

export default ShowtimeForm;
