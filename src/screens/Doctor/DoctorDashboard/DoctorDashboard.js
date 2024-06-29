// import { onMessage } from "@firebase/messaging";
import { Divider, Grid } from "@mui/material";
import moment from "moment";
import { useEffect, useState } from "react";
import Calendar from "react-awesome-calendar";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import TopBar from "../../../components/TopBar/TopBar";
import socket from "../../../components/socket";
import Header from "../../../layouts/header";
// import { showSnackBar } from "../../../redux/reducers/snackSlice";
import { getVetDashboardDetails } from "../../../redux/reducers/vetSlice";
import { AppColors } from "../../../util/AppColors";
// import {
//   enableNotificationService,
//   messaging,
// } from "../../../util/notification";
import "./DoctorDashboard.css";
import api from "../../../redux/actions/api";

const DoctorDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const vetId = localStorage.getItem("userId");
  const [calendarEvents, setCalendarEvents] = useState([]);
  const dashboard = useSelector((state) => state?.vet?.dashboard);

  useEffect(() => {
    checkLocalStorageforReload();
    dispatch(getVetDashboardDetails());
    getProfile();
    // enableNotificationService();
    // receivePushNotification();

    //socket events
    socket.on("pendingCall", (data) => {
      if (
        data?.info === "callCreated" ||
        data?.info === "checkInDone" ||
        data?.info === "prescriptionAdded" ||
        data?.info === "callInDone" ||
        data?.info === "callRejected"
      ) {
        if (data?.doctorId === vetId) {
          dispatch(getVetDashboardDetails());
        }
      }
    });
  }, []);

  useEffect(() => {
    setAllAppointmentsInCalendar(dashboard?.appointments);
  }, [dashboard?.appointments]);

  const getProfile = async() => {
    const res = await api({ contentType: true, auth: true }).get('/user/me')
    localStorage.setItem("user", JSON.stringify(res.data.data));
  }

  const checkLocalStorageforReload = async () => {
    const videoCallPageReloaded = await JSON.parse(
      localStorage.getItem("videoCallPageReloaded")
    );
    if (videoCallPageReloaded) {
      navigate("/vet-appointment-details", {
        state: {
          ...videoCallPageReloaded?.state,
          activeTab: videoCallPageReloaded?.activeTab ?? "",
        },
      });
      return await localStorage.removeItem("videoCallPageReloaded");
    }
  };

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

  const setAllAppointmentsInCalendar = (callList) => {
    const reqData = callList?.map((call) => {
      const reqFrom = new Date(call?.extraInfo).setHours(
        moment(call?.extraInfo).format("HH"),
        moment(call?.extraInfo).format("mm")
      );
      const reqFromFormat = moment(reqFrom).format("YYYY-MM-DDTHH:mm:00+00:00");

      return {
        id: call?._id,
        color: AppColors.appPrimary,
        from: reqFromFormat,
        to: reqFromFormat,
        title: `${moment(call?.extraInfo).format("HH:mm")} ${
          call?.appointmentType
        }`,
      };
    });
    setCalendarEvents(reqData);
  };

  const handleClickEvent = (evetId) => {
    const reqEvent = dashboard?.appointments?.find((li) => li?._id === evetId);
    if (reqEvent) {
      navigate("/vet-appointment-details", {
        state: { _id: reqEvent?._id },
      });
    }
  };

  return (
    <>
      <Header name="Vetinstant" />
      <TopBar name="Dashboard" rightVerBtnShow={false} />
      <div className="com-mar">
        <Grid container spacing={1}>
          <Grid item xs={12} sm={12} md={12} lg={4} xl={4}>
            <Grid container spacing={1}>
              <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                <div className="DocDash-count-card">
                  <div className="text-bold-12 gray-color">Total Patients</div>
                  <div className="bold-font30 blue-color mt10">
                    {dashboard?.totalPets}
                  </div>
                </div>
              </Grid>
              <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                <div className="DocDash-count-card">
                  <div className="text-bold-12 gray-color">Total Appointments</div>
                  <div className="bold-font30 blue-color mt10">
                    {dashboard?.totalAppointments}
                  </div>
                </div>
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <div className="DocDash-left-card mt10">
                  <div className="flex-row">
                    <div className="flex-start font-bold black fs18">
                      Upcoming Appointments
                    </div>
                    <div className="flex-end flex1 gray2 fs18 txt-semi-bold">
                      Today
                    </div>
                  </div>
                  {dashboard?.upcomingAppointments?.length > 0 ? (
                    dashboard?.upcomingAppointments?.map((call, i) => (
                      <div
                        key={i}
                        className="cursor"
                        onClick={() => {
                          navigate("/vet-appointment-details", {
                            state: { _id: call?._id },
                          });
                        }}
                      >
                        <div className="flex-row mv20">
                          <div className="w70Per">
                            <div className="mv2 txt-semi-bold black fs16">
                              Pet name : {call?.petName}
                            </div>
                            <div className="mv2 fs14 txt-regular gray3">
                              Pet parent name : {call?.userName}
                            </div>
                          </div>
                          <div className="w30Per flex-end">
                            <div className="flex-center txt-semi-bold fs18 blue-color">
                              {moment(call?.extraInfo).format("HH:mm")}
                            </div>
                          </div>
                        </div>
                        <Divider />
                      </div>
                    ))
                  ) : (
                    <div className="DocDash-no-rec text">No upcoming calls</div>
                  )}
                </div>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={8} xl={8}>
            <div className="DocDash-cal">
              <Calendar
                events={calendarEvents}
                onClickEvent={(e) => handleClickEvent(e)}
                // onChange={(e) => console.log("BHBHB", e)}
              />
            </div>
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default DoctorDashboard;
