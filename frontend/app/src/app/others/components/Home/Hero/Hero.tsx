"use client";

import Orb from "@/app/others/components/ReactBits/Orb"; 
import SearchInput from "./SearchInput";
import { Lexend } from "next/font/google";

type HeroProps = {
  onNavigateToSearch?: (query: string) => void;
};

const lexendSmall = Lexend({
  weight: "200",
  subsets: ["latin"],
});

const lexendBold = Lexend({
  weight: "700",
  subsets: ["latin"],
});

export default function Hero({ onNavigateToSearch }: HeroProps) {
  const handleSearch = (query: string) => {
    console.log("Navigating to search results page with query:", query);
    if (onNavigateToSearch) {
      onNavigateToSearch(query);
    }
  };
  const handleSuggestionSelect = (suggestion) => {
    console.log(`Navigating to ${suggestion.type} detail page:`, suggestion);
  };
  return (
    <section className="relative min-h-[600px] flex flex-col justify-center items-center overflow-hidden">
      <div className="relative z-10 w-full">
          <section className="relative h-full pt-28 pb-40 z-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <div className="backdrop-blur-sm bg-black/20 rounded-3xl p-8 md:p-12 border border-gray-500/30">
          <h1
            className={`${lexendBold.className} text-4xl md:text-6xl lg:text-7xl text-white mb-6 leading-tight`}
          >
            Big Screens. Bigger Thrills.
          </h1>
          <p
            className={`${lexendSmall.className} text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto`}
          >
            Experience cinema at its finest. Book tickets instantly, grab the
            best seats, and enjoy the latest blockbusters in ultimate comfort
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <SearchInput 
              onSearch={handleSearch}
              onSuggestionSelect={handleSuggestionSelect}
            />
          </div>
        </div>
      </div>
    </section>
      </div>
    </section>
  );
}
