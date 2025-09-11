import { Lexend } from "next/font/google";

const lexendSmall = Lexend({
  weight: "200",
  subsets: ["latin"],
});

const lexendMedium = Lexend({
  weight: "400",
  subsets: ["latin"],
});

interface MovieGenresProps {
  genres: string[];
}

export default function MovieGenres({ genres }: MovieGenresProps) {
  return (
    <div>
      <h3 className={`${lexendMedium.className} text-white text-lg mb-3`}>Genres</h3>
      <div className="flex flex-wrap gap-2">
        {genres.map((genre, index) => (
          <span
            key={index}
            className={`${lexendSmall.className} bg-white/10 text-white px-3 py-1 rounded-lg text-sm border border-gray-500/30`}
          >
            {genre}
          </span>
        ))}
      </div>
    </div>
  );
}
