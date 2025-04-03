import { div } from "framer-motion/client";
import React from "react";

const Detailed = ({ movie, keywords, content_type }) => {
  return (
    <div className="bg-gray-800 rounded p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h4 className="text-gray-400 mb-2 text-sm">Original Title</h4>
          <p className="mb-4">{movie.title || movie.name}</p>

          <h4 className="text-gray-400 mb-2 text-sm">Status</h4>
          <p className="mb-4">{movie.status || "Released"}</p>

          <h4 className="text-gray-400 mb-2 text-sm">Original Language</h4>
          <p className="mb-4">{movie.original_language || "English"}</p>
        </div>

        <div>
          <h4 className="text-gray-400 mb-2 text-sm">
            {content_type == "movie" ? "Budget" : "First Air Date"}
          </h4>
          <p className="mb-4">
            {movie.budget
              ? `$${movie.budget.toLocaleString()}`
              : movie.first_air_date}
          </p>

          <h4 className="text-gray-400 mb-2 text-sm">
            {content_type == "movie" ? "Budget" : "Last Air Date"}
          </h4>
          <p className="mb-4">
            {movie.budget
              ? `$${movie.budget.toLocaleString()}`
              : movie.last_air_date}
          </p>

          <h4 className="text-gray-400 mb-2 text-sm">Keywords</h4>
          <div className="flex flex-wrap gap-2">
            {content_type == "movie"
              ? keywords.keywords.map((keyword, idx) => (
                  <span
                    key={idx}
                    className="bg-gray-700 text-xs px-2 py-1 rounded"
                  >
                    {typeof keyword === "string"
                      ? keyword
                      : keyword.name || "keyword"}
                  </span>
                ))
              : keywords.results.map((keyword, idx) => (
                  <span
                    key={idx}
                    className="bg-gray-700 text-xs px-2 py-1 rounded"
                  >
                    {typeof keyword === "string"
                      ? keyword
                      : keyword.name || "keyword"}
                  </span>
                ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Detailed;
