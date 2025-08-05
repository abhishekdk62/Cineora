"use client";

import { Lexend } from "next/font/google";
import { Ticket } from "lucide-react";

const lexend = Lexend({
  weight: "500",
  subsets: ["latin"],
});

const lexendSmall = Lexend({
  weight: "200",
  subsets: ["latin"],
});

const lexendBold = Lexend({
  weight: "700",
  subsets: ["latin"],
});

export default function Footer() {
  return (
    <footer
      id="contact"
      className="relative z-10 border-t border-gray-800/50 backdrop-blur-md"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Ticket className="h-8 w-8 text-[#FF5A3C]" />
              <span className={`${lexendBold.className} text-2xl text-white`}>
                Cineora
              </span>
            </div>
            <p
              className={`${lexendSmall.className} text-gray-300 mb-4 max-w-md`}
            >
              Your premier destination for movie ticket booking. Experience
              cinema like never before with our seamless booking platform and
              premium theater locations.
            </p>
          </div>

          <div>
            <h3 className={`${lexend.className} text-lg text-white mb-4`}>
              Quick Links
            </h3>
            <ul className="space-y-2">
              {["Movies", "Theaters", "Pricing", "Support"].map((link) => (
                <li key={link}>
                  <button
                    className={`${lexendSmall.className} text-gray-300 hover:text-white transition-colors`}
                  >
                    {link}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className={`${lexend.className} text-lg text-white mb-4`}>
              Contact
            </h3>
            <ul className="space-y-2">
              <li className={`${lexendSmall.className} text-gray-300`}>
                support@cinemabook.com
              </li>
              <li className={`${lexendSmall.className} text-gray-300`}>
                1-800-CINEMA-1
              </li>
              <li className={`${lexendSmall.className} text-gray-300`}>
                24/7 Customer Support
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800/50 mt-8 pt-8 text-center">
          <p className={`${lexendSmall.className} text-gray-400`}>
            © 2024 CinemaBook. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}