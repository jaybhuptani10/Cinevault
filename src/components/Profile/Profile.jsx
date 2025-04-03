import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Navbar from "../comp/Navbar";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [movies, setMovies] = useState({
    watched: [],
    liked: [],
    watchlisted: [],
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("watched");
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    setLoading(true);
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("You must be logged in to view this page");
      setLoading(false);
      return;
    }

    try {
      const [userResponse, moviesResponse] = await Promise.all([
        axios.get("/user/profile", { headers: { "x-auth-token": token } }),
        axios.get("/user/collections", { headers: { "x-auth-token": token } }),
      ]);

      setUser(userResponse.data);
      setMovies({
        watched: moviesResponse.data.watched || [],
        liked: moviesResponse.data.liked || [],
        watchlisted: moviesResponse.data.watchlisted || [],
      });
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError("Failed to load profile data");
    } finally {
      setLoading(false);
    }
  };

  const removeFromCollection = async (movieId, collectionType) => {
    const token = localStorage.getItem("authToken");

    try {
      await axios.delete(`/user/media/movie/${movieId}/${collectionType}`, {
        headers: { "x-auth-token": token },
      });

      // Update local state after successful removal
      setMovies((prev) => ({
        ...prev,
        [collectionType]: prev[collectionType].filter(
          (movie) => movie.id !== movieId
        ),
      }));
    } catch (err) {
      console.error(`Error removing movie from ${collectionType}:`, err);
    }
  };

  const MovieCard = ({ movie, collectionType }) => {
    const posterUrl = movie.poster_path
      ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
      : "/placeholder-poster.jpg";

    return (
      <>
        <Navbar />
        <div className="relative group bg-gray-900 rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl">
          <Link to={`/movie/${movie.id}`}>
            <img
              src={posterUrl}
              alt={movie.title}
              className="w-full h-64 object-cover"
            />
            <div className="p-4">
              <h3 className="text-white font-medium text-lg line-clamp-1">
                {movie.title}
              </h3>
              <p className="text-gray-400 text-sm">
                {movie.release_date?.substring(0, 4)}
              </p>
              {movie.vote_average > 0 && (
                <div className="flex items-center mt-2">
                  <svg
                    className="w-4 h-4 text-yellow-400 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-gray-300">
                    {movie.vote_average.toFixed(1)}
                  </span>
                </div>
              )}
            </div>
          </Link>
          <button
            onClick={() => removeFromCollection(movie.id, collectionType)}
            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Remove from collection"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="text-center p-6 bg-gray-800 rounded-lg shadow-lg">
          <p className="text-red-500 mb-4">{error}</p>
          <Link to="/login" className="text-blue-500 hover:underline">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  const activeMovies = movies[activeTab] || [];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-purple-900 py-16 px-4">
        <div className="container mx-auto">
          <div className="flex items-center gap-6">
            <div className="bg-gray-800 rounded-full h-24 w-24 flex items-center justify-center text-3xl font-bold border-4 border-blue-500">
              {user?.username?.charAt(0).toUpperCase() || "?"}
            </div>
            <div>
              <h1 className="text-3xl font-bold">
                {user?.username || "User"}'s Profile
              </h1>
              <p className="text-gray-300 mt-1">{user?.email || ""}</p>
              <div className="flex items-center gap-8 mt-4">
                <div className="text-center">
                  <div className="text-2xl font-semibold">
                    {movies.watched.length}
                  </div>
                  <div className="text-gray-300 text-sm">Watched</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-semibold">
                    {movies.liked.length}
                  </div>
                  <div className="text-gray-300 text-sm">Liked</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-semibold">
                    {movies.watchlisted.length}
                  </div>
                  <div className="text-gray-300 text-sm">Watchlist</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Movie Collection Tabs */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex border-b border-gray-700 mb-8">
          <button
            className={`px-6 py-3 text-lg font-medium ${
              activeTab === "watched"
                ? "text-blue-500 border-b-2 border-blue-500"
                : "text-gray-400 hover:text-gray-200"
            }`}
            onClick={() => setActiveTab("watched")}
          >
            Watched
          </button>
          <button
            className={`px-6 py-3 text-lg font-medium ${
              activeTab === "liked"
                ? "text-red-500 border-b-2 border-red-500"
                : "text-gray-400 hover:text-gray-200"
            }`}
            onClick={() => setActiveTab("liked")}
          >
            Liked
          </button>
          <button
            className={`px-6 py-3 text-lg font-medium ${
              activeTab === "watchlisted"
                ? "text-green-500 border-b-2 border-green-500"
                : "text-gray-400 hover:text-gray-200"
            }`}
            onClick={() => setActiveTab("watchlisted")}
          >
            Watchlist
          </button>
        </div>

        {/* Movie Grid */}
        {activeMovies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {activeMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                collectionType={activeTab}
              />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <svg
              className="w-16 h-16 mx-auto text-gray-600 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z"
              />
            </svg>
            <p className="text-xl text-gray-400">
              No movies in your {activeTab} collection yet.
            </p>
            <Link
              to="/discover"
              className="inline-block mt-4 px-6 py-2 bg-blue-600 rounded-full hover:bg-blue-700 transition-colors"
            >
              Discover Movies
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
