import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Carousel = ({ type, endpoint, limit, content }) => {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("/api/fetch", {
          params: {
            type: type,
            endpoint: endpoint,
          },
        });
        setMovies(response.data.results.slice(0, limit));
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, [type, endpoint, limit]);

  // Sample poster data for preview (will be replaced by API data in production)
  const samplePosters = [
    { id: 1, title: "Mickey 17", posterPath: "/api/placeholder/300/450" },
    {
      id: 2,
      title: "Paddington in Peru",
      posterPath: "/api/placeholder/300/450",
    },
    { id: 3, title: "The Monkey", posterPath: "/api/placeholder/300/450" },
    { id: 4, title: "Eephus", posterPath: "/api/placeholder/300/450" },
    {
      id: 5,
      title: "On Becoming a Guinea Fowl",
      posterPath: "/api/placeholder/300/450",
    },
    { id: 6, title: "The Actor", posterPath: "/api/placeholder/300/450" },
  ].slice(0, limit);

  // Use sample data when loading or if API fails
  const displayMovies = movies.length > 0 ? movies : samplePosters;

  const handleMovieClick = (movieId, content) => {
    navigate(`/details/${content}/${movieId}`);
  };

  return (
    <div className="w-full my-8">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">
          Popular {content == "Movies" ? "Movies" : "Shows"}
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {isLoading
            ? // Skeleton loaders
              Array(limit)
                .fill()
                .map((_, index) => (
                  <div
                    key={`skeleton-${index}`}
                    className="bg-gray-200 rounded-lg h-64 animate-pulse"
                  ></div>
                ))
            : displayMovies.map((movie) => (
                <div
                  key={movie.id}
                  className="relative rounded-lg overflow-hidden group cursor-pointer"
                  onClick={() => handleMovieClick(movie.id, content)}
                >
                  <img
                    src={
                      movie.poster_path
                        ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
                        : `/api/placeholder/300/450`
                    }
                    alt={movie.title || movie.original_name || movie.name}
                    className="w-full h-64 object-cover"
                  />

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-70 transition-all duration-300 flex items-end">
                    <div className="p-4 transform translate-y-full group-hover:translate-y-0 transition-all duration-300">
                      <h3 className="text-white font-semibold text-lg">
                        {movie.title || movie.name}
                      </h3>
                    </div>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

export default Carousel;
