import { createSlice } from "@reduxjs/toolkit";

export const snackSlice = createSlice({
  name: "snack",
  initialState: {
    title: "",
    message: "",
    successSnackbarOpen: false,
    errorSnackbarOpen: false,
    infoSnackbarOpen: false,
    warningSnackbarOpen: false,
    notificationSnackbarOpen: false,
    severity: "",
  },
  reducers: {
    showSnackBar: (state, payload) => {
      const payLoad = payload?.payload;
      const snackOpenType =
        payLoad?.type === "success"
          ? "successSnackbarOpen"
          : payLoad?.type === "error"
          ? "errorSnackbarOpen"
          : payLoad?.type === "info"
          ? "infoSnackbarOpen"
          : payLoad?.type === "warning"
          ? "warningSnackbarOpen"
          : payLoad?.type === "notification"
          ? "notificationSnackbarOpen"
          : null;
      state[snackOpenType] = true;
      state.title = payLoad?.title;
      state.message = payLoad?.message;
      state.severity =
        payLoad?.type === "notification" ? "info" : payLoad?.type; //severity type list success,error,info,warning
    },
    snackClear: (state) => {
      state.title = "";
      state.message = "";
      state.successSnackbarOpen = false;
      state.errorSnackbarOpen = false;
      state.infoSnackbarOpen = false;
      state.warningSnackbarOpen = false;
      state.notificationSnackbarOpen = false;
      state.severity = "";
    },
  },
});
export const { showSnackBar, snackClear } = snackSlice.actions;

export default snackSlice.reducer;
