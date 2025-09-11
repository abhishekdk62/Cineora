import { Lexend } from "next/font/google";

const lexendSmall = Lexend({
  weight: "200",
  subsets: ["latin"],
});

const lexendMedium = Lexend({
  weight: "400",
  subsets: ["latin"],
});

interface MovieCreditsProps {
  director: string;
  cast: string[];
}

export default function MovieCredits({ director, cast }: MovieCreditsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h3 className={`${lexendMedium.className} text-white text-lg mb-3`}>Director</h3>
        <p className={`${lexendSmall.className} text-gray-300`}>{director}</p>
      </div>
      <div>
        <h3 className={`${lexendMedium.className} text-white text-lg mb-3`}>Cast</h3>
        <div className="space-y-1">
          {cast.map((actor, index) => (
            <p key={index} className={`${lexendSmall.className} text-gray-300`}>
              {actor}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}
