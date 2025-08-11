import React, { useState, useEffect } from "react";
import { Lexend } from "next/font/google";
import {
  X,
  Save,
  Loader2,
  Film,
  Star,
  Calendar,
  Clock,
  Users,
  Play,
} from "lucide-react";

const lexend = Lexend({
  weight: "500",
  subsets: ["latin"],
});

const lexendSmall = Lexend({
  weight: "300",
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
  const [genreInput, setGenreInput] = useState("");

  const ratings = ["G", "PG", "PG-13", "R", "NC-17"];
  const languages = [
    { code: "en", name: "English" },
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "it", name: "Italian" },
    { code: "ja", name: "Japanese" },
    { code: "ko", name: "Korean" },
    { code: "zh", name: "Chinese" },
    { code: "hi", name: "Hindi" },
    { code: "ar", name: "Arabic" },
  ];

  const genres = [
    "Action",
    "Adventure",
    "Animation",
    "Comedy",
    "Crime",
    "Documentary",
    "Drama",
    "Family",
    "Fantasy",
    "History",
    "Horror",
    "Music",
    "Mystery",
    "Romance",
    "Science Fiction",
    "TV Movie",
    "Thriller",
    "War",
    "Western",
  ];

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
      setGenreInput(
        Array.isArray(tmdbMovie.genre) ? tmdbMovie.genre.join(", ") : ""
      );
    } else if (editingMovie) {
      setFormData(editingMovie);
      setCastInput(editingMovie.cast.join(", "));
      setGenreInput(editingMovie.genre.join(", "));
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
            {/* Left Column - Movie Poster & Basic Info */}
            <div className="space-y-6">
              <div className="bg-[#1a1a1a] border border-gray-600 rounded-lg p-4">
                <h3 className={`${lexend.className} text-lg text-white mb-4`}>
                  Movie Poster
                </h3>
                <div className="space-y-4">
                  <img
                    src={formData.poster || "/placeholder.svg"}
                    alt="Movie Poster"
                    className="w-full h-80 object-cover rounded-lg border border-gray-500"
                  />
                  <div className="space-y-2">
                    <label
                      className={`${lexendSmall.className} block text-sm text-gray-300 font-medium`}
                    >
                      Poster URL
                    </label>
                    <input
                      type="url"
                      name="poster"
                      value={formData.poster || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-[#2a2a2a] border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#e78f03] focus:ring-1 focus:ring-[#e78f03]"
                      placeholder="https://example.com/poster.jpg"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-[#1a1a1a] border border-gray-600 rounded-lg p-4">
                <h3 className={`${lexend.className} text-lg text-white mb-4`}>
                  Movie Details
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-gray-300">
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span className="text-sm">
                      TMDB ID: {formData.tmdbId || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <Calendar className="h-4 w-4 text-blue-400" />
                    <span className="text-sm">
                      Release:{" "}
                      {formData.releaseDate
                        ? new Date(formData.releaseDate).getFullYear()
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <Clock className="h-4 w-4 text-green-400" />
                    <span className="text-sm">
                      Duration: {formData.duration || 0} minutes
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <Users className="h-4 w-4 text-purple-400" />
                    <span className="text-sm">
                      Cast: {formData.cast?.length || 0} actors
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Middle Column - Main Details */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <label
                    className={`${lexendSmall.className} block text-sm text-gray-300 font-medium`}
                  >
                    Title <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title || ""}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 bg-[#2a2a2a] border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#e78f03] focus:ring-1 focus:ring-[#e78f03]"
                    placeholder="Enter movie title"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label
                      className={`${lexendSmall.className} block text-sm text-gray-300 font-medium`}
                    >
                      Duration (minutes)
                    </label>
                    <input
                      type="number"
                      name="duration"
                      value={formData.duration || ""}
                      onChange={handleInputChange}
                      min="1"
                      className="w-full px-3 py-2 bg-[#2a2a2a] border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#e78f03] focus:ring-1 focus:ring-[#e78f03]"
                      placeholder="120"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      className={`${lexendSmall.className} block text-sm text-gray-300 font-medium`}
                    >
                      Rating
                    </label>
                    <select
                      name="rating"
                      value={formData.rating || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-[#2a2a2a] border border-gray-500 rounded-lg text-white focus:outline-none focus:border-[#e78f03] focus:ring-1 focus:ring-[#e78f03]"
                    >
                      <option value="">Select rating</option>
                      {ratings.map((rating) => (
                        <option key={rating} value={rating}>
                          {rating}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label
                      className={`${lexendSmall.className} block text-sm text-gray-300 font-medium`}
                    >
                      Release Date <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="date"
                      name="releaseDate"
                      value={formData.releaseDate || ""}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 bg-[#2a2a2a] border border-gray-500 rounded-lg text-white focus:outline-none focus:border-[#e78f03] focus:ring-1 focus:ring-[#e78f03]"
                    />
                  </div>

                  <div className="space-y-2">
                    <label
                      className={`${lexendSmall.className} block text-sm text-gray-300 font-medium`}
                    >
                      Language
                    </label>
                    <select
                      name="language"
                      value={formData.language || ""}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-[#2a2a2a] border border-gray-500 rounded-lg text-white focus:outline-none focus:border-[#e78f03] focus:ring-1 focus:ring-[#e78f03]"
                    >
                      <option value="">Select language</option>
                      {languages.map((lang) => (
                        <option key={lang.code} value={lang.code}>
                          {lang.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    className={`${lexendSmall.className} block text-sm text-gray-300 font-medium`}
                  >
                    Director
                  </label>
                  <input
                    type="text"
                    name="director"
                    value={formData.director || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-[#2a2a2a] border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#e78f03] focus:ring-1 focus:ring-[#e78f03]"
                    placeholder="Director name"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    className={`${lexendSmall.className} block text-sm text-gray-300 font-medium`}
                  >
                    Trailer URL
                  </label>
                  <input
                    type="url"
                    name="trailer"
                    value={formData.trailer || ""}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-[#2a2a2a] border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#e78f03] focus:ring-1 focus:ring-[#e78f03]"
                    placeholder="https://youtube.com/watch?v=..."
                  />
                </div>

                <div className="space-y-2">
                  <label
                    className={`${lexendSmall.className} block text-sm text-gray-300 font-medium`}
                  >
                    Description <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description || ""}
                    onChange={handleInputChange}
                    rows={4}
                    required
                    className="w-full px-3 py-2 bg-[#2a2a2a] border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#e78f03] focus:ring-1 focus:ring-[#e78f03] resize-none"
                    placeholder="Enter movie description..."
                  />
                </div>
              </div>
            </div>

            {/* Right Column - Genres & Cast */}
            <div className="space-y-6">
              <div className="bg-[#1a1a1a] border border-gray-600 rounded-lg p-4">
                <h3 className={`${lexend.className} text-lg text-white mb-4`}>
                  Genres
                </h3>
                <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto">
                  {genres.map((genre) => (
                    <label
                      key={genre}
                      className="flex items-center space-x-2 cursor-pointer hover:bg-[#2a2a2a] p-2 rounded-md transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={formData.genre?.includes(genre) || false}
                        onChange={() => handleGenreChange(genre)}
                        className="rounded border-gray-400 text-[#e78f03] focus:ring-[#e78f03] focus:ring-2"
                      />
                      <span
                        className={`${lexendSmall.className} text-gray-300 text-sm`}
                      >
                        {genre}
                      </span>
                    </label>
                  ))}
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {formData.genre?.map((genre, index) => (
                    <span
                      key={index}
                      className="bg-[#e78f03] text-black px-2 py-1 rounded-full text-xs font-medium"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-[#1a1a1a] border border-gray-600 rounded-lg p-4">
                <h3 className={`${lexend.className} text-lg text-white mb-4`}>
                  Cast
                </h3>
                <div className="space-y-2">
                  <label
                    className={`${lexendSmall.className} block text-sm text-gray-300 font-medium`}
                  >
                    Cast Members (comma-separated)
                  </label>
                  <textarea
                    value={castInput}
                    onChange={(e) => handleCastInputChange(e.target.value)}
                    rows={6}
                    className="w-full px-3 py-2 bg-[#2a2a2a] border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#e78f03] focus:ring-1 focus:ring-[#e78f03] resize-none"
                    placeholder="Actor 1, Actor 2, Actor 3..."
                  />
                </div>
                <div className="mt-4 space-y-2 max-h-40 overflow-y-auto">
                  {formData.cast?.map((actor, index) => (
                    <div
                      key={index}
                      className="bg-[#2a2a2a] border border-gray-500 rounded-md p-2 flex items-center gap-2"
                    >
                      <Users className="h-4 w-4 text-purple-400" />
                      <span
                        className={`${lexendSmall.className} text-gray-300 text-sm`}
                      >
                        {actor}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
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
