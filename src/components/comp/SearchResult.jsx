import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import axios from "axios";
import noPosterImg from "../../assets/no-poster.png"; // Placeholder image

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get("q");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("All");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [itemsPerPage] = useState(20);

  // Filter options
  const filterOptions = [
    "All",
    "Films",
    "Reviews",
    "Lists",
    "Original Lists",
    "Stories",
    "Cast, Crew or Studios",
    "Members or HQs",
    "Tags",
    "Journal articles",
    "Podcast episodes",
    "Full-text search",
  ];

  useEffect(() => {
    if (query) {
      setCurrentPage(1);
      fetchSearchResults(query, 1);
    }
  }, [query]);

  useEffect(() => {
    if (query && currentPage > 1) {
      fetchSearchResults(query, currentPage);
    }
  }, [currentPage]);

  const fetchSearchResults = async (searchQuery, page) => {
    setLoading(true);
    try {
      if (searchQuery) {
        const response = await axios.get("/api/search", {
          params: {
            result: `multi?query=${searchQuery}&page=${page}`,
            filter: activeFilter !== "All" ? activeFilter.toLowerCase() : "",
          },
        });
        console.log(response.data);
        setResults(response.data.results || []);
        setTotalPages(response.data.total_pages || 1);
        setLoading(false);
      }
    } catch (err) {
      setError("Failed to fetch search results. Please try again.");
      setLoading(false);
      console.error("Search error:", err);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo(0, 0);
    }
  };

  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setCurrentPage(1);
    fetchSearchResults(query, 1);
  };

  const navigateToMovie = (item) => {
    // Determine if it's a movie or TV show
    const content = item.media_type === "movie" ? "Movies" : "tv";

    // Create a URL-friendly slug from the title
    const titleSlug = (item.title || item.name)
      .toLowerCase()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");

    // Navigate to the detail page
    navigate(`/details/${content}/${item.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Main content area */}
          <div className="flex-1">
            <h1 className="text-xl font-medium text-gray-400 mb-4">
              SHOWING MATCHES FOR "{query?.toUpperCase()}"
            </h1>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
              </div>
            ) : error ? (
              <div className="bg-red-900 text-white p-4 rounded-md">
                {error}
              </div>
            ) : results.length === 0 ? (
              <div className="text-center py-12">
                <h2 className="text-xl font-medium mb-2">No results found</h2>
                <p className="text-gray-400">
                  We couldn't find any movies matching "{query}"
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-6">
                  {results.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 border-b border-gray-800 pb-6 cursor-pointer hover:bg-gray-800 p-2 rounded transition-colors"
                      onClick={() => navigateToMovie(item)}
                    >
                      <div className="w-20 h-30 flex-shrink-0">
                        <img
                          src={
                            item.poster_path
                              ? `https://image.tmdb.org/t/p/w200${item.poster_path}`
                              : noPosterImg
                          }
                          alt={item.title || item.name}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                      <div className="flex-1">
                        <h2 className="text-xl font-bold">
                          {item.title || item.name}{" "}
                          <span className="text-gray-400">
                            {item.release_date?.substring(0, 4) ||
                              item.first_air_date?.substring(0, 4)}
                          </span>
                        </h2>
                        {item.alternative_titles && (
                          <div className="text-gray-400 mt-1 text-sm">
                            <span>
                              Alternative titles: {item.alternative_titles}
                            </span>
                            {item.alternative_titles.length > 60 && (
                              <span className="text-gray-500 cursor-pointer ml-1">
                                ...more
                              </span>
                            )}
                          </div>
                        )}
                        {item.overview && (
                          <div className="mt-2 text-sm">
                            <span className=" py-1 text-xs rounded-md">
                              {item.overview}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-8 space-x-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className={`px-3 py-1 rounded-md text-sm ${
                        currentPage === 1
                          ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                          : "bg-gray-700 hover:bg-gray-600"
                      }`}
                    >
                      Previous
                    </button>

                    <div className="flex items-center px-3 text-sm">
                      <span>
                        Page {currentPage} of {totalPages}
                      </span>
                    </div>

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className={`px-3 py-1 rounded-md text-sm ${
                        currentPage === totalPages
                          ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                          : "bg-gray-700 hover:bg-gray-600"
                      }`}
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Filter sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-gray-800 rounded-md p-4">
              <h2 className="text-lg font-medium mb-4">SHOW RESULTS FOR</h2>
              <ul className="space-y-2">
                {filterOptions.map((filter) => (
                  <li key={filter}>
                    <button
                      onClick={() => handleFilterChange(filter)}
                      className={`w-full text-left py-2 px-3 rounded ${
                        activeFilter === filter
                          ? "bg-gray-700 text-white"
                          : "text-gray-300 hover:bg-gray-700"
                      }`}
                    >
                      {filter}
                    </button>
                  </li>
                ))}
              </ul>

              <div className="mt-8">
                <button className="text-blue-400 hover:underline text-sm">
                  Advanced search help
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
