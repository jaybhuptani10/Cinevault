import React, { useState, useEffect } from "react";
import axios from "axios";

const ActionButtons = ({
  isLoggedIn,
  mediaType,
  tmdbId,
  user_id,
  initialState = {},
}) => {
  if (!isLoggedIn) return null;

  const [watched, setWatched] = useState(initialState.watched || false);
  const [liked, setLiked] = useState(initialState.liked || false);
  const [watchlisted, setWatchlisted] = useState(
    initialState.watchlisted || false
  );
  const [loading, setLoading] = useState({
    watched: false,
    liked: false,
    watchlisted: false,
  });

  useEffect(() => {
    if (!initialState.hasOwnProperty("watched")) {
      fetchInteractionState();
    }
  }, [mediaType, tmdbId, initialState]);

  // Fetch current interaction state from the backend
  const fetchInteractionState = async () => {
    const token = localStorage.getItem("authToken");

    try {
      const response = await axios.get(`/user/media`, {
        params: { userId: user_id, mediaType, tmdbId },
        headers: {
          "x-auth-token": token,
        },
      });

      setWatched(response.data.watched);
      setLiked(response.data.liked);
      setWatchlisted(response.data.watchlisted);
    } catch (error) {
      console.error(
        "Error fetching interaction state:",
        error.response?.data || error.message
      );
    }
  };

  // Utility function to make API requests
  const toggleState = async (stateType, apiEndpoint, setStateFunction) => {
    setLoading((prev) => ({ ...prev, [stateType]: true }));

    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("No auth token found!");
      return;
    }

    try {
      const response = await axios.post(
        `/user/media/${mediaType}/${tmdbId}/${apiEndpoint}`,
        { userId: user_id },
        {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
        }
      );

      console.log(`API Response for ${stateType}:`, response.data);
      setStateFunction(response.data[stateType]); // Toggle state based on API response
    } catch (error) {
      console.error(
        `Error toggling ${stateType}:`,
        error.response?.data || error.message
      );
    } finally {
      setLoading((prev) => ({ ...prev, [stateType]: false }));
    }
  };

  return (
    <div className="hidden md:flex gap-4 mb-8">
      {/* Watched Button */}
      <button
        className={`flex items-center justify-center px-4 py-3 rounded-full transition-all ${
          watched
            ? "bg-blue-500 text-white ring-2 ring-blue-300 shadow-md"
            : "bg-gray-800 text-gray-300 hover:bg-gray-700"
        }`}
        onClick={() => toggleState("watched", "watched", setWatched)}
        disabled={loading.watched}
      >
        <svg
          className={`w-5 h-5 ${watched ? "mr-2" : "mr-1"}`}
          fill={watched ? "currentColor" : "none"}
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          ></path>
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          ></path>
        </svg>
        <span>{watched ? "Unwatch" : "Watch"}</span>
        {loading.watched && (
          <svg
            className="animate-spin ml-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
      </button>

      {/* Liked Button */}
      <button
        className={`flex items-center justify-center px-4 py-3 rounded-full transition-all ${
          liked
            ? "bg-red-500 text-white ring-2 ring-red-300 shadow-md"
            : "bg-gray-800 text-gray-300 hover:bg-gray-700"
        }`}
        onClick={() => toggleState("liked", "like", setLiked)}
        disabled={loading.liked}
      >
        <svg
          className={`w-5 h-5 ${liked ? "mr-2" : "mr-1"}`}
          fill={liked ? "currentColor" : "none"}
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          ></path>
        </svg>
        <span>{liked ? "Unlike" : "Like"}</span>
        {loading.liked && (
          <svg
            className="animate-spin ml-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
      </button>

      {/* Watchlist Button */}
      <button
        className={`flex items-center justify-center px-4 py-3 rounded-full transition-all ${
          watchlisted
            ? "bg-green-500 text-white ring-2 ring-green-300 shadow-md"
            : "bg-gray-800 text-gray-300 hover:bg-gray-700"
        }`}
        onClick={() => toggleState("watchlisted", "watchlist", setWatchlisted)}
        disabled={loading.watchlisted}
      >
        <svg
          className={`w-5 h-5 ${watchlisted ? "mr-2" : "mr-1"}`}
          fill={watchlisted ? "currentColor" : "none"}
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d={
              watchlisted
                ? "M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                : "M12 6v6m0 0v6m0-6h6m-6 0H6"
            }
          ></path>
        </svg>
        <span>{watchlisted ? "Remove" : "Watchlist"}</span>
        {loading.watchlisted && (
          <svg
            className="animate-spin ml-2 h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
      </button>
    </div>
  );
};

export default ActionButtons;
