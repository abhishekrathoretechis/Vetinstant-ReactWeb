import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../actions/api";
import { hideLoader, showLoader } from "./loaderSlice";
import { showSnackBar } from "./snackSlice";

export const petAppointment = createAsyncThunk(
  "petAppointment",
  async (data, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({ contentType: true, auth: true }).post(
        `/clinic/book/appoinment/pet/${data?.petId}`,
        data?.data
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
      // thunkAPI.dispatch(
      //   showSnackBar({ message: "Pets getting failed", type: "error" })
      // );
    }
  }
);

export const petAppointmentImmediate = createAsyncThunk(
  "petAppointmentImmediate",
  async (data, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({ contentType: true, auth: true }).post(
        `/clinic/book/immediate/appoinment/pet/${data?.petId}`,
        data?.data
      );
      if (res.status === 200) {
        thunkAPI.dispatch(hideLoader());
        showSnackBar({
          message: "Appointment created successfully!",
          type: "success",
        });
        return res.data;
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

export const getSlotByDoctorId = createAsyncThunk(
  "getSlotByDoctorId",
  async (data, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({ contentType: true, auth: true }).get(
        `/user/${data?.getId}/slots?type=${data?.type}`
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
      // thunkAPI.dispatch(
      //   showSnackBar({ message: "Pets getting failed", type: "error" })
      // );
    }
  }
);

export const getSlotTime = createAsyncThunk(
  "getSlotTime",
  async (data, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      // const res = await api({ contentType: true, auth: true,formData:true }).get(
      //   `doctor/slot/${data?.doctorId}/date/slots?date=${data?.date}`
      // );
      const res = await api({
        contentType: true,
        auth: true,
        formData: true,
      }).get(
        `clinic/doctor/${data?.doctorId}/day?type=${data?.contType}&date=${data?.date}`
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

export const getPetsCompliantSummary = createAsyncThunk(
  "getPetsCompliantSummary",
  async (appointmentId, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({ contentType: true, auth: true }).get(
        `appoinments/${appointmentId}/pet/compliantSummary`
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
      // thunkAPI.dispatch(
      //   showSnackBar({ message: "Pets getting failed", type: "error" })
      // );
    }
  }
);

export const createPreventive = createAsyncThunk(
  "createPreventive",
  async (data, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({
        contentType: true,
        auth: true,
        formData: true,
      }).post(`appointment/${data?.appointmentId}/preventive/web`, data?.form);

      if (res.status === 200) {
        thunkAPI.dispatch(
          showSnackBar({
            message: "Record created successfully!",
            type: "success",
          })
        );
        thunkAPI.dispatch(hideLoader());
        return res.data;
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

export const createPetAppointment = createAsyncThunk(
  "createPetAppointment",
  async (data, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({
        contentType: true,
        auth: true,
        formData: false,
      }).post(`clinic/book/appoinment/pet/${data?.petId}`, data?.data);

      if (res.status === 200) {
        thunkAPI.dispatch(hideLoader());
        thunkAPI.dispatch(
          showSnackBar({ message: "Record created successfully!", type: "success" })
        );
        return res.data;
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

export const updatePreventive = createAsyncThunk(
  "updatePreventive",
  async (data, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({
        contentType: true,
        auth: true,
        formData: true,
      }).put(`appointment/preventive/${data?.preventId}/web`, data?.form);

      if (res.status === 200) {
        thunkAPI.dispatch(hideLoader());
        thunkAPI.dispatch(
          showSnackBar({
            message: "Changes updated successfully!",
            type: "success",
          })
        );
        return res.data;
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

export const createPrescription = createAsyncThunk(
  "createPrescription",
  async (data, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({ contentType: true, auth: true }).post(
        `appointment/${data?.appointmentId}/prescription`,
        data?.data
      );

      if (res.status === 200) {
        thunkAPI.dispatch(hideLoader());
            thunkAPI.dispatch(
        showSnackBar({ message: "Record created successfully!", type: "success" })
      );
        return res.data;
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

export const updatePrescription = createAsyncThunk(
  "updatePrescription",
  async (data, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({ contentType: true, auth: true }).put(
        `appointment/prescription/${data?.prescriptionId}`,
        data?.data
      );

      if (res.status === 200) {
        thunkAPI.dispatch(hideLoader());
        thunkAPI.dispatch(
          showSnackBar({ message: "Changes updated successfully!", type: "success" })
        );
        return res.data;
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

export const createDiagnostics = createAsyncThunk(
  "createDiagnostics",
  async (data, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({
        contentType: true,
        auth: true,
        formData: data?.formData ?? false,
      }).post(
        `appointment/${data?.appointmentId}/diagonistics/web`,
        data?.form ?? data?.data
      );

      if (res.status === 200) {
        thunkAPI.dispatch(hideLoader());
        thunkAPI.dispatch(
          showSnackBar({ message: "Record created successfully!", type: "success" })
        );
        return res.data;
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

export const updateDiagnostics = createAsyncThunk(
  "updateDiagnostics",
  async (data, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({
        contentType: true,
        auth: true,
        formData: true,
      }).put(`appointment/diagonistics/${data?.diagnosticsId}/web`, data?.form);

      if (res.status === 200) {
        thunkAPI.dispatch(hideLoader());
        thunkAPI.dispatch(
          showSnackBar({ message: "Changes updated successfully!", type: "success" })
        );
        return res.data;
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

export const getPets = createAsyncThunk(
  "getPets",
  async (url = null, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({ contentType: true, auth: true }).get(
        `getall/pets${url ? `${url}` : ""}`
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
      // thunkAPI.dispatch(
      //   showSnackBar({ message: "Pets getting failed", type: "error" })
      // );
    }
  }
);

export const getMedicalHistoryByPetId = createAsyncThunk(
  "getMedicalHistoryByPetId",
  async ({ url = "?type=all", petId }, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({ contentType: true, auth: true }).get(
        `/medicalHistory/search/${petId}${url ? `${url}` : ""}`
      );
      if (res.status === 200) {
        thunkAPI.dispatch(hideLoader());
        return res.data;
      } else if (res.status !== 200) {
        thunkAPI.dispatch(hideLoader());
      }
    } catch (err) {
      thunkAPI.dispatch(hideLoader());
      thunkAPI.dispatch(
        showSnackBar({
          message: "Medical history getting failed",
          type: "error",
        })
      );
    }
  }
);

export const getMedicalHistoryById = createAsyncThunk(
  "getMedicalHistoryById",
  async (medHisId, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({ contentType: true, auth: true }).get(
        `/medicalHistory/detail/${medHisId}?pet=true&web=true&petowner=true`
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
        showSnackBar({
          message: "Medical history getting failed",
          type: "error",
        })
      );
    }
  }
);

export const createPet = createAsyncThunk(
  "createPet",
  async (data, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({
        contentType: true,
        auth: true,
        formData: true,
      }).post("/clinic/user/pet", data);
      if (res.status === 201 || res.status === 200) {
        thunkAPI.dispatch(hideLoader());
        thunkAPI.dispatch(
          showSnackBar({ message: "Pet created successfully", type: "success" })
        );
        return true;
      } else if (res.status === 400) {
        thunkAPI.dispatch(hideLoader());
        thunkAPI.dispatch(
          showSnackBar({ message: "Pet create failed", type: "error" })
        );
      }
      thunkAPI.dispatch(hideLoader());
      return null;
    } catch (err) {
      thunkAPI.dispatch(hideLoader());
      thunkAPI.dispatch(
        showSnackBar({ message: "Pet create failed", type: "error" })
      );
    }
  }
);

export const createPetNewRegister = createAsyncThunk(
  "createPetNewRegister",
  async (data, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({
        contentType: true,
        auth: true,
        formData: true,
      }).post("pets", data);
      if (res.status === 201) {
        thunkAPI.dispatch(hideLoader());
        thunkAPI.dispatch(
          showSnackBar({ message: "Pet created successfully", type: "success" })
        );
        return res?.data;
      } else if (res.status === 400) {
        thunkAPI.dispatch(hideLoader());
        thunkAPI.dispatch(
          showSnackBar({ message: "Pet create failed", type: "error" })
        );
      }
      thunkAPI.dispatch(hideLoader());
      return null;
    } catch (err) {
      thunkAPI.dispatch(hideLoader());
      thunkAPI.dispatch(
        showSnackBar({ message: "Pet create failed", type: "error" })
      );
    }
  }
);

export const updatePet = createAsyncThunk(
  "updatePet",
  async (data, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({
        contentType: true,
        auth: true,
        formData: true,
      }).patch(`pets/${data?.petId}`, data?.form);
      if (res.status === 200 || res.status === 201) {
        thunkAPI.dispatch(hideLoader());
        thunkAPI.dispatch(
          showSnackBar({ message: "Pet updated successfully", type: "success" })
        );
        return true;
      } else if (res.status === 400) {
        thunkAPI.dispatch(hideLoader());
        thunkAPI.dispatch(
          showSnackBar({ message: "Pet update failed", type: "error" })
        );
      }
      thunkAPI.dispatch(hideLoader());
      return null;
    } catch (err) {
      thunkAPI.dispatch(hideLoader());
      thunkAPI.dispatch(
        showSnackBar({ message: "Pet update failed", type: "error" })
      );
    }
  }
);

export const getPetPreventives = createAsyncThunk(
  "getPetPreventives",
  async ({ petId, url = "" }, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({ contentType: true, auth: true }).get(
        `/pet/${petId}/preventive${url}`
      );

      if (res.status === 200) {
        thunkAPI.dispatch(hideLoader());
        return res?.data;
      } else if (res.status !== 200) {
        thunkAPI.dispatch(hideLoader());
      }
      thunkAPI.dispatch(hideLoader());
      return null;
    } catch (err) {
      thunkAPI.dispatch(hideLoader());
    }
  }
);

export const getPetPrescriptions = createAsyncThunk(
  "getPetPrescriptions",
  async ({ petId, url = "" }, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({ contentType: true, auth: true }).get(
        `/pet/${petId}/prescription${url}`
      );

      if (res.status === 200) {
        thunkAPI.dispatch(hideLoader());
        return res?.data;
      } else if (res.status !== 200) {
        thunkAPI.dispatch(hideLoader());
      }
      thunkAPI.dispatch(hideLoader());
      return null;
    } catch (err) {
      thunkAPI.dispatch(hideLoader());
    }
  }
);

export const getPetDiagnostics = createAsyncThunk(
  "getPetDiagnostics",
  async ({ petId, url = "" }, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({ contentType: true, auth: true }).get(
        `/pet/${petId}/diagonistics${url}`
      );

      if (res.status === 200) {
        thunkAPI.dispatch(hideLoader());
        return res?.data;
      } else if (res.status !== 200) {
        thunkAPI.dispatch(hideLoader());
      }
      thunkAPI.dispatch(hideLoader());
      return null;
    } catch (err) {
      thunkAPI.dispatch(hideLoader());
    }
  }
);

export const getClinicPets = createAsyncThunk(
  "getClinicPets",
  async (url = "", thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({ contentType: true, auth: true }).get(
        `/clinic/pets${url}`
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
      // thunkAPI.dispatch(
      //   showSnackBar({ message: "Pets getting failed", type: "error" })
      // );
    }
  }
);

export const createPetPrescription = createAsyncThunk(
  "createPetPrescription",
  async ({ petId, data }, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({ contentType: true, auth: true }).post(
        `/pets/prescription/upload/${petId}`,
        data
      );
      if (res.status === 200) {
        thunkAPI.dispatch(hideLoader());
        thunkAPI.dispatch(
          showSnackBar({
            message: "Prescription created successfully",
            type: "success",
          })
        );
        return true;
      } else if (res.status === 400) {
        thunkAPI.dispatch(hideLoader());
        thunkAPI.dispatch(
          showSnackBar({ message: "Prescription create failed", type: "error" })
        );
      }
      thunkAPI.dispatch(hideLoader());
      return null;
    } catch (err) {
      thunkAPI.dispatch(hideLoader());
      thunkAPI.dispatch(
        showSnackBar({ message: "Prescription create failed", type: "error" })
      );
    }
  }
);

export const petSlice = createSlice({
  name: "pet",
  initialState: {
    pets: { totalRecords: 0, pets: [] },
    clinicPets: { totalRecords: 0, pets: [] },
    medicalHistorys: { totalRecords: 0, medicalHistorys: [] },
    medicalHistory: {},
    petDetails: null,
    slotList: null,
    preventives: [],
    prescriptions: [],
    diagnostics: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getPets.fulfilled, (state, action) => {
      const payLoad = action.payload;

      state.pets = { pets: payLoad?.data, totalRecords: payLoad?.data?.length };
    });
    // builder.addCase(createPet.fulfilled, () => {});
    // builder.addCase(createPetNewRegister.fulfilled, () => {});
    // builder.addCase(updatePet.fulfilled, () => {});
    //clinic Details
    builder.addCase(getClinicPets.fulfilled, (state, action) => {
      const payLoad = action.payload;
      state.clinicPets = {
        pets: payLoad?.data,
        totalRecords: payLoad?.totalRecords,
      };
    });
    //medical history
    builder.addCase(getMedicalHistoryByPetId.fulfilled, (state, action) => {
      const payLoad = action.payload;
      state.medicalHistorys = {
        totalRecords: payLoad?.totalRecords,
        medicalHistorys: payLoad?.data,
      };
    });
    builder.addCase(getMedicalHistoryById.fulfilled, (state, action) => {
      state.medicalHistory = action.payload;
    });
    //prescription
    builder.addCase(createPetPrescription.fulfilled, () => {});
    builder.addCase(getPetsCompliantSummary.fulfilled, (state, action) => {
      state.petDetails = action.payload;
    });

    builder.addCase(getSlotTime.fulfilled, (state, action) => {
      state.slotList = action.payload;
    });
    builder.addCase(getPetPrescriptions.fulfilled, (state, action) => {
      state.prescriptions = action.payload;
    });
    builder.addCase(getPetDiagnostics.fulfilled, (state, action) => {
      state.diagnostics = action.payload;
    });
    builder.addCase(getPetPreventives.fulfilled, (state, action) => {
      state.preventives = action.payload;
    });
  },
});

export const {} = petSlice.actions;

export default petSlice.reducer;
