import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLoggedIn: false,
    user: {},
    searchMode: false,
  },
  reducers: {
    setLogin: (state) => {
      state.isLoggedIn = true;
    },
    setLogout: (state) => {
      state.isLoggedIn = false;
    },
    setUserDetails: (state, action) => {
      state.user = action.payload;
    },
    setSearchMode: (state) => {
      state.searchMode = true;
    },
    setUnSearchMode: (state) => {
      state.searchMode = false;
    },
  },
});

export const {
  setLogin,
  setLogout,
  setUserDetails,
  setSearchMode,
  setUnSearchMode,
} = authSlice.actions;
export default authSlice.reducer;
