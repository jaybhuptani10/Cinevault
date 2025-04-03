import { createSlice } from "@reduxjs/toolkit";

// Load initial state from localStorage
const storedUser = JSON.parse(localStorage.getItem("user"));
const storedIsLoggedIn = JSON.parse(localStorage.getItem("isLoggedIn"));

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: storedUser || null,
    isLoggedIn: storedIsLoggedIn || false,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload.user;
      state.isLoggedIn = action.payload.isLoggedIn;
      // Save to localStorage
      localStorage.setItem("user", JSON.stringify(state.user));
      localStorage.setItem("isLoggedIn", JSON.stringify(state.isLoggedIn));
    },
    logout: (state) => {
      state.user = null;
      state.isLoggedIn = false;
      // Remove from localStorage
      localStorage.removeItem("user");
      localStorage.removeItem("isLoggedIn");
    },
  },
});

export const { setUser, logout } = authSlice.actions;
export default authSlice.reducer;
