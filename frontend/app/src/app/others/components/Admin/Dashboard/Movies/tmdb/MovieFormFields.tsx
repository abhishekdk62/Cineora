import React from "react";
import { Lexend } from "next/font/google";
import { UseFormRegister, FieldErrors } from 'react-hook-form';

const lexendSmall = Lexend({
  weight: "300",
  subsets: ["latin"],
});

interface MovieFormFieldsProps {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
  watchedValues: any;
}

const MovieFormFields: React.FC<MovieFormFieldsProps> = ({
  register,
  errors,
  watchedValues,
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
      {/* Title Field */}
      <div className="space-y-2">
        <label className={`${lexendSmall.className} block text-sm text-gray-300 font-medium`}>
          Title <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          {...register('title')}
          className={`w-full px-3 py-2 bg-[#2a2a2a] border ${
            errors.title ? 'border-red-400' : 'border-gray-500'
          } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#e78f03] focus:ring-1 focus:ring-[#e78f03]`}
          placeholder="Enter movie title"
        />
        {errors.title && (
          <p className="text-red-400 text-sm mt-1">
            {String(errors.title?.message || 'This field is required')}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Duration Field */}
        <div className="space-y-2">
          <label className={`${lexendSmall.className} block text-sm text-gray-300 font-medium`}>
            Duration (minutes)
          </label>
          <input
            type="number"
            {...register('duration', { valueAsNumber: true })}
            min="1"
            className={`w-full px-3 py-2 bg-[#2a2a2a] border ${
              errors.duration ? 'border-red-400' : 'border-gray-500'
            } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#e78f03] focus:ring-1 focus:ring-[#e78f03]`}
            placeholder="120"
          />
          {errors.duration && (
            <p className="text-red-400 text-sm mt-1">
              {String(errors.duration?.message || 'Duration is required')}
            </p>
          )}
        </div>

        {/* Rating Field */}
        <div className="space-y-2">
          <label className={`${lexendSmall.className} block text-sm text-gray-300 font-medium`}>
            Rating
          </label>
          <select
            {...register('rating')}
            className={`w-full px-3 py-2 bg-[#2a2a2a] border ${
              errors.rating ? 'border-red-400' : 'border-gray-500'
            } rounded-lg text-white focus:outline-none focus:border-[#e78f03] focus:ring-1 focus:ring-[#e78f03]`}
          >
            <option value="">Select rating</option>
            {ratings.map((rating) => (
              <option key={rating} value={rating}>
                {rating}
              </option>
            ))}
          </select>
          {errors.rating && (
            <p className="text-red-400 text-sm mt-1">
              {String(errors.rating?.message || 'Rating is required')}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Release Date Field */}
        <div className="space-y-2">
          <label className={`${lexendSmall.className} block text-sm text-gray-300 font-medium`}>
            Release Date <span className="text-red-400">*</span>
          </label>
          <input
            type="date"
            {...register('releaseDate')}
            className={`w-full px-3 py-2 bg-[#2a2a2a] border ${
              errors.releaseDate ? 'border-red-400' : 'border-gray-500'
            } rounded-lg text-white focus:outline-none focus:border-[#e78f03] focus:ring-1 focus:ring-[#e78f03]`}
          />
          {errors.releaseDate && (
            <p className="text-red-400 text-sm mt-1">
              {String(errors.releaseDate?.message || 'Release date is required')}
            </p>
          )}
        </div>

        {/* Language Field */}
        <div className="space-y-2">
          <label className={`${lexendSmall.className} block text-sm text-gray-300 font-medium`}>
            Language
          </label>
          <select
            {...register('language')}
            className={`w-full px-3 py-2 bg-[#2a2a2a] border ${
              errors.language ? 'border-red-400' : 'border-gray-500'
            } rounded-lg text-white focus:outline-none focus:border-[#e78f03] focus:ring-1 focus:ring-[#e78f03]`}
          >
            <option value="">Select language</option>
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
          {errors.language && (
            <p className="text-red-400 text-sm mt-1">
              {String(errors.language?.message || 'Language is required')}
            </p>
          )}
        </div>
      </div>

      {/* Director Field */}
      <div className="space-y-2">
        <label className={`${lexendSmall.className} block text-sm text-gray-300 font-medium`}>
          Director
        </label>
        <input
          type="text"
          {...register('director')}
          className={`w-full px-3 py-2 bg-[#2a2a2a] border ${
            errors.director ? 'border-red-400' : 'border-gray-500'
          } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#e78f03] focus:ring-1 focus:ring-[#e78f03]`}
          placeholder="Director name"
        />
        {errors.director && (
          <p className="text-red-400 text-sm mt-1">
            {String(errors.director?.message || 'Director is required')}
          </p>
        )}
      </div>

      {/* Trailer URL Field */}
      <div className="space-y-2">
        <label className={`${lexendSmall.className} block text-sm text-gray-300 font-medium`}>
          Trailer URL
        </label>
        <input
          type="url"
          {...register('trailer')}
          className={`w-full px-3 py-2 bg-[#2a2a2a] border ${
            errors.trailer ? 'border-red-400' : 'border-gray-500'
          } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#e78f03] focus:ring-1 focus:ring-[#e78f03]`}
          placeholder="https://youtube.com/watch?v=..."
        />
        {errors.trailer && (
          <p className="text-red-400 text-sm mt-1">
            {String(errors.trailer?.message || 'Invalid trailer URL')}
          </p>
        )}
      </div>

      {/* Description Field */}
      <div className="space-y-2">
        <label className={`${lexendSmall.className} block text-sm text-gray-300 font-medium`}>
          Description <span className="text-red-400">*</span>
        </label>
        <textarea
          {...register('description')}
          rows={4}
          className={`w-full px-3 py-2 bg-[#2a2a2a] border ${
            errors.description ? 'border-red-400' : 'border-gray-500'
          } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#e78f03] focus:ring-1 focus:ring-[#e78f03] resize-none`}
          placeholder="Enter movie description..."
        />
        {errors.description && (
          <p className="text-red-400 text-sm mt-1">
            {String(errors.description?.message || 'Description is required')}
          </p>
        )}
      </div>
    </div>
  );
};

export default MovieFormFields;
