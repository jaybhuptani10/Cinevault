import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import Home from "./components/Home/Home";
import LandingPage from "./components/Home/Landing";
import Details from "./components/Details/Details";
import SearchResults from "./components/comp/SearchResult";

// import Profile from "./components/Profile/Profile";
import ProfilePage from "./components/Profile/Profile";

const App = () => {
  axios.defaults.baseURL ="https://philmyshittbackend.onrender.com";
    //"https://philmyshitt-backend-git-stable-jaybhuptani10s-projects.vercel.app/";
  // axios.defaults.baseURL = "http://localhost:8000/";
  axios.defaults.withCredentials = true;

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={isLoggedIn ? <Home /> : <LandingPage />} />
        <Route
          path="/login"
          element={isLoggedIn ? <Navigate to="/" /> : <Login />}
        />
        <Route
          path="/register"
          element={isLoggedIn ? <Navigate to="/" /> : <Register />}
        />
        <Route path="/details/:content/:id" element={<Details />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
