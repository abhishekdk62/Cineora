import React, { useEffect, useState } from "react"
import { Lexend } from "next/font/google"
import {
  Edit,
  Trash2,
  Search,
  Filter,
  Grid3X3,
  List,
  Star,
  Clock,
  DollarSign,
  Eye,
  Play,
  Pause,
  Calendar,
  Users,
} from "lucide-react"
import { MovieResponseDto } from "../../dtos"

const lexend = Lexend({
  weight: "500",
  subsets: ["latin"],
})

const lexendSmall = Lexend({
  weight: "300",
  subsets: ["latin"],
})

interface Movie {
  _id: string
  tmdbId: number
  title: string
  genre: string[]
  releaseDate: string
  duration: number
  rating: string
  description: string
  poster: string
  trailer: string
  cast: string[]
  director: string
  language: string
  isActive: boolean
  createdAt?: Date
  updatedAt?: Date
}

interface MoviesListProps {
  movies: MovieResponseDto[]
  onEdit: (movie: MovieResponseDto) => void
  onDelete: (movie: MovieResponseDto) => void
  onToggleStatus: (movie: MovieResponseDto) => void
  title: string
  emptyMessage: string
}

const MoviesList: React.FC<MoviesListProps> = ({
  movies,
  onEdit,
  onDelete,
  onToggleStatus,
  title,
  emptyMessage,
}) => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedGenre, setSelectedGenre] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("title")

  const genres = ["all", ...Array.from(new Set(movies?.flatMap(movie => movie.genre)))]

  const filteredMovies = movies?.filter((movie) => {
      const matchesSearch =
        movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        movie.genre.some(g => g.toLowerCase().includes(searchTerm.toLowerCase())) ||
        movie.director.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesGenre = selectedGenre === "all" || movie.genre.includes(selectedGenre)
      return matchesSearch && matchesGenre
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title)
        case "releaseDate":
          return new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
        case "duration":
          return b.duration - a.duration
        default:
          return 0
      }
    })

  const getRatingColor = (rating: string) => {
    switch (rating) {
      case "G":
        return "bg-green-500"
      case "PG":
        return "bg-blue-500"
      case "PG-13":
        return "bg-yellow-500"
      case "R":
        return "bg-orange-500"
      case "NC-17":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getGenreColor = (genre: string) => {
    const colors = {
      Action: "bg-red-500/20 text-red-200 border-red-400/50",
      Comedy: "bg-yellow-500/20 text-yellow-200 border-yellow-400/50",
      Drama: "bg-purple-500/20 text-purple-200 border-purple-400/50",
      Horror: "bg-gray-500/20 text-gray-200 border-gray-400/50",
      "Sci-Fi": "bg-blue-500/20 text-blue-200 border-blue-400/50",
      Romance: "bg-pink-500/20 text-pink-200 border-pink-400/50",
      Thriller: "bg-orange-500/20 text-orange-200 border-orange-400/50",
      Crime: "bg-indigo-500/20 text-indigo-200 border-indigo-400/50",
    }
    return colors[genre as keyof typeof colors] || "bg-gray-500/20 text-gray-200 border-gray-400/50"
  }

  const renderMovieCard = (movie: MovieResponseDto) => (
    <div
      key={movie._id}
      className="group bg-[#1a1a1a] border border-gray-600 rounded-lg hover:border-[#e78f03] transition-all duration-300 hover:shadow-2xl hover:shadow-[#e78f03]/20 backdrop-blur-sm"
    >
      <div className="relative overflow-hidden rounded-t-lg">
        <img
          src={movie.poster || "/placeholder.svg"}
          alt={movie.title}
          className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-3 left-3">
          <span className={`${getRatingColor(movie.rating)} text-white text-xs px-2 py-1 rounded-full font-medium`}>
            {movie.rating}
          </span>
        </div>
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex gap-1">
            <button
              className="h-8 w-8 p-0 bg-blue-500 hover:bg-blue-600 text-white rounded-md flex items-center justify-center transition-colors"
              onClick={() => onToggleStatus(movie)}
              title={movie.isActive ? "Deactivate" : "Activate"}
            >
              {movie.isActive ? <Pause size={14} /> : <Play size={14} />}
            </button>
            <button
              className="h-8 w-8 p-0 bg-[#e78f03] hover:bg-[#d17a02] text-black rounded-md flex items-center justify-center transition-colors"
              onClick={() => onEdit(movie)}
            >
              <Edit size={14} />
            </button>
            <button
              className="h-8 w-8 p-0 bg-red-500 hover:bg-red-600 text-white rounded-md flex items-center justify-center transition-colors"
              onClick={() => onDelete(movie)}
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className={`${lexend.className} text-lg font-semibold text-white line-clamp-1`}>{movie.title}</h3>
          <div className="flex items-center gap-1 text-yellow-400">
            <Star size={14} fill="currentColor" />
            <span className="text-sm">4.5</span>
          </div>
        </div>
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          {movie.genre.slice(0, 2).map((genre, index) => (
            <span key={index} className={`text-xs px-2 py-1 rounded-full border ${getGenreColor(genre)}`}>
              {genre}
            </span>
          ))}
          <div className="flex items-center gap-1 text-gray-300 text-sm">
            <Clock size={12} />
            <span>{movie.duration}m</span>
          </div>
        </div>
        <p className={`${lexendSmall.className} text-gray-300 text-sm mb-4 line-clamp-2`}>{movie.description}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-300 text-sm">
            <Users size={12} />
            <span>{movie.director}</span>
          </div>
          <div className="flex items-center gap-1 text-gray-300 text-sm">
            <Calendar size={12} />
            <span>{new Date(movie.releaseDate).getFullYear()}</span>
          </div>
        </div>
      </div>
    </div>
  )

  const renderMovieList = (movie: MovieResponseDto) => (
    <div
      key={movie._id}
      className="bg-[#1a1a1a] border border-gray-600 rounded-lg hover:border-[#e78f03] transition-all duration-300"
    >
      <div className="p-4">
        <div className="flex items-center gap-4">
          <img
            src={movie.poster || "/placeholder.svg"}
            alt={movie.title}
            className="w-16 h-24 object-cover rounded-lg"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <h3 className={`${lexend.className} text-lg font-semibold text-white`}>{movie.title}</h3>
              <div className="flex items-center gap-2">
                <span
                  className={`${getRatingColor(movie.rating)} text-white text-xs px-2 py-1 rounded-full font-medium`}
                >
                  {movie.rating}
                </span>
                <div className="flex items-center gap-1 text-yellow-400">
                  <Star size={14} fill="currentColor" />
                  <span className="text-sm">4.5</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 mb-2 flex-wrap">
              {movie.genre.slice(0, 3).map((genre, index) => (
                <span key={index} className={`text-xs px-2 py-1 rounded-full border ${getGenreColor(genre)}`}>
                  {genre}
                </span>
              ))}
              <div className="flex items-center gap-1 text-gray-300 text-sm">
                <Clock size={12} />
                <span>{movie.duration}m</span>
              </div>
              <div className="flex items-center gap-1 text-gray-300 text-sm">
                <Calendar size={12} />
                <span>{new Date(movie.releaseDate).getFullYear()}</span>
              </div>
            </div>
            <p className={`${lexendSmall.className} text-gray-300 text-sm mb-3 line-clamp-1`}>{movie.description}</p>
          </div>
          <div className="flex gap-2">
            <button
              className="px-3 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors"
              onClick={() => onToggleStatus(movie)}
              title={movie.isActive ? "Deactivate" : "Activate"}
            >
              {movie.isActive ? <Pause size={14} /> : <Play size={14} />}
            </button>
            <button
              className="px-3 py-2 text-sm bg-[#e78f03] hover:bg-[#d17a02] text-black rounded-md transition-colors font-medium"
              onClick={() => onEdit(movie)}
            >
              <Edit size={14} />
            </button>
            <button
              className="px-3 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
              onClick={() => onDelete(movie)}
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-[#1a1a1a] border border-gray-600 rounded-lg p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm font-medium">Total Movies</p>
              <p className="text-2xl font-bold text-white">{movies.length}</p>
            </div>
            <Eye className="h-8 w-8 text-[#e78f03]" />
          </div>
        </div>
        <div className="bg-[#1a1a1a] border border-gray-600 rounded-lg p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm font-medium">Active</p>
              <p className="text-2xl font-bold text-green-400">{movies.filter(m => m.isActive).length}</p>
            </div>
            <Play className="h-8 w-8 text-green-400" />
          </div>
        </div>
        <div className="bg-[#1a1a1a] border border-gray-600 rounded-lg p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm font-medium">Inactive</p>
              <p className="text-2xl font-bold text-red-400">{movies.filter(m => !m.isActive).length}</p>
            </div>
            <Pause className="h-8 w-8 text-red-400" />
          </div>
        </div>
        <div className="bg-[#1a1a1a] border border-gray-600 rounded-lg p-4 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-300 text-sm font-medium">Genres</p>
              <p className="text-2xl font-bold text-white">{genres.length - 1}</p>
            </div>
            <Filter className="h-8 w-8 text-[#e78f03]" />
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className={`${lexend.className} text-2xl font-bold text-white`}>{title}</h2>
      </div>

      {/* Filters and Search */}
      <div className="bg-[#1a1a1a] border border-gray-600 rounded-lg p-4 shadow-lg">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search movies by title, genre, or director..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`${lexendSmall.className} w-full pl-10 pr-4 py-2 bg-[#2a2a2a] border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#e78f03] focus:ring-1 focus:ring-[#e78f03]`}
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="w-48 pl-10 pr-4 py-2 bg-[#2a2a2a] border border-gray-500 rounded-lg text-white focus:outline-none focus:border-[#e78f03] focus:ring-1 focus:ring-[#e78f03] appearance-none"
            >
              {genres.map((genre) => (
                <option key={genre} value={genre} className="bg-[#2a2a2a]">
                  {genre === "all" ? "All Genres" : genre}
                </option>
              ))}
            </select>
          </div>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-40 px-4 py-2 bg-[#2a2a2a] border border-gray-500 rounded-lg text-white focus:outline-none focus:border-[#e78f03] focus:ring-1 focus:ring-[#e78f03] appearance-none"
            >
              <option value="title">Sort by Title</option>
              <option value="releaseDate">Sort by Date</option>
              <option value="duration">Sort by Duration</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-md border transition-colors ${
                viewMode === "grid"
                  ? "bg-[#e78f03] text-black border-[#e78f03]"
                  : "border-gray-500 text-gray-300 hover:text-white hover:border-[#e78f03]"
              }`}
            >
              <Grid3X3 size={16} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-md border transition-colors ${
                viewMode === "list"
                  ? "bg-[#e78f03] text-black border-[#e78f03]"
                  : "border-gray-500 text-gray-300 hover:text-white hover:border-[#e78f03]"
              }`}
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {filteredMovies.length === 0 ? (
        <div className="bg-[#1a1a1a] border border-gray-600 rounded-lg p-12 text-center">
          <Eye className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className={`${lexend.className} text-xl text-white mb-2`}>{emptyMessage}</h3>
          <p className={`${lexendSmall.className} text-gray-400`}>Try adjusting your search or filter criteria</p>
        </div>
      ) : (
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              : "space-y-4"
          }
        >
          {filteredMovies.map((movie) => (viewMode === "grid" ? renderMovieCard(movie) : renderMovieList(movie)))}
        </div>
      )}
    </div>
  )
}

export default MoviesList