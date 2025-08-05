"use client";

import { Lexend } from "next/font/google";

const lexendSmall = Lexend({
  weight: "200",
  subsets: ["latin"],
});

const lexendBold = Lexend({
  weight: "700",
  subsets: ["latin"],
});

export default function CallToAction() {
  return (
    <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <div className="backdrop-blur-sm bg-black/30 rounded-3xl border border-gray-500/30 p-12">
          <h2
            className={`${lexendBold.className} text-4xl md:text-5xl text-white mb-6`}
          >
            Ready for the Show?
          </h2>
          <p
            className={`${lexendSmall.className} text-xl text-gray-300 mb-8`}
          >
            Book your seats, grab your popcorn, and dive into the thrill of
            every frame
          </p>
          <button
            type="button"
            className="px-8 py-3 cursor-pointer bg-white text-black font-semibold rounded-full shadow-lg hover:shadow-xl transition-shadow duration-200 max-w-xs mx-auto"
          >
            Book Now
          </button>
        </div>
      </div>
    </section>
  );
}