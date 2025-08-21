import React, { useState, useEffect } from "react";
import { Lexend } from "next/font/google";
import { X, Save, Loader2, Film } from "lucide-react";
import MoviePosterSection from "./MoviePosterSection";
import MovieDetailsSection from "./MovieDetailsSection";
import MovieFormFields from "./MovieFormFields";
import GenreSelector from "./GenreSelector";
import CastManager from "./CastManager";


const lexend = Lexend({
  weight: "500",
  subsets: ["latin"],
});

interface Movie {
  _id?: string;
  tmdbId: number;
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
  isActive?: boolean;
}

interface AddMovieModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (movieData: any) => void;
  tmdbMovie?: any;
  editingMovie?: Movie | null;
}

const AddMovieModal: React.FC<AddMovieModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  tmdbMovie,
  editingMovie,
}) => {
  const [formData, setFormData] = useState<Partial<Movie>>({
    tmdbId: 0,
    title: "",
    genre: [],
    releaseDate: "",
    duration: 0,
    rating: "",
    description: "",
    poster: "",
    trailer: "",
    cast: [],
    director: "",
    language: "",
    isActive: true,
  });

  const [loading, setLoading] = useState(false);
  const [castInput, setCastInput] = useState("");

  useEffect(() => {
    if (tmdbMovie) {
      setFormData({
        tmdbId: tmdbMovie.tmdbId || 0,
        title: tmdbMovie.title || "",
        genre: Array.isArray(tmdbMovie.genre) ? tmdbMovie.genre : [],
        releaseDate: tmdbMovie.releaseDate || "",
        duration: tmdbMovie.duration || 120,
        rating: tmdbMovie.rating || "PG-13",
        description: tmdbMovie.description || "",
        poster: tmdbMovie.poster || "",
        trailer: tmdbMovie.trailer || "",
        cast: Array.isArray(tmdbMovie.cast) ? tmdbMovie.cast : [],
        director: tmdbMovie.director || "",
        language: tmdbMovie.language || "en",
        isActive: true,
      });
      setCastInput(
        Array.isArray(tmdbMovie.cast) ? tmdbMovie.cast.join(", ") : ""
      );
    } else if (editingMovie) {
      setFormData(editingMovie);
      setCastInput(editingMovie.cast.join(", "));
    }
  }, [tmdbMovie, editingMovie]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number.parseFloat(value) || 0 : value,
    }));
  };

  const handleGenreChange = (genre: string) => {
    const currentGenres = formData.genre || [];
    const updatedGenres = currentGenres.includes(genre)
      ? currentGenres.filter((g) => g !== genre)
      : [...currentGenres, genre];

    setFormData((prev) => ({ ...prev, genre: updatedGenres }));
  };

  const handleCastInputChange = (value: string) => {
    setCastInput(value);
    const castArray = value
      .split(",")
      .map((actor) => actor.trim())
      .filter((actor) => actor);
    setFormData((prev) => ({ ...prev, cast: castArray }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    setLoading(true);
    try {
      if (!formData.title || !formData.description || !formData.releaseDate) {
        alert("Please fill in all required fields");
        return;
      }
      onSubmit(formData);
    } catch (error) {
      console.error("Error saving movie:", error);
      alert("Error saving movie. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-[#0a0a0a] border border-gray-600 rounded-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-600 sticky top-0 bg-[#0a0a0a] z-10">
          <div className="flex items-center gap-3">
            <Film className="h-6 w-6 text-[#e78f03]" />
            <h2 className={`${lexend.className} text-2xl text-white`}>
              {editingMovie ? "Edit Movie" : "Add New Movie"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2 rounded-md transition-colors"
            disabled={loading}
          >
            <X size={24} />
          </button>
        </div>

        <form className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              <MoviePosterSection
                poster={formData.poster || ""}
                onPosterChange={handleInputChange}
              />
              <MovieDetailsSection formData={formData} />
            </div>

            {/* Middle Column */}
            <div className="space-y-6">
              <MovieFormFields 
                formData={formData}
                onInputChange={handleInputChange}
              />
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <GenreSelector
                selectedGenres={formData.genre || []}
                onGenreChange={handleGenreChange}
              />
              <CastManager
                cast={formData.cast || []}
                castInput={castInput}
                onCastInputChange={handleCastInputChange}
              />
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-6 mt-6 border-t border-gray-600">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="bg-[#e78f03] text-black hover:bg-[#d17a02] px-6 py-3 rounded-lg flex items-center gap-2 transition-colors font-medium shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Save size={16} />
              )}
              {editingMovie ? "Update Movie" : "Add Movie"}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="border border-gray-500 text-gray-300 hover:bg-[#2a2a2a] hover:text-white bg-transparent px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMovieModal;
