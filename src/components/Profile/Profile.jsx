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
  const [mediaTypeFilter, setMediaTypeFilter] = useState("all"); // Options: all, movie, tv
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
        axios.get("/user/media/lists", { headers: { "x-auth-token": token } }),
      ]);

      setUser(userResponse.data);

      // Helper function to fetch movie/series details
      const fetchDetails = async (mediaArray) => {
        const details = await Promise.all(
          mediaArray.map(async (item) => {
            const response = await axios.get("/api/details", {
              params: {
                type: item.mediaType,
                id: item.tmdbId,
                sub: "",
                end: "",
              },
            });
            return {
              id: item.tmdbId,
              mediaType: item.mediaType,
              title:
                response.data.title || response.data.name || "Unknown Title",
              poster_path: response.data.poster_path || null,
              release_date:
                response.data.release_date ||
                response.data.first_air_date ||
                "Unknown Date",
              vote_average: response.data.vote_average || 0,
            };
          })
        );
        return details;
      };

      // Fetch details for watched, liked, and watchlisted
      const watchedDetails = await fetchDetails(
        moviesResponse.data.watched || []
      );
      const likedDetails = await fetchDetails(moviesResponse.data.liked || []);
      const watchlistedDetails = await fetchDetails(
        moviesResponse.data.watchlisted || []
      );

      setMovies({
        watched: watchedDetails,
        liked: likedDetails,
        watchlisted: watchlistedDetails,
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
      await axios.post(
        `/user/media/${collectionType}/${movieId}/remove`,
        {},
        { headers: { "x-auth-token": token } }
      );

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
      ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
      : "/placeholder-poster.jpg";

    // Format media type for display
    const mediaTypeDisplay = movie.mediaType === "tv" ? "TV Series" : "Movie";

    return (
      <div className="relative group bg-gray-800 rounded overflow-hidden shadow-md transition-all duration-200 hover:shadow-lg">
        <Link to={`/movie/${movie.id}`} className="flex flex-col h-full">
          <div className="poster-container w-full h-64 overflow-hidden bg-gray-900 relative">
            <img
              src={posterUrl}
              alt={movie.title}
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "/placeholder-poster.jpg";
              }}
            />
            {/* Media type badge that appears on hover */}
            <div className="absolute inset-0 bg-black bg-opacity-60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="px-2 py-1 bg-blue-600 text-white text-xs font-medium rounded">
                {mediaTypeDisplay}
              </span>
            </div>
          </div>
          <div className="p-2 flex-1 flex flex-col justify-between">
            <h3 className="text-white text-sm font-medium line-clamp-1 mb-1">
              {movie.title}
            </h3>
            <div className="flex items-center justify-between">
              <p className="text-gray-400 text-xs">
                {movie.release_date?.substring(0, 4) || "N/A"}
              </p>
              {movie.vote_average > 0 && (
                <div className="flex items-center">
                  <svg
                    className="w-3 h-3 text-yellow-400 mr-0.5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-gray-300 text-xs">
                    {movie.vote_average.toFixed(1)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </Link>
        <button
          onClick={() => removeFromCollection(movie.id, collectionType)}
          className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Remove from collection"
        >
          <svg
            className="w-3 h-3"
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
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-900">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
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

  // Filter the active tab's media based on mediaTypeFilter
  const activeMovies = movies[activeTab] || [];
  const filteredMovies =
    mediaTypeFilter === "all"
      ? activeMovies
      : activeMovies.filter((movie) => movie.mediaType === mediaTypeFilter);

  // Calculate counts for movie/TV type in current collection
  const movieCount = activeMovies.filter(
    (item) => item.mediaType !== "tv"
  ).length;
  const tvCount = activeMovies.filter((item) => item.mediaType === "tv").length;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      {/* Simplified header */}
      <div className="bg-gradient-to-r from-blue-900 to-purple-900 py-8 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center gap-4">
            <div className="bg-gray-800 rounded-full h-16 w-16 flex items-center justify-center text-2xl font-bold border-2 border-blue-500">
              {user?.name?.charAt(0).toUpperCase() || "?"}
            </div>
            <div>
              <h1 className="text-2xl font-bold">
                {user?.name || "User"}'s Profile
              </h1>
              <p className="text-gray-300 text-sm mt-0.5">
                {user?.email || ""}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Collection Stats */}
      <div className="container mx-auto max-w-6xl px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex space-x-8">
            <div className="text-center">
              <div className="text-xl font-medium">{movies.watched.length}</div>
              <div className="text-gray-400 text-sm">Watched</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-medium">{movies.liked.length}</div>
              <div className="text-gray-400 text-sm">Liked</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-medium">
                {movies.watchlisted.length}
              </div>
              <div className="text-gray-400 text-sm">Watchlist</div>
            </div>
          </div>

          <Link
            to="/discover"
            className="text-sm text-blue-400 hover:text-blue-300"
          >
            Discover More
          </Link>
        </div>
      </div>

      {/* Movie Collection Tabs */}
      <div className="container mx-auto max-w-6xl px-4 py-4">
        <div className="flex border-b border-gray-800 mb-4">
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "watched"
                ? "text-blue-400 border-b-2 border-blue-400"
                : "text-gray-400 hover:text-gray-300"
            }`}
            onClick={() => setActiveTab("watched")}
          >
            Watched
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "liked"
                ? "text-red-400 border-b-2 border-red-400"
                : "text-gray-400 hover:text-gray-300"
            }`}
            onClick={() => setActiveTab("liked")}
          >
            Liked
          </button>
          <button
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === "watchlisted"
                ? "text-green-400 border-b-2 border-green-400"
                : "text-gray-400 hover:text-gray-300"
            }`}
            onClick={() => setActiveTab("watchlisted")}
          >
            Watchlist
          </button>
        </div>

        {/* Media Type Filter */}
        {activeMovies.length > 0 && (
          <div className="mb-6 flex flex-wrap items-center justify-between">
            <div className="flex items-center space-x-2 mb-2 md:mb-0">
              <span className="text-sm text-gray-400">Filter:</span>
              <div className="flex bg-gray-800 rounded-lg p-1">
                <button
                  onClick={() => setMediaTypeFilter("all")}
                  className={`px-3 py-1 text-xs rounded-md ${
                    mediaTypeFilter === "all"
                      ? "bg-blue-600 text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  All ({activeMovies.length})
                </button>
                <button
                  onClick={() => setMediaTypeFilter("movie")}
                  className={`px-3 py-1 text-xs rounded-md ${
                    mediaTypeFilter === "movie"
                      ? "bg-blue-600 text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  Movies ({movieCount})
                </button>
                <button
                  onClick={() => setMediaTypeFilter("tv")}
                  className={`px-3 py-1 text-xs rounded-md ${
                    mediaTypeFilter === "tv"
                      ? "bg-blue-600 text-white"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  TV Series ({tvCount})
                </button>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              {filteredMovies.length} items shown
            </div>
          </div>
        )}

        {/* Updated Movie Grid - matching reference image aspect ratio */}
        {filteredMovies.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
            {filteredMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                collectionType={activeTab}
              />
            ))}
          </div>
        ) : (
          <div className="py-8 text-center">
            <svg
              className="w-12 h-12 mx-auto text-gray-600 mb-3"
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
            {activeMovies.length > 0 ? (
              <p className="text-gray-400 mb-3">
                No {mediaTypeFilter === "movie" ? "movies" : "TV series"} found
                with the current filter.
              </p>
            ) : (
              <p className="text-gray-400 mb-3">
                No media in your {activeTab} collection yet.
              </p>
            )}
            <Link
              to="/discover"
              className="inline-block px-4 py-1.5 bg-blue-600 rounded text-sm hover:bg-blue-700 transition-colors"
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
