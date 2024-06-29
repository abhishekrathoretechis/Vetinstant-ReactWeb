import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    accessToken: null,
  },
  reducers: {
    setToken: (state, action) => {
      state.accessToken = localStorage.setItem("accessToken", action.payload);
    },
    getToken: (state) => {
      state.accessToken = localStorage.getItem("accessToken");
    },
  },
});

export const { setToken, getToken } = authSlice.actions;

export default authSlice.reducer;
