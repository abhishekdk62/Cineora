import { Lexend } from "next/font/google";

const lexendMedium = Lexend({
  weight: "400",
  subsets: ["latin"],
});

const lexendSmall = Lexend({
  weight: "200",
  subsets: ["latin"],
});

export default function EmptyTheaterReviews() {
  return (
    <div className="text-center py-12 px-6">
      <p className={`${lexendMedium.className} text-gray-400 text-lg`}>
        No reviews yet for this theater
      </p>
      <p className={`${lexendSmall.className} text-gray-500 mt-2`}>
        Be the first to review this theater after booking a show!
      </p>
    </div>
  );
}
