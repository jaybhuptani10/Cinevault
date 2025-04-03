import React from "react";

const MobileTitle = ({ movie }) => {
  return (
    <div className="block md:hidden mb-6">
      <h1 className="text-3xl font-bold">{movie.title || movie.name}</h1>
      <div className="flex items-center gap-3 text-gray-400 mt-2">
        <span>
          {movie.release_date || movie.first_air_date
            ? new Date(movie.release_date || movie.first_air_date).getFullYear()
            : "Unknown"}
        </span>
        <span>•</span>
        <span>
          {movie.episode_runtime || 0
            ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
            : "0"}
        </span>
      </div>
    </div>
  );
};

export default MobileTitle;
