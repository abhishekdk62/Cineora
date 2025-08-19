"use client";

import React from "react";
import { useState } from "react";
import { Lexend } from "next/font/google";
import { Ticket, Menu, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../redux/slices/authSlice";

const lexendSmall = Lexend({
  weight: "200",
  subsets: ["latin"],
});

const lexendBold = Lexend({
  weight: "700",
  subsets: ["latin"],
});


export default function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();


  const user = useSelector((state: RootState) => state.auth.user);
  const role = useSelector((state: RootState) => state.auth.role);
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const loading = useSelector((state: RootState) => state.auth.loading);
  const error = useSelector((state: RootState) => state.auth.error);

  const handleClickAcc = () => {
    router.push("/user/account");
  };

  const dispatch = useDispatch<AppDispatch>();

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="relative z-50 border-b border-gray-800/50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <div
              onClick={() => {
                router.push("/");
              }}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <Ticket className="h-8 w-8 text-[#FF5A3C]" />
              <span className={`${lexendBold.className} text-2xl text-white`}>
                Cineora
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => {
                router.push("/search/movies");
              }}
              className={`${lexendSmall.className} text-gray-300 hover:text-white transition-colors`}
            >
              Movies
            </button>
            <button

              onClick={() => { router.push('/search/theaters') }}

              className={`${lexendSmall.className} text-gray-300 hover:text-white transition-colors`}
            >
              Theaters
            </button>
            <button
              className={`${lexendSmall.className} text-gray-300 hover:text-white transition-colors`}
            >
              Pricing
            </button>
            <button
              onClick={() => handleClickAcc()}
              className={`${lexendSmall.className} text-gray-300 hover:text-white transition-colors`}
            >
              My Account
            </button>

            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="bg-[#FF5A3C] text-white px-6 py-2 rounded-full hover:bg-[#e54a32] transition-colors font-medium"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => {
                  router.push("/login");
                }}
                className="bg-[#FF5A3C] text-white px-6 py-2 rounded-full hover:bg-[#e54a32] transition-colors font-medium"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-white"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-800/50 py-4">
            <div className="flex flex-col space-y-4">
              <button
                onClick={() => {
                  router.push("/search/movies");
                  setIsMenuOpen(false);
                }}
                className={`${lexendSmall.className} text-gray-300 hover:text-white transition-colors text-left`}
              >
                Movies
              </button>
              <button
                className={`${lexendSmall.className} text-gray-300 hover:text-white transition-colors text-left`}
              >
                Theaters
              </button>
              <button
                className={`${lexendSmall.className} text-gray-300 hover:text-white transition-colors text-left`}
              >
                Pricing
              </button>
              <button
                onClick={() => {
                  handleClickAcc();
                  setIsMenuOpen(false);
                }}
                className={`${lexendSmall.className} text-gray-300 hover:text-white transition-colors text-left`}
              >
                My Account
              </button>
              {isAuthenticated ? (
                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="bg-[#FF5A3C] text-white px-6 py-2 rounded-full hover:bg-[#e54a32] transition-colors font-medium w-fit"
                >
                  Logout
                </button>
              ) : (
                <button
                  onClick={() => {
                    router.push("/login");
                    setIsMenuOpen(false);
                  }}
                  className="bg-[#FF5A3C] text-white px-6 py-2 rounded-full hover:bg-[#e54a32] transition-colors font-medium w-fit"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
