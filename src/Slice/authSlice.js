import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user:  JSON.parse(localStorage.getItem("user"))  || null,
  token: localStorage.getItem("token") || null,
  isAuthenticated: !!localStorage.getItem("token"),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      const { user, accessToken } = action.payload;
      state.user            = user;
      state.token           = accessToken;
      state.isAuthenticated = true;
      localStorage.setItem("token", accessToken);
      localStorage.setItem("user",  JSON.stringify(user));
    },
    logout: (state) => {
      state.user            = null;
      state.token           = null;
      state.isAuthenticated = false;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;

// Selectors
export const selectCurrentUser  = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.token;
export const selectIsAuth       = (state) => state.auth.isAuthenticated;