import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../actions/api";
import { hideLoader, showLoader } from "./loaderSlice";

export const scheduleNotifications = createAsyncThunk(
  "scheduleNotifications",
  async (data, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({ contentType: true, auth: true }).post(
        "scheduleNotifications",
        data
      );
      if (res.status === 200) {
        thunkAPI.dispatch(hideLoader());
        return true;
      }
      if (res.status !== 200) {
        thunkAPI.dispatch(hideLoader());
        return false;
      }
    } catch (err) {
      thunkAPI.dispatch(hideLoader());
      return false;
    }
  }
);

export const notificationSlice = createSlice({
  name: "notification",
  initialState: {},
  reducers: {},
  extraReducers: (builder) => {
    // builder.addCase(scheduleNotifications, () => {});
  },
});

export const {} = notificationSlice.actions;

export default notificationSlice.reducer;
