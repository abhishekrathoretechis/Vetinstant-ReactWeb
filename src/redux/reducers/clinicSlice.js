import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../actions/api";
import { hideLoader, showLoader } from "./loaderSlice";
import { showSnackBar } from "./snackSlice";

export const getBillDetailsByPaymentId = createAsyncThunk(
  "getBillDetailsByPaymentId",
  async (paymentId, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({ contentType: true, auth: true }).get(
        `/appointment/clinic/payments/${paymentId}`
      );
      if (res?.status === 200) {
        thunkAPI.dispatch(hideLoader());
        return res.data.data;
      }
      thunkAPI.dispatch(hideLoader());
    } catch (err) {
      thunkAPI.dispatch(hideLoader());
    }
  }
);

export const postClinicalNotes = createAsyncThunk(
  "postClinicalNotes",
  async (data, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({ contentType: true, auth: true }).post(
        `/appointment/${data?.appId}/notes`,
        data?.data
      );
      if (res?.status === 200) {
        thunkAPI.dispatch(hideLoader());
        return res.data.data;
      }
      thunkAPI.dispatch(hideLoader());
    } catch (err) {
      thunkAPI.dispatch(hideLoader());
    }
  }
);

export const addBillingItemsByPaymentId = createAsyncThunk(
  "addBillingItemsByPaymentId",
  async (data, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({ contentType: true, auth: true }).post(
        `/appointment/clinic/payments/${data?.paymentId}`,
        data?.data
      );
      if (res?.status === 200) {
        thunkAPI.dispatch(hideLoader());
        thunkAPI.dispatch(
          showSnackBar({
            message: "Payment Item added successfully",
            type: "success",
          })
        );
        return true;
      }
      thunkAPI.dispatch(hideLoader());
      thunkAPI.dispatch(
        showSnackBar({
          message: "Payment Item adding failed",
          type: "error",
        })
      );
    } catch (err) {
      thunkAPI.dispatch(hideLoader());
      thunkAPI.dispatch(
        showSnackBar({
          message: "Payment Item adding failed",
          type: "error",
        })
      );
    }
  }
);
export const checkedInApi = createAsyncThunk(
  "checkedInApi",
  async (data, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      // const res = await api({ contentType: true, auth: true }).post(
      //   `/appointment/${data?.appointmentId}/doctor/${data?.doctorId}/checkin`
      // );
      const res = await api({ contentType: true, auth: true }).post(
        `/appointment/${data?.appointmentId}/user/checkin`
      );
      if (res?.status === 200) {
        thunkAPI.dispatch(hideLoader());
        thunkAPI.dispatch(
          showSnackBar({
            message: "Checked-in successfully!",
            type: "success",
          })
        );
        return true;
      }
      thunkAPI.dispatch(hideLoader());
      // thunkAPI.dispatch(
      //   showSnackBar({
      //     message: "Payment Item adding failed",
      //     type: "error",
      //   })
      // );
    } catch (err) {
      thunkAPI.dispatch(hideLoader());
      // thunkAPI.dispatch(
      //   showSnackBar({
      //     message: "Payment Item adding failed",
      //     type: "error",
      //   })
      // );
    }
  }
);

export const checkedCallInApi = createAsyncThunk(
  "checkedCallInApi",
  async (data, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      // const res = await api({ contentType: true, auth: true }).post(
      //   `/appointment/${data?.appointmentId}/doctor/${data?.doctorId}/checkin`
      // );
      const res = await api({ contentType: true, auth: true }).post(
        `/appointment/${data?.appointmentId}/doctor/${data?.doctorId}/checkin`
      );
      if (res?.status === 200) {
        thunkAPI.dispatch(hideLoader());
        thunkAPI.dispatch(
          showSnackBar({
            message: "Patient has been notified!",
            type: "success",
          })
        );
        return true;
      }
      thunkAPI.dispatch(hideLoader());
    } catch (err) {
      thunkAPI.dispatch(hideLoader());
    }
  }
);

export const updateBillingByPaymentId = createAsyncThunk(
  "updateBillingByPaymentId",
  async (data, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({ contentType: true, auth: true }).put(
        `/appointment/payments/${data?.paymentId}`,
        data?.data
      );

      if (res?.status === 200) {
        thunkAPI.dispatch(hideLoader());
        thunkAPI.dispatch(
          showSnackBar({
            message: "Payment updated successfully",
            type: "success",
          })
        );
        return true;
      }
      thunkAPI.dispatch(hideLoader());
      // thunkAPI.dispatch(
      //   showSnackBar({
      //     message: "Payment update failed",
      //     type: "success",
      //   })
      // );
    } catch (err) {
      thunkAPI.dispatch(hideLoader());
      // thunkAPI.dispatch(
      //   showSnackBar({
      //     message: "Payment update failed",
      //     type: "success",
      //   })
      // );
    }
  }
);

export const updateCheckedIn = createAsyncThunk(
  "updateCheckedIn",
  async (appId, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({ contentType: true, auth: true }).put(
        `appoinments/${appId}/doctor?status=inprogress`
      );

      if (res?.status === 200) {
        thunkAPI.dispatch(hideLoader());
        thunkAPI.dispatch(
          showSnackBar({
            message: "Check-in updated successfully",
            type: "success",
          })
        );
        return true;
      }
      thunkAPI.dispatch(hideLoader());
      // thunkAPI.dispatch(
      //   showSnackBar({
      //     message: "Payment update failed",
      //     type: "success",
      //   })
      // );
    } catch (err) {
      thunkAPI.dispatch(hideLoader());
      // thunkAPI.dispatch(
      //   showSnackBar({
      //     message: "Payment update failed",
      //     type: "success",
      //   })
      // );
    }
  }
);

export const updateCancel = createAsyncThunk(
  "updateCancel",
  async (appId, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({ contentType: true, auth: true }).put(
        `/appoinments/${appId}/doctor?status=canceled`
      );

      if (res?.status === 200) {
        thunkAPI.dispatch(hideLoader());
        thunkAPI.dispatch(
          showSnackBar({
            message: "Appointment canceld successfully",
            type: "success",
          })
        );
        return true;
      }
      thunkAPI.dispatch(hideLoader());
      // thunkAPI.dispatch(
      //   showSnackBar({
      //     message: "Payment update failed",
      //     type: "success",
      //   })
      // );
    } catch (err) {
      thunkAPI.dispatch(hideLoader());
      // thunkAPI.dispatch(
      //   showSnackBar({
      //     message: "Payment update failed",
      //     type: "success",
      //   })
      // );
    }
  }
);

export const updateCompleted = createAsyncThunk(
  "updateCompleted",
  async (appId, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({ contentType: true, auth: true }).put(
        `/appoinments/${appId}/doctor?status=completed`
      );

      if (res?.status === 200) {
        thunkAPI.dispatch(hideLoader());
        thunkAPI.dispatch(
          showSnackBar({
            message: "Appointment updated successfully",
            type: "success",
          })
        );
        return true;
      }
      thunkAPI.dispatch(hideLoader());
      // thunkAPI.dispatch(
      //   showSnackBar({
      //     message: "Payment update failed",
      //     type: "success",
      //   })
      // );
    } catch (err) {
      thunkAPI.dispatch(hideLoader());
      // thunkAPI.dispatch(
      //   showSnackBar({
      //     message: "Payment update failed",
      //     type: "success",
      //   })
      // );
    }
  }
);

export const updateFinalize = createAsyncThunk(
  "updateFinalize",
  async (appId, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({ contentType: true, auth: true }).put(
        `/appoinments/${appId}/doctor?status=finalize`
      );

      if (res?.status === 200) {
        thunkAPI.dispatch(hideLoader());
        thunkAPI.dispatch(
          showSnackBar({
            message: "Changes updated successfully!",
            type: "success",
          })
        );
        return true;
      }
      thunkAPI.dispatch(hideLoader());
    } catch (err) {
      thunkAPI.dispatch(hideLoader());
      // thunkAPI.dispatch(
      //   showSnackBar({
      //     message: "Status update failed",
      //     type: "error",
      //   })
      // );
    }
  }
);

export const updateConsult = createAsyncThunk(
  "updateConsult",
  async (appId, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({ contentType: true, auth: true }).put(
        `/appoinments/${appId}/doctor?status=consultation`
      );
      if (res?.status === 200) {
        thunkAPI.dispatch(hideLoader());
        thunkAPI.dispatch(
          showSnackBar({
            message: "Appointment updated successfully",
            type: "success",
          })
        );
        return true;
      }
      thunkAPI.dispatch(hideLoader());
      // thunkAPI.dispatch(
      //   showSnackBar({
      //     message: "Payment update failed",
      //     type: "success",
      //   })
      // );
    } catch (err) {
      thunkAPI.dispatch(hideLoader());
      // thunkAPI.dispatch(
      //   showSnackBar({
      //     message: "Payment update failed",
      //     type: "success",
      //   })
      // );
    }
  }
);

export const updatePayment = createAsyncThunk(
  "updatePayment",
  async (data, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({ contentType: true, auth: true }).put(
        `/appointment/clinic/final/payments/
${data?.paymentId}?paymentMode=${data?.paymentMode}&amount=${data?.paymentAmount}`,
        data?.data
      );

      if (res?.status === 200 || res?.status === 201) {
        thunkAPI.dispatch(hideLoader());
        thunkAPI.dispatch(
          showSnackBar({
            message: "Payment updated successfully!",
            type: "success",
          })
        );
        return true;
      }
      thunkAPI.dispatch(hideLoader());
      thunkAPI.dispatch(
        showSnackBar({
          message: "Payment update failed",
          type: "error",
        })
      );
    } catch (err) {
      thunkAPI.dispatch(hideLoader());
      thunkAPI.dispatch(
        showSnackBar({
          message: "Payment update failed",
          type: "error",
        })
      );
    }
  }
);

export const clinicRescheduleAppointment = createAsyncThunk(
  "clinicRescheduleAppointment",
  async (data, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({ contentType: true, auth: true }).put(
        `/clinic/book/appoinment/${data?.appointmentId}`,
        data?.data
      );

      if (res?.status === 200) {
        thunkAPI.dispatch(hideLoader());
        thunkAPI.dispatch(
          showSnackBar({
            message: "Appointment updated successfully!",
            type: "success",
          })
        );
        return true;
      }
      thunkAPI.dispatch(hideLoader());
      thunkAPI.dispatch(
        showSnackBar({
          message: "Payment update failed",
          type: "success",
        })
      );
    } catch (err) {
      thunkAPI.dispatch(hideLoader());
      thunkAPI.dispatch(
      showSnackBar({
        message: "Payment update failed",
        type: "success",
      }));
    }
  }
);

export const updateBillingItemsByPaymentId = createAsyncThunk(
  "updateBillingItemsByPaymentId",
  async (data, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({ contentType: true, auth: true }).put(
        `/appointment/clinic/payments/${data?.paymentId}`,
        data?.data
      );
      if (res?.status === 200) {
        thunkAPI.dispatch(hideLoader());
        thunkAPI.dispatch(
        showSnackBar({
          message: "Payment Item updated successfully",
          type: "success",
        }));
        return true;
      }
      thunkAPI.dispatch(hideLoader());
      thunkAPI.dispatch(
      showSnackBar({
        message: "Payment Item update failed",
        type: "success",
      }));
    } catch (err) {
      thunkAPI.dispatch(hideLoader());
      thunkAPI.dispatch(
      showSnackBar({
        message: "Payment Item update failed",
        type: "success",
      }));
    }
  }
);

export const deletePaymentItemById = createAsyncThunk(
  "deletePaymentItemById",
  async (id, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({ contentType: true, auth: true }).delete(
        `appointment/clinic/user/service/${id}`
      );
      if (res.status === 200) {
        thunkAPI.dispatch(hideLoader());
        thunkAPI.dispatch(
          showSnackBar({
            message: "Payment Item removed successfully",
            type: "success",
          })
        );
        return true;
      }
      thunkAPI.dispatch(hideLoader());
      thunkAPI.dispatch(
      showSnackBar({
        message: "Payment Item remove failed",
        type: "error",
      }))
      return false;
    } catch (err) {
      thunkAPI.dispatch(hideLoader());
      thunkAPI.dispatch(
        showSnackBar({
          message: "Payment Item remove failed",
          type: "error",
        })
      );
    }
  }
);

export const getRecentTransactionsPayment = createAsyncThunk(
  "getRecentTransactionsPayment",
  async (url = "", thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({ contentType: true, auth: true }).get(
        `appointment/clinic/payments${url}`
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
      thunkAPI
        .dispatch
        // showSnackBar({ message: "Hospitals getting failed", type: "error" })
        ();
    }
  }
);

export const getAllClinicPayment = createAsyncThunk(
  "getAllClinicPayment",
  async (url = "", thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({ contentType: true, auth: true }).get(
        `appointment/clinic/payments${url}`
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
      thunkAPI
        .dispatch
        // showSnackBar({ message: "Hospitals getting failed", type: "error" })
        ();
    }
  }
);

export const getSlotById = createAsyncThunk(
  "getSlotById",
  async (data, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({ contentType: true, auth: true }).get(
        `clinic/doctor/${data?.vetId}/slot/date${data?.url}`
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
      thunkAPI
        .dispatch
        // showSnackBar({ message: "Hospitals getting failed", type: "error" })
        ();
    }
  }
);

export const doctorSlotDayByDisable = createAsyncThunk(
  "doctorSlotDayByDisable",
  async (data, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({ contentType: true, auth: true }).put(
        `clinic/slots/doctor/${data?.vetId}/slotday/${data?.slotdayId}`
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
      thunkAPI
        .dispatch
        // showSnackBar({ message: "Hospitals getting failed", type: "error" })
        ();
    }
  }
);

export const doctorSlotTimeByDisable = createAsyncThunk(
  "doctorSlotTimeByDisable",
  async (data, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({ contentType: true, auth: true }).put(
        `doctor/slot/time`,
        data
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
      thunkAPI
        .dispatch
        // showSnackBar({ message: "Hospitals getting failed", type: "error" })
        ();
    }
  }
);

export const getClinics = createAsyncThunk(
  "getClinics",
  async (url = "", thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({ contentType: true, auth: true }).get(
        `getall/clinic${url ? `${url}` : ""}`
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
      thunkAPI
        .dispatch
        // showSnackBar({ message: "Hospitals getting failed", type: "error" })
        ();
    }
  }
);

export const getClinicDashboardData = createAsyncThunk(
  "getClinicDashboardData",
  async (data, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({ contentType: true, auth: true }).get(
        `appoinments/clinic/doctors?type=${data}`
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
        showSnackBar({
          message: "Clinic dashbord details getting failed",
          type: "error",
        })
      );
    }
  }
);

export const getClinicAppointmentTypesByUserId = createAsyncThunk(
  "getClinicAppointmentTypesByUserId",
  async (userId, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({ contentType: true, auth: true }).get(
        `hospitals/appointments/${userId}`
      );
      if (res.status === 200) {
        thunkAPI.dispatch(hideLoader());
        return res?.data?.appointmentType;
      } else if (res.status !== 200) {
        thunkAPI.dispatch(hideLoader());
      }
      thunkAPI.dispatch(hideLoader());
      return null;
    } catch (err) {
      thunkAPI.dispatch(hideLoader());
      thunkAPI.dispatch(
        showSnackBar({
          message: "Hospitals appointment types getting failed",
          type: "error",
        })
      );
    }
  }
);

export const getClinicTerms = createAsyncThunk(
  "getClinicTerms",
  async (_, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({ contentType: true, auth: true }).get(
        "/clinic/terms"
      );
      if (res.status === 200) {
        thunkAPI.dispatch(hideLoader());
        return res?.data?.data;
      }
      thunkAPI.dispatch(hideLoader());
      return false;
    } catch (err) {
      thunkAPI.dispatch(hideLoader());
      thunkAPI.dispatch(
        showSnackBar({
          message: "Hospital Terms getting failed",
          type: "error",
        })
      );
    }
  }
);

export const getClinicLocations = createAsyncThunk(
  "getClinicLocations",
  async (_, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({ contentType: true, auth: true }).get("location");
      if (res.status === 200) {
        thunkAPI.dispatch(hideLoader());
        return res.data.locations;
      } else if (res.status !== 200) {
        thunkAPI.dispatch(hideLoader());
      }
      thunkAPI.dispatch(hideLoader());
      return null;
    } catch (err) {
      thunkAPI.dispatch(hideLoader());
      thunkAPI.dispatch(
        showSnackBar({
          message: "Hospital locations getting failed",
          type: "error",
        })
      );
    }
  }
);

export const getDoctorsByClinicId = createAsyncThunk(
  "getDoctorsByClinicId",
  async (clinicId, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({ contentType: true, auth: true }).get(
        `admin/getdoctorsbyhospital/${clinicId}`
      );
      if (res.status === 200) {
        thunkAPI.dispatch(hideLoader());
        return res.data.hospital;
      } else if (res.status !== 200) {
        thunkAPI.dispatch(hideLoader());
      }
      thunkAPI.dispatch(hideLoader());
    } catch (err) {
      thunkAPI.dispatch(hideLoader());
      thunkAPI.dispatch(
        showSnackBar({
          message: "Clinic doctors getting failed",
          type: "error",
        })
      );
    }
  }
);

export const getAppointsmentsByClinic = createAsyncThunk(
  "getAppointsmentsByClinic",
  async (url = "", thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({ contentType: true, auth: true }).get(
        `/clinic/doctors/appointments${url}`
      );
      if (res.status === 200) {
        thunkAPI.dispatch(hideLoader());
        return res?.data;
      } else if (res.status !== 200) {
        thunkAPI.dispatch(hideLoader());
      }
      thunkAPI.dispatch(hideLoader());
    } catch (err) {
      thunkAPI.dispatch(hideLoader());
      thunkAPI
        .dispatch
        // showSnackBar({ message: "Appointments getting failed", type: "error" })
        ();
    }
  }
);

export const getDoctorAppointsmentsById = createAsyncThunk(
  "getDoctorAppointsmentsById",
  async (data, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({ contentType: true, auth: true }).get(
        `/appoinments/clinic/doctor/${data?.vetId}?type=${data?.type}`
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
      thunkAPI
        .dispatch
        // showSnackBar({ message: "Appointments getting failed", type: "error" })
        ();
    }
  }
);

export const getVetAppointmentsByIdAndFilter = createAsyncThunk(
  "getVetAppointmentsByIdAndFilter",
  async (url = "", thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({ contentType: true, auth: true }).get(
        `/appoinments/clinic/doctor/${url}`
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
      thunkAPI
        .dispatch
        // showSnackBar({ message: "Appointments getting failed", type: "error" })
        ();
    }
  }
);

export const getVetUpcomingAppointmentsById = createAsyncThunk(
  "getVetUpcomingAppointmentsById",
  async (vetId, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({ contentType: true, auth: true }).get(
        `/appoinments/clinic/doctor/${vetId}?type=upcomming`
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
      thunkAPI
        .dispatch
        // showSnackBar({ message: "Appointments getting failed", type: "error" })
        ();
    }
  }
);

export const getPetAppointsmentsById = createAsyncThunk(
  "getPetAppointsmentsById",
  async (_, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({ contentType: true, auth: true }).get(
        `/appoinments/doctor/pet/2`
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
      thunkAPI
        .dispatch
        // showSnackBar({ message: "Appointments getting failed", type: "error" })
        ();
    }
  }
);

export const getMedicalOrdersByClinic = createAsyncThunk(
  "getMedicalOrdersByClinic",
  async (url = "", thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({ contentType: true, auth: true }).get(
        `medicalorder/getallmedicalorder${url ? url : ""}`
      );
      if (res.status === 200) {
        thunkAPI.dispatch(hideLoader());
        return res?.data;
      }
      thunkAPI.dispatch(hideLoader());
    } catch (err) {
      thunkAPI.dispatch(hideLoader());
      thunkAPI
        .dispatch
        // showSnackBar({
        //   message: "Medical Orders getting failed",
        //   type: "error",
        // })
        ();
    }
  }
);

export const getClinicOpeningHours = createAsyncThunk(
  "getClinicOpeningHours",
  async (_, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({ contentType: true, auth: true }).get(
        "/clinic/globaldays"
      );
      thunkAPI.dispatch(hideLoader());
      if (res.status === 200) {
        return res?.data?.data;
      }
      return false;
    } catch (err) {
      thunkAPI.dispatch(hideLoader());
    }
  }
);

export const getClinicDetails = createAsyncThunk(
  "getClinicDetails",
  async (_, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({ contentType: true, auth: true }).get("/clinic");
      thunkAPI.dispatch(hideLoader());
      if (res.status === 200) {
        return res?.data?.data;
      }
      return false;
    } catch (err) {
      thunkAPI.dispatch(hideLoader());
    }
  }
);

export const getClinicHolidays = createAsyncThunk(
  "getClinicHolidays",
  async (_, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({ contentType: true, auth: true }).get(
        "/clinic/hollidays"
      );
      thunkAPI.dispatch(hideLoader());
      if (res.status === 200) {
        return res?.data?.data;
      }
      return false;
    } catch (err) {
      thunkAPI.dispatch(hideLoader());
    }
  }
);

export const updateClinicOpeningHours = createAsyncThunk(
  "updateClinicOpeningHours",
  async (data, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({ contentType: true, auth: true }).post(
        `/clinic/globaldays`,
        data?.data
      );
      if (res.status === 201 || res.status === 200) {
        thunkAPI.dispatch(hideLoader());
        thunkAPI.dispatch(
          showSnackBar({
            message: "Clinic Hours Updated",
            type: "success",
          })
        );
        return true;
      } else if (res.status !== 201) {
        thunkAPI.dispatch(hideLoader());
      }
      thunkAPI.dispatch(hideLoader());
      return null;
    } catch (err) {
      thunkAPI.dispatch(hideLoader());
      thunkAPI.dispatch(
        showSnackBar({
          message: "Clinic Hours update failed",
          type: "error",
        })
      );
    }
  }
);

export const createClinicDoctors = createAsyncThunk(
  "createClinicDoctors",
  async (data, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({
        contentType: true,
        auth: true,
        formData: true,
      }).post(`/clinic/doctors`, data);
      // console.log("BigRes------>", res);

      thunkAPI.dispatch(hideLoader());

      if (res.status === 201 || res.status === 200) {
        if (res?.data?.status === 200) {
          thunkAPI.dispatch(
            showSnackBar({
              message: "Clinic Vet Registered",
              type: "success",
            })
          );
          return res;
        } else if (res?.data?.message?.includes("email")) {
          thunkAPI.dispatch(
            showSnackBar({
              message: "Email already registered",
              type: "error",
            })
          );
        } else if (res?.data?.message?.includes("mobile")) {
          thunkAPI.dispatch(
            showSnackBar({
              message: "Mobile number already registered",
              type: "error",
            })
          );
        } else {
          thunkAPI.dispatch(
            showSnackBar({
              message: res?.data?.message || "An error occurred",
              type: "error",
            })
          );
        }
        return res;
      } else {
        thunkAPI.dispatch(
          showSnackBar({
            message: "An error occurred",
            type: "error",
          })
        );
      }
      return null;
    } catch (err) {
      thunkAPI.dispatch(hideLoader());
      thunkAPI.dispatch(
        showSnackBar({
          message: "Clinic Hours update failed",
          type: "error",
        })
      );
    }
  }
);
export const createOthers = createAsyncThunk(
  "createOthers",
  async (data, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({
        contentType: true,
        auth: true,
        formData: true,
      }).post(`/other/register`, data);
      if (res.status === 201 || res.status === 200) {
        thunkAPI.dispatch(hideLoader());
        thunkAPI.dispatch(
          showSnackBar({
            message: "User created successfully!",
            type: "success",
          })
        );
        return true;
      } else if (res.status !== 201) {
        thunkAPI.dispatch(hideLoader());
      }
      thunkAPI.dispatch(hideLoader());
      return null;
    } catch (err) {
      thunkAPI.dispatch(hideLoader());
      thunkAPI.dispatch(
        showSnackBar({
          message: "Clinic Hours update failed",
          type: "error",
        })
      );
    }
  }
);

export const createClinicSlots = createAsyncThunk(
  "createClinicSlots",
  async (data, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({ contentType: true, auth: true }).post(
        `/clinic/slots/doctor/${data?.vetId}`,
        data?.data
      );

      if (res.status === 201 || res.status === 200) {
        thunkAPI.dispatch(hideLoader());
        thunkAPI.dispatch(
          showSnackBar({
            message: "Changes updated successfully!",
            type: "success",
          })
        );
        return true;
      } else if (res.status !== 201) {
        thunkAPI.dispatch(hideLoader());
      }
      thunkAPI.dispatch(hideLoader());
      return null;
    } catch (err) {
      thunkAPI.dispatch(hideLoader());
      thunkAPI.dispatch(
        showSnackBar({
          message: err?.response?.data?.message ?? "Clinic Slot add failed",
          type: "error",
        })
      );
    }
  }
);

export const createUserPet = createAsyncThunk(
  "createUserPet",
  async (data, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({
        contentType: true,
        auth: true,
        formData: true,
      }).post(`/clinic/user/pet`, data);

      if (res.status === 201 || res.status === 200) {
        thunkAPI.dispatch(hideLoader());

        return res;
      } else if (res.status !== 201) {
        thunkAPI.dispatch(hideLoader());
      }
      thunkAPI.dispatch(hideLoader());
      return null;
    } catch (err) {
      thunkAPI.dispatch(hideLoader());
      thunkAPI.dispatch(
        showSnackBar({
          message: err?.response?.data?.message ?? "Clinic create add failed",
          type: "error",
        })
      );
    }
  }
);

export const updateClinicHolidays = createAsyncThunk(
  "updateClinicHolidays",
  async (data, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({ contentType: true, auth: true }).post(
        "/clinic/hollidays",
        data
      );
      if (res.status === 201 || res.status === 200) {
        thunkAPI.dispatch(hideLoader());
        thunkAPI.dispatch(
          showSnackBar({
            message: "Clinic Holidays Updated",
            type: "success",
          })
        );
        return true;
      } else if (res.status !== 201) {
        thunkAPI.dispatch(hideLoader());
      }
      thunkAPI.dispatch(hideLoader());
      return null;
    } catch (err) {
      thunkAPI.dispatch(hideLoader());
      thunkAPI.dispatch(
        showSnackBar({
          message: "Clinic Holidays update failed",
          type: "error",
        })
      );
    }
  }
);

export const addClinic = createAsyncThunk(
  "addClinic",
  async (data, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({
        contentType: true,
        auth: true,
        formData: true,
      }).post("clinic/register", data);
      if (res.status === 200) {
        thunkAPI.dispatch(hideLoader());
        thunkAPI.dispatch(
          showSnackBar({
            message: "Clinic Added successfully",
            type: "success",
          })
        );
        return res.data.data;
      } else if (res.status === 400) {
        thunkAPI.dispatch(hideLoader());
        thunkAPI.dispatch(
          showSnackBar({ message: "Clinic Add failed", type: "error" })
        );
      }
      thunkAPI.dispatch(hideLoader());
      return null;
    } catch (err) {
      thunkAPI.dispatch(hideLoader());
      thunkAPI.dispatch(
        showSnackBar({ message: "Clinic Add failed", type: "error" })
      );
    }
  }
);

export const updateClinic = createAsyncThunk(
  "updateClinic",
  async (form, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({
        contentType: true,
        auth: true,
        formData: true,
      }).put("/clinic", form);
      if (res.status === 200) {
        thunkAPI.dispatch(hideLoader());
        thunkAPI.dispatch(
          showSnackBar({
            message: "Changes updated successfully!",
            type: "success",
          })
        );
        return true;
      } else if (res.status === 400) {
        thunkAPI.dispatch(hideLoader());
        thunkAPI.dispatch(
          showSnackBar({ message: "Clinic Update failed", type: "error" })
        );
      }
      thunkAPI.dispatch(hideLoader());
      return null;
    } catch (err) {
      thunkAPI.dispatch(hideLoader());
      thunkAPI.dispatch(
        showSnackBar({ message: "Clinic Update failed", type: "error" })
      );
    }
  }
);

export const updateStatusConsultation = createAsyncThunk(
  "updateStatusConsultation",
  async (data, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({
        contentType: true,
        auth: true,
      }).put("/clinic/terms", data);
      if (res.status === 200) {
        thunkAPI.dispatch(hideLoader());
        thunkAPI.dispatch(
          showSnackBar({
            message: "Clinic Terms Updated successfully",
            type: "success",
          })
        );
        return true;
      } else if (res.status === 400) {
        thunkAPI.dispatch(hideLoader());
        thunkAPI.dispatch(
          showSnackBar({ message: "Clinic Update failed", type: "error" })
        );
      }
      thunkAPI.dispatch(hideLoader());
      return false;
    } catch (err) {
      thunkAPI.dispatch(hideLoader());
      thunkAPI.dispatch(
        showSnackBar({ message: "Clinic Update failed", type: "error" })
      );
    }
  }
);

export const updateMedicineFeesByMedicationId = createAsyncThunk(
  "updateMedicineFeesByMedicationId",
  async ({ medicationId, data }, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({ contentType: true, auth: true }).put(
        `medicalorder/updateprescriptionfee/${medicationId}`,
        data
      );
      if (res.status === 200) {
        thunkAPI.dispatch(hideLoader());
        thunkAPI.dispatch(
          showSnackBar({
            message: "Medical fees updated successfully!...",
            type: "success",
          })
        );
        return true;
      }
      thunkAPI.dispatch(hideLoader());
      thunkAPI.dispatch(
        showSnackBar({
          message: "Medical fees update failed",
          type: "error",
        })
      );
      return false;
    } catch (err) {
      thunkAPI.dispatch(hideLoader());
      thunkAPI.dispatch(
        showSnackBar({
          message: "Medical fees update failed",
          type: "error",
        })
      );
    }
  }
);

export const createCv = createAsyncThunk("createCv", async (data, thunkAPI) => {
  try {
    thunkAPI.dispatch(showLoader());
    const res = await api({
      contentType: true,
      auth: true,
      formData: true,
    }).patch("admin/clinic/import", data?.form);
    if (res.status === 201) {
      thunkAPI.dispatch(hideLoader());
      return true;
    } else if (res.status === 400) {
      thunkAPI.dispatch(hideLoader());
    }
    thunkAPI.dispatch(hideLoader());
    return null;
  } catch (error) {
    thunkAPI.dispatch(hideLoader());
  }
});

export const addSlotFromConsultation = createAsyncThunk(
  "addSlotFromConsultation",
  async (data, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({
        contentType: true,
        auth: true,
      }).post("/clinicslot", data);
      if (res.status === 200) {
        thunkAPI.dispatch(hideLoader());
        thunkAPI.dispatch(
          showSnackBar({
            message: "Clinic Slot Added successfully",
            type: "success",
          })
        );
        return true;
      } else if (res.status === 400) {
        thunkAPI.dispatch(hideLoader());
        thunkAPI.dispatch(
          showSnackBar({ message: "Clinic Slot Add failed", type: "error" })
        );
      }
      thunkAPI.dispatch(hideLoader());
      return null;
    } catch (err) {
      thunkAPI.dispatch(hideLoader());
      thunkAPI.dispatch(
        showSnackBar({ message: "Clinic Slot Add failed", type: "error" })
      );
    }
  }
);

export const createClinicService = createAsyncThunk(
  "createClinicService",
  async (data, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({
        contentType: true,
        auth: true,
      }).post("/clinic/service", data);
      if (res.status === 201 || res.status === 200) {
        thunkAPI.dispatch(hideLoader());
        thunkAPI.dispatch(
          showSnackBar({
            message: "Changes updated successfully!",
            type: "success",
          })
        );
        return true;
      } else if (res.status === 400) {
        thunkAPI.dispatch(hideLoader());
        thunkAPI.dispatch(
          showSnackBar({ message: "Clinic Service Add failed", type: "error" })
        );
      }
      thunkAPI.dispatch(hideLoader());
      return false;
    } catch (err) {
      thunkAPI.dispatch(hideLoader());
      thunkAPI.dispatch(
        showSnackBar({ message: "Clinic Service Add failed", type: "error" })
      );
    }
  }
);

export const getServices = createAsyncThunk(
  "getServices",
  async (url = "", thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({ contentType: true, auth: true }).get(
        `/clinic/service${url}`
      );
      if (res.status === 200) {
        thunkAPI.dispatch(hideLoader());
        return res?.data?.data;
      } else if (res.status !== 200) {
        thunkAPI.dispatch(hideLoader());
      }
      thunkAPI.dispatch(hideLoader());
      return null;
    } catch (err) {
      thunkAPI.dispatch(hideLoader());
      thunkAPI.dispatch(
        showSnackBar({
          message: "Hospital Service getting failed",
          type: "error",
        })
      );
    }
  }
);

export const deleteClinicService = createAsyncThunk(
  "deleteClinicService",
  async (id, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({ contentType: true, auth: true }).delete(
        `/clinic/service/${id}`
      );
      if (res.status === 200) {
        thunkAPI.dispatch(hideLoader());
        thunkAPI.dispatch(
          showSnackBar({
            message: "Clinic Service remove successfully",
            type: "success",
          })
        );
        return true;
      }
      thunkAPI.dispatch(hideLoader());
      return false;
    } catch (err) {
      thunkAPI.dispatch(hideLoader());
      thunkAPI.dispatch(
        showSnackBar({
          message: "Clinic Service remove failed",
          type: "error",
        })
      );
    }
  }
);

export const editClinicService = createAsyncThunk(
  "editClinicService",
  async (data, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({
        contentType: true,
        auth: true,
      }).put(`/clinic/service/${data?.id}`, data?.data);

      if (res.status === 200) {
        thunkAPI.dispatch(hideLoader());
        thunkAPI.dispatch(
          showSnackBar({
            message: "Changes updated successfully!",
            type: "success",
          })
        );
        return true;
      } else if (res.status === 400) {
        thunkAPI.dispatch(hideLoader());
        thunkAPI.dispatch(
          showSnackBar({ message: "Clinic Service Edit failed", type: "error" })
        );
      }
      thunkAPI.dispatch(hideLoader());
      return null;
    } catch (err) {
      thunkAPI.dispatch(hideLoader());
      thunkAPI.dispatch(
        showSnackBar({ message: "Clinic Service Edit failed", type: "error" })
      );
    }
  }
);

export const getRolesAndAccess = createAsyncThunk(
  "getRolesAndAccess",
  async (_, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({ contentType: true, auth: true }).get(
        `hospitals/user/get`
      );
      if (res.status === 200) {
        thunkAPI.dispatch(hideLoader());
        return res.data.clinicUserList;
      } else if (res.status !== 200) {
        thunkAPI.dispatch(hideLoader());
      }
      thunkAPI.dispatch(hideLoader());
      return null;
    } catch (err) {
      thunkAPI.dispatch(hideLoader());
      thunkAPI.dispatch(
        showSnackBar({
          message: "Hospital Roles getting failed",
          type: "error",
        })
      );
    }
  }
);

export const getUnitType = createAsyncThunk(
  "getUnitType",
  async (_, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({ contentType: true, auth: true }).get(
        `/clinic/unit`
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
        showSnackBar({
          message: "Hospital Roles getting failed",
          type: "error",
        })
      );
    }
  }
);

export const editRoleAndAccess = createAsyncThunk(
  "editRoleAndAccess",
  async (data, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({
        contentType: true,
        auth: true,
      }).patch(`/hospitals/user/${data?.id}`, data?.data);
      if (res.status === 200) {
        thunkAPI.dispatch(hideLoader());
        thunkAPI.dispatch(
          showSnackBar({
            message: "Clinic Roles Edit successfully",
            type: "success",
          })
        );
        thunkAPI.dispatch(getRolesAndAccess());
        return true;
      } else if (res.status === 400) {
        thunkAPI.dispatch(hideLoader());
        thunkAPI.dispatch(
          showSnackBar({ message: "Clinic Roles Edit failed", type: "error" })
        );
      }
      thunkAPI.dispatch(hideLoader());
      return null;
    } catch (err) {
      thunkAPI.dispatch(hideLoader());
      thunkAPI.dispatch(
        showSnackBar({ message: "Clinic Roles Edit failed", type: "error" })
      );
    }
  }
);

export const createNewProduct = createAsyncThunk(
  "createNewProduct",
  async (data, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({
        contentType: true,
        auth: true,
      }).post("/clinic/product", data);
      if (res.status === 201 || res.status === 200) {
        thunkAPI.dispatch(hideLoader());
        thunkAPI.dispatch(
          showSnackBar({
            message: "Product Added successfully",
            type: "success",
          })
        );
        return true;
      } else if (res.status === 400) {
        thunkAPI.dispatch(hideLoader());
        thunkAPI.dispatch(
          showSnackBar({ message: "Clinic Add failed", type: "error" })
        );
      }
      thunkAPI.dispatch(hideLoader());
      return null;
    } catch (err) {
      thunkAPI.dispatch(hideLoader());
      thunkAPI.dispatch(
        showSnackBar({ message: "Clinic Add failed", type: "error" })
      );
    }
  }
);

export const createNewStock = createAsyncThunk(
  "createNewStock",
  async (data, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({
        contentType: true,
        auth: true,
      }).post("/clinic/stock", data);
      if (res.status === 201 || res.status === 200) {
        thunkAPI.dispatch(hideLoader());
        thunkAPI.dispatch(
          showSnackBar({
            message: "Stock Added successfully",
            type: "success",
          })
        );
        return true;
      } else if (res.status === 400) {
        thunkAPI.dispatch(hideLoader());
        thunkAPI.dispatch(
          showSnackBar({ message: "Clinic Add failed", type: "error" })
        );
      }
      thunkAPI.dispatch(hideLoader());
      return null;
    } catch (err) {
      thunkAPI.dispatch(hideLoader());
      thunkAPI.dispatch(
        showSnackBar({ message: "Clinic Add failed", type: "error" })
      );
    }
  }
);

export const createRoleAndAccess = createAsyncThunk(
  "createRoleAndAccess",
  async (data, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({
        contentType: true,
        auth: true,
        formData: true,
      }).post("/hospitals/user/add", data);
      if (res.status === 201) {
        thunkAPI.dispatch(hideLoader());
        thunkAPI.dispatch(
          showSnackBar({
            message: "Clinic Roles Added successfully",
            type: "success",
          })
        );
        thunkAPI.dispatch(getRolesAndAccess());
        return true;
      } else if (res.status === 400) {
        thunkAPI.dispatch(hideLoader());
        thunkAPI.dispatch(
          showSnackBar({ message: "Clinic Roles Add failed", type: "error" })
        );
      }
      thunkAPI.dispatch(hideLoader());
      return null;
    } catch (err) {
      thunkAPI.dispatch(hideLoader());
      thunkAPI.dispatch(
        showSnackBar({ message: "Clinic Roles Add failed", type: "error" })
      );
    }
  }
);

export const getSupplier = createAsyncThunk(
  "getSupplier",
  async (url = "", thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({ contentType: true, auth: true }).get(
        `/clinic/supplier${url}`
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
        showSnackBar({
          message: "Hospital suppliers getting failed",
          type: "error",
        })
      );
    }
  }
);

export const deleteSupplier = createAsyncThunk(
  "deleteSupplier",
  async (id, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({ contentType: true, auth: true }).delete(
        `/clinic/supplier/${id}`
      );
      if (res.status === 200) {
        thunkAPI.dispatch(hideLoader());
        thunkAPI.dispatch(
          showSnackBar({
            message: "Clinic Supplier remove successfully",
            type: "success",
          })
        );
        return true;
      } else if (res.status !== 200) {
        thunkAPI.dispatch(hideLoader());
      }
      thunkAPI.dispatch(hideLoader());
      return null;
    } catch (err) {
      thunkAPI.dispatch(hideLoader());
      thunkAPI.dispatch(
        showSnackBar({
          message: "Clinic Supplier remove failed",
          type: "error",
        })
      );
    }
  }
);

export const createSupplier = createAsyncThunk(
  "createSupplier",
  async (data, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({
        contentType: true,
        auth: true,
      }).post("/clinic/supplier", data);
      if (res.status === 201 || res.status === 200) {
        thunkAPI.dispatch(hideLoader());
        thunkAPI.dispatch(
          showSnackBar({
            message: "Changes updated successfully!",
            type: "success",
          })
        );
        return true;
      } else if (res.status === 400) {
        thunkAPI.dispatch(hideLoader());
        thunkAPI.dispatch(
          showSnackBar({ message: "Supplier Adding failed", type: "error" })
        );
      }
      thunkAPI.dispatch(hideLoader());
      return null;
    } catch (err) {
      thunkAPI.dispatch(hideLoader());
      thunkAPI.dispatch(
        showSnackBar({ message: "Clinic Supplier Add failed", type: "error" })
      );
    }
  }
);

export const deleteProducts = createAsyncThunk(
  "deleteProducts",
  async (id, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({ contentType: true, auth: true }).delete(
        `/clinic/product/${id}`
      );
      if (res.status === 200) {
        thunkAPI.dispatch(hideLoader());
        thunkAPI.dispatch(
          showSnackBar({
            message: "Clinic Product removed successfully",
            type: "success",
          })
        );
        return true;
      } else if (res.status !== 200) {
        thunkAPI.dispatch(hideLoader());
      }
      thunkAPI.dispatch(hideLoader());
      return null;
    } catch (err) {
      thunkAPI.dispatch(hideLoader());
      thunkAPI.dispatch(
        showSnackBar({
          message: "Clinic Service remove failed",
          type: "error",
        })
      );
    }
  }
);

export const editClinicProduct = createAsyncThunk(
  "editClinicProduct",
  async (data, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({
        contentType: true,
        auth: true,
      }).put(`/clinic/product/${data?.id}`, data?.data);
      if (res.status === 200) {
        thunkAPI.dispatch(hideLoader());
        thunkAPI.dispatch(
          showSnackBar({
            message: "Changes updated successfully!",
            type: "success",
          })
        );
        return true;
      } else if (res.status === 400) {
        thunkAPI.dispatch(hideLoader());
        thunkAPI.dispatch(
          showSnackBar({ message: "Clinic Product Edit failed", type: "error" })
        );
      }
      thunkAPI.dispatch(hideLoader());
      return null;
    } catch (err) {
      thunkAPI.dispatch(hideLoader());
      thunkAPI.dispatch(
        showSnackBar({ message: "Clinic Service Edit failed", type: "error" })
      );
    }
  }
);

export const getProductsByClinic = createAsyncThunk(
  "getProductsByClinic",
  async (url = "", thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({ contentType: true, auth: true }).get(
        `/clinic/product${url}`
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
        showSnackBar({
          message: "Hospital locations getting failed",
          type: "error",
        })
      );
    }
  }
);

export const getStocksByClinic = createAsyncThunk(
  "getStocksByClinic",
  async (url = "", thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({ contentType: true, auth: true }).get(
        `/clinic/stock${url}`
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
        showSnackBar({
          message: "Hospital locations getting failed",
          type: "error",
        })
      );
    }
  }
);

export const editSupplier = createAsyncThunk(
  "editSupplier",
  async (data, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({
        contentType: true,
        auth: true,
      }).put(`/clinic/supplier/${data?.id}`, data?.data);
      if (res.status === 200) {
        thunkAPI.dispatch(hideLoader());
        thunkAPI.dispatch(
          showSnackBar({
            message: "Changes updated successfully!",
            type: "success",
          })
        );
        return true;
      } else if (res.status === 400) {
        thunkAPI.dispatch(hideLoader());
        thunkAPI.dispatch(
          showSnackBar({
            message: "Clinic Supplier Edit failed",
            type: "error",
          })
        );
      }
      thunkAPI.dispatch(hideLoader());
      return null;
    } catch (err) {
      thunkAPI.dispatch(hideLoader());
      thunkAPI.dispatch(
        showSnackBar({ message: "Clinic Supplier Edit failed", type: "error" })
      );
    }
  }
);

export const payBill = createAsyncThunk("payBill", async (id, thunkAPI) => {
  try {
    thunkAPI.dispatch(showLoader());
    const res = await api({ contentType: true, auth: true }).get(
      `/paybill/${id}`
    );
    if (res.status === 200) {
      thunkAPI.dispatch(hideLoader());
      return res.data.billing;
    } else if (res.status !== 200) {
      thunkAPI.dispatch(hideLoader());
    }
    thunkAPI.dispatch(hideLoader());
    return null;
  } catch (err) {
    thunkAPI.dispatch(hideLoader());
    // thunkAPI.dispatch(
    //   showSnackBar({
    //     message: "Hospital Paybill getting failed",
    //     type: "error",
    //   })
    // );
  }
});

export const deletePayBill = createAsyncThunk(
  "deletePayBill",
  async (id, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({ contentType: true, auth: true }).delete(
        `/paybill/item/${id}`
      );
      if (res.status === 200) {
        thunkAPI.dispatch(hideLoader());
        thunkAPI.dispatch(payBill());
        thunkAPI.dispatch(
          showSnackBar({
            message: "Clinic Paybill remove successfully",
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
      thunkAPI.dispatch(
        showSnackBar({
          message: "Clinic Paybill remove failed",
          type: "error",
        })
      );
    }
  }
);

export const createPayBill = createAsyncThunk(
  "createPayBill",
  async (data, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({
        contentType: true,
        auth: true,
      }).post("/paybill/item", data);
      if (res.status === 201) {
        thunkAPI.dispatch(hideLoader());
        // thunkAPI.dispatch(payBill());
        thunkAPI.dispatch(
          showSnackBar({
            message: "Clinic Paybill Added successfully",
            type: "success",
          })
        );
        return true;
      } else if (res.status === 400) {
        thunkAPI.dispatch(hideLoader());
        thunkAPI.dispatch(
          showSnackBar({ message: "Clinic Paybill Add failed", type: "error" })
        );
      }
      thunkAPI.dispatch(hideLoader());
      return null;
    } catch (err) {
      thunkAPI.dispatch(hideLoader());
      thunkAPI.dispatch(
        showSnackBar({ message: "Clinic Paybill Add failed", type: "error" })
      );
    }
  }
);

export const editPayBill = createAsyncThunk(
  "editPayBill",
  async (data, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({
        contentType: true,
        auth: true,
      }).patch(`/paybill/item/${data?.id}`, data?.data);
      if (res.status === 200) {
        thunkAPI.dispatch(hideLoader());
        // thunkAPI.dispatch(payBill());
        thunkAPI.dispatch(
          showSnackBar({
            message: "Clinic Paybill Edited successfully",
            type: "success",
          })
        );
        return true;
      } else if (res.status === 400) {
        thunkAPI.dispatch(hideLoader());
        thunkAPI.dispatch(
          showSnackBar({
            message: "Clinic Paybill Edited failed",
            type: "error",
          })
        );
      }
      thunkAPI.dispatch(hideLoader());
      return null;
    } catch (err) {
      thunkAPI.dispatch(hideLoader());
      thunkAPI.dispatch(
        showSnackBar({ message: "Clinic Paybill Edit failed", type: "error" })
      );
    }
  }
);

export const bookPetAppointment = createAsyncThunk(
  "bookPetAppointment",
  async (data, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({
        contentType: true,
        auth: true,
      }).post("/clinic/bookpetappointment", data);
      if (res.status === 201) {
        thunkAPI.dispatch(hideLoader());
        thunkAPI.dispatch(
          showSnackBar({
            message: "Pet Book Appointment Added successfully",
            type: "success",
          })
        );
        return true;
      } else if (res.status === 400) {
        thunkAPI.dispatch(hideLoader());
        thunkAPI.dispatch(
          showSnackBar({
            message: "Pet Book Appointment Add failed",
            type: "error",
          })
        );
      }
      thunkAPI.dispatch(hideLoader());
      return null;
    } catch (err) {
      thunkAPI.dispatch(hideLoader());
      thunkAPI.dispatch(
        showSnackBar({
          message: "Pet Book Appointment Add failed",
          type: "error",
        })
      );
    }
  }
);

export const getVetDetailsById = createAsyncThunk(
  "getVetDetailsById",
  async (vetId, thunkAPI) => {
    try {
      thunkAPI.dispatch(showLoader());
      const res = await api({ contentType: true, auth: true }).get(
        `/clinic/doctor/${vetId}`
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
      thunkAPI
        .dispatch
        // showSnackBar({ message: "Hospitals getting failed", type: "error" })
        ();
    }
  }
);

export const clinicSlice = createSlice({
  name: "clinic",
  initialState: {
    hospitals: {
      total: 0,
      hospitals: [],
    },
    locations: [],
    doctors: {},
    appointments: { totalRecords: 0, appointments: [] },
    doctorAppointments: { totalRecords: 0, appointments: [] },
    petAppointments: { totalRecords: 0, appointments: [] },
    medicalOrders: { totalRecords: 0, orders: [] },
    settings: {},
    services: [],
    roles: null,
    unittype: [],
    suppliers: [],
    consulation: null,
    paybill: null,
    products: [],
    appointmentType: [],
    openingHours: [],
    details: {},
    holidays: [],
    termsAndConditions: [],
    dashboard: {},
    vet: {},
    vetUpcomingAppointments: [],
    vetAppointments: [],
    getSlot: [],
    payments: {},
    transactions: [],
    billDetails: [],
  },
  reducers: {
    setConsultation: (state, action) => {
      state.consulation = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getSlotById.fulfilled, (state, action) => {
      state.getSlot = action.payload;
    });

    builder.addCase(getClinics.fulfilled, (state, action) => {
      const payLoad = action.payload;
      state.hospitals = {
        totalRecords: payLoad?.length,
        hospitals: payLoad,
      };
    });
    builder.addCase(getClinicLocations.fulfilled, (state, action) => {
      state.locations = action.payload;
    });
    builder.addCase(getAllClinicPayment.fulfilled, (state, action) => {
      state.payments = action.payload;
    });
    builder.addCase(getRecentTransactionsPayment.fulfilled, (state, action) => {
      state.transactions = action.payload;
    });
    // builder.addCase(addClinic.fulfilled, () => {});
    // builder.addCase(createNewProduct.fulfilled, () => {});
    // builder.addCase(createNewStock.fulfilled, () => {});
    // builder.addCase(updateClinic.fulfilled, () => {});
    builder.addCase(getDoctorsByClinicId.fulfilled, (state, action) => {
      state.doctors = action.payload;
    });
    builder.addCase(getAppointsmentsByClinic.fulfilled, (state, action) => {
      state.appointments = action.payload;
    });
    builder.addCase(getDoctorAppointsmentsById.fulfilled, (state, action) => {
      const payLoad = action.payload;
      state.doctorAppointments = {
        totalRecords: payLoad?.totalRecords,
        appointments: payLoad,
      };
    });
    builder.addCase(
      getVetAppointmentsByIdAndFilter.fulfilled,
      (state, action) => {
        state.vetAppointments = action.payload;
      }
    );
    builder.addCase(getPetAppointsmentsById.fulfilled, (state, action) => {
      const payLoad = action.payload;
      state.petAppointments = {
        totalRecords: payLoad?.totalRecords,
        appointments: payLoad,
      };
    });
    builder.addCase(getMedicalOrdersByClinic.fulfilled, (state, action) => {
      const payLoad = action.payload;
      state.medicalOrders = {
        totalRecords: payLoad?.totalRecords,
        orders: payLoad?.neworders,
      };
    });
    builder.addCase(getClinicTerms.fulfilled, (state, action) => {
      state.termsAndConditions = action.payload;
    });
    builder.addCase(updateClinicOpeningHours.fulfilled, (state, action) => {
      state.settings = action.payload;
    });
    builder.addCase(getProductsByClinic.fulfilled, (state, action) => {
      state.products = action.payload;
    });
    builder.addCase(getStocksByClinic.fulfilled, (state, action) => {
      state.stocks = action.payload;
    });
    builder.addCase(updateClinicHolidays.fulfilled, (state, action) => {
      state.settings = action.payload;
    });
    builder.addCase(getServices.fulfilled, (state, action) => {
      state.services = action.payload;
    });
    builder.addCase(getRolesAndAccess.fulfilled, (state, action) => {
      state.roles = action.payload;
    });
    builder.addCase(getUnitType.fulfilled, (state, action) => {
      state.unittype = action.payload;
    });
    builder.addCase(getSupplier.fulfilled, (state, action) => {
      state.suppliers = action.payload;
    });
    builder.addCase(payBill.fulfilled, (state, action) => {
      state.paybill = action.payload;
    });
    builder.addCase(
      getClinicAppointmentTypesByUserId.fulfilled,
      (state, action) => {
        state.appointmentType = action.payload;
      }
    );
    builder.addCase(getClinicOpeningHours.fulfilled, (state, action) => {
      state.openingHours = action.payload;
    });
    builder.addCase(getClinicDetails.fulfilled, (state, action) => {
      state.details = action.payload;
    });
    builder.addCase(getClinicHolidays.fulfilled, (state, action) => {
      state.holidays = action.payload;
    });
    builder.addCase(getClinicDashboardData.fulfilled, (state, action) => {
      state.dashboard = action.payload;
    });
    builder.addCase(getVetDetailsById.fulfilled, (state, action) => {
      state.vet = action.payload;
    });
    builder.addCase(
      getVetUpcomingAppointmentsById.fulfilled,
      (state, action) => {
        state.vetUpcomingAppointments = action.payload;
      }
    );
    builder.addCase(getBillDetailsByPaymentId.fulfilled, (state, action) => {
      state.billDetails = action.payload;
    });
  },
});

export const { setConsultation } = clinicSlice.actions;

export default clinicSlice.reducer;
