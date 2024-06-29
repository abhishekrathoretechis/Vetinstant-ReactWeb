import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../actions/api";
import { hideLoader, showLoader } from "./loaderSlice";
import { showSnackBar } from "./snackSlice";

export const getAdminPayments = createAsyncThunk(
  "getAdminPayments",
  async (url = null, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({ contentType: true, auth: true }).get(
        `payments${url ? url : ""}`
      );
      if (res.status === 200) {
        thunkAPI.dispatch(hideLoader());
        return res.data;
      } else if (res.status !== 200) {
        thunkAPI.dispatch(hideLoader());
      }
      thunkAPI.dispatch(hideLoader());
      return null;
    } catch (err) {
      thunkAPI.dispatch(hideLoader());
      thunkAPI.dispatch(
        showSnackBar({ message: "Payments getting failed", type: "error" })
      );
    }
  }
);

export const getClinicPayments = createAsyncThunk(
  "getClinicPayments",
  async (url = null, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({ contentType: true, auth: true }).get(
        `clinic/payments${url ? url : ""}`
      );
      if (res.status === 200) {
        thunkAPI.dispatch(hideLoader());
        return res.data;
      } else if (res.status !== 200) {
        thunkAPI.dispatch(hideLoader());
      }
      thunkAPI.dispatch(hideLoader());
      return null;
    } catch (err) {
      thunkAPI.dispatch(hideLoader());
      thunkAPI.dispatch(
        showSnackBar({ message: "Payments getting failed", type: "error" })
      );
    }
  }
);

export const getClinicBilling = createAsyncThunk(
  "getClinicBilling",
  async (url = null, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({ contentType: true, auth: true }).get(
        `pendingcalls/clinic/billing${url ? url : ""}`
      );
      console.log("pending------->>",res)
      if (res.status === 200) {
        thunkAPI.dispatch(hideLoader());
        return res.data.appointmentList;
      } else if (res.status !== 200) {
        thunkAPI.dispatch(hideLoader());
      }
      thunkAPI.dispatch(hideLoader());
      return null;
    } catch (err) {
      thunkAPI.dispatch(hideLoader());
      thunkAPI.dispatch(
        showSnackBar({ message: "Payments getting failed", type: "error" })
      );
    }
  }
);

export const paymentSlice = createSlice({
  name: "payment",
  initialState: {
    adminPayments: { totalRecords: 0, payments: [] },
    clinicPayments: { totalRecords: 0, payments: [] },
    billing: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAdminPayments.fulfilled, (state, action) => {
      const payLoad = action.payload;
      state.adminPayments = {
        totalRecords: payLoad?.totalRecords,
        payments: payLoad?.data,
      };
    });
    builder.addCase(getClinicPayments.fulfilled, (state, action) => {
      const payLoad = action.payload;
      state.clinicPayments = {
        totalRecords: payLoad?.totalRecords,
        payments: payLoad?.data,
      };
    });
    builder.addCase(getClinicBilling.fulfilled, (state, action) => {
      state.billing = action.payload;
    });
  },
});

export const {} = paymentSlice.actions;

export default paymentSlice.reducer;
