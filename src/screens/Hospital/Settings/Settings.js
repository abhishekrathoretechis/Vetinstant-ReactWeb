import AddIcon from "@mui/icons-material/Add";
import { Grid } from "@mui/material";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomButton from "../../../components/CustomButton";
import CustomCheckbox from "../../../components/CustomCheckbox";
import CustomModal from "../../../components/CustomModal/CustomModal";
import CustomTextField from "../../../components/CustomTextField";
import CustomUpload from "../../../components/CustomUpload";
import TopBar from "../../../components/TopBar/TopBar";
import Header from "../../../layouts/header";
import {
  getClinicDetails,
  getClinicHolidays,
  getClinicOpeningHours,
  updateClinic,
  updateClinicHolidays,
  updateClinicOpeningHours,
} from "../../../redux/reducers/clinicSlice";
import { profileSettingsDays } from "../../../util/arrayList";
import CommonAccessAndRolesComponent from "../../CommonComponents/CommonAccessAndRolesComponent";
import ClinicConsultation from "../clinicconsultation/ClinicConsultation";
import Services from "../services/Services";
import "./Settings.css";

const holidayObj = { date: new Date(), holliday: "" };

const Settings = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("profile");
  const [holidays, setHolidays] = useState([{ ...holidayObj, i: 0 }]);
  const clinic = useSelector((state) => state.clinic.settings);
  const [dayList, setDayList] = useState(profileSettingsDays);
  const [isOpeningHoursVisible, setOpeningHoursVisible] = useState(false);
  const [addSlotModalVisible, setAddSlotModalVisible] = useState(false);
  const clinicOpeningHours = useSelector(
    (state) => state?.clinic?.openingHours
  );
  const clinicDetails = useSelector((state) => state?.clinic?.details);
  const clinicHolidays = useSelector((state) => state?.clinic?.holidays);
  const [isProfileEdit, setProfileEdit] = useState(false);
  const [fileUploadUrl, setFileUploadUrl] = useState({
    file: null,
    imagePreviewUrl: null,
  });
  const [cliniContact, setClinicContact] = useState("");
  const [clinicName, setClinicName] = useState("");
  const [holidayModalVisible, setHolidayModalVisible] = useState(false);
  const [holidayValue, setHolidayValue] = useState(holidayObj);
  const user = localStorage.getItem("user");
  const profile = JSON.parse(user);

  useEffect(() => {
    if (activeTab === "profile") {
      dispatch(getClinicDetails());
      dispatch(getClinicOpeningHours());
      dispatch(getClinicHolidays());
    }
  }, [activeTab]);

  useEffect(() => {
    setClinicContact(clinicDetails?.mobile);
    setClinicName(clinicDetails?.name);
    setFileUploadUrl({
      ...fileUploadUrl,
      imagePreviewUrl: clinicDetails?.image ?? profile?.image,
    });
  }, [clinicDetails]);

  useEffect(() => {
    getClinicActiveHours(clinicOpeningHours);
  }, [clinicOpeningHours]);

  useEffect(() => {
    getClinicHolidayList(clinicHolidays);
  }, [clinicHolidays]);

  const handleSlotModalVisible = () => {
    setAddSlotModalVisible(!addSlotModalVisible);
  };

  const getClinicHolidayList = (holidayList) => {
    const reqHolidays = holidayList?.map((hd) => {
      return { ...hd };
    });
    setHolidays(reqHolidays);
  };

  const getRequiredTime = (srtTime, enTime) => {
    const [stHr, stMin] = srtTime?.split(":");
    const [edHr, edMin] = enTime?.split(":");
    const strtTime = new Date();
    const endTim = new Date();
    strtTime.setMinutes(stMin);
    strtTime.setHours(stHr);
    strtTime.setSeconds("00");
    strtTime.setMilliseconds("00");

    endTim.setMinutes(edMin);
    endTim.setHours(edHr);
    endTim.setSeconds("00");
    endTim.setMilliseconds("00");
    return { startTime: strtTime, endTime: endTim };
  };

  const getClinicActiveHours = (openingHours) => {
    const reqDayList = profileSettingsDays?.map((day) => {
      const clinicDay = openingHours?.find((hr) => hr?.day === day?.value);
      if (clinicDay) {
        const requiredTime = getRequiredTime(
          clinicDay?.startTime,
          clinicDay?.endTime
        );
        return {
          ...day,
          isSelected: true,
          startTime: requiredTime?.startTime,
          endTime: requiredTime?.endTime,
        };
      }
      return day;
    });
    setDayList(reqDayList);
  };

  const handleOnchange = (e) => {
    setHolidayValue({ ...holidayValue, [e.target.name]: e.target.value });
  };

  const handleOpeningHoursModal = () => {
    setOpeningHoursVisible(!isOpeningHoursVisible);
  };

  const handleModalValuesChange = (name, value, ind) => {
    const reqDays = dayList?.map((day, i) => {
      if (i === ind) {
        return { ...day, [name]: value };
      }
      return day;
    });
    setDayList(reqDays);
  };

  const handleUpdateOpeningHours = async () => {
    const data = [];
    dayList?.forEach((d) => {
      if (d?.isSelected) {
        data.push({
          day: d?.value,
          startTime: moment(new Date(d?.startTime)).format("HH:mm"),
          endTime: moment(new Date(d?.endTime)).format("HH:mm"),
        });
      }
    });
    const apiSuccess = await dispatch(updateClinicOpeningHours(data));
    if (apiSuccess?.payload) handleOpeningHoursModal();
  };

  const handleUpdateHolidays = async () => {
    const data = {
      ...holidayValue,
      date: moment(new Date(holidayValue?.date)).format("YYYY-MM-DD"),
    };
    const apiRes = await dispatch(updateClinicHolidays(data));
    if (apiRes?.payload) {
      dispatch(getClinicHolidays());
      handleHolidayModal();
    }
  };

  const handleProfileEditModal = () => {
    setProfileEdit(!isProfileEdit);
  };

  const handleUpdateClinicProfile = async () => {
    const form = new FormData();
    form.append("name", clinicName);
    form.append("contact", cliniContact);
    if (fileUploadUrl?.file) form.append("image", fileUploadUrl?.file);
    const apiSuccess = await dispatch(updateClinic(form));
    if (apiSuccess?.payload) handleProfileEditModal();
  };

  const onUploadFile = (e) => {
    const reader = new FileReader();
    const file = e.target.files[0];
    reader.onloadend = () => {
      setFileUploadUrl({
        file: e.target.files[0],
        imagePreviewUrl: reader.result,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleHolidayModal = () => {
    setHolidayValue(holidayObj);
    setHolidayModalVisible(!holidayModalVisible);
  };

  return (
    <>
      
      {/* <TopBar
        name="Settings"
        leftBtnTxt="Download"
        rightBtnTxt="Manage Settings"
        rightVerBtnShow={false}
      /> */}
      <div className="com-mar">
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <div className="con-p5-mh80vh">
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <div className="tab-sty">
                <div
                  className={`${
                    activeTab === "profile" ? "tab-active-btn" : "tab-txt"
                  } cursor`}
                  onClick={() => setActiveTab("profile")}
                >
                  Profile
                </div>
                <div
                  className={`${
                    activeTab === "consultation" ? "tab-active-btn" : "tab-txt"
                  } cursor`}
                  onClick={() => setActiveTab("consultation")}
                >
                  Consultation
                </div>
                <div
                  className={`${
                    activeTab === "services" ? "tab-active-btn" : "tab-txt"
                  } cursor`}
                  onClick={() => setActiveTab("services")}
                >
                  Services
                </div>
                <div
                  className={`${
                    activeTab === "accessAndRoles"
                      ? "tab-active-btn"
                      : "tab-txt"
                  } cursor`}
                  onClick={() => setActiveTab("accessAndRoles")}
                >
                  Access and Roles
                </div>
              </div>
            </Grid>
            {activeTab === "profile" ? (
              <Grid container spacing={0} direction="row" className="mt15">
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                  <div className="settings-left-con">
                    <div className="p10">
                      <div className="settings-box">
                        <div className="flex-row mh10">
                          <div className="flex-start">
                            {profile?.image ? (
                              <img
                                src={profile?.image ?? clinicDetails?.image}
                                alt={profile?.image ?? clinicDetails?.image}
                                className="settings-img"
                              />
                            ) : (
                              <div className="detail-empty-img" />
                            )}
                          </div>
                          <div className="flex1-start-end">
                            <img
                              src={
                                require("../../../assets/images/svg/editIcon.svg")
                                  .default
                              }
                              alt="myIcon"
                              className="cursor"
                              onClick={handleProfileEditModal}
                            />
                          </div>
                        </div>
                        <div className="flex-row mh10 mt10">
                          <div className="w50Per">
                            <div className="flex-column">
                              <div className="font-bold fs14">Clinic Name</div>
                              <div className="font-medium fs14">
                                {profile?.name ?? clinicDetails?.name}
                              </div>
                              <div className="font-bold fs14 mt10">
                                Administrator Contact
                              </div>
                              <div className="font-medium fs14">
                                {profile?.mobile ?? clinicDetails?.mobile}
                              </div>
                            </div>
                          </div>
                          <div className="w50Per">
                            <div className="flex-column">
                              <div className="font-bold fs14">Location</div>
                              <div className="font-medium fs14">
                                {profile?.location ?? clinicDetails?.location}
                              </div>
                              <div className="font-bold fs14 mt10">Email</div>
                              <div className="font-medium fs14">
                                {profile?.email ?? clinicDetails?.email}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="settings-box mt20">
                        <div className="flex-row mh10">
                          <div className="font-bold fs16 blue-color">
                            Operating Hours:
                          </div>
                          <div className="flex1-end">
                            <img
                              src={
                                require("../../../assets/images/svg/editIcon.svg")
                                  .default
                              }
                              alt="myIcon"
                              className="cursor"
                              onClick={handleOpeningHoursModal}
                            />
                          </div>
                        </div>
                        <div className="flex-row mh10">
                          <div className="w30Per jus-cen">
                            <div className="flex-column mb10">
                              {dayList.map((day, i) => (
                                <div
                                  className={`font-medium fs14 mt10 ${
                                    !day?.isSelected && "opacity-point3"
                                  }`}
                                  key={i}
                                >
                                  {day?.name}
                                </div>
                              ))}
                            </div>
                          </div>
                          <div className="w50Per">
                            <div className="flex-column mb10">
                              {dayList.map((day, i) => (
                                <div
                                  className={`flex-row jus-con-spa-even mt10 ${
                                    !day?.isSelected && "opacity-point3"
                                  }`}
                                  key={i}
                                >
                                  <div className="font-medium fs14">
                                    {!day?.isSelected
                                      ? "00:00"
                                      : moment(day?.startTime).format("HH:mm")}
                                  </div>
                                  <div className="font-medium fs14">-</div>
                                  <div className="font-medium fs14">
                                    {!day?.isSelected
                                      ? "00:00"
                                      : moment(day?.endTime).format("HH:mm")}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                  <div className="settings-right-con">
                    <div className="p10">
                      <div className="flex-row align-center-wh">
                        <div className="font-bold fs16 blue-color">
                          Holiday calendar:
                        </div>
                        <div
                          className="flex-center cursor"
                          onClick={() => setHolidayModalVisible(true)}
                        >
                          <AddIcon color="disabled" />
                        </div>
                      </div>
                      <div className="mv10">
                        <div className="flex-row">
                          <div className="w30Per font-bold fs14 blue-color">
                            Date
                          </div>
                          <div className="w70Per font-bold fs14 blue-color">
                            Occasion
                          </div>
                        </div>
                        {holidays?.map((hol, i) => (
                          <div key={i}>
                            <div className="flex-row mt10">
                              <div className="w30Per ph5">
                                <CustomTextField
                                  name="date"
                                  fullWidth
                                  mobileDate
                                  value={hol?.date}
                                  disabled
                                />
                              </div>
                              <div className="w70Per ph5">
                                <CustomTextField
                                  name="holliday"
                                  fullWidth
                                  placeholder="Add Description"
                                  value={hol?.holliday}
                                  disabled
                                />
                              </div>
                            </div>
                            <div className="line-bar" />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Grid>
              </Grid>
            ) : null}

            {activeTab === "accessAndRoles" ? (
              <CommonAccessAndRolesComponent />
            ) : null}

            {activeTab === "consultation" ? (
              <Grid container spacing={0}>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                  <ClinicConsultation openModal={handleSlotModalVisible} />
                </Grid>
              </Grid>
            ) : null}

            {activeTab === "services" ? <Services /> : null}
          </div>
        </Grid>
      </div>

      <CustomModal
        open={isProfileEdit}
        onClose={handleProfileEditModal}
        header="Clinic Profile"
        headerCenter
        modal
        modalWidth={40}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <CustomUpload
              uploadText={"Tab to add a profile picture"}
              onUploadFile={onUploadFile}
              value={
                fileUploadUrl?.imagePreviewUrl ??
                clinic?.image ??
                profile?.image ??
                clinicDetails?.image
              }
              center
              imageHeight={75}
            />
          </Grid>
          <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
            <CustomTextField
              placeholder="Clinic Name"
              label="Clinic Name"
              name="clinicName"
              fullWidth
              handleChange={(e) => setClinicName(e.target.value)}
              value={clinicName ?? clinic?.name}
            />
          </Grid>
          <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
            <CustomTextField
              placeholder="Location"
              label="Location"
              name="location"
              fullWidth
              value={clinicDetails?.location}
              disabled
            />
          </Grid>
          <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
            <CustomTextField
              placeholder="Administrator Contact"
              label="Administrator Contact"
              name="adminContact"
              fullWidth
              handleChange={(e) => setClinicContact(e.target.value)}
              value={cliniContact ?? clinic?.contact}
            />
          </Grid>
          <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
            <CustomTextField
              placeholder="Email"
              label="Email"
              name="email"
              fullWidth
              value={clinicDetails?.email}
              disabled
            />
          </Grid>
        </Grid>

        <div className="flex-center mt10">
          <div className="w20Per">
            <CustomButton
              text="Cancel"
              grayBtn
              onClick={handleProfileEditModal}
            />
          </div>
          <div className="w20Per mh10">
            <CustomButton text="Apply" onClick={handleUpdateClinicProfile} />
          </div>
        </div>
      </CustomModal>
      <CustomModal
        open={isOpeningHoursVisible}
        onClose={handleOpeningHoursModal}
        header="Opening Hours"
        headerCenter
        modal
        modalWidth={40}
      >
        {dayList?.map((day, i) => (
          <Grid container key={i} className="mv5 ">
            <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
              <CustomCheckbox
                label={day?.name}
                checked={day?.isSelected}
                name="isSelected"
                onChange={(e) =>
                  handleModalValuesChange("isSelected", !day?.isSelected, i)
                }
              />
            </Grid>
            <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
              <div className="mh5">
                <CustomTextField
                  placeholder="startTime"
                  name="startTime"
                  fullWidth
                  handleChange={(e) => {
                    handleModalValuesChange(e.target.name, e.target.value, i);
                  }}
                  value={day?.startTime}
                  mobileTime
                  is12HourFomat={false}
                />
              </div>
            </Grid>
            <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
              <div className="mh5">
                <CustomTextField
                  placeholder="endTime"
                  name="endTime"
                  fullWidth
                  handleChange={(e) => {
                    handleModalValuesChange(e.target.name, e.target.value, i);
                  }}
                  value={day?.endTime}
                  mobileTime
                  is12HourFomat={false}
                />
              </div>
            </Grid>
          </Grid>
        ))}
        <div className="flex-center mt10">
          <div className="w20Per">
            <CustomButton
              text="Cancel"
              grayBtn
              onClick={handleOpeningHoursModal}
            />
          </div>
          <div className="w20Per mh10">
            <CustomButton text="Apply" onClick={handleUpdateOpeningHours} />
          </div>
        </div>
      </CustomModal>
      <CustomModal
        open={holidayModalVisible}
        onClose={handleHolidayModal}
        header="Add Holiday"
        headerCenter
        modal
        modalWidth={40}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <CustomTextField
              name="date"
              fullWidth
              mobileDate
              value={holidayValue?.date}
              handleChange={(e) => handleOnchange(e)}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <CustomTextField
              name="holliday"
              fullWidth
              placeholder="Add Description"
              value={holidayValue?.holliday}
              handleChange={(e) => handleOnchange(e)}
            />
          </Grid>
        </Grid>
        <div className="flex-center mt10">
          <div className="w20Per">
            <CustomButton text="Cancel" grayBtn onClick={handleHolidayModal} />
          </div>
          <div className="w20Per mh10">
            <CustomButton
              text="Apply"
              disabled={holidayValue?.holliday?.length === 0}
              onClick={handleUpdateHolidays}
            />
          </div>
        </div>
      </CustomModal>
    </>
  );
};

export default Settings;
