import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import "./App.css";
import Snackbar from "./components/CustomSnackbar/CustomSnackbar";
import Loader from "./components/Loader";
import { navWidths } from "./redux/reducers/loaderSlice";
import Router from "./routes/Router";
import ThemeProvider from "./theme";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(navWidths(false));
  }, []);

  return (
    <>
      <Loader />
      <ThemeProvider>
        <Router />
        <Snackbar />
      </ThemeProvider>
    </>
  );
};

export default App;
