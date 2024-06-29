// import { onMessage } from "@firebase/messaging";
import React from // , { useEffect }
"react";
// import { useDispatch } from "react-redux";
import SearchRow from "../../../components/SearchRow/SearchRow";
import TopBar from "../../../components/TopBar/TopBar";
import Header from "../../../layouts/header";
// import { showSnackBar } from "../../../redux/reducers/snackSlice";
// import {
//   enableNotificationService,
//   messaging,
// } from "../../../util/notification";
import "./Home.css";

export function getUrlParams(url = window.location.href) {
  let urlStr = url.split("?")[1];
  return new URLSearchParams(urlStr);
}

const Home = () => {
  // const dispatch = useDispatch();

  // useEffect(() => {
  //   enableNotificationService();
  //   receivePushNotification();
  // }, []);

  // const receivePushNotification = () => {
  //   onMessage(messaging, (payload) => {
  //     // console.log("payload?.notification", payload?.notification?.body);
  //     dispatch(
  //       showSnackBar({
  //         title: payload?.notification?.title,
  //         message: payload?.notification?.body,
  //         type: "notification",
  //       })
  //     );
  //   });
  // };

  return (
    <>
      {/* <Header name="Vetinstant" /> */}
      {/* <TopBar
        name="Home"
        leftBtnTxt="Download"
        rightBtnTxt="Create Pet"
        rightVerBtnShow={false}
      /> */}
      <SearchRow leftBtnTxt="Reset" rightBtnTxt="Search" />
    </>
  );
};

export default Home;
