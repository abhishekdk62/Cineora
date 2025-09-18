"use client";

import React from "react";
import MoviesListBook from "@/app/others/components/User/Book/MoviesListBook";
import TheatersListBook from "@/app/others/components/User/Book/TheatersListBook";
import EmptyState from "./EmptyState";
import { UnifiedBookingEntity } from "@/app/others/types";

interface BookingContentProps {
  bookingFlow: 'movie-first' | 'theater-first' | null;
  movie?: UnifiedBookingEntity | null;
  theater?: UnifiedBookingEntity | null;
  movies: UnifiedBookingEntity[];
  theaters: UnifiedBookingEntity[];
  selectedDate: Date;
  onShowtimeSelect: (showtimeId:string) => void;
}

export default function BookingContent({
  bookingFlow,
  movie,
  theater,
  movies,
  theaters,
  selectedDate,
  onShowtimeSelect
}: BookingContentProps) {
  if (theaters.length == 0 && movies.length == 0) {
    return <EmptyState bookingFlow={bookingFlow} />

  }



  return (
    <>
      {bookingFlow === 'movie-first' && movie && theaters.length > 0 && (
        <TheatersListBook
          theaters={theaters}
          movie={movie}
          selectedDate={selectedDate}
          onShowtimeSelect={onShowtimeSelect}
        />
      )}

      {bookingFlow === 'theater-first' && theater && movies.length > 0 && (
        <MoviesListBook
          movies={movies}
          selectedDate={selectedDate}
          theater={theater}
          onShowtimeSelect={onShowtimeSelect}
        />
      )}
    </>
  );
}
