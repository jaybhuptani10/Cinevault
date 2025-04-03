import React, { useState, useEffect } from "react";
import axios from "axios";

const RatingComponent = ({ mediaType, tmdbId, userId }) => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Fetch user-specific rating on component mount
  useEffect(() => {
    const fetchUserRating = async () => {
      try {
        const response = await axios.get(
          `/user/rating/${mediaType}/${tmdbId}`,
          {
            params: { userId },
            headers: {
              "x-auth-token": localStorage.getItem("authToken"),
            },
          }
        );

        if (response.data) {
          setRating(response.data.userRating || 0);
        }
      } catch (err) {
        console.error("Error fetching user rating:", err);
      }
    };

    if (tmdbId && mediaType && userId) {
      fetchUserRating();
    }
  }, [tmdbId, mediaType, userId]);

  // Handle submit rating
  const submitRating = async (newRating) => {
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("Authentication required.");
      setIsSubmitting(false);
      return;
    }

    try {
      const payload = {
        userId: String(userId),
        tmdbId: String(tmdbId),
        mediaType: String(mediaType),
        rating: Number(newRating),
      };

      const response = await axios.post(`/user/rate`, payload, {
        headers: {
          "Content-Type": "application/json",
          "x-auth-token": token,
        },
      });

      if (response.data.success) {
        setRating(newRating);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(response.data.message || "Failed to save rating.");
      }
    } catch (err) {
      console.error("Error submitting rating:", err);
      setError(
        `Failed to save rating: ${err.response?.data?.message || err.message}`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle star click for rating submission
  const handleStarClick = (clickedValue) => {
    if (isSubmitting) return;

    const fullStar = clickedValue;
    const halfStar = clickedValue - 0.5;

    let newRating;

    if (Math.abs(rating - fullStar) < 0.1) {
      newRating = halfStar;
    } else if (Math.abs(rating - halfStar) < 0.1) {
      newRating = 0;
    } else {
      newRating = fullStar;
    }

    setRating(newRating);
    submitRating(newRating);
  };

  // Render stars dynamically
  const renderStars = () => {
    return [...Array(5)].map((_, i) => {
      const starIndex = i + 1;
      const isFullStar = starIndex <= Math.floor(rating);
      const isHalfStar =
        !isFullStar && starIndex === Math.ceil(rating) && rating % 1 !== 0;

      return (
        <button
          key={starIndex}
          disabled={isSubmitting}
          className="text-3xl sm:text-4xl px-1 transition-colors duration-200 focus:outline-none"
          onMouseEnter={() => setHoveredRating(starIndex)}
          onMouseLeave={() => setHoveredRating(0)}
          onClick={() => handleStarClick(starIndex)}
          aria-label={`Rate ${starIndex} stars`}
        >
          {hoveredRating > 0 ? (
            <span
              className={`${
                hoveredRating >= starIndex ? "text-yellow-300" : "text-gray-500"
              }`}
            >
              ★
            </span>
          ) : isFullStar ? (
            <span className="text-yellow-400">★</span>
          ) : isHalfStar ? (
            <div className="relative inline-block">
              <span className="text-gray-500">★</span>
              <span
                className="absolute inset-0 overflow-hidden text-yellow-400"
                style={{ width: "50%" }}
              >
                ★
              </span>
            </div>
          ) : (
            <span className="text-gray-500">★</span>
          )}
        </button>
      );
    });
  };

  return (
    <div className="bg-gray-800 p-4 sm:p-6 rounded mb-8">
      <div className="text-center mb-3">
        <span className="text-lg font-medium">Rate</span>
        {rating > 0 && (
          <div className="text-sm text-gray-400 mt-1">
            Your rating: {rating.toFixed(1)}
          </div>
        )}
      </div>

      <div className="flex justify-center space-x-1">{renderStars()}</div>

      {error && (
        <div className="mt-3 text-red-400 text-center text-sm">{error}</div>
      )}

      {success && (
        <div className="mt-3 text-green-400 text-center text-sm">
          Rating saved successfully!
        </div>
      )}

      <div className="text-center mt-3 text-xs text-gray-500">
        Click once for full star, twice for half star, three times to remove
      </div>
    </div>
  );
};

export default RatingComponent;
