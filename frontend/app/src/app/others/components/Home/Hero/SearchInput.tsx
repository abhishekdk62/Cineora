"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Lexend } from "next/font/google";
import SearchModal from "./SearchModal"; 

const lexendMedium = Lexend({
  weight: "400",
  subsets: ["latin"],
});

type SearchInputProps = {
  onSearch: (query: string) => void;
  onSuggestionSelect: (suggestion) => void;
};

export default function SearchInput({ onSearch, onSuggestionSelect }: SearchInputProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalSearch = (query: string, type: "movies" | "theaters") => {
    console.log(`Searching for ${type}:`, query);
    onSearch(query);
  };

  return (
    <>
      <div 
        className="relative flex-1 max-w-md cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <div className={`${lexendMedium.className} w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-sm border border-gray-500/30 rounded-2xl text-white placeholder-gray-400 hover:bg-white/15 transition-all duration-300 cursor-pointer`}>
            Search movies, theaters...
          </div>
        </div>
      </div>

      <SearchModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSearch={handleModalSearch}
      />
    </>
  );
}
