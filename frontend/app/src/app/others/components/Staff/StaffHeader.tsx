"use client";
import React from "react";
import { useState, useEffect } from "react";
import { Menu, X, User, QrCode, LogOut, ChevronDown } from "lucide-react";
import { useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../redux/slices/authSlice";
import { Lexend } from "next/font/google";

import NavLogo from "../Home/NavLogo";
import { useRouter } from "next/navigation";

const lexendMedium = Lexend({ weight: "500", subsets: ["latin"] });
const lexendRegular = Lexend({ weight: "400", subsets: ["latin"] });

interface StaffHeaderProps {
  activeTab: 'account' | 'scanner';
  onTabChange: (tab: 'account' | 'scanner') => void;
}

export default function StaffHeader({ activeTab, onTabChange }: StaffHeaderProps) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
 
    const dispatch = useDispatch<AppDispatch>();
    const user = useSelector((state: RootState) => state.auth.user);
    const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleLogout = async () => {
        try {
            await dispatch(logoutUser()).unwrap();
            router.push('/login');
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <>
            <nav className="relative z-50 border-b border-gray-800/50 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <div className="flex items-center">
                            <NavLogo />
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-6">
                            {/* Tab Buttons */}
                            <button
                                onClick={() => onTabChange('account')}
                                className={`${lexendMedium.className} flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                                    activeTab === 'account' 
                                        ? 'bg-white text-black' 
                                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                                }`}
                            >
                                <User className="w-4 h-4" />
                                My Account
                            </button>

                            <button
                                onClick={() => onTabChange('scanner')}
                                className={`${lexendMedium.className} flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                                    activeTab === 'scanner' 
                                        ? 'bg-white text-black' 
                                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                                }`}
                            >
                                <QrCode className="w-4 h-4" />
                                QR Scanner
                            </button>

                            {/* User Profile Dropdown */}
                            {mounted && isAuthenticated && user && (
                                <div className="relative">
                                    <button
                                        onClick={() => setIsProfileOpen(!isProfileOpen)}
                                        className="flex items-center gap-2 px-3 py-2 text-gray-300 hover:text-white transition-colors rounded-xl hover:bg-white/10"
                                    >
                                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                            <span className={`${lexendMedium.className} text-white text-sm`}>
                                                {user.firstName?.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <span className={`${lexendRegular.className} text-sm`}>
                                            {user.firstName}
                                        </span>
                                        <ChevronDown className="w-4 h-4" />
                                    </button>

                                    {isProfileOpen && (
                                        <div className="absolute right-0 top-full mt-2 w-64 bg-black/90 backdrop-blur-sm border border-gray-500/30 rounded-xl shadow-2xl z-50">
                                            <div className="p-4 border-b border-gray-500/30">
                                                <p className={`${lexendMedium.className} text-white text-sm`}>
                                                    {user.firstName} {user.lastName}
                                                </p>
                                                <p className={`${lexendRegular.className} text-gray-400 text-xs`}>
                                                    {user.email}
                                                </p>
                                                <span className={`${lexendRegular.className} inline-block mt-1 px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full`}>
                                                    {user.role}
                                                </span>
                                            </div>
                                            <div className="p-2">
                                                <button
                                                    onClick={handleLogout}
                                                    className={`${lexendRegular.className} w-full flex items-center gap-2 px-3 py-2 text-left text-red-400 hover:bg-red-500/20 rounded-lg transition-colors text-sm`}
                                                >
                                                    <LogOut className="w-4 h-4" />
                                                    Sign Out
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Mobile Menu Button */}
                        <div className="md:hidden flex items-center gap-4">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="text-gray-300 hover:text-white"
                            >
                                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Navigation */}
                    {isMenuOpen && (
                        <div className="md:hidden border-t border-gray-800/50 py-4">
                            <div className="flex flex-col space-y-4">
                                {/* User Info */}
                                {mounted && isAuthenticated && user && (
                                    <div className="flex items-center gap-3 px-4 py-2 border border-gray-500/30 rounded-xl">
                                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                            <span className={`${lexendMedium.className} text-white`}>
                                                {user.firstName?.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <div>
                                            <p className={`${lexendMedium.className} text-white text-sm`}>
                                                {user.firstName} {user.lastName}
                                            </p>
                                            <p className={`${lexendRegular.className} text-gray-400 text-xs`}>
                                                {user.email}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {/* Tab Buttons */}
                                <button
                                    onClick={() => {
                                        onTabChange('account');
                                        setIsMenuOpen(false);
                                    }}
                                    className={`${lexendMedium.className} flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                                        activeTab === 'account' 
                                            ? 'bg-white text-black' 
                                            : 'text-gray-300 hover:text-white hover:bg-white/10'
                                    }`}
                                >
                                    <User className="w-5 h-5" />
                                    My Account
                                </button>

                                <button
                                    onClick={() => {
                                        onTabChange('scanner');
                                        setIsMenuOpen(false);
                                    }}
                                    className={`${lexendMedium.className} flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                                        activeTab === 'scanner' 
                                            ? 'bg-white text-black' 
                                            : 'text-gray-300 hover:text-white hover:bg-white/10'
                                    }`}
                                >
                                    <QrCode className="w-5 h-5" />
                                    QR Scanner
                                </button>

                                <button
                                    onClick={handleLogout}
                                    className={`${lexendMedium.className} flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/20 rounded-xl transition-colors`}
                                >
                                    <LogOut className="w-5 h-5" />
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            {isProfileOpen && (
                <div
                    className="fixed inset-0 z-40"
                    onClick={() => setIsProfileOpen(false)}
                />
            )}
        </>
    );
}
