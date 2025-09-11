import { Lexend } from "next/font/google";

const lexendMedium = Lexend({
  weight: "400",
  subsets: ["latin"],
});

interface MovieActionButtonsProps {
  onBookTicket: () => void;
  onWatchTrailer: () => void;
  hasTrailer: boolean;
}

export default function MovieActionButtons({
  onBookTicket,
  onWatchTrailer,
  hasTrailer
}: MovieActionButtonsProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 pt-4">
      <button 
        onClick={onBookTicket} 
        className={`${lexendMedium.className} flex-1 bg-white text-black py-4 px-6 rounded-xl hover:bg-gray-200 transition-all duration-300 font-medium`}
      >
        Book Tickets
      </button>

      {hasTrailer && (
        <button
          onClick={onWatchTrailer}
          className={`${lexendMedium.className} flex-1 bg-white/10 text-white py-4 px-6 rounded-xl hover:bg-white/20 border border-gray-500/30 transition-all duration-300`}
        >
          Watch Trailer
        </button>
      )}
    </div>
  );
}
