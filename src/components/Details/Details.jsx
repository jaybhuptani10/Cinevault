import React, { useState, useEffect } from "react";
import {
  useParams,
  useNavigate,
  Link,
  useSearchParams,
} from "react-router-dom";
import axios from "axios";
import Navbar from "../comp/Navbar";
import Cast from "./Cast";
import FilmCredits from "./Crew";
import Detailed from "./Detailed";
import MobileTitle from "./Mobile/MobileTitle";
import SocialStats from "./SocialStats";
import MobileActionButtons from "./Mobile/MobileActionButtons";
import WhereToWatch from "./WhereToWatch";
import MobileWheretoWatch from "./Mobile/MobileWheretoWatch";
import ActionButtons from "./ActionButtons";
import Ratings from "./Ratings";
import MediaGallery from "./Media";
import { useSelector, useDispatch } from "react-redux";
import RatingComponent from "./RatingComponent";
const Details = () => {
  const dispatch = useDispatch();
  const { isLoggedIn } = useSelector((state) => state.auth);
  const user_id = useSelector((state) => state.auth.user?._id) || null;
  const { id, content } = useParams();
  const content_type = content == "Movies" ? "movie" : "tv";
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [crew, setCrew] = useState(null);
  const [keywords, setKeywords] = useState(null);
  const [watchProviders, setWatchProviders] = useState(null);
  const [videos, setVideos] = useState(null);
  const [photos, setPhotos] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("CAST");

  useEffect(() => {
    if (!id || Number(movie?.id) === Number(id)) return;

    const fetchAllData = async () => {
      setIsLoading(true);
      try {
        const [movieRes, castRes, keywordsRes, watchRes, videoRes, photoRes] =
          await Promise.all([
            axios.get("/api/details", {
              params: { type: content_type, id, sub: "", end: "" },
            }),
            axios.get("/api/details", {
              params: {
                type: "movie",
                id,
                sub: "credits?language=en-US",
                end: "",
              },
            }),
            axios.get("/api/details", {
              params: { type: content_type, id, sub: "keywords", end: "" },
            }),
            axios.get("/api/details", {
              params: {
                type: content_type,
                id,
                sub: "watch",
                end: "providers",
              },
            }),
            axios.get("/api/details", {
              params: {
                type: content_type,
                id,
                sub: "videos?language=en-US",
                end: "",
              },
            }),
            axios.get("/api/details", {
              params: { type: content_type, id, sub: "images", end: "" },
            }),
          ]);

        setMovie(movieRes.data);
        setCrew(castRes.data);
        setKeywords(keywordsRes.data);
        setWatchProviders(watchRes.data);
        // setVideos(videoRes.data);
        setPhotos(photoRes.data);
      } catch (error) {
        console.error("Error fetching movie details:", error);
        setError("Failed to load movie details. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-4">
        <Navbar />
        <div className="container mx-auto max-w-6xl">
          <div className="animate-pulse flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/3 lg:w-1/4 h-96 bg-gray-800 rounded"></div>
            <div className="w-full md:w-2/3 lg:w-3/4">
              <div className="h-10 bg-gray-800 rounded w-3/4 mb-6"></div>
              <div className="h-4 bg-gray-800 rounded w-1/2 mb-8"></div>
              <div className="h-20 bg-gray-800 rounded w-full mb-6"></div>
              <div className="h-8 bg-gray-800 rounded w-full mb-4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-4">
        <Navbar />
        <div className="container mx-auto max-w-6xl text-center py-16">
          <div className="bg-red-900/50 border border-red-500 text-red-100 p-6 mb-6 rounded">
            <p>{error}</p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-4">
        <Navbar />
        <div className="container mx-auto max-w-6xl text-center py-16">
          <div className="bg-yellow-900/50 border border-yellow-500 text-yellow-100 p-6 mb-6 rounded">
            <p>Movie not found</p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-6 rounded transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "CAST":
        return <Cast crew={crew} />;
      case "CREW":
        return <FilmCredits crew={crew} />;
      case "DETAILS":
        return (
          <Detailed
            content_type={content_type}
            movie={movie}
            keywords={keywords}
          />
        );
      case "GENRES":
        return (
          <div className="flex flex-wrap gap-2">
            {(movie.genres || ["Action", "Drama", "Thriller"]).map(
              (genre, idx) => (
                <span key={idx} className="bg-gray-800 px-3 py-2 rounded">
                  {typeof genre === "string" ? genre : genre.name || "genre"}
                </span>
              )
            )}
          </div>
        );
      case "RELEASES":
        return (
          <div className="bg-gray-800 rounded p-4">
            <h4 className="text-gray-400 mb-2 text-sm">Release Date</h4>
            {content_type == "Movies" ? (
              <p>{movie.release_date || "Unknown"}</p>
            ) : (
              <div>
                <p>First Air Date: {movie.first_air_date || "Unknown"}</p>
                <p>Last Air Date: {movie.last_air_date || "Unknown"}</p>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Movie Title for Mobile */}
        <MobileTitle movie={movie} />

        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Column - Poster and Watch Options */}
          <div className="w-full md:w-1/3 lg:w-1/4 flex flex-col gap-6">
            {/* Poster */}
            <div className="rounded cursor-pointer overflow-hidden shadow-lg">
              <img
                src={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : "/assets/img1.jpg" // Use img1 as the fallback image
                }
                alt={movie.title || movie.name}
                className="w-full object-cover"
              />
            </div>

            {/* Social Stats */}
            <SocialStats />

            {/* Mobile Action Buttons */}
            <MobileActionButtons
              isLoggedIn={isLoggedIn}
              mediaType={content_type}
              tmdbId={id}
              user_id={user_id}
            />

            {/* Where to Watch */}
            <WhereToWatch watchProviders={watchProviders.results} />

            {/* Watch Trailer Button */}
            <button className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 py-3 px-4 rounded font-medium transition-colors">
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                  clipRule="evenodd"
                ></path>
              </svg>
              <span>Watch Trailer</span>
            </button>

            {/* Mobile Where to Watch - Collapsible */}
            <MobileWheretoWatch />
          </div>

          {/* Right Column - Movie Details */}
          <div className="w-full md:w-2/3 lg:w-3/4">
            {/* Movie title and year - Desktop */}
            <div className="hidden md:block mb-6">
              <h1 className="text-4xl font-bold">
                {movie.title || movie.name}
              </h1>
              <div className="flex items-center gap-3 text-gray-400 mt-2">
                <span>
                  {movie.release_date || movie.first_air_date
                    ? new Date(
                        movie.release_date || movie.first_air_date
                      ).getFullYear()
                    : "Unknown"}
                </span>
                <span>•</span>
                <span>
                  Directed by{" "}
                  {crew.crew[0].name ||
                    movie.created_by[0].original_name ||
                    "Unknown"}
                </span>
              </div>
            </div>

            <div className="mb-8">
              <p className="text-gray-300 text-lg leading-relaxed">
                {movie.overview || "No overview available."}
              </p>
            </div>

            {/* Action Buttons - Desktop */}
            <ActionButtons
              isLoggedIn={isLoggedIn}
              mediaType={content_type}
              tmdbId={id}
              user_id={user_id}
            />

            {/* Rating Section - Responsive */}
            {isLoggedIn && (
              <RatingComponent
                mediaType={content_type}
                tmdbId={id}
                userId={user_id}
              />
            )}

            {/* Tabs - Scrollable on mobile */}
            <div className="border-b border-gray-700 mb-6 overflow-x-auto">
              <nav className="flex space-x-4 sm:space-x-8 whitespace-nowrap pb-1">
                {["CAST", "CREW", "DETAILS", "GENRES", "RELEASES"].map(
                  (tab) => (
                    <button
                      key={tab}
                      className={`py-3 px-1 font-medium ${
                        activeTab === tab
                          ? "border-b-2 border-green-500 text-white"
                          : "text-gray-400 hover:text-white"
                      }`}
                      onClick={() => setActiveTab(tab)}
                    >
                      {tab}
                    </button>
                  )
                )}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="mb-8">{renderTabContent()}</div>

            {/* Movie Info - Responsive */}
            <div className="mt-8 flex flex-wrap items-center gap-2 sm:gap-3 text-gray-400">
              <span>
                {movie.runtime
                  ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
                  : "95 mins"}
              </span>
              <span className="hidden sm:inline">•</span>
              <span>More at</span>
              <a
                href="#"
                className="px-2 py-1 bg-yellow-600 text-white text-xs rounded"
              >
                IMDb
              </a>
              <a
                href="#"
                className="px-2 py-1 bg-blue-600 text-white text-xs rounded"
              >
                TMDb
              </a>
            </div>

            {/* Ratings - Responsive */}
            <Ratings movie={movie} />
            <MediaGallery videos={videos} photos={photos} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Details;
