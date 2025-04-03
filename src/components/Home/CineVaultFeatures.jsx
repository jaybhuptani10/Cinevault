import React from "react";
import {
  Film,
  Heart,
  Star,
  Calendar,
  List,
  Users,
  Clock,
  Bookmark,
} from "lucide-react";

const CineVaultFeatures = () => {
  const features = [
    {
      icon: <Film className="h-10 w-10 text-emerald-500" />,
      title: "Build Your Film Collection",
      description:
        "Log every film you've watched and build your digital film library",
    },
    {
      icon: <Star className="h-10 w-10 text-amber-400" />,
      title: "Rate & Review",
      description:
        "Score films on a 10-point scale and share your detailed thoughts",
    },
    {
      icon: <Heart className="h-10 w-10 text-rose-500" />,
      title: "Curate Favorites",
      description:
        "Highlight the films that defined your taste and recommend to others",
    },
    {
      icon: <Calendar className="h-10 w-10 text-blue-500" />,
      title: "Journal Your Experience",
      description:
        "Record when and where you watched each film with personal notes",
    },
    {
      icon: <List className="h-10 w-10 text-purple-500" />,
      title: "Create Custom Collections",
      description:
        "Organize films by director, genre, era or create your own categories",
    },
    {
      icon: <Users className="h-10 w-10 text-indigo-500" />,
      title: "Connect With Film Lovers",
      description:
        "Follow friends and discover films through their recommendations",
    },
    {
      icon: <Clock className="h-10 w-10 text-cyan-500" />,
      title: "Track Watch Time",
      description:
        "See statistics on your viewing habits and cinematic journey",
    },
    {
      icon: <Bookmark className="h-10 w-10 text-orange-500" />,
      title: "Manage Your Watchlist",
      description:
        "Never forget a film recommendation with your personalized queue",
    },
  ];

  return (
    <div className=" text-white py-12 px-4 rounded-lg">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-2">
          CINEVAULT LETS YOU...
        </h2>
        <p className="text-gray-300 text-center mb-12">
          Your personal cinema headquarters for tracking, sharing, and
          discovering films
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gray-800 cursor-pointer bg-opacity-50 backdrop-blur-sm p-6 rounded-xl border border-gray-700 hover:border-gray-500 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-900/20 group"
            >
              <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white group-hover:text-emerald-400 transition-colors duration-300">
                {feature.title}
              </h3>
              <p className="text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CineVaultFeatures;
