"use client";

import { useState, useEffect } from "react";
import SearchHeader from "./SearchHeader";
import FilterSidebar from "./FilterSidebar";
import MoviesGrid from "./MovieGrid";

interface Movie {
  _id: string;
  tmdbId: string;
  title: string;
  genre: string[];
  releaseDate: string;
  duration: number;
  rating: string;
  description: string;
  poster: string;
  trailer: string;
  cast: string[];
  director: string;
  language: string;
  isActive: boolean;
}

interface MoviesPageProps {
  movies: Movie[];
  loading: boolean;
  searchLoading?: boolean; 
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onSearchChange: (search: string) => void; 
  onFiltersChange: (filters: any) => void;
}

export default function MoviesPage({
  movies,
  loading,
  searchLoading = false, 
  totalPages,
  currentPage,
  onPageChange,
  onSearchChange,
  onFiltersChange
}: MoviesPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("all");
  const [selectedRating, setSelectedRating] = useState("all");
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");
  const [durationRange, setDurationRange] = useState({ min: "", max: "" });
  const [sortBy, setSortBy] = useState("releaseDate");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>("desc");
  const [showFilters, setShowFilters] = useState(false);

  const genres = ["All", "Action", "Adventure", "Animation", "Comedy", "Crime", "Documentary", "Drama", "Family", "Fantasy", "History", "Horror", "Music", "Mystery", "Romance", "Sci-Fi", "Thriller", "War", "Western"];
  const ratings = ["All", "G", "PG", "PG-13", "R", "NC-17"];
  const languages = ["All", "en", "es", "fr", "de", "hi", "zh", "ja", "ko"];
  const years = ["All", "2025", "2024", "2023", "2022", "2021", "2020", "2019", "2018"];
  const sortOptions = [
    { value: "releaseDate", label: "Release Date" },
    { value: "title", label: "Title" },
    { value: "duration", label: "Duration" },
    { value: "rating", label: "Rating" },
  ];

  const languageMap: { [key: string]: string } = {
    "en": "English",
    "es": "Spanish",
    "fr": "French",
    "de": "German",
    "hi": "Hindi",
    "zh": "Chinese",
    "ja": "Japanese",
    "ko": "Korean"
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const handleSearchInput = (value: string) => {
    setSearchQuery(value);
    onSearchChange(value);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    onSearchChange('');
  };

  useEffect(() => {
    const filters: any = {};

    if (selectedGenre !== "all") filters.genre = selectedGenre;
    if (selectedRating !== "all") filters.rating = selectedRating;
    if (selectedLanguage !== "all") filters.language = selectedLanguage;
    if (selectedYear !== "all") {
      filters.releaseYearStart = parseInt(selectedYear);
      filters.releaseYearEnd = parseInt(selectedYear);
    }
    if (durationRange.min) filters.minDuration = parseInt(durationRange.min);
    if (durationRange.max) filters.maxDuration = parseInt(durationRange.max);

    filters.sortBy = sortBy;
    filters.sortOrder = sortOrder;

    onFiltersChange(filters);
  }, [selectedGenre, selectedRating, selectedLanguage, selectedYear, durationRange, sortBy, sortOrder]); 

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedGenre("all");
    setSelectedRating("all");
    setSelectedLanguage("all");
    setSelectedYear("all");
    setDurationRange({ min: "", max: "" });
    setSortBy("releaseDate");
    setSortOrder("desc");
    onSearchChange(''); 
  };

  const hasActiveFilters = selectedGenre !== 'all' || selectedRating !== 'all' || selectedLanguage !== 'all' || selectedYear !== 'all' || durationRange.min || durationRange.max;

  return (
    <div className="min-h-screen bg-transparent">
      <SearchHeader
        searchQuery={searchQuery}
        onSearchInput={handleSearchInput} 
        onClearSearch={handleClearSearch}
        searchLoading={searchLoading} 
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        hasActiveFilters={!!hasActiveFilters}
        sortOptions={sortOptions}
      />

      <FilterSidebar
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        selectedGenre={selectedGenre}
        setSelectedGenre={setSelectedGenre}
        selectedRating={selectedRating}
        setSelectedRating={setSelectedRating}
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        clearAllFilters={clearAllFilters}
        hasActiveFilters={!!hasActiveFilters}
        genres={genres}
        ratings={ratings}
        languageMap={languageMap}
        years={years}
      />

      <MoviesGrid
        movies={movies}
        loading={loading}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        languageMap={languageMap}
        formatDuration={formatDuration}
        hasActiveFilters={!!hasActiveFilters}
        clearAllFilters={clearAllFilters}
      />
    </div>
  );
}
