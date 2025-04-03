import React, { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../../store/slice";
import SearchBar from "./SearchBar";

const Navbar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const profileRef = useRef(null);
  const dispatch = useDispatch();

  // Get user and login status from Redux store
  const { user, isLoggedIn } = useSelector((state) => state.auth);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-transparent text-white w-full py-3 px-4 lg:px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
          </div>
          <h1 className="text-2xl font-bold ml-2">CineVault</h1>
        </div>

        {/* Main Navigation - Desktop */}
        <div className="hidden md:flex items-center space-x-8">
          {isLoggedIn ? (
            <>
              {/* User Profile Button */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-1"
                >
                  <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center overflow-hidden">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xs font-bold">
                        {user?.name?.[0]?.toUpperCase() || "U"}
                      </span>
                    )}
                  </div>
                  <span className="font-medium hidden lg:inline">
                    {user?.name}
                  </span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-50">
                    <a
                      href="/profile"
                      className="block px-4 py-2 text-sm hover:bg-gray-700"
                    >
                      Profile
                    </a>
                    <a
                      href="/settings"
                      className="block px-4 py-2 text-sm hover:bg-gray-700"
                    >
                      Settings
                    </a>
                    <button
                      onClick={() => dispatch(logout())}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-700"
                    >
                      Log out
                    </button>
                  </div>
                )}
              </div>

              {/* Activity Button */}
              <button className="text-gray-400 hover:text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </button>

              {/* Main Navigation Links */}
              <a
                href="/films"
                className="uppercase font-medium tracking-wide hover:text-gray-300"
              >
                Films
              </a>
              <a
                href="/lists"
                className="uppercase font-medium tracking-wide hover:text-gray-300"
              >
                Lists
              </a>
              <a
                href="/members"
                className="uppercase font-medium tracking-wide hover:text-gray-300"
              >
                Members
              </a>
              <a
                href="/journal"
                className="uppercase font-medium tracking-wide hover:text-gray-300"
              >
                Journal
              </a>
            </>
          ) : (
            <>
              <a
                href="/login"
                className="uppercase font-medium tracking-wide hover:text-gray-300"
              >
                Sign In
              </a>
              <a
                href="/register"
                className="uppercase font-medium tracking-wide hover:text-gray-300"
              >
                Create Account
              </a>
            </>
          )}
        </div>

        {/* Search and Actions - Desktop */}
        <div className="hidden md:flex items-center space-x-4">
          <div className="relative">
            <SearchBar />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>

          {isLoggedIn && (
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              LOG
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-4 pt-4 border-t border-gray-700">
          <div className="flex flex-col space-y-4 px-2">
            {isLoggedIn ? (
              <>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center overflow-hidden">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xs font-bold">
                        {user?.name?.[0]?.toUpperCase() || "U"}
                      </span>
                    )}
                  </div>
                  <span className="font-medium">{user?.name}</span>
                </div>

                <a href="/profile" className="py-2">
                  Profile
                </a>
                <a href="/films" className="py-2 uppercase font-medium">
                  Films
                </a>
                <a href="/lists" className="py-2 uppercase font-medium">
                  Lists
                </a>
                <a href="/members" className="py-2 uppercase font-medium">
                  Members
                </a>
                <a href="/journal" className="py-2 uppercase font-medium">
                  Journal
                </a>

                <div className="pt-2 flex justify-between">
                  <button
                    onClick={() => dispatch(logout())}
                    className="text-red-400 font-medium"
                  >
                    Log out
                  </button>

                  <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    LOG
                  </button>
                </div>

                <div className="relative mt-2">
                  <SearchBar />
                  <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </button>
                </div>
              </>
            ) : (
              <>
                <a href="/login" className="py-2 uppercase font-medium">
                  Sign In
                </a>
                <a href="/register" className="py-2 uppercase font-medium">
                  Create Account
                </a>
                <div className="relative mt-2">
                  <SearchBar />
                  <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
