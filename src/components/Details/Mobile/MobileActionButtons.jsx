import React, { useState, useEffect } from "react";
import axios from "axios";

const MobileActionButtons = ({
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
  const toggleState = async (stateType, apiEndpoint, setStateFunction) => {
    setLoading((prev) => ({ ...prev, [stateType]: true }));
    console.log(`Toggling ${stateType} state...`);

    const token = localStorage.getItem("authToken");
    if (!token) {
      console.error("No auth token found!");
      return;
    }

    try {
      const response = await axios.post(
        `/user/media/${mediaType}/${tmdbId}/${apiEndpoint}`, // ✅ Fix: Match backend route
        { userId: user_id }, // ✅ Fix: Send only userId in body
        {
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": token,
          },
        }
      );

      console.log(`API Response for ${stateType}:`, response.data);
      setStateFunction(response.data[stateType]); // ✅ Update state correctly
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
    <div className="grid grid-cols-3 gap-2 md:hidden">
      <button
        onClick={() => toggleState("watched", "watched", setWatched)}
        disabled={loading.watched}
        className={`flex flex-col items-center justify-center py-3 rounded transition-colors ${
          watched ? "bg-green-700" : "bg-gray-800 hover:bg-gray-700"
        }`}
      >
        <svg
          className="w-5 h-5 mb-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
          />
        </svg>
        <span className="text-xs">{watched ? "Watched" : "Watch"}</span>
      </button>
      {/* Like button */}
      <button
        onClick={() => toggleState("liked", "like", setLiked)}
        disabled={loading.liked}
        className={`flex flex-col items-center justify-center py-3 rounded transition-colors ${
          liked ? "bg-red-700" : "bg-gray-800 hover:bg-gray-700"
        }`}
      >
        <svg
          className="w-5 h-5 mb-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
        <span className="text-xs">{liked ? "Liked" : "Like"}</span>
      </button>
      <button
        onClick={() => toggleState("watchlisted", "watchlist", setWatchlisted)}
        disabled={loading.watchlisted}
        className={`flex flex-col items-center justify-center py-3 rounded transition-colors ${
          watchlisted ? "bg-blue-700" : "bg-gray-800 hover:bg-gray-700"
        }`}
      >
        <svg
          className="w-5 h-5 mb-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
        <span className="text-xs">
          {watchlisted ? "Watchlisted" : "Watchlist"}
        </span>
      </button>
    </div>
  );
};

export default MobileActionButtons;
