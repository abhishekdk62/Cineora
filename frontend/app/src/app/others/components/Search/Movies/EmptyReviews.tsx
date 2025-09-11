import { Lexend } from "next/font/google";

const lexendSmall = Lexend({
  weight: "200",
  subsets: ["latin"],
});

const lexendMedium = Lexend({
  weight: "400",
  subsets: ["latin"],
});

export default function EmptyReviews() {
  return (
    <div className="text-center py-8">
      <p className={`${lexendMedium.className} text-gray-400 text-lg`}>
        No movie reviews yet
      </p>
      <p className={`${lexendSmall.className} text-gray-500 mt-2`}>
        Be the first to review this movie!
      </p>
    </div>
  );
}
