import { Lexend } from "next/font/google";
import { ThumbsUp, Flag } from "lucide-react";

const lexendSmall = Lexend({
  weight: "200",
  subsets: ["latin"],
});

interface ReviewActionsProps {
  helpfulCount: number;
}

export default function ReviewActions({ helpfulCount }: ReviewActionsProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
          <ThumbsUp className="w-4 h-4" />
          <span className={`${lexendSmall.className}`}>
            Helpful ({helpfulCount})
          </span>
        </button>
      </div>
      <button className="flex items-center gap-2 text-gray-400 hover:text-red-400 transition-colors">
        <Flag className="w-4 h-4" />
        <span className={`${lexendSmall.className}`}>Report</span>
      </button>
    </div>
  );
}
