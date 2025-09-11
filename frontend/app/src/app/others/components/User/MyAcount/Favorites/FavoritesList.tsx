'use client';

import React, { useEffect, useState } from 'react';
import FavoriteMovieCard from './FavoriteMovieCard';
import Loader from '../../../utils/Loader';
import { getUserFavorites, removeFromFavorites } from '@/app/others/services/userServices/favoriteServices';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const lexendBold = { className: "font-bold" };
const lexendSmall = { className: "font-normal text-sm" };
const lexendMedium = { className: "font-medium" };

interface FavoriteMovie {
    _id: string;
    movieId: {
        _id: string;
        title: string;
        poster: string;
        genre: string[];
        releaseDate: string;
        duration: number;
        rating: number;
        language: string;
        synopsis?: string;
    };
    addedAt: string;
    createdAt: string;
}

interface FavoritesResponse {
    favorites: FavoriteMovie[];
    total: number;
    page: number;
    totalPages: number;
}

const FavoritesList = () => {
    const [favoritesData, setFavoritesData] = useState<FavoritesResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [limit] = useState(8);
const router=useRouter()
    const getFavorites = async (pageNumber: number = 1) => {
        try {
            setLoading(true);
            const response = await getUserFavorites();
            console.log(response.data.data);
            setFavoritesData(response.data.data);
            setError(null);
        } catch (error) {
            console.log(error);
            setError('Failed to load favorites');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getFavorites(currentPage);
    }, [currentPage]);

    const handleRemoveFromFavorites = async (movieId: string) => {
        try {
            await removeFromFavorites(movieId);
            getFavorites(currentPage);
            toast.success('Movie removed from favorites')
        } catch (error) {
            console.error('Failed to remove from favorites:', error);
        }
    };

    const handleViewMovie = (movieId: string) => {
    router.push(`/search/movies/${movieId}`)
    };

    const handleBookTickets = (movieId: string) => {
        router.push(`/book/${movieId}?flow=movie-first`)
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-transparent p-12 flex items-center justify-center">
                <div className="text-white text-xl"><Loader text='Loading your tickets' /></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-transparent p-12 flex items-center justify-center">
                <div className="text-red-400 text-xl">{error}</div>
            </div>
        );
    }


    return (
        <div className="min-h-screen bg-transparent p-12">
            <div className="mx-auto max-w-6xl space-y-7">

                <div className="mb-10">
                    <h1 className={`${lexendBold.className} text-5xl text-center text-white mb-2`}>
                        My Favorite Movies
                    </h1>
                    <p className={`${lexendSmall.className} text-gray-400 text-center`}>
                        {favoritesData?.total ? `${favoritesData.total} favorite movies` : 'Your movie collection'}
                    </p>
                </div>

                {/* Stats */}
                {favoritesData?.total && favoritesData.total > 0 && (
                    <div className="flex justify-center mb-8">
                        <div className="bg-white/5 border border-white/10 rounded-xl px-6 py-3 backdrop-blur-sm">
                            <span className={`${lexendMedium.className} text-white text-lg`}>
                                {favoritesData.total} Movies • Page {favoritesData.page} of {favoritesData.totalPages}
                            </span>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 gap-6">
                    {favoritesData?.favorites?.map((favorite) => (
                        <FavoriteMovieCard
                            key={favorite._id}
                            favorite={favorite}
                            onRemoveFromFavorites={handleRemoveFromFavorites}
                            onViewMovie={handleViewMovie}
                            onBookTickets={handleBookTickets}
                        />
                    ))}
                </div>

                {/* Empty State */}
                {(!favoritesData?.favorites || favoritesData.favorites.length === 0) && (
                    <div className="text-center bg-gradient-to-br from-white/10 via-white/5 to-transparent border border-white/10 rounded-2xl p-12 backdrop-blur-xl">
                        <div className="w-16 h-16 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </div>
                        <h3 className={`${lexendBold.className} text-xl text-white mb-2`}>
                            No Favorite Movies Yet
                        </h3>
                        <p className={`${lexendSmall.className} text-gray-400 mb-6`}>
                            Start adding movies to your favorites to see them here
                        </p>
                        <button
                            onClick={() => window.location.href = '/movies'}
                            className={`${lexendBold.className} bg-white text-black px-6 py-3 rounded-xl hover:bg-white/90 transition-colors`}
                        >
                            Browse Movies
                        </button>
                    </div>
                )}

                {/* Pagination would go here if needed */}
            </div>
        </div>
    );
};

export default FavoritesList;
