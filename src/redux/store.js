import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./reducers/authSlice";
import clinicSlice from "./reducers/clinicSlice";
import loaderSlice from "./reducers/loaderSlice";
import petSlice from "./reducers/petSlice";
import snackSlice from "./reducers/snackSlice";
import vetSlice from "./reducers/vetSlice";
import paymentSlice from "./reducers/paymentSlice";
import doctorSlice from "./reducers/doctorSlice";
import medicalHistorySlice from "./reducers/medicalHistorySlice";
import notificationSlice from "./reducers/notificationSlice";
import mixedSlice from "./reducers/mixedSlice";

const reducer = {
  auth: authSlice,
  loader: loaderSlice,
  snack: snackSlice,
  clinic: clinicSlice,
  pet: petSlice,
  vet: vetSlice,
  payment: paymentSlice,
  doctor: doctorSlice,
  medicalHistory: medicalHistorySlice,
  notification: notificationSlice,
  mixed: mixedSlice,
};

export default configureStore({
  reducer,
});
