import { MovieResponseDto } from "@/app/others/dtos";

interface Movie {
  title: string;
  trailer: string;
}

interface MovieTrailerModalProps {
  movie: MovieResponseDto;
  showTrailer: boolean;
  onClose: () => void;
}

export default function MovieTrailerModal({ movie, showTrailer, onClose }: MovieTrailerModalProps) {
  const getVideoId = (url: string) => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
      /youtube\.com\/embed\/([^&\n?#]+)/,
      /youtube\.com\/v\/([^&\n?#]+)/
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return match[1].split('?')[0];
      }
    }
    return null;
  };

  if (!showTrailer || !movie.trailer) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl">
        <button
          onClick={onClose}
          className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors duration-200"
        >
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        <div className="aspect-video rounded-2xl overflow-hidden">
          <iframe
            src={`https://www.youtube.com/embed/${getVideoId(movie.trailer)}`}
            className="w-full h-full"
            allowFullScreen
            title={`${movie.title} Trailer`}
          />
        </div>
      </div>
    </div>
  );
}
