"use client";

import React from "react";
import { Lexend } from "next/font/google";

const lexendSmall = Lexend({ weight: "200", subsets: ["latin"] });
const lexendMedium = Lexend({ weight: "400", subsets: ["latin"] });

interface DateSelectorProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export default function DateSelector({ selectedDate, onDateChange }: DateSelectorProps) {
  const getNext7Days = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    } else {
      return date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      });
    }
  };

  return (
    <div className="pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="backdrop-blur-sm bg-black/20 rounded-2xl p-4 border border-gray-500/30">
          <h2 className={`${lexendMedium.className} text-white text-lg mb-4`}>
            Select Date
          </h2>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {getNext7Days().map((date, index) => (
              <button
                key={index}
                onClick={() => onDateChange(date)}
                className={`${lexendSmall.className} flex-shrink-0 px-4 py-3 rounded-lg transition-all duration-300 ${
                  selectedDate.toDateString() === date.toDateString()
                    ? "bg-white text-black"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                <div className="text-center">
                  <div className="font-medium">{formatDate(date)}</div>
                  <div className="text-xs opacity-75">
                    {date.toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "short",
                    })}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
