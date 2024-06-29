import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../actions/api";
import { hideLoader, showLoader } from "./loaderSlice";
import { showSnackBar } from "./snackSlice";

export const getClinicVets = createAsyncThunk(
  "getClinicVets",
  async (_, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({ contentType: true, auth: true }).get(
        `/clinic/doctors`
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
        showSnackBar({ message: "Vets getting failed", type: "error" })
      );
    }
  }
);

export const getGlobalDays = createAsyncThunk(
  "getGlobalDays",
  async (_, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({ contentType: true, auth: true }).get(
        `/clinic/globaldays`
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
        showSnackBar({ message: "Vets getting failed", type: "error" })
      );
    }
  }
);

export const getVetsSlots = createAsyncThunk(
  "getVetsSlots",
  async (doctorId, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({ contentType: true, auth: true }).get(
        `/clinic/slots/doctor/${doctorId}`
      );
      thunkAPI.dispatch(hideLoader());
      if (res.status === 200) {
        return res?.data?.data;
      }
      return null;
    } catch (err) {
      thunkAPI.dispatch(hideLoader());
      thunkAPI
        .dispatch
        // showSnackBar({ message: "Slots getting failed", type: "error" })
        ();
    }
  }
);

export const getVetsSlotsWithType = createAsyncThunk(
  "getVetsSlotsWithType",
  async (data, thunkAPI) => {
    try {
      const res = await api({ contentType: true, auth: true }).get(
        `/clinic/vet/availability/${data.type}/${data.id}`
      );
      if (res.status === 200) {
        return res?.data.slotList;
      } else if (res.status !== 200) {
      }
    } catch (err) {}
  }
);

export const getSlotDetailsBySlotId = createAsyncThunk(
  "getSlotDetailsBySlotId",
  async (slotId, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({ contentType: true, auth: true }).get(
        `/clinic/doctor/slot/${slotId}/date`
      );
      if (res.status === 200) {
        thunkAPI.dispatch(hideLoader());
        return res.data.data;
      } else if (res.status !== 200) {
        thunkAPI.dispatch(hideLoader());
      }
    } catch (err) {
      thunkAPI.dispatch(hideLoader());
      thunkAPI
        .dispatch
        // showSnackBar({ message: "Slots getting failed", type: "error" })
        ();
    }
  }
);

export const getVirtualSlotsBySlotId = createAsyncThunk(
  "getVirtualSlotsBySlotId",
  async (slotId, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({ contentType: true, auth: true }).get(
        `/doctor/slot/${slotId}`
      );
      if (res.status === 200) {
        thunkAPI.dispatch(hideLoader());
        return res.data.data;
      } else if (res.status !== 200) {
        thunkAPI.dispatch(hideLoader());
      }
    } catch (err) {
      thunkAPI.dispatch(hideLoader());
      // thunkAPI.dispatch(
      //   showSnackBar({ message: "Slots getting failed", type: "error" })
      // );
    }
  }
);

export const getAppointsmentsVetId = createAsyncThunk(
  "getAppointsmentsVetId",
  async (type, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({ contentType: true, auth: true }).get(
        `/appoinments/doctor?type=${type}`
      );
      if (res.status === 200) {
        thunkAPI.dispatch(hideLoader());
        return res.data.data;
      } else if (res.status !== 200) {
        thunkAPI.dispatch(hideLoader());
      }
      thunkAPI.dispatch(hideLoader());
    } catch (err) {
      thunkAPI.dispatch(hideLoader());
      thunkAPI.dispatch(
        showSnackBar({ message: "Appointments getting failed", type: "error" })
      );
    }
  }
);

export const getVetDashboardDetails = createAsyncThunk(
  "getVetDashboardDetails",
  async (_, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({ contentType: true, auth: true }).get(
        "doctors/dashboard/details"
      );
      if (res.status === 200) {
        thunkAPI.dispatch(hideLoader());
        return res.data.data;
      } else if (res.status !== 200) {
        thunkAPI.dispatch(hideLoader());
      }
      thunkAPI.dispatch(hideLoader());
    } catch (err) {
      thunkAPI.dispatch(hideLoader());
      thunkAPI.dispatch(
        showSnackBar({ message: "Appointments getting failed", type: "error" })
      );
    }
  }
);

export const addVirtualSlotsByVetId = createAsyncThunk(
  "addVirtualSlotsByVetId",
  async (data, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({ contentType: true, auth: true }).post(
        `doctorslot/virtualslotdoctor/${data?.vetId}`,
        data?.data
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
          showSnackBar({ message: "Slot add failed", type: "error" })
        );
        return false;
      }
    } catch (err) {
      const res = err?.response;
      if (res.status === 400) {
        thunkAPI.dispatch(hideLoader());
        thunkAPI.dispatch(
          showSnackBar({ message: res?.data?.msg, type: "warning" })
        );
        return false;
      }
      thunkAPI.dispatch(hideLoader());
    }
  }
);

export const addPhysicalSlotsByVetId = createAsyncThunk(
  "addPhysicalSlotsByVetId",
  async (data, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({ contentType: true, auth: true }).post(
        `physicaldocslot/${data?.vetId}`,
        data?.data
      );
      if (res.status === 201) {
        thunkAPI.dispatch(hideLoader());
        thunkAPI.dispatch(
          showSnackBar({ message: "Slot added successfully", type: "success" })
        );
        return true;
      } else {
        thunkAPI.dispatch(hideLoader());
        thunkAPI.dispatch(
          showSnackBar({ message: "Slot add failed", type: "error" })
        );
        return false;
      }
    } catch (err) {
      const res = err?.response;
      if (res.status === 400) {
        thunkAPI.dispatch(hideLoader());
        thunkAPI.dispatch(
          showSnackBar({ message: res?.data?.msg, type: "warning" })
        );
        return false;
      }
      thunkAPI.dispatch(hideLoader());
    }
  }
);

export const createVet = createAsyncThunk(
  "createVet",
  async (data, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({
        contentType: true,
        auth: true,
        formData: true,
      }).post("/clinic/doctors", data);
      if (res.status === 200) {
        thunkAPI.dispatch(hideLoader());
        thunkAPI.dispatch(
          showSnackBar({ message: "Vet created successfully", type: "success" })
        );
        return true;
      } else if (res.status === 400) {
        thunkAPI.dispatch(hideLoader());
        thunkAPI.dispatch(
          showSnackBar({ message: "Vet create failed", type: "error" })
        );
      }
      thunkAPI.dispatch(hideLoader());
      return null;
    } catch (err) {
      thunkAPI.dispatch(hideLoader());
      if (err?.response?.status === 400) {
        thunkAPI.dispatch(
          showSnackBar({
            message: err?.response?.data?.msg ?? "Vet create failed",
            type: "error",
          })
        );
      }
    }
  }
);

export const updateVet = createAsyncThunk(
  "updateVet",
  async (data, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({
        contentType: true,
        auth: true,
        formData: true,
      }).patch(`clinic/doctors/${data?.vetId}`, data?.form);
      if (res.status === 200 || res.status === 201) {
        thunkAPI.dispatch(hideLoader());
        thunkAPI.dispatch(
          showSnackBar({ message: "Vet updated successfully", type: "success" })
        );
        return true;
      } else if (res.status === 400) {
        thunkAPI.dispatch(hideLoader());
        thunkAPI.dispatch(
          showSnackBar({ message: "Vet update failed", type: "error" })
        );
      }
      thunkAPI.dispatch(hideLoader());
      return null;
    } catch (err) {
      thunkAPI.dispatch(hideLoader());
      thunkAPI.dispatch(
        showSnackBar({ message: "Vet update failed", type: "error" })
      );
    }
  }
);

export const updateVetByClinic = createAsyncThunk(
  "updateVetByClinic",
  async (data, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({
        contentType: true,
        auth: true,
        formData: true,
      }).put(`clinic/doctors/${data?.vetId}`, data?.form);
      if (res.status === 200 || res.status === 201) {
        thunkAPI.dispatch(hideLoader());
        thunkAPI.dispatch(
          showSnackBar({ message: "Vet updated successfully", type: "success" })
        );
        return true;
      } else if (res.status === 400) {
        thunkAPI.dispatch(hideLoader());
        thunkAPI.dispatch(
          showSnackBar({ message: "Vet update failed", type: "error" })
        );
      }
      thunkAPI.dispatch(hideLoader());
      return null;
    } catch (err) {
      thunkAPI.dispatch(hideLoader());
      thunkAPI.dispatch(
        showSnackBar({ message: "Vet update failed", type: "error" })
      );
    }
  }
);

export const updateVetFee = createAsyncThunk(
  "updateVetFee",
  async (data, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({ contentType: true, auth: true }).put(
        `clinic/doctors/${data?.vetId}/feeandconsulation`,
        data
      );
      if (res.status === 200) {
        thunkAPI.dispatch(hideLoader());
        thunkAPI.dispatch(
          showSnackBar({ message: "Vet fee updated", type: "success" })
        );
        return res.data;
      }
      if (res.status !== 200) {
        thunkAPI.dispatch(hideLoader());
        thunkAPI.dispatch(
          showSnackBar({ message: "Vet fee update failed", type: "error" })
        );
        return false;
      }
      return null;
    } catch (err) {
      thunkAPI.dispatch(hideLoader());
      thunkAPI.dispatch(
        showSnackBar({ message: "Vet fee update failed", type: "error" })
      );
    }
  }
);

export const updateAppointmentStatus = createAsyncThunk(
  "updateAppointmentStatus",
  async (data, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({ contentType: true, auth: true }).put(
        `/appoinments/${data?.appId}/doctor?status=${data?.status}`
      );
      console.log("res", res);
      if (res.status === 200) {
        thunkAPI.dispatch(hideLoader());
        thunkAPI.dispatch(
          showSnackBar({
            message: "Appointment status updated",
            type: "success",
          })
        );
        return res.data;
      }
      if (res.status !== 200) {
        thunkAPI.dispatch(hideLoader());
        thunkAPI.dispatch(
          showSnackBar({
            message: "Appointment status update failed",
            type: "error",
          })
        );
        return false;
      }
      return null;
    } catch (err) {
      thunkAPI.dispatch(hideLoader());
      thunkAPI.dispatch(
        showSnackBar({ message: "Vet fee update failed", type: "error" })
      );
    }
  }
);

export const updateVetFeeConsulatation = createAsyncThunk(
  "updateVetFeeConsulatation",
  async (data, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({ contentType: true, auth: true }).put(
        `clinic/doctors/${data?.vetId}/feeandconsulation`,
        data?.data
      );
      if (res.status === 200) {
        thunkAPI.dispatch(hideLoader());
        thunkAPI.dispatch(
          showSnackBar({ message: "Vet fee updated!", type: "success" })
        );
        return res.data;
      }
      if (res.status !== 200) {
        thunkAPI.dispatch(hideLoader());
        thunkAPI.dispatch(
          showSnackBar({ message: "Vet fee update failed", type: "error" })
        );
        return false;
      }
      return null;
    } catch (err) {
      thunkAPI.dispatch(hideLoader());
      thunkAPI.dispatch(
        showSnackBar({ message: "Vet fee update failed", type: "error" })
      );
    }
  }
);

export const updateVetBlockStatus = createAsyncThunk(
  "updateVetBlockStatus",
  async (data, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({ contentType: true, auth: true }).put(
        `clinic/doctors/${data?.vetId}/block?active=${data?.active}`
      );
      if (res.status === 200) {
        thunkAPI.dispatch(hideLoader());
        thunkAPI.dispatch(
          showSnackBar({ message: "Vet status updated", type: "success" })
        );
        return true;
      }
      if (res.status !== 200) {
        thunkAPI.dispatch(hideLoader());
        thunkAPI.dispatch(
          showSnackBar({ message: "Vet status update failed", type: "error" })
        );
        return false;
      }
      return null;
    } catch (err) {
      thunkAPI.dispatch(hideLoader());
      thunkAPI.dispatch(
        showSnackBar({ message: "Vet status update failed", type: "error" })
      );
    }
  }
);

export const updateVirtualSlotStatusById = createAsyncThunk(
  "updateVirtualSlotStatusById",
  async (data, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({ contentType: true, auth: true }).patch(
        `virtualdocslot/updateslotstatus/${data?.slotId}`,
        data?.data
      );
      if (res.status === 200) {
        thunkAPI.dispatch(hideLoader());
        thunkAPI.dispatch(
          showSnackBar({ message: "Slot status updated", type: "success" })
        );
        return true;
      }
      if (res.status !== 200) {
        thunkAPI.dispatch(hideLoader());
        thunkAPI.dispatch(
          showSnackBar({ message: "Slot status update failed", type: "error" })
        );
        return false;
      }
    } catch (err) {
      thunkAPI.dispatch(hideLoader());
      thunkAPI.dispatch(
        showSnackBar({ message: "Slot status update failed", type: "error" })
      );
    }
  }
);

export const updatePhysicalSlotStatusById = createAsyncThunk(
  "updatePhysicalSlotStatusById",
  async (data, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({ contentType: true, auth: true }).patch(
        `physicaldocslotlist/updateslotstatus/${data?.slotId}`,
        data?.data
      );
      if (res.status === 200) {
        thunkAPI.dispatch(hideLoader());
        thunkAPI.dispatch(
          showSnackBar({ message: "Slot status updated", type: "success" })
        );
        return true;
      }
      if (res.status !== 200) {
        thunkAPI.dispatch(hideLoader());
        thunkAPI.dispatch(
          showSnackBar({ message: "Slot status update failed", type: "error" })
        );
        return false;
      }
    } catch (err) {
      thunkAPI.dispatch(hideLoader());
      thunkAPI.dispatch(
        showSnackBar({ message: "Slot status update failed", type: "error" })
      );
    }
  }
);

export const updateSlotStatusMultiple = createAsyncThunk(
  "updateSlotStatusMultiple",
  async (data, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({ contentType: true, auth: true }).put(
        "/doctor/slot/time",
        data
      );
      if (res.status === 200) {
        thunkAPI.dispatch(hideLoader());
        thunkAPI.dispatch(
          showSnackBar({ message: "Slot status updated", type: "success" })
        );
        return true;
      }
      if (res.status !== 200) {
        thunkAPI.dispatch(hideLoader());
        thunkAPI.dispatch(
          showSnackBar({ message: "Slot status update failed", type: "error" })
        );
        return false;
      }
    } catch (err) {
      thunkAPI.dispatch(hideLoader());
      thunkAPI.dispatch(
        showSnackBar({ message: "Slot status update failed", type: "error" })
      );
    }
  }
);

export const updatePhysicalSlotStatusMultiple = createAsyncThunk(
  "updatePhysicalSlotStatusMultiple",
  async (data, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({ contentType: true, auth: true }).patch(
        "physicaldocslotlist/updatemultislotstatus",
        data
      );
      if (res.status === 200) {
        thunkAPI.dispatch(hideLoader());
        thunkAPI.dispatch(
          showSnackBar({ message: "Slot status updated", type: "success" })
        );
        return true;
      }
      if (res.status !== 200) {
        thunkAPI.dispatch(hideLoader());
        thunkAPI.dispatch(
          showSnackBar({ message: "Slot status update failed", type: "error" })
        );
        return false;
      }
    } catch (err) {
      thunkAPI.dispatch(hideLoader());
      thunkAPI.dispatch(
        showSnackBar({ message: "Slot status update failed", type: "error" })
      );
    }
  }
);

export const updateSlotStatusVetByDayId = createAsyncThunk(
  "updateSlotStatusVetByDayId",
  async (slotdayId, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({ contentType: true, auth: true }).put(
        `/clinic/slots/doctor/slotday/${slotdayId}`
      );
      if (res.status === 200) {
        thunkAPI.dispatch(hideLoader());
        thunkAPI.dispatch(
          showSnackBar({ message: "Slot status updated", type: "success" })
        );
        return true;
      }
      thunkAPI.dispatch(hideLoader());
      thunkAPI.dispatch(
        showSnackBar({ message: "Slot status update failed", type: "error" })
      );
      return false;
    } catch (err) {
      thunkAPI.dispatch(hideLoader());
      thunkAPI.dispatch(
        showSnackBar({ message: "Slot status update failed", type: "error" })
      );
    }
  }
);

export const updateSlotStatusByDayId = createAsyncThunk(
  "updateSlotStatusByDayId",
  async (data, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({ contentType: true, auth: true }).put(
        `/clinic/slots/doctor/${data?.doctorId}/slotday/${data?.slotdayId}`
      );
      if (res.status === 200) {
        thunkAPI.dispatch(hideLoader());
        thunkAPI.dispatch(
          showSnackBar({ message: "Slot status updated", type: "success" })
        );
        return true;
      }
      thunkAPI.dispatch(hideLoader());
      thunkAPI.dispatch(
        showSnackBar({ message: "Slot status update failed", type: "error" })
      );
      return false;
    } catch (err) {
      thunkAPI.dispatch(hideLoader());
      thunkAPI.dispatch(
        showSnackBar({ message: "Slot status update failed", type: "error" })
      );
    }
  }
);

export const removeVirtualSlotById = createAsyncThunk(
  "removeVirtualSlotById",
  async (slotId, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({ contentType: true, auth: true }).delete(
        `virtualdocslot/removeslot/${slotId}`
      );
      if (res.status === 200) {
        thunkAPI.dispatch(hideLoader());
        thunkAPI.dispatch(
          showSnackBar({
            message: "Slot removed successfully",
            type: "success",
          })
        );
        return true;
      }
      if (res.status !== 200) {
        thunkAPI.dispatch(hideLoader());
        thunkAPI.dispatch(
          showSnackBar({ message: "Slot remove failed", type: "success" })
        );
        return false;
      }
    } catch (err) {
      thunkAPI.dispatch(hideLoader());
      thunkAPI.dispatch(
        showSnackBar({ message: "Slot remove failed", type: "success" })
      );
    }
  }
);

export const removePhysicalSlotById = createAsyncThunk(
  "removePhysicalSlotById",
  async (slotId, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({ contentType: true, auth: true }).delete(
        `physicaldocslotlist/removeslot/${slotId}`
      );
      if (res.status === 200) {
        thunkAPI.dispatch(hideLoader());
        thunkAPI.dispatch(
          showSnackBar({
            message: "Slot removed successfully",
            type: "success",
          })
        );
        return true;
      }
      if (res.status !== 200) {
        thunkAPI.dispatch(hideLoader());
        thunkAPI.dispatch(
          showSnackBar({ message: "Slot remove failed", type: "success" })
        );
        return false;
      }
    } catch (err) {
      thunkAPI.dispatch(hideLoader());
      thunkAPI.dispatch(
        showSnackBar({ message: "Slot remove failed", type: "success" })
      );
    }
  }
);

export const makeDoctorCallIn = createAsyncThunk(
  "makeDoctorCallIn",
  async (data, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({ contentType: true, auth: true }).patch(
        "slotToken/doctorcall",
        data
      );
      if (res.status === 200) {
        thunkAPI.dispatch(hideLoader());
        thunkAPI.dispatch(
          showSnackBar({
            message: "Call In successfully",
            type: "success",
          })
        );
        return true;
      }
      if (res.status !== 200) {
        thunkAPI.dispatch(hideLoader());
        thunkAPI.dispatch(
          showSnackBar({ message: "Call In failed", type: "error" })
        );
        return false;
      }
    } catch (err) {
      thunkAPI.dispatch(hideLoader());
      thunkAPI.dispatch(
        showSnackBar({ message: "Call In failed", type: "error" })
      );
      return false;
    }
  }
);

export const getCallPendingById = createAsyncThunk(
  "getCallPendingById",
  async (callId, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({ contentType: true, auth: true }).get(
        `pendingcalls/${callId}`
      );
      if (res.status === 200) {
        thunkAPI.dispatch(hideLoader());
        return res?.data?.call;
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

export const getDoctorPets = createAsyncThunk(
  "getDoctorPets",
  async (url = null, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({ contentType: true, auth: true }).get(
        `/doctor/pets`
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
      // thunkAPI.dispatch(
      // showSnackBar({ message: "Pets getting failed", type: "error" })
      // );
    }
  }
);

export const getVetTotalPetsAndAppointments = createAsyncThunk(
  "getVetTotalPetsAndAppointments",
  async (_, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({ contentType: true, auth: true }).get(
        "doctors/dashboard"
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
      // thunkAPI.dispatch(
      //   showSnackBar({ message: "Pets getting failed", type: "error" })
      // );
    }
  }
);

export const vetSlice = createSlice({
  name: "vet",
  initialState: {
    vets: [],
    globalDays:[],
    slotList: [],
    slotDetails: [],
    type: [],
    slots: {
      virtualSlotDetails: [],
    },
    appointments: { list: [], totalRecords: 0 },
    doctorPets: { totalRecords: 0, pets: [] },
    dashboard: {
      totalAppointments: 0,
      totalPets: 0,
      appointments: [],
      upcomingAppointments: [],
    },
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getClinicVets.fulfilled, (state, action) => {
      state.vets = action.payload;
    });
    // builder.addCase(createVet.fulfilled, () => {});
    // builder.addCase(addVirtualSlotsByVetId.fulfilled, () => {});
    // builder.addCase(addPhysicalSlotsByVetId.fulfilled, () => {});
    // builder.addCase(updateVet.fulfilled, () => {});
    // builder.addCase(updateVetFee.fulfilled, () => {});
    // builder.addCase(updateVetBlockStatus.fulfilled, () => {});

    builder.addCase(getVirtualSlotsBySlotId.fulfilled, (state, action) => {
      state.slots.virtualSlotDetails = action.payload;
    });
    builder.addCase(getGlobalDays.fulfilled, (state, action) => {
      state.globalDays = action.payload;
    });
    builder.addCase(getVetsSlots.fulfilled, (state, action) => {
      state.slotList = action.payload;
    });
    builder.addCase(getSlotDetailsBySlotId.fulfilled, (state, action) => {
      state.slotDetails = action.payload;
    });
    builder.addCase(getVetsSlotsWithType.fulfilled, (state, action) => {
      state.type = action.payload;
    });

    builder.addCase(getAppointsmentsVetId.fulfilled, (state, action) => {
      const payLoad = action.payload;
      state.appointments = {
        list: payLoad,
        totalRecords: payLoad?.totalRecords,
      };
    });
    builder.addCase(getVetDashboardDetails.fulfilled, (state, action) => {
      const payLoad = action.payload;
      state.dashboard = {
        totalAppointments: payLoad?.totalAppointments,
        totalPets: payLoad?.totalPets,
        appointments: payLoad?.appointments,
        upcomingAppointments: payLoad?.upcomingAppointments,
      };
    });
    // builder.addCase(makeDoctorCallIn.fulfilled, () => {});
    // builder.addCase(getCallPendingById, () => {});
    builder.addCase(getDoctorPets.fulfilled, (state, action) => {
      const payLoad = action.payload;
      state.doctorPets = {
        pets: payLoad,
        totalRecords: payLoad?.totalRecords,
      };
    });
    builder.addCase(
      getVetTotalPetsAndAppointments.fulfilled,
      (state, action) => {
        const payLoad = action.payload;
        state.dashboard = {
          totalAppointments: payLoad?.totalAppointments,
          totalPets: payLoad?.totalPets,
        };
      }
    );
  },
});

export const {} = vetSlice.actions;

export default vetSlice.reducer;
