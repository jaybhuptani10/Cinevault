import React from "react";
import Navbar from "../comp/Navbar";
import axios from "axios";
import { useEffect, useState } from "react";
import Carousel from "../comp/Carousel";
import CineVaultFeatures from "./CineVaultFeatures";
import CineVaultFooter from "./Footer";

const LandingPage = () => {
  const [movieData, setMovieData] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMoviePoster = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("/api/fetch", {
          params: { type: "trending", endpoint: "movie/week?language=en-US" },
        });
        setMovieData(response.data.results);
      } catch (error) {
        console.error("Error fetching movie data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMoviePoster();
  }, []);

  return (
    <div className="flex items-center flex-col min-h-full text-white bg-gray-900">
      <Navbar />

      {/* Hero Section with Full-width Image and Text Overlay */}
      <div className="relative w-full h-screen">
        {/* Image container - note the overflow-hidden to ensure image stays contained */}
        <div className="absolute inset-0 overflow-hidden">
          {!isLoading && movieData && movieData.length > 0 ? (
            <img
              src={`https://image.tmdb.org/t/p/original${movieData[1].backdrop_path}`}
              alt={movieData[1].title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-900 flex items-center justify-center">
              <p className="text-lg">Loading...</p>
            </div>
          )}

          {/* Dark overlay for better text visibility */}
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>

        {/* Text overlay - centered vertically and horizontally */}
        <div className="absolute sm:mt-10 inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-6">
            Discover your cinema journey.
          </h1>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-6">
            Curate your must-watch collection.
          </h2>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-10">
            Share the stories that moved you.
          </h2>
          {/* Optional: Add a CTA button */}
          <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300">
            GET STARTED
          </button>
        </div>
      </div>

      {/* Content section */}
      <div className="w-full">
        <div className="container mx-auto py-12">
          <Carousel
            type="trending"
            endpoint="movie/week?language=en-US"
            limit="6"
            content="Movies"
          />
          <Carousel
            type="trending"
            endpoint="tv/week?language=en-US"
            limit="6"
            content="Tv"
          />
          <CineVaultFeatures />
        </div>
      </div>

      {/* Footer - moved outside the container to be full width */}
      <CineVaultFooter />
    </div>
  );
};

export default LandingPage;
