import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../actions/api";
import { hideLoader, showLoader } from "./loaderSlice";

export const updateCallPending = createAsyncThunk(
  "updateCallPending",
  async (data, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({ contentType: true, auth: true }).patch(
        `pendingcalls/${data?.callId}`,
        data?.reqObj
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

export const updateUserFcmToken = createAsyncThunk(
  "updateUserFcmToken",
  async (token, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({ contentType: true, auth: true }).patch(
        "users/saveToken",
        { token }
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

export const getNotificationsByUserId = createAsyncThunk(
  "getNotificationsByUserId",
  async (userId, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({ contentType: true, auth: true }).get(
        `/notifications/user/${userId}`
      );
      if (res.status === 200) {
        thunkAPI.dispatch(hideLoader());
        return res?.data?.notifications;
      }
      if (res.status !== 200) {
        thunkAPI.dispatch(hideLoader());
      }
    } catch (err) {
      thunkAPI.dispatch(hideLoader());
      return false;
    }
  }
);

export const mixedSlice = createSlice({
  name: "mixed",
  initialState: {
    notifications: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    // builder.addCase(updateCallPending.fulfilled, () => {});
    // builder.addCase(updateUserFcmToken.fulfilled, () => {});
    builder.addCase(getNotificationsByUserId.fulfilled, (state, action) => {
      state.notifications = action.payload;
    });
  },
});

// export const {} = mixedSlice.actions;

export default mixedSlice.reducer;
