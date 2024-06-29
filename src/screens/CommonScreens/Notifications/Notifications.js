import React, { useEffect } from "react";
import TopBar from "../../../components/TopBar/TopBar";
import Header from "../../../layouts/header";
import { useDispatch, useSelector } from "react-redux";
import { getNotificationsByUserId } from "../../../redux/reducers/mixedSlice";
import "./Notification.css";
import moment from "moment";

const Notifications = () => {
  const dispatch = useDispatch();
  const userId = localStorage.getItem("userId");
  const notifications = useSelector((state) => state?.mixed?.notifications);

  useEffect(() => {
    dispatch(getNotificationsByUserId(userId));
  }, []);

  return (
    <>
      <Header name="Vetinstant" />
      <TopBar name="Notifications" rightVerBtnShow={false} />
      <div className="com-mar">
        <div className="con-white-wmh">
          {notifications?.length > 0 ? (
            notifications?.map((not, i) => (
              <div className="flex-row-ali-cen mv10" key={i}>
                <div className="not-right-con">
                  <div className="flex-row">
                    <div className="flex-center">
                      <img
                        src={"https://picsum.photos/200"}
                        alt={"https://picsum.photos/200"}
                        className="not-img"
                      />
                    </div>
                    <div className="flex-start align-center-wh ml15">
                      <div className="flex-column">
                        <div className="font-bold fs14 blue-color">
                          {not?.title}
                        </div>
                        <div className="font-medium fs12">{not?.message}</div>
                        <div className="font-bold fs16 blue-color">View</div>
                      </div>
                    </div>
                    <div className="flex1-end">
                      <div className="not-right-box">
                        <div className="text-bold-12 white-color just-cen">
                          {moment(
                            not?.appointmentTime ?? not?.createdAt
                          ).format("Do MMM,")}
                        </div>
                        <div className="text-bold-12 white-color just-cen">
                          {moment(
                            not?.appointmentTime ?? not?.createdAt
                          ).format("dddd,")}
                        </div>
                        <div className="text-bold-12 white-color just-cen">
                          {moment(
                            not?.appointmentTime ?? not?.createdAt
                          ).format("HH:mm")}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-record">No notification available</div>
          )}
        </div>
      </div>
    </>
  );
};

export default Notifications;
