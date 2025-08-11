"use client";

import React, { forwardRef } from "react";

type Suggestion = {
  id: string | number;
  title: string;
  type: "movie" | "theater" | "location";
  location?: string;
};

type Props = {
  suggestions: Suggestion[];
  selectedIndex: number;
  onSuggestionClick: (suggestion: Suggestion) => void;
  id?: string;
};

const SearchSuggestions = forwardRef<HTMLUListElement, Props>(
  ({ suggestions, selectedIndex, onSuggestionClick, id }, ref) => {
    return (
      <ul
        ref={ref}
        id={id}
        className="absolute left-0 right-0 mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg max-h-64 overflow-auto z-50"
        role="listbox"
      >
        {suggestions.map((suggestion, index) => {
          const isSelected = index === selectedIndex;
          return (
            <li
              key={`${suggestion.type}-${suggestion.id}`}
              role="option"
              aria-selected={isSelected}
            >
              <button
                type="button"
                onMouseDown={() => onSuggestionClick(suggestion)}
                className={`
                  flex items-center w-full px-4 py-2 text-left
                  transition-colors duration-200
                  ${
                    isSelected
                      ? "bg-indigo-600 text-white font-medium"
                      : "text-gray-200 hover:bg-indigo-500 hover:text-white"
                  }
                  focus:outline-none
                `}
                id={`suggestion-${index}`}
                tabIndex={-1}
              >
                <img
                  src="/default.jpg" 
                  alt={`${suggestion.title} poster`}
                  className="w-10 h-14 rounded-md object-cover mr-3 flex-shrink-0 border border-gray-700"
                />
                <div>
                  <div className="text-sm sm:text-base font-medium">
                    {suggestion.title}
                  </div>
                  {suggestion.location && (
                    <div className="text-xs text-gray-400">{suggestion.location}</div>
                  )}
                  <div className="text-[10px] uppercase tracking-wide text-gray-400 mt-0.5">
                    {suggestion.type}
                  </div>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    );
  }
);

SearchSuggestions.displayName = "SearchSuggestions";

export default SearchSuggestions;
