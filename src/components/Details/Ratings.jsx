import React from "react";

const Ratings = ({ movie }) => {
  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">RATINGS</h3>
        <span className="text-gray-400">{movie.vote_count} FANS</span>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="text-3xl font-bold mb-4 sm:mb-0">
          {movie.vote_average ? movie.vote_average.toFixed(1) : "3.3"}
          /10
        </div>

        <div className="flex-1 w-full">
          <div className="h-16 sm:h-20 flex items-end">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((bar) => {
              const randomHeight = Math.floor(20 + Math.random() * 80);
              return (
                <div
                  key={bar}
                  className="w-full bg-gray-700 mx-px"
                  style={{ height: `${randomHeight}%` }}
                ></div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ratings;
