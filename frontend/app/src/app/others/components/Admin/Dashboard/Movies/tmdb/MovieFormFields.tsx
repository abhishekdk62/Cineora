import React from "react";
import { Lexend } from "next/font/google";

const lexendSmall = Lexend({
  weight: "300",
  subsets: ["latin"],
});

interface MovieFormFieldsProps {
  formData: {
    title?: string;
    duration?: number;
    rating?: string;
    releaseDate?: string;
    language?: string;
    director?: string;
    trailer?: string;
    description?: string;
  };
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
}

const MovieFormFields: React.FC<MovieFormFieldsProps> = ({
  formData,
  onInputChange,
}) => {
  const ratings = ["G", "PG", "PG-13", "R", "NC-17"];
  const languages = [
    { code: "en", name: "English" },
    { code: "es", name: "Spanish" },
    { code: "fr", name: "French" },
    { code: "de", name: "German" },
    { code: "it", name: "Italian" },
    { code: "ja", name: "Japanese" },
    { code: "ko", name: "Korean" },
    { code: "zh", name: "Chinese" },
    { code: "hi", name: "Hindi" },
    { code: "ar", name: "Arabic" },
  ];

  return (
    <div className="grid grid-cols-1 gap-4">
      <div className="space-y-2">
        <label
          className={`${lexendSmall.className} block text-sm text-gray-300 font-medium`}
        >
          Title <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          name="title"
          value={formData.title || ""}
          onChange={onInputChange}
          required
          className="w-full px-3 py-2 bg-[#2a2a2a] border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#e78f03] focus:ring-1 focus:ring-[#e78f03]"
          placeholder="Enter movie title"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label
            className={`${lexendSmall.className} block text-sm text-gray-300 font-medium`}
          >
            Duration (minutes)
          </label>
          <input
            type="number"
            name="duration"
            value={formData.duration || ""}
            onChange={onInputChange}
            min="1"
            className="w-full px-3 py-2 bg-[#2a2a2a] border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#e78f03] focus:ring-1 focus:ring-[#e78f03]"
            placeholder="120"
          />
        </div>

        <div className="space-y-2">
          <label
            className={`${lexendSmall.className} block text-sm text-gray-300 font-medium`}
          >
            Rating
          </label>
          <select
            name="rating"
            value={formData.rating || ""}
            onChange={onInputChange}
            className="w-full px-3 py-2 bg-[#2a2a2a] border border-gray-500 rounded-lg text-white focus:outline-none focus:border-[#e78f03] focus:ring-1 focus:ring-[#e78f03]"
          >
            <option value="">Select rating</option>
            {ratings.map((rating) => (
              <option key={rating} value={rating}>
                {rating}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label
            className={`${lexendSmall.className} block text-sm text-gray-300 font-medium`}
          >
            Release Date <span className="text-red-400">*</span>
          </label>
          <input
            type="date"
            name="releaseDate"
            value={formData.releaseDate || ""}
            onChange={onInputChange}
            required
            className="w-full px-3 py-2 bg-[#2a2a2a] border border-gray-500 rounded-lg text-white focus:outline-none focus:border-[#e78f03] focus:ring-1 focus:ring-[#e78f03]"
          />
        </div>

        <div className="space-y-2">
          <label
            className={`${lexendSmall.className} block text-sm text-gray-300 font-medium`}
          >
            Language
          </label>
          <select
            name="language"
            value={formData.language || ""}
            onChange={onInputChange}
            className="w-full px-3 py-2 bg-[#2a2a2a] border border-gray-500 rounded-lg text-white focus:outline-none focus:border-[#e78f03] focus:ring-1 focus:ring-[#e78f03]"
          >
            <option value="">Select language</option>
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label
          className={`${lexendSmall.className} block text-sm text-gray-300 font-medium`}
        >
          Director
        </label>
        <input
          type="text"
          name="director"
          value={formData.director || ""}
          onChange={onInputChange}
          className="w-full px-3 py-2 bg-[#2a2a2a] border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#e78f03] focus:ring-1 focus:ring-[#e78f03]"
          placeholder="Director name"
        />
      </div>

      <div className="space-y-2">
        <label
          className={`${lexendSmall.className} block text-sm text-gray-300 font-medium`}
        >
          Trailer URL
        </label>
        <input
          type="url"
          name="trailer"
          value={formData.trailer || ""}
          onChange={onInputChange}
          className="w-full px-3 py-2 bg-[#2a2a2a] border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#e78f03] focus:ring-1 focus:ring-[#e78f03]"
          placeholder="https://youtube.com/watch?v=..."
        />
      </div>

      <div className="space-y-2">
        <label
          className={`${lexendSmall.className} block text-sm text-gray-300 font-medium`}
        >
          Description <span className="text-red-400">*</span>
        </label>
        <textarea
          name="description"
          value={formData.description || ""}
          onChange={onInputChange}
          rows={4}
          required
          className="w-full px-3 py-2 bg-[#2a2a2a] border border-gray-500 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#e78f03] focus:ring-1 focus:ring-[#e78f03] resize-none"
          placeholder="Enter movie description..."
        />
      </div>
    </div>
  );
};

export default MovieFormFields;
