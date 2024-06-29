import { createSlice } from '@reduxjs/toolkit';

export const loaderSlice = createSlice({
    name: "loader",
    initialState: {
      loader: false,
      loadingText: "",
      navWidth: false,
      sideNavVisible: false,
    },
    reducers: {
      showLoader: (state) => {
        state.loader = true;
        // state.loadingText = action.payload;
      },
      hideLoader: (state) => {
        state.loader = false;
      },
      navWidths: (state, action) => {
        state.navWidth = action.payload;
      },
      sideNavVisibles: (state, action) => {
        state.sideNavVisible = action.payload;
      },
    },
  });
  
  export const { showLoader, hideLoader, navWidths, sideNavVisibles } =
    loaderSlice.actions;
  
  export default loaderSlice.reducer;
