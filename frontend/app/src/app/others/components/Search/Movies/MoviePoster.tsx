import { Lexend } from "next/font/google";

const lexendSmall = Lexend({
  weight: "200",
  subsets: ["latin"],
});

interface Movie {
  poster: string;
  title: string;
  rating: string;
}

interface MoviePosterProps {
  movie: Movie;
}

export default function MoviePoster({ movie }: MoviePosterProps) {
  return (
    <div className="lg:col-span-1">
      <div className="relative group">
        <img
          src={movie.poster}
          alt={movie.title}
          className="w-full rounded-2xl shadow-2xl"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/api/placeholder/400/600";
          }}
        />
        <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-lg">
          <span className={`${lexendSmall.className} text-white text-sm`}>
            {movie.rating}
          </span>
        </div>
      </div>
    </div>
  );
}
