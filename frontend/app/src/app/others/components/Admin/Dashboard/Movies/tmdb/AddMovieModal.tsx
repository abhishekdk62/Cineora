import React, { useState, useEffect } from "react";
import { Lexend } from "next/font/google";
import { X, Save, Loader2, Film } from "lucide-react";
import MoviePosterSection from "./MoviePosterSection";
import MovieDetailsSection from "./MovieDetailsSection";
import MovieFormFields from "./MovieFormFields";
import GenreSelector from "./GenreSelector";
import CastManager from "./CastManager";
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { movieSchema } from "@/app/others/Utils/zodSchemas";
import z from "zod";
import { MovieResponseDto } from "@/app/others/dtos";


const lexend = Lexend({
  weight: "500",
  subsets: ["latin"],
});

export type Movie = z.infer<typeof movieSchema>;


interface AddMovieModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (movieData: Movie) => void;
  tmdbMovie?: Movie;
  editingMovie?: MovieResponseDto| null;
}

const AddMovieModal: React.FC<AddMovieModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  tmdbMovie,
  editingMovie,
}) => {


  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    control,
    reset
  } = useForm({
    resolver: zodResolver(movieSchema),
    defaultValues: {
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
    }
  });

  const watchedValues = watch();

  const handleFormSubmit = async (data: Movie) => {
    setLoading(true);
    try {
      onSubmit(data); 
    } catch (error) {
      console.error("Error saving movie:", error);
      alert("Error saving movie. Please try again.");
    } finally {
      setLoading(false);
    }
  };

useEffect(() => {
  if (tmdbMovie) {
    reset({
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
  } else if (editingMovie) {
    reset({
     tmdbId: typeof editingMovie.tmdbId === 'string' 
  ? parseInt(editingMovie.tmdbId) || 0 
  : editingMovie.tmdbId || 0,

      title: editingMovie.title || "",
      genre: Array.isArray(editingMovie.genre) ? editingMovie.genre : [],
      releaseDate: editingMovie.releaseDate instanceof Date 
        ? editingMovie.releaseDate.toISOString().split('T')[0] 
        : editingMovie.releaseDate || "",
      duration: editingMovie.duration || 120,
      rating: editingMovie.rating || "PG-13",
      description: editingMovie.description || "",
      poster: editingMovie.poster || "",
      trailer: editingMovie.trailer || "",
      cast: Array.isArray(editingMovie.cast) ? editingMovie.cast : [],
      director: editingMovie.director || "",
      language: editingMovie.language || "en",
      isActive: editingMovie.isActive ?? true,
    });
  }
}, [tmdbMovie, editingMovie, reset]);


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

        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6">
          {/* 🔥 CHANGE YOUR COMPONENT CALLS TO THIS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              <MoviePosterSection
                poster={watchedValues.poster || ""}
                onPosterChange={(e) => setValue('poster', e.target.value)}
                posterError={errors.poster?.message} 
              />
              <MovieDetailsSection
                formData={watchedValues}
              />
            </div>

            {/* Middle Column */}
            <div className="space-y-6">
              <MovieFormFields
                register={register}
                errors={errors} 
                watchedValues={watchedValues}


              />
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <GenreSelector
                selectedGenres={watchedValues.genre || []}
                onGenreChange={(genre) => {
                  const currentGenres = watchedValues.genre || [];
                  const updatedGenres = currentGenres.includes(genre)
                    ? currentGenres.filter((g) => g !== genre)
                    : [...currentGenres, genre];
                  setValue('genre', updatedGenres);
                }}
                genreError={errors.genre?.message}
              />
              <CastManager
                cast={watchedValues.cast || []}
                onCastChange={(castArray) => setValue('cast', castArray)}
                castError={errors.cast?.message}
              />
            </div>
          </div>


          {/* Submit Buttons */}
          <div className="flex gap-3 pt-6 mt-6 border-t border-gray-600">
            <button
              type="submit"
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
