import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../actions/api";
import { hideLoader, showLoader } from "./loaderSlice";
import { showSnackBar } from "./snackSlice";

export const getDoctorSlots = createAsyncThunk(
  "getDoctorSlots",
  async (_, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({ contentType: true, auth: true }).get(
        "/doctor/slots"
      );
      if (res.status === 200) {
        thunkAPI.dispatch(hideLoader());
        return res.data.data;
      } else if (res.status !== 200) {
        thunkAPI.dispatch(hideLoader());
      }
    } catch (err) {
      thunkAPI.dispatch(hideLoader());
      thunkAPI.dispatch(
        // showSnackBar({ message: "Slots getting failed", type: "error" })
      );
    }
  }
);

export const getDoctorSlotDetilsById = createAsyncThunk(
  "getDoctorSlotDetilsById",
  async (slotId, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({ contentType: true, auth: true }).get(
        `/doctor/slot/${slotId}/days`
      );
      if (res.status === 200) {
        thunkAPI.dispatch(hideLoader());
        return res.data.data;
      } else if (res.status !== 200) {
        thunkAPI.dispatch(hideLoader());
      }
    } catch (err) {
      thunkAPI.dispatch(hideLoader());
      thunkAPI.dispatch(
        // showSnackBar({ message: "Slots getting failed", type: "error" })
      );
    }
  }
);

export const storeDoctorVirtualSlots = createAsyncThunk(
  "storeDoctorVirtualSlots",
  async (data, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({ contentType: true, auth: true }).post(
        "doctorslot",
        data
      );
      if (res.status === 201) {
        thunkAPI.dispatch(hideLoader());
        thunkAPI.dispatch(
          showSnackBar({ message: "Slot added successfully", type: "success" })
        );
        return true;
      } else if (res.status === 400) {
        thunkAPI.dispatch(hideLoader());
        thunkAPI.dispatch(
          showSnackBar({ message: res?.data?.msg, type: "warning" })
        );
        return false;
      } else {
        thunkAPI.dispatch(hideLoader());
        thunkAPI.dispatch(
          showSnackBar({ message: "Slot adding failed", type: "error" })
        );
        return false;
      }
    } catch (err) {
      thunkAPI.dispatch(hideLoader());
      thunkAPI.dispatch(
        showSnackBar({
          message: err?.response?.data?.message ?? "Slot update failed",
          type: "error",
        })
      );
    }
  }
);

export const storeDoctorPhysicalSlots = createAsyncThunk(
  "storeDoctorPhysicalSlots",
  async (data, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({ contentType: true, auth: true }).post(
        "physicaldocslot",
        data
      );
      if (res.status === 201) {
        thunkAPI.dispatch(hideLoader());
        thunkAPI.dispatch(
          showSnackBar({ message: "Slot added successfully", type: "success" })
        );
        return true;
      } else if (res.status === 400) {
        thunkAPI.dispatch(hideLoader());
        thunkAPI.dispatch(
          showSnackBar({ message: res?.data?.msg, type: "warning" })
        );
        return false;
      } else {
        thunkAPI.dispatch(hideLoader());
        thunkAPI.dispatch(
          showSnackBar({ message: "Slot adding failed", type: "error" })
        );
        return false;
      }
    } catch (err) {
      thunkAPI.dispatch(hideLoader());
      thunkAPI.dispatch(
        showSnackBar({
          message: err?.response?.data?.message ?? "Slot update failed",
          type: "error",
        })
      );
    }
  }
);

export const getDoctorByVetId = createAsyncThunk(
  "getDoctorByVetId",
  async (vetId, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({ contentType: true, auth: true }).get(
        `doctors/user/${vetId}`
      );
      if (res.status === 200) {
        thunkAPI.dispatch(hideLoader());
        return res.data.doctor;
      } else if (res.status !== 200) {
        thunkAPI.dispatch(hideLoader());
      }
    } catch (err) {
      thunkAPI.dispatch(hideLoader());
      thunkAPI.dispatch(
        showSnackBar({ message: "Vet detail getting failed", type: "error" })
      );
    }
  }
);

export const getDoctorDetailsByVetId = createAsyncThunk(
  "getDoctorDetailsByVetId",
  async (_, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({ contentType: true, auth: true }).get(`/user/me`);
      if (res.status === 200) {
        console.log("res.data.datares.data.data", res.data.data);
        thunkAPI.dispatch(hideLoader());
        return res.data.data;
      } else if (res.status !== 200) {
        thunkAPI.dispatch(hideLoader());
      }
    } catch (err) {
      thunkAPI.dispatch(hideLoader());
      thunkAPI.dispatch(
        showSnackBar({ message: "Vet detail getting failed", type: "error" })
      );
    }
  }
);

export const getAllVetTransaction = createAsyncThunk(
  "getAllVetTransaction",
  async (url = null, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({ contentType: true, auth: true }).get(
        `payments/doctor${url ? url : ""}`
      );
      if (res.status === 200) {
        thunkAPI.dispatch(hideLoader());
        return res.data;
      }
      thunkAPI.dispatch(hideLoader());
    } catch (err) {
      thunkAPI.dispatch(hideLoader());
      thunkAPI.dispatch(
        showSnackBar({
          message: "Vet transaction getting failed",
          type: "error",
        })
      );
    }
  }
);

export const updateVetProfile = createAsyncThunk(
  "updateVetProfile",
  async (form, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({
        contentType: true,
        auth: true,
        formData: true,
      }).patch(`users/updateDoctorHosp`, form);
      if (res.status === 200) {
        thunkAPI.dispatch(hideLoader());
        thunkAPI.dispatch(
          showSnackBar({
            message: "Profile updated succesfully",
            type: "success",
          })
        );
        return true;
      } else {
        thunkAPI.dispatch(hideLoader());
        thunkAPI.dispatch(
          showSnackBar({ message: "Profile update failed", type: "error" })
        );
        return false;
      }
    } catch (err) {
      thunkAPI.dispatch(hideLoader());
      thunkAPI.dispatch(
        showSnackBar({ message: "Profile update failed", type: "error" })
      );
    }
  }
);

export const doctorSlice = createSlice({
  name: "doctor",
  initialState: {
    virtualSlots: [],
    physicalSlots: [],
    vetDetails: {},
    transactions: {},
    slotDetails: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getDoctorSlots.fulfilled, (state, action) => {
      state.virtualSlots = action.payload.virtual;
      state.physicalSlots = action.payload.physical;
    });
    builder.addCase(getDoctorSlotDetilsById.fulfilled, (state, action) => {
      state.slotDetails = action.payload;
    });
    // builder.addCase(storeDoctorVirtualSlots.fulfilled, () => {});
    // builder.addCase(storeDoctorPhysicalSlots.fulfilled, () => {});
    builder.addCase(getDoctorByVetId.fulfilled, (state, action) => {
      state.vetDetails = action.payload;
    });
    builder.addCase(getDoctorDetailsByVetId.fulfilled, (state, action) => {
      state.vetDetails = action.payload;
    });
    // builder.addCase(updateVetProfile.fulfilled, () => {});
    builder.addCase(getAllVetTransaction.fulfilled, (state, action) => {
      state.transactions = action.payload;
    });
  },
});

export const {} = doctorSlice.actions;

export default doctorSlice.reducer;
