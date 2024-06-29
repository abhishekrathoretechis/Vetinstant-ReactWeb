import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { hideLoader, showLoader } from "./loaderSlice";
import api from "../actions/api";
import { showSnackBar } from "./snackSlice";

export const getMedicalHistoryByCallId = createAsyncThunk(
  "getMedicalHistoryByCallId",
  async (callId, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({ contentType: true, auth: true }).get(
        `/appoinments/${callId}/medical`
      );
      if (res.status === 200) {
        thunkAPI.dispatch(hideLoader());
        return res.data.data;
      } else if (res.status !== 200) {
        thunkAPI.dispatch(hideLoader());
      }
      thunkAPI.dispatch(hideLoader());
      return null;
    } catch (err) {
      thunkAPI.dispatch(hideLoader());
      thunkAPI.dispatch(
        showSnackBar({ message: "Pet Data getting failed", type: "error" })
      );
    }
  }
);

export const medicalHistorySlice = createSlice({
  name: "medicalHistory",
  initialState: {
    detail: null,
    list: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getMedicalHistoryByCallId.fulfilled, (state, action) => {
      state.detail = action.payload;
    });
  },
});

export const {} = medicalHistorySlice.actions;

export default medicalHistorySlice.reducer;
