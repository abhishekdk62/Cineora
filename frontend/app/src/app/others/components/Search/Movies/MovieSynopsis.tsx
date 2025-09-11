import { Lexend } from "next/font/google";

const lexendSmall = Lexend({
  weight: "200",
  subsets: ["latin"],
});

const lexendMedium = Lexend({
  weight: "400",
  subsets: ["latin"],
});

interface MovieSynopsisProps {
  description: string;
}

export default function MovieSynopsis({ description }: MovieSynopsisProps) {
  return (
    <div>
      <h3 className={`${lexendMedium.className} text-white text-lg mb-3`}>Synopsis</h3>
      <p className={`${lexendSmall.className} text-gray-300 leading-relaxed`}>
        {description}
      </p>
    </div>
  );
}
