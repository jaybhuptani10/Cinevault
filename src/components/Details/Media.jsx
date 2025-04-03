import React, { useState } from "react";

const Media = ({ photos, videos }) => {
  // States for active tab
  const [activeTab, setActiveTab] = useState("popular");

  // Count media items
  const videoCount = videos?.results?.length || 0;
  const posterCount = photos?.posters?.length || 0;

  // Render navigation tabs
  const renderTabs = () => {
    return (
      <div className="flex flex-col sm:flex-row sm:items-center mb-4 sm:mb-6 border-b border-gray-700 pb-2">
        <h2 className="text-xl sm:text-2xl font-bold sm:mr-4 md:mr-8 mb-2 sm:mb-0">
          Media
        </h2>

        <div className="flex items-center flex-grow overflow-x-auto pb-2 sm:pb-0">
          <button
            className={`px-2 sm:px-4 py-2 mr-2 font-medium text-sm sm:text-base whitespace-nowrap focus:outline-none ${
              activeTab === "popular"
                ? "border-b-2 border-green-500 font-semibold"
                : "border-b-2 border-transparent"
            }`}
            onClick={() => setActiveTab("popular")}
          >
            Most Popular
          </button>

          <button
            className={`px-2 sm:px-4 py-2 mr-2 font-medium text-sm sm:text-base whitespace-nowrap focus:outline-none ${
              activeTab === "videos"
                ? "border-b-2 border-green-500 font-semibold"
                : "border-b-2 border-transparent"
            }`}
            onClick={() => setActiveTab("videos")}
          >
            Videos{" "}
            <span className="text-xs sm:text-sm text-gray-400 ml-1">
              {videoCount}
            </span>
          </button>

          <button
            className={`px-2 sm:px-4 py-2 mr-2 font-medium text-sm sm:text-base whitespace-nowrap focus:outline-none ${
              activeTab === "posters"
                ? "border-b-2 border-green-500 font-semibold"
                : "border-b-2 border-transparent"
            }`}
            onClick={() => setActiveTab("posters")}
          >
            Posters{" "}
            <span className="text-xs sm:text-sm text-gray-400 ml-1">
              {posterCount}
            </span>
          </button>

          {activeTab === "posters" && posterCount > 10 && (
            <a
              href="#"
              className="ml-auto text-green-500 font-medium text-xs sm:text-sm whitespace-nowrap"
            >
              View All Posters
            </a>
          )}
        </div>
      </div>
    );
  };

  // Render posters content with horizontal scroll
  const renderPosters = () => {
    if (!photos?.posters?.length)
      return <div className="text-center py-8">No posters available</div>;

    // Limit to 10 posters
    const postersToShow = photos.posters.slice(0, 10);

    return (
      <div className="w-full">
        <div className="grid grid-cols-2 sm:flex sm:overflow-x-auto gap-2 sm:gap-4 pb-4 sm:space-x-4">
          {postersToShow.map((poster, index) => (
            <div
              key={index}
              className="w-full sm:w-28 md:w-32 lg:w-40 rounded-lg overflow-hidden shadow-md transition-transform duration-200 hover:scale-105 cursor-pointer"
            >
              <img
                src={
                  poster.file_path
                    ? `https://image.tmdb.org/t/p/w342${poster.file_path}`
                    : "/api/placeholder/342/513"
                }
                alt={`Poster ${index + 1}`}
                className="w-full h-auto object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render videos content with horizontal scroll
  const renderVideos = () => {
    if (!videos?.results?.length)
      return <div className="text-center py-8">No videos available</div>;

    // Limit to 5 videos
    const videosToShow = videos.results.slice(0, 5);

    return (
      <div className="w-full">
        <div className="flex flex-col sm:flex-row sm:overflow-x-auto gap-4 sm:space-x-4">
          {videosToShow.map((video, index) => (
            <div
              key={video.key || index}
              className="w-full sm:w-80 md:w-96 flex-none rounded-lg overflow-hidden shadow-md bg-gray-800"
            >
              <h3 className="p-2 sm:p-3 bg-gray-800 border-b border-gray-700 text-sm sm:text-base font-medium m-0 truncate">
                {video.name}
              </h3>
              {video.site === "YouTube" ? (
                <div className="relative pb-[56.25%] h-0">
                  <iframe
                    className="absolute top-0 left-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${video.key}`}
                    title={video.name}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    loading="lazy"
                  ></iframe>
                </div>
              ) : (
                <div className="p-4 text-center bg-gray-700 h-48">
                  Video from {video.site} ({video.key})
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render popular content (mix of different media types) with horizontal scroll
  const renderPopular = () => {
    // Get a mix of media (posters and videos)
    const popularPosters = photos?.posters?.slice(0, 3) || [];
    const popularVideos = videos?.results?.slice(0, 2) || [];

    return (
      <div className="w-full space-y-6 sm:space-y-8">
        {popularPosters.length > 0 && (
          <div className="mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">
              Popular Posters
            </h3>
            <div className="grid grid-cols-3 sm:flex sm:overflow-x-auto gap-2 sm:gap-4 pb-2 sm:pb-4 sm:space-x-4">
              {popularPosters.map((poster, index) => (
                <div
                  key={index}
                  className="w-full sm:w-28 md:w-32 lg:w-40 rounded-lg overflow-hidden shadow-md transition-transform duration-200 hover:scale-105 cursor-pointer"
                >
                  <img
                    src={
                      poster.file_path
                        ? `https://image.tmdb.org/t/p/w342${poster.file_path}`
                        : "/api/placeholder/342/513"
                    }
                    alt={`Poster ${index + 1}`}
                    className="w-full h-auto object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {popularVideos.length > 0 && (
          <div className="mb-4 sm:mb-6">
            <h3 className="text-base sm:text-lg font-semibold mb-2 sm:mb-3">
              Popular Videos
            </h3>
            <div className="flex flex-col sm:flex-row sm:overflow-x-auto gap-4 sm:space-x-4">
              {popularVideos.map((video, index) => (
                <div
                  key={video.key || index}
                  className="w-full sm:w-80 md:w-96 flex-none rounded-lg overflow-hidden shadow-md bg-gray-800"
                >
                  <h3 className="p-2 sm:p-3 bg-gray-800 border-b border-gray-700 text-sm sm:text-base font-medium m-0 truncate">
                    {video.name}
                  </h3>
                  {video.site === "YouTube" ? (
                    <div className="relative pb-[56.25%] h-0">
                      <iframe
                        className="absolute top-0 left-0 w-full h-full"
                        src={`https://www.youtube.com/embed/${video.key}`}
                        title={video.name}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        loading="lazy"
                      ></iframe>
                    </div>
                  ) : (
                    <div className="p-4 text-center bg-gray-700 h-48">
                      Video from {video.site} ({video.key})
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render active tab content
  const renderContent = () => {
    switch (activeTab) {
      case "popular":
        return renderPopular();
      case "videos":
        return renderVideos();
      case "posters":
        return renderPosters();
      default:
        return renderPopular();
    }
  };

  return (
    <div className="w-full max-w-full mx-auto font-sans">
      {renderTabs()}
      <div className="w-full">{renderContent()}</div>
    </div>
  );
};

export default Media;
