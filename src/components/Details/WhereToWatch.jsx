import React from "react";

const WhereToWatch = ({ watchProviders }) => {
  // Early return if no watch providers or no IN region data
  if (!watchProviders || !watchProviders.IN) {
    return null;
  }

  const { link, rent, buy, flatrate } = watchProviders.IN;

  // Helper function to get initial letter for fallback
  const getInitial = (name) => {
    return name ? name.charAt(0) : "?";
  };

  // Function to render provider items
  const renderProviders = (providers, type) => {
    if (!providers || providers.length === 0) return null;

    return providers.map((provider) => (
      <div
        key={provider.provider_id}
        className="flex items-center justify-between bg-gray-800 p-3 rounded"
      >
        <div className="flex items-center gap-3">
          {provider.logo_path ? (
            <img
              src={`https://image.tmdb.org/t/p/original${provider.logo_path}`}
              alt={provider.provider_name}
              className="w-8 h-8 rounded object-cover"
            />
          ) : (
            <div
              className={`w-8 h-8 bg-blue-500 rounded flex items-center justify-center text-white font-bold text-xs`}
            >
              {getInitial(provider.provider_name)}
            </div>
          )}
          <span>{provider.provider_name}</span>
        </div>
        <span className="text-sm bg-gray-700 px-2 py-1 rounded">{type}</span>
      </div>
    ));
  };

  return (
    <div className="hidden md:block">
      <h3 className="text-lg font-medium mb-3 text-gray-300">WHERE TO WATCH</h3>
      <div className="space-y-2">
        {/* Subscription providers */}
        {flatrate && renderProviders(flatrate, "SUB")}

        {/* Rental providers */}
        {rent && renderProviders(rent, "RENT")}

        {/* Buy providers */}
        {buy && renderProviders(buy, "BUY")}

        {/* Link to all providers */}
        {link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 text-sm block mt-2 hover:underline"
          >
            See all watch providers
          </a>
        )}
      </div>
    </div>
  );
};

export default WhereToWatch;
