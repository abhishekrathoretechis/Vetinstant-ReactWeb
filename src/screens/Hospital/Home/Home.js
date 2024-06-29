import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import TopBar from "../../../components/TopBar/TopBar";
import { useNavigate } from "react-router-dom";
import CustomCard from "../../../components/CustomCard/CustomCard";
import api from "../../../redux/actions/api";
import "./Home.css";
import { Typography, Container, Grid, Card, CardMedia } from "@mui/material";
import Button from "../../../components/CustomButton";
import Select from "../../../components/Select/Select";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";

import {
  checkedInApi,
  clinicRescheduleAppointment,
  getClinicDashboardData,
  updateCancel,
  updateCheckedIn,
  updateCompleted,
  updateConsult,
  checkedCallInApi,
  updateFinalize,
} from "../../../redux/reducers/clinicSlice";
import { getClinicVets } from "../../../redux/reducers/vetSlice";
import { AppColors } from "../../../util/AppColors";
import CustomModal from "../../../components/CustomModal/CustomModal";
import CustomTextField from "../../../components/CustomTextField";
import CustomButton from "../../../components/CustomButton";
import ClinicPetBookAppointment from "../ClinicPets/ClinicPetBookAppointment";
import moment from "moment";
import {
  serviceType,
  typeAppointemnt,
  typeList,
  typeListNew,
} from "../../../util/dropList";
import { conditionList } from "../../../util/arrayList";
import CustomCheckbox from "../../../components/CustomCheckbox";
import CalenderComponent from "../ClinicPets/CalenderComponent";
import { getSlotTime } from "../../../redux/reducers/petSlice";

const initialValues = {
  typeOfAppointment: "Phone",
  serviceType: "Consultation",
  consultationType: "Virtual",
  reason: "",
  vetName: "",
  dob: "",
};

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const slotList = useSelector((state) => state.pet.slotList);
  const activeSlotList = slotList?.filter((status) => status.status == "Y");
  const [selectedTab, setSelectedTab] = useState("Outpatient");
  const dashboard = useSelector((state) => state.clinic.dashboard);
  const [rescheduleData, setRescheduleData] = useState(null);
  const [petValues, setPetValues] = useState(initialValues);
  const [selectedDateError, setSelectedDateError] = useState(false);
  const [doctorId, setDoctorId] = useState(null);
  const [book, setBook] = useState(false);

  const [modalData, setModalData] = useState(null);
  console.log("modalData----->", modalData);

  const [appId, setAppId] = useState(null);

  const clinicVets = useSelector((state) => state.vet.vets);
  const [vets, setVets] = useState([]);
  // console.log('vets------>',vets)
  // const [newVets, setNewVets] = useState(vets);
  const newItem = {
    name: "All",
    value: "All",
    id: 1,
  };

  // Adding the new item to the beginning of the array
  const updatedData = [newItem, ...vets];

  const [selectedVet, setSelectedVet] = useState("All");
  const [selectTime, setSelectTime] = useState();

  const [selectTimeId, setSelectTimeId] = useState("");
  const [delModVisible, setDelModVisible] = useState(false);
  const [payModalVisible, setPayModalVisible] = useState(false);
  const [payModalVisibleFollowUp, setPayModalVisibleFollowUp] = useState(false);
  const [selectTimeIdError, setSelectTimeIdError] = useState(false);
  const [payModalVisibleReassign, setPayModalVisibleReassign] = useState(false);
  const [conMode, setConMode] = useState(null);

  const [serType, setSerType] = useState(null);
  const [reason, setReason] = useState(null);
  const [bookingType, setBookingType] = useState("Walk-in");

  const [modalBookVisible, setModalBookVisible] = useState(false);
  const [selectPet, setSelectPet] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [doctor, setDoctor] = useState(modalData?.appoinment?.doctorName);

  const [selectedVetId, setSelectedVetId] = useState(null);
  const [appointmentError, setAppointmentError] = useState(false);
  const [appointmentOption, setAppointmentOption] = useState("Immediate");
  const [selectedDate, setSelectedDate] = useState("");

  const [errors, setErrors] = useState({
    appointmentDate: "",
    appointmentTime: "",
    doctor: "",
  });

  useEffect(() => {
    checkLocalStorageforReload();
    getProfile(); // get and store user details
    dispatch(getClinicDashboardData(selectedTab));
    dispatch(getClinicVets());
  }, []);

  useEffect(() => {
    const reqVetList = clinicVets?.map((vet) => {
      return { name: vet?.name, value: vet?.name, id: vet?.doctorId };
    });
    setVets([...reqVetList]);
  }, [clinicVets]);

  // useEffect(() => {
  //   const newData = [{ name: "All", value: "All", id: 1 }, ...vets];
  //   setNewVets(newData);
  // }, []);

  useEffect(() => {
    // Refetch the dashboard data whenever the selected veterinarian changes
    dispatch(getClinicDashboardData(selectedTab));
  }, [selectedVet]);

  const createModalOpen = (li) => {
    setPayModalVisible(!payModalVisible);
    setAppId(li?.appoinment?.appoimentId);
    setDoctorId(li?.appoinment?.doctorId);
    setRescheduleData(li);
    setModalData(li);
  };

  const createModalOpenFollowUp = (li) => {
    setPayModalVisibleFollowUp(!payModalVisibleFollowUp);
    setAppId(li?.appoinment?.appoimentId);
    setDoctorId(li?.appoinment?.doctorId);
    setRescheduleData(li);
    setModalData(li);
    setConMode(li?.appoinment?.appoinmentType);
    setReason(li?.appoinment?.reason);
    setSerType(li?.appoinment?.appoinmentStatus);
  };
  const handleAppointmentOptionChange = (event) => {
    setAppointmentOption(event.target.value);
    setAppointmentError(false);
  };

  const handleDelModClose = (li) => {
    setDelModVisible(!delModVisible);
    setAppId(li?.appoinment?.appoimentId);
  };
  const handleSelectTime = (time) => {
    setSelectTime(time?.time);
    setSelectTimeId(time?.slotTimeId);
    setSelectTimeIdError(false);
  };

  const handleDateClick = (day, vetId = null, appType = null) => {
    // setSelectedDateError(false);
    // setSelectedDate(day);
    const date = moment(new Date(day)).format("YYYY-MM-DD");
    const doctorId = selectedVetId ?? vetId;
    // console.log("selectPet", petValues);
    const contType = appType ?? petValues?.consultationType;

    const metaData = { doctorId, contType, date };
    dispatch(getSlotTime(metaData));
  };

  const createModalOpenReassign = (li) => {
    setPayModalVisibleReassign(!payModalVisibleReassign);
    // setAppId(li?.appoinment?.appoimentId);
  };

  const validateFields = () => {
    const newErrors = {};
    // if (!appointmentDate) newErrors.appointmentDate = "This field is required";
    // if (!appointmentTime) newErrors.appointmentTime = "This field is required";
    if (!doctor) newErrors.doctor = "This field is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const checkLocalStorageforReload = async () => {
    const videoCallPageReloaded = await JSON.parse(
      localStorage.getItem("videoCallPageReloaded")
    );
    if (videoCallPageReloaded) {
      navigate(`/clinic-pet-details`, {
        state: { appointment: { appoinment: videoCallPageReloaded?.state } },
      });
      return await localStorage.removeItem("videoCallPageReloaded");
    }
  };

  const getProfile = async () => {
    const res = await api({ contentType: true, auth: true }).get(
      "/user/profile"
    );
    localStorage.setItem("user", JSON.stringify(res.data.data));
  };

  const navigatePetDetailsScreen = (appointment, title) => {
    navigate(`/clinic-pet-details`, { state: { appointment, title } });
  };

  const filterAppointmentsByVet = (appointments) =>
    selectedVet === "All"
      ? appointments
      : appointments.filter(
          (item) => item?.appoinment?.doctorName === selectedVet
        );

  const filterAppointments = (data, type) =>
    data.filter((item) => item.appoinment.appoinmentType === type);

  const renderSection = (
    title,
    data,
    colorClass,
    sectionType,
    checkIn,
    threedots
  ) => (
    <div className="w20Per borderRight">
      <div className="flex-row">
        <div className="p10MinWid99Per ">
          <Typography
            variant="h6"
            className={`card-head-${colorClass}-color card-head-border-bottom-${colorClass} font-bold fs20`}
          >
            {title} ({data?.length ?? 0})
          </Typography>
          <CustomCard
            list={data ?? []}
            dashboard
            // topBarClassName={`card-top-${colorClass}-color`}
            sectionType={sectionType}
            onClickResch={(li) => createModalOpen(li)}
            onReassign={(li) => createModalOpen(li)}
            handleAction={(li) => handleAction(li)}
            handleCancel={(li) => handleDelModClose(li)}
            handleCompleted={(li) => handleCompleted(li)}
            onFollowUp={(li) => {
              createModalOpenFollowUp(li);
            }}
            onClick={(li) => navigatePetDetailsScreen(li, title)}
            checkIn={checkIn}
            threedots={threedots}
            handleConsult={(li) => handleConsult(li)}
            handleCheckout={(li) => handleCheckout(li)}
          />
        </div>
      </div>
    </div>
  );

  const upcomingAppointments = filterAppointmentsByVet(
    dashboard?.upcomming || []
  );
  const checkedInAppointments = filterAppointmentsByVet(
    dashboard?.checkedin || []
  );
  const consultationAppointments = filterAppointmentsByVet(
    dashboard?.consultation || []
  );
  const completedAppointments = filterAppointmentsByVet(
    dashboard?.completed || []
  );
  const billingAppointments = filterAppointmentsByVet(
    dashboard?.billings || []
  );

  const handleAction = (li, action) => {
    // setSelectPet(li?.appoinment);
    // dispatch(updateCheckedIn(li?.appoinment?.appoimentId));
    // dispatch(getClinicDashboardData());
    // setModalBookVisible(true);

    const data = {
      appointmentId: li?.appoinment?.appoimentId,
      doctorId: li?.appoinment?.doctorId,
    };

    dispatch(checkedInApi(data)).then((res) => {
      console.log("Response------>", res);
      if (res.meta.requestStatus === "fulfilled") {
        checkLocalStorageforReload();
        getProfile(); // get and store user details
        dispatch(getClinicDashboardData(selectedTab));
        dispatch(getClinicVets());
      }
    });
  };
  const handleCancel = (li, action) => {
    dispatch(updateCancel(appId)).then((res) => {
      if (res?.meta?.requestStatus === "fulfilled") {
        setDelModVisible(false);
        setPayModalVisible(false);
        setAppointmentDate(null);
        setAppointmentTime(null);
        checkLocalStorageforReload();
        getProfile(); // get and store user details
        dispatch(getClinicDashboardData(selectedTab));
        dispatch(getClinicVets());
      }
    });
    // dispatch(getClinicDashboardData(selectedTab));
  };

  const handleConsult = (li, action) => {
    const data = {
      appointmentId: li?.appoinment?.appoimentId,
      doctorId: li?.appoinment?.doctorId,
    };
    dispatch(checkedCallInApi(data)).then((res) => {
      if (res?.meta?.requestStatus === "fulfilled") {
        checkLocalStorageforReload();
        getProfile(); // get and store user details
        dispatch(getClinicDashboardData(selectedTab));
        dispatch(getClinicVets());
      }
    });
    // dispatch(getClinicDashboardData(selectedTab));
  };

  const handleCompleted = (li, action) => {
    dispatch(updateFinalize(li?.appoinment?.appoimentId)).then((res) => {
      if (res?.meta?.requestStatus === "fulfilled") {
        checkLocalStorageforReload();
        getProfile(); // get and store user details
        dispatch(getClinicDashboardData(selectedTab));
        dispatch(getClinicVets());
      }
    });
    // dispatch(getClinicDashboardData(selectedTab));
  };

  const handleCheckout = (li, action) => {
    dispatch(updateCompleted(li?.appoinment?.appoimentId)).then((res) => {
      if (res?.meta?.requestStatus === "fulfilled") {
        checkLocalStorageforReload();
        getProfile(); // get and store user details
        dispatch(getClinicDashboardData(selectedTab));
        dispatch(getClinicVets());
      }
    });
    // dispatch(getClinicDashboardData(selectedTab));
  };

  const handleReschedule = () => {
    if (!validateFields()) return;
    const data = {
      // appointmentDate: moment(selectedDate).format("YYYY-MM-DD"),
      appointmentDate: moment(petValues?.dob).format("YYYY-MM-DD"),
      appoimentTime: selectTime,
      doctorId: selectedVetId,
    };

    const appointmentId = appId;

    const metaData = { appointmentId, data };
    dispatch(clinicRescheduleAppointment(metaData)).then((res) => {
      if (res?.meta?.requestStatus === "fulfilled") {
        setPayModalVisible(false);
        setAppointmentDate(null);
        setAppointmentTime(null);

        setDoctor(null);
        setAppointmentDate(null);
        setAppointmentTime(null);
      }
    });
  };
  const handleChange = (e) => {
    setPetValues({ ...petValues, [e.target.name]: e.target.value });
  };
  return (
    <>
      <TopBar>
        <Container maxWidth="xl">
          <Grid container spacing={0} className="flex-center">
            <Grid item xs={8} sm={8} md={8} lg={8} xl={8}>
              <Grid container spacing={0}>
                <Grid item xs={4} sm={4} md={2} lg={2} xl={2}>
                  <Button
                    text="Outpatient"
                    tabSelectdBtn={selectedTab === "Outpatient"}
                    textBtn={selectedTab !== "Outpatient"}
                    onClick={() => {
                      setSelectedTab("Outpatient");
                      dispatch(getClinicDashboardData("Outpatient"));
                    }}
                    color={AppColors.grayBtn2}
                  />
                </Grid>
                <Grid item xs={4} sm={4} md={2} lg={2} xl={2}>
                  <Button
                    text="Virtual"
                    tabSelectdBtn={selectedTab === "Virtual"}
                    textBtn={selectedTab !== "Virtual"}
                    onClick={() => {
                      setSelectedTab("Virtual");
                      dispatch(getClinicDashboardData("Virtual"));
                    }}
                    color={AppColors.grayBtn2}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
              <div className="flex1-end">
                <Grid item xs={8} sm={8} md={8} lg={8} xl={8}>
                  <Select
                    list={updatedData}
                    name="doctorList"
                    value={selectedVet}
                    handleChange={(e) => {
                      const selectedVet = vets.find(
                        (vet) => vet.value === e.target.value
                      );
                      setSelectedVet(e.target.value);
                      setSelectedVetId(
                        selectedVet && selectedVet.value !== "All"
                          ? selectedVet.id
                          : null
                      );
                    }}
                    select
                  />
                </Grid>
              </div>
            </Grid>
          </Grid>
        </Container>
      </TopBar>
      <div className="mv20">
        <Container maxWidth="xl">
          <div className="flex-center">
            {selectedTab === "Outpatient" && (
              <>
                {renderSection(
                  "Upcoming",
                  upcomingAppointments,
                  "orange",
                  "Upcoming",
                  true,
                  true
                )}
                {renderSection(
                  "Checked-in",
                  checkedInAppointments,
                  "rose",
                  "Checked-in",
                  true,
                  true
                )}
                {renderSection(
                  "Consultation",
                  consultationAppointments,
                  "green",
                  "Consultation",
                  true,
                  true
                )}
                {renderSection(
                  "Billing",
                  billingAppointments,
                  "yellow",
                  "Billing",
                  true,
                  true
                )}
                {renderSection(
                  "Completed",
                  completedAppointments,
                  "paleGreen",
                  "Completed",
                  true,
                  true
                )}
              </>
            )}
            {selectedTab === "Virtual" && (
              <>
                {renderSection(
                  "Upcoming",
                  filterAppointments(upcomingAppointments, "Virtual"),
                  "orange",
                  "Upcoming",
                  false,
                  false
                )}
                {renderSection(
                  "Consultation",
                  filterAppointments(consultationAppointments, "Virtual"),
                  "green",
                  "Consultation",
                  false,
                  false
                )}
                {renderSection(
                  "Completed",
                  filterAppointments(completedAppointments, "Virtual"),
                  "paleGreen",
                  "Completed",
                  false,
                  false
                )}
              </>
            )}
          </div>
        </Container>
      </div>
      <CustomModal
        open={payModalVisible}
        onClose={createModalOpen}
        header={"Reschedule / Reassign"}
        rightModal
        modalWidth={30}
        headerBold
      >
        <Grid container spacing={1} className="ph20 scroll-80vh">
          <Grid item xs={12}>
            <Card
              sx={{
                borderRadius: 1,
                padding: 2,
                borderTopColor: AppColors.appPrimary,
              }}
              className="CustomCard-back-appointment"
            >
              <div className="maint">
                <div className="flex-row">
                  <Grid item xs={3}>
                    <div className="flex-center">
                      {modalData?.appoinment?.petImage ? (
                        <CardMedia
                          image={modalData?.appoinment?.petImage}
                          className="CustomCard-img3-bill"
                        />
                      ) : (
                        <div className="CustomCard-empty-img" />
                      )}
                    </div>
                  </Grid>
                  <div className="flex-row">
                    <div className="flex-start">
                      <div className="flex-column">
                        <div className="flex-row">
                          <div
                            variant="body1"
                            className="mb10 txt-semi-bold black fs14 capitalize"
                          >
                            {modalData?.appoinment?.petName}
                          </div>
                          <Typography
                            variant="body1"
                            className={`ml5 text capitalize ${
                              modalData?.appoinment?.gender === "male"
                                ? "card-blue-color"
                                : "card-rose-color"
                            }`}
                          >
                            {`(${modalData?.appoinment?.gender})`}
                          </Typography>
                        </div>
                        <Typography
                          variant="body2"
                          className="mb10 txt-regular card-gray-color fs12"
                        >
                          {modalData?.appoinment?.breed}
                        </Typography>
                      </div>
                    </div>
                  </div>
                  <div></div>
                </div>
                <div>
                  <div className="flex-row parentcontainer mt10">
                    <div className="flex-row iconcontainer">
                      <AccountCircleOutlinedIcon
                        sx={{ width: 25, height: 25 }}
                      />
                      <div className="txt-semi-bold fs14 capitalize">
                        {modalData?.appoinment?.userName}
                      </div>
                    </div>
                    <div className="meeting-doctor">
                      {moment(modalData?.appoinment?.appoinmentDate).fromNow()}{" "}
                      ({modalData?.appoinment?.appoinmentDate})
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </Grid>

          <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
            <div className="txt-semi-bold fs14 light-grey">Booking Type</div>
            <Select
              // list={typeAppointemnt}
              value={"Walk-in"}
              // handleChange={(e) => handleSelect(e, "typeOfAppointment")}
              // name="typeOfAppointment"
              selectFixed
              // helperText={petHelpers?.typeOfAppointment}
              // error={petErrors?.typeOfAppointment}
            />
          </Grid>
          <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
            <div className="txt-semi-bold fs14 light-grey">
              Consultation mode
            </div>
            <Select
              // list={typeList}
              // value={petValues.consultationType}
              // handleChange={(e) => {
              //   handleSelect(e, "consultationType");
              //   handleSlot(e.target.value, "consultationType");
              //   setSelectedDate(null);
              //   handleDateClick();
              // }}
              value={"Physical"}
              // name="consultationType"
              selectFixed
              // helperText={petHelpers?.consultationType}
              // error={petErrors?.consultationType}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <div className="txt-semi-bold fs14 light-grey">Service type</div>
            <Select
              // list={serviceType}
              value={"Consultation"}
              // handleChange={(e) => handleSelect(e, "serviceType")}
              selectFixed
              // helperText={petHelpers?.serviceType}
              // error={petErrors?.serviceType}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <div className="txt-semi-bold fs14 light-grey">
              Reason for visit
            </div>
            <Select
              // list={conditionList}
              value={rescheduleData?.appoinment?.reason}
              // handleChange={(e) => handleSelect(e, "reason")}
              selectFixed
              // multiline

              // helperText={petHelpers?.reason}
              // error={petErrors?.reason}
              // labelTop
            />
          </Grid>

          {/* <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
          <div className="txt-semi-bold fs14 light-grey">Appointment Date</div>
          <CustomTextField
              // label={"Appointment Date"}
              name="appointmentDate"
              fullWidth
              mobileDateNew
              value={appointmentDate}
              handleChange={(e) => setAppointmentDate(e?.target?.value)}
              error={!!errors?.appointmentDate}
              helperText={errors?.appointmentTime}
              labelTop
            />
        </Grid>
        <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
          <div className="txt-semi-bold fs14 light-grey">Appointment Time</div>
          <CustomTextField
              // label={"Appointment Time"}
              name="appointmentTime"
              fullWidth
              mobileTime
              value={appointmentTime}
              handleChange={(e) => setAppointmentTime(e?.target?.value)}
              error={!!errors.appointmentTime}
              helperText={errors.appointmentTime}
              labelTop
              is12HourFomat={false}
            />
        </Grid> */}
          {/* <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <CustomTextField
              label={"Appointment Date"}
              name="appointmentDate"
              fullWidth
              mobileDateNew
              value={appointmentDate}
              handleChange={(e) => setAppointmentDate(e?.target?.value)}
              error={!!errors?.appointmentDate}
              helperText={errors?.appointmentTime}
              labelTop
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <CustomTextField
              label={"Appointment Time"}
              name="appointmentTime"
              fullWidth
              mobileTime
              value={appointmentTime}
              handleChange={(e) => setAppointmentTime(e?.target?.value)}
              error={!!errors.appointmentTime}
              helperText={errors.appointmentTime}
              labelTop
              is12HourFomat={false}
            />
          </Grid> */}

          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <div className="txt-semi-bold fs14 light-grey mb10">Vet Name</div>
            <Select
              list={vets}
              handleChange={(e) => {
                const selectedVet = vets.find(
                  (vet) => vet.value === e.target.value
                );
                setSelectedVetId(selectedVet?.id);
                setDoctor(e.target.value);
                handleDateClick(new Date(), selectedVet?.id, "Physical");
              }}
              name="doctorList"
              // label={"Doctor List"}
              select
              value={doctor}
              error={!!errors?.doctor}
              helperText={errors?.doctor}
              labelTop
            />
          </Grid>

          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={12}
            xl={12}
            className="mbminus"
          >
            <div className="flex-row">
              <div className="txt-semi-bold fs14 light-grey mt10">
                Appointment :
              </div>
              <div className="ml5">
                <CustomCheckbox
                  radio
                  value={appointmentOption}
                  onChange={handleAppointmentOptionChange}
                  radios={[
                    { label: "Immediate", value: "Immediate" },
                    { label: "Later", value: "Later" },
                  ]}
                />
              </div>
            </div>

            {appointmentError && (
              <Typography color="error" className="ml5 mt5 fs14">
                Appointment is Required
              </Typography>
            )}
          </Grid>

          {appointmentOption === "Later" && (
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <div className="txt-mont fs14 ">Date</div>
              <div className="mb20">
                {/* <CustomTextField
                  name="dob"
                  value={
                    selectedDate
                      ? moment(selectedDate).format("DD/MM/YYYY")
                      : ""
                  }
                  labelTop
                  fullWidth
                /> */}

                <CustomTextField
                  name="dob"
                  value={petValues?.dob}
                  labelTop
                  fullWidth
                  mobileDate
                  handleChange={(e) => {
                    handleChange(e, "dob");
                    handleDateClick(e.target.value, null, "Physical");
                  }}
                />
              </div>
            </Grid>
          )}

          {/* {appointmentOption === "Later" && (
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <CalenderComponent
                handleDateClick={handleDateClick}
                selectedDate={selectedDate}
              />

              {selectedDateError && (
                <Typography color="error" className="ml5 mt5 fs14">
                  Date is Requried
                </Typography>
              )}
            </Grid>
          )} */}
          {appointmentOption === "Later" && petValues?.dob && (
            <>
              {activeSlotList?.map((item, i) => {
                return (
                  <>
                    <div className="flex-row">
                      <div
                        onClick={() => handleSelectTime(item)}
                        className={
                          selectTimeId === item?.slotTimeId
                            ? "bgContainerSelected cursor"
                            : "bgContainerUnselected cursor"
                        }
                      >
                        {item?.time}
                      </div>
                    </div>
                  </>
                );
              })}
            </>
          )}

          {selectTimeIdError && (
            <Typography color="error" className="ml5 mt5 fs14">
              Time is Requried
            </Typography>
          )}
        </Grid>
        <div className="flex1-end mt20">
          <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
            <CustomButton text="Save" onClick={handleReschedule} />
          </Grid>
        </div>
      </CustomModal>
      <CustomModal
        open={payModalVisibleFollowUp}
        onClose={createModalOpenFollowUp}
        header={"Book an appointment"}
        rightModal
        modalWidth={30}
        headerBold
      >
        <Grid container spacing={1} className="ph20 scroll-80vh">
          <Grid item xs={12}>
            <Card
              sx={{
                borderRadius: 1,
                padding: 2,
                borderTopColor: AppColors.appPrimary,
              }}
              className="CustomCard-back-appointment"
            >
              <div className="maint">
                <div className="flex-row">
                  <Grid item xs={3}>
                    <div className="flex-center">
                      {modalData?.appoinment?.petImage ? (
                        <CardMedia
                          image={modalData?.appoinment?.petImage}
                          className="CustomCard-img3-bill"
                        />
                      ) : (
                        <div className="CustomCard-empty-img" />
                      )}
                    </div>
                  </Grid>
                  <div className="flex-row">
                    <div className="flex-start">
                      <div className="flex-column">
                        <div className="flex-row">
                          <div
                            variant="body1"
                            className="mb10 txt-semi-bold black fs14 capitalize"
                          >
                            {modalData?.appoinment?.petName}
                          </div>
                          <Typography
                            variant="body1"
                            className={`ml5 text capitalize ${
                              modalData?.appoinment?.gender === "male"
                                ? "card-blue-color"
                                : "card-rose-color"
                            }`}
                          >
                            {`(${modalData?.appoinment?.gender})`}
                          </Typography>
                        </div>
                        <Typography
                          variant="body2"
                          className="mb10 txt-regular card-gray-color fs12"
                        >
                          {modalData?.appoinment?.breed}
                        </Typography>
                      </div>
                    </div>
                  </div>
                  <div></div>
                </div>
                <div>
                  <div className="flex-row parentcontainer mt10">
                    <div className="flex-row iconcontainer">
                      <AccountCircleOutlinedIcon
                        sx={{ width: 25, height: 25 }}
                      />
                      <div className="txt-semi-bold fs14 capitalize">
                        {modalData?.appoinment?.userName}
                      </div>
                    </div>
                    <div className="meeting-doctor">
                      {moment(modalData?.appoinment?.appoinmentDate).fromNow()}{" "}
                      ({modalData?.appoinment?.appoinmentDate})
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </Grid>

          <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
            <div className="txt-semi-bold fs14 light-grey">Booking Type</div>
            <Select
              // list={typeAppointemnt}
              list={typeAppointemnt}
              value={bookingType}
              handleChange={(e) => {
                setBookingType(e.target.value);
                handleDateClick(
                  new Date(),
                  null,
                  bookingType === "Walk-in" ? "Physical" : conMode
                );
              }}
              // name="typeOfAppointment"
              select
              labelTop

              // helperText={petHelpers?.typeOfAppointment}
              // error={petErrors?.typeOfAppointment}
            />
          </Grid>
          <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
            <div className="txt-semi-bold fs14 light-grey">
              Consultation mode
            </div>
            <Select
              list={bookingType === "Walk-in" ? typeListNew : typeList}
              // list={typeList}
              // value={petValues.consultationType}
              value={bookingType === "Walk-in" ? "Physical" : conMode}
              // value={conMode}
              handleChange={(e) => {
                setConMode(e.target.value);
                handleDateClick(new Date(), null, e.target.value);
              }}
              // name="consultationType"
              select
              labelTop
              // helperText={petHelpers?.consultationType}
              // error={petErrors?.consultationType}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <div className="txt-semi-bold fs14 light-grey">Service type</div>
            <Select
              list={serviceType}
              value={serType}
              handleChange={(e) => setSerType(e.target.value)}
              select
              labelTop
              // helperText={petHelpers?.serviceType}
              // error={petErrors?.serviceType}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <div className="txt-semi-bold fs14 light-grey">
              Reason for visit
            </div>
            <Select
              list={conditionList}
              value={reason}
              handleChange={(e) => setReason(e.target.value)}
              select
              labelTop
              // helperText={petHelpers?.reason}
              // error={petErrors?.reason}
              // labelTop
            />
          </Grid>

          {/* <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
          <div className="txt-semi-bold fs14 light-grey">Appointment Date</div>
          <CustomTextField
              // label={"Appointment Date"}
              name="appointmentDate"
              fullWidth
              mobileDateNew
              value={appointmentDate}
              handleChange={(e) => setAppointmentDate(e?.target?.value)}
              error={!!errors?.appointmentDate}
              helperText={errors?.appointmentTime}
              labelTop
            />
        </Grid>
        <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
          <div className="txt-semi-bold fs14 light-grey">Appointment Time</div>
          <CustomTextField
              // label={"Appointment Time"}
              name="appointmentTime"
              fullWidth
              mobileTime
              value={appointmentTime}
              handleChange={(e) => setAppointmentTime(e?.target?.value)}
              error={!!errors.appointmentTime}
              helperText={errors.appointmentTime}
              labelTop
              is12HourFomat={false}
            />
        </Grid> */}
          {/* <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <CustomTextField
              label={"Appointment Date"}
              name="appointmentDate"
              fullWidth
              mobileDateNew
              value={appointmentDate}
              handleChange={(e) => setAppointmentDate(e?.target?.value)}
              error={!!errors?.appointmentDate}
              helperText={errors?.appointmentTime}
              labelTop
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <CustomTextField
              label={"Appointment Time"}
              name="appointmentTime"
              fullWidth
              mobileTime
              value={appointmentTime}
              handleChange={(e) => setAppointmentTime(e?.target?.value)}
              error={!!errors.appointmentTime}
              helperText={errors.appointmentTime}
              labelTop
              is12HourFomat={false}
            />
          </Grid> */}

          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <div className="txt-semi-bold fs14 light-grey mb10">Vet Name</div>
            <Select
              list={vets}
              handleChange={(e) => {
                const selectedVet = vets.find(
                  (vet) => vet.value === e.target.value
                );

                setSelectedVetId(selectedVet.id);
                setDoctor(e.target.value);
                handleDateClick(
                  new Date(),
                  selectedVet?.id,
                  bookingType === "Walk-in" ? "Physical" : conMode
                );
              }}
              name="doctorList"
              // label={"Doctor List"}
              select
              value={doctor}
              error={!!errors?.doctor}
              helperText={errors?.doctor}
              labelTop
            />
          </Grid>

          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={12}
            xl={12}
            className="mbminus"
          >
            <div className="flex-row">
              <div className="txt-semi-bold fs14 light-grey mt10">
                Appointment :
              </div>
              <div className="ml5">
                <CustomCheckbox
                  radio
                  value={appointmentOption}
                  onChange={handleAppointmentOptionChange}
                  radios={[
                    { label: "Immediate", value: "Immediate" },
                    { label: "Later", value: "Later" },
                  ]}
                />
              </div>
            </div>

            {appointmentError && (
              <Typography color="error" className="ml5 mt5 fs14">
                Appointment is Required
              </Typography>
            )}
          </Grid>

          {appointmentOption === "Later" && (
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <div className="txt-mont fs14 ">Date</div>
              <div className="mb20">
                {/* <CustomTextField
                  name="dob"
                  value={
                    selectedDate
                      ? moment(selectedDate).format("DD/MM/YYYY")
                      : ""
                  }
                  labelTop
                  fullWidth
                /> */}

                <CustomTextField
                  name="dob"
                  value={petValues?.dob}
                  labelTop
                  fullWidth
                  mobileDate
                  handleChange={(e) => {
                    handleChange(e, "dob");
                    // handleDateClick(e.target.value);
                    handleDateClick(
                      e.target.value,
                      null,
                      bookingType === "Walk-in" ? "Physical" : conMode
                    );
                  }}
                />
              </div>
            </Grid>
          )}

          {/* {appointmentOption === "Later" && (
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <CalenderComponent
                handleDateClick={handleDateClick}
                selectedDate={selectedDate}
              />

              {selectedDateError && (
                <Typography color="error" className="ml5 mt5 fs14">
                  Date is Requried
                </Typography>
              )}
            </Grid>
          )} */}
          {appointmentOption === "Later" && petValues?.dob && (
            <>
              {activeSlotList?.map((item, i) => {
                return (
                  <>
                    <div className="flex-row">
                      <div
                        onClick={() => handleSelectTime(item)}
                        className={
                          selectTimeId === item?.slotTimeId
                            ? "bgContainerSelected cursor"
                            : "bgContainerUnselected cursor"
                        }
                      >
                        {item?.time}
                      </div>
                    </div>
                  </>
                );
              })}
            </>
          )}

          {selectTimeIdError && (
            <Typography color="error" className="ml5 mt5 fs14">
              Time is Requried
            </Typography>
          )}
        </Grid>
        <div className="flex1-end mt20">
          <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
            <CustomButton text="Save" onClick={handleReschedule} />
          </Grid>
        </div>
      </CustomModal>

      {/* <CustomModal
        open={payModalVisibleReassign}
        onClose={createModalOpenReassign}
        header="Reassign"
        rightModal
        modalWidth={30}
      >
        <Grid container spacing={1} className="ph20">
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <Select
              list={vets}
              handleChange={(e) => {
                const selectedVet = vets.find(
                  (vet) => vet.value === e.target.value
                );

                setSelectedVetId(selectedVet.id);
                setDoctor(e.target.value);
              }}
              name="doctorList"
              label={"Doctor List"}
              select
              value={doctor}
              error={!!errors?.doctor}
              helperText={errors?.doctor}
              labelTop
            />
          </Grid>
        </Grid>
        <div className="flex1-end mt20">
          <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
            <CustomButton text="Save" onClick={handleReschedule} />
          </Grid>
        </div>
      </CustomModal> */}

      <CustomModal
        open={delModVisible}
        onClose={handleDelModClose}
        header="Cancel"
        modal
        modalWidth={40}
      >
        <Typography className="txt-regular fs16 ml10">
          Are you sure you want to cancel the appointment?
        </Typography>
        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
          <div className="clinic-mod-btn-pos mb10 mt15">
            <div className="mr10">
              <CustomButton text="Yes" redBtn onClick={handleCancel} />
            </div>
            <div className="ml10">
              <CustomButton
                text={"No"}
                onClick={() => setDelModVisible(false)}
              />
            </div>
          </div>
        </Grid>
      </CustomModal>

      <ClinicPetBookAppointment
        modalVisible={modalBookVisible}
        setModalBookVisible={setModalBookVisible}
        selectPet={selectPet}
      />
    </>
  );
};

export default Home;
