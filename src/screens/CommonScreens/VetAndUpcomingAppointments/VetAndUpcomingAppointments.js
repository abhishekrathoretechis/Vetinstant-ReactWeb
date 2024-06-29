import CallIcon from "@mui/icons-material/Call";
import EditIcon from "@mui/icons-material/Edit";
import MailIcon from "@mui/icons-material/Mail";
import { Container, Grid, Typography } from "@mui/material";
import CustomSwitch from "../../../components/CustomSwitch";
import { AppColors } from "../../../util/AppColors";
// import CustomButton from "../../../components/CustomButton";
// import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import EditCalendarOutlinedIcon from "@mui/icons-material/EditCalendarOutlined";
import MonetizationOnOutlinedIcon from "@mui/icons-material/MonetizationOnOutlined";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CustomButton from "../../../components/CustomButton";
import Checkbox from "../../../components/CustomCheckbox";
import CustomModal from "../../../components/CustomModal/CustomModal";
import CustomTextField from "../../../components/CustomTextField";
import CustomUpload from "../../../components/CustomUpload";
import Select from "../../../components/Select/Select";
import {
  getAllClinicPayment,
  getRecentTransactionsPayment,
  getVetDetailsById,
  getVetUpcomingAppointmentsById,
} from "../../../redux/reducers/clinicSlice";
import {
  updateVetBlockStatus,
  updateVetByClinic,
} from "../../../redux/reducers/vetSlice";
import {
  clinicRolesList,
  salutationList,
  specialtyList,
  typeList,
} from "../../../util/dropList";
import CommonPaymentUpdateModal from "../../Hospital/CommonPaymentUpdateModal/CommonPaymentUpdateModal";
import VetBookAppointment from "../../Hospital/VetCalendar/VetBookAppointment";
import { newRoleList } from "../../../util/arrayList";

const initialValues = {
  type: "Vet",
  salutation: "Mr",
  name: "",
  speciality: "",
  contactNumber: "",
  conType: [],
  email: "",
  password: "",
  role: "",
  image: { file: null, previewUrl: null },
};

const initialError = {
  salutation: false,
  name: false,
  speciality: false,
  conType: false,
  contactNumber: false,
  email: false,
  password: false,
  role: false,
};

const initialHelp = {
  salutation: "",
  name: "",
  speciality: "",
  conType: "",
  contactNumber: "",
  email: "",
  password: "",
  role: "",
};

const nameExpan = {
  salutation: "Salutation",
  name: "Name",
  speciality: "Speciality",
  conType: "Consultation Type",
  contactNumber: "Contact Number",
  email: "Email",
  password: "Password",
  role: "role",
};

const VetAndUpcomingAppointments = ({
  children,
  vetId,
  left = true,
  active,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [conModVisible, setConModVisible] = useState(false);
  const [modalBookVisible, setModalBookVisible] = useState(false);
  const [profileEditModVisible, setProfileEditModVisible] = useState(false);
  const vetDetails = useSelector((state) => state?.clinic?.vet);

  const upcomingAppointments = useSelector(
    (state) => state?.clinic?.vetUpcomingAppointments
  );
  const payment = useSelector((state) => state.clinic.transactions);
  const getPayment =
    payment ??
    []
      .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate))
      .slice(0, 10);
  const [profileValues, setProfileValues] = useState(initialValues);

  const [profileHelps, setProfileHelps] = useState(initialHelp);
  const [profileError, setProfileError] = useState(initialError);

  useEffect(() => {
    if (vetId) {
      dispatch(getVetDetailsById(vetId));
      dispatch(getVetUpcomingAppointmentsById(vetId));
    }
    dispatch(getRecentTransactionsPayment("?filter=all&type=resent"));
  }, []);

  const bookAppointment = (li) => {
    setModalBookVisible(true);
  };

  const handleManageSlot = () => {
    navigate(`/manage-slot/${vetId}/4`, { state: { vetId } });
  };

  const updateVetStatus = async () => {
    const apiRes = await dispatch(
      updateVetBlockStatus({
        vetId: vetId ?? vetDetails?.doctorId,
        active: vetDetails?.active === "N" ? "Y" : "N",
      })
    );
    if (apiRes?.payload) dispatch(getVetDetailsById(vetId));
  };

  const conModalOpen = () => {
    setConModVisible(!conModVisible);
  };

  const onApiSuccess = () => {
    dispatch(getVetDetailsById(vetId));
    setConModVisible(!conModVisible);
  };

  const handleEditProfile = () => {
    setProfileValues({
      ...profileValues,
      type: vetDetails?.doctorId ? "Vet" : "Other",
      name: vetDetails?.name,
      speciality: vetDetails?.speciality,
      conType: vetDetails?.consulationType,
      email: vetDetails?.email,
      role: vetDetails?.role,
      salutation: vetDetails?.salutation,
      contactNumber: vetDetails?.mobile,
      image: { file: null, previewUrl: vetDetails?.image },
    });
    setProfileEditModVisible(true);
  };

  const onEditProfileModClose = () => {
    setProfileEditModVisible(!profileEditModVisible);
  };

  const handleChange = (name, value) => {
    if (name === "conType") {
      setProfileValues({
        ...profileValues,
        conType: typeof value === "string" ? value.split(",") : value,
      });
      return;
    }
    setProfileValues({
      ...profileValues,
      [name]: value,
    });
    if (value === "") {
      setProfileError({ ...profileError, [name]: true });
      setProfileHelps({
        ...profileHelps,
        [name]: `${nameExpan?.[name]} Required Field`,
      });
    }
    if (value !== "") {
      setProfileError({ ...profileError, [name]: false });
      setProfileHelps({ ...profileHelps, [name]: "" });
    }
  };

  const validateField = (value) => {
    if (Array?.isArray(value)) {
      return value?.length > 0;
    } else {
      return typeof value === "string" && value.trim() !== "";
    }
  };

  const handleUpdate = async () => {
    const nameValid = validateField(profileValues?.name);
    const emailValid = validateField(profileValues?.email);

    // const salutationValid = validateField(profileValues?.salutation);
    const specialityValid = validateField(profileValues?.speciality);
    const conTypeValid = validateField(profileValues?.conType);

    const roleValid = validateField(profileValues?.role);

    if (
      !nameValid || !emailValid || profileValues?.type === "Vet"
        ? // !salutationValid ||
          !specialityValid || !conTypeValid
        : !roleValid
    ) {
      const errors = { name: !nameValid, email: !emailValid };
      const helps = {
        name: nameValid ? "" : "This Field is required",
        email: emailValid ? "" : "Invalid email format",
      };
      if (profileValues?.type === "Vet") {
        // errors.salutation = !salutationValid;
        errors.speciality = !specialityValid;
        errors.conType = !conTypeValid;
        // helps.salutation = salutationValid ? "" : "This Field is required";
        helps.speciality = specialityValid ? "" : "This Field is required";
        helps.conType = conTypeValid ? "" : "This Field is required";
      } else {
        errors.role = !roleValid;
        helps.role = roleValid ? "" : "This Field is required";
      }
      setProfileError(errors);

      setProfileHelps(helps);
      return;
    }

    const form = new FormData();
    form.append("name", profileValues.name);
    form.append("email", profileValues.email);
    if (profileValues?.type === "Vet") {
      form.append(
        "salutation",
        profileValues?.type === "Vet" ? "Dr." : profileValues?.salutation
      );
      form.append("speciality", profileValues.speciality);
      form.append("consulationType", profileValues.conType);
      form.append("mobile", profileValues?.contactNumber);
      form.append("role", profileValues?.role);
      if (profileValues?.image?.file) {
        form.append("image", profileValues?.image?.file);
      }
    } else {
      form.append("role", profileValues?.role);
    }

    let apiRes = null;
    if (profileValues?.type === "Vet") {
      apiRes = await dispatch(updateVetByClinic({ vetId, form }));
    }
    // else {
    // }
    if (apiRes?.payload) {
      dispatch(getVetDetailsById(vetId));
      setProfileEditModVisible(false);
      setProfileValues(initialValues);
    }
  };

  const onUploadFile = (e) => {
    const reader = new FileReader();
    const file = e?.target?.files[0];
    reader.onloadend = () => {
      setProfileValues({
        ...profileValues,
        image: { file: e.target.files[0], previewUrl: reader.result },
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      <Grid container className="back-white ph20">
        {left ? (
          <Grid
            item
            xs={12}
            sm={12}
            md={2.5}
            lg={2.5}
            xl={2.5}
            className="back-white border-rt"
            style={{ height: "100vh" }}
          >
            <Grid container className="mv20 ph20">
              <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                <img src={vetDetails?.image} alt="" className="img2" />
              </Grid>
              <Grid item xs={8} sm={8} md={8} lg={8} xl={8} className="ph10">
                <Typography className="font-bold capitalize">
                  Dr. {vetDetails?.name}
                </Typography>
                <Typography
                  variant="body2"
                  className="mb10 txt-regular card-gray-color fs12 capitalize"
                >
                  {vetDetails?.speciality}
                </Typography>
                <div className="flex-row">
                  <div className="flex-center">
                    <Typography
                      variant="body2"
                      className={`mb10 font-bold fs12 ${
                        vetDetails?.active === "Y" ? "blue-color" : "red-color3"
                      }`}
                    >
                      {vetDetails?.active === "Y" ? "Available" : "On Leave"}
                    </Typography>
                    <div className="ml10">
                      <CustomSwitch
                        value={vetDetails?.active === "Y" ? true : false}
                        onChange={updateVetStatus}
                        greenToGray
                      />
                    </div>
                  </div>
                </div>
                <div className="flex-row">
                  {vetDetails?.consulationType?.map((ct, i) => (
                    <div
                      key={ct}
                      className={`txt-regular white-color fs8 card-consultation ${
                        ct === "Physical"
                          ? "card-con-blue-back"
                          : ct === "Virtual"
                          ? "virtual-bg-color"
                          : "card-con-gray-back"
                      } ${i !== 0 ? "ml5" : ""}`}
                    >
                      {ct === "Home" ? "Home Visit" : ct}
                    </div>
                  ))}
                </div>
              </Grid>
              <div className="dashed-card mv20 p20">
                <div className="flex-row">
                  <MailIcon
                    sx={{
                      color: AppColors.appPrimary,
                      width: 30,
                      height: 30,
                    }}
                  />
                  <div className="flex-center">
                    <Typography
                      variant="body2"
                      className="txt-regular card-gray-color fs14 ml10"
                    >
                      {vetDetails?.email}
                    </Typography>
                  </div>
                </div>
                <div className="flex-row mt10">
                  <CallIcon
                    sx={{
                      color: AppColors.appPrimary,
                      width: 30,
                      height: 30,
                    }}
                  />
                  <div className="flex-center">
                    <Typography
                      variant="body2"
                      className="txt-regular card-gray-color fs14 ml10"
                    >
                      {vetDetails?.mobile}
                    </Typography>
                  </div>
                </div>
              </div>
              {/* <div className="w30Per">
            <CustomButton
              text="Chat"
              leftIcon
              startIcon={<ChatOutlinedIcon />}
              //   onClick={() => setVideoCallEnabled(true)}
            />
          </div> */}
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Typography variant="body1" className="text-bold mb10 fs14">
                  Shortcuts
                </Typography>
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <div className="flex-row mv5 cursor">
                  <EditIcon
                    sx={{ width: 30, height: 30, color: AppColors.gray2 }}
                  />
                  <div className="ml10 flex-center" onClick={handleEditProfile}>
                    <Typography variant="body1" className="txt-regular fs14">
                      Edit Profile
                    </Typography>
                  </div>
                </div>
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <div
                  className="flex-row mv5 cursor"
                  onClick={() =>
                    navigate("/vet-holiday-calendar", { state: { vetId } })
                  }
                >
                  <CalendarMonthIcon
                    sx={{
                      width: 30,
                      height: 30,
                      color:
                        active === "holidayCalendar"
                          ? AppColors.appPrimary
                          : AppColors.gray2,
                    }}
                  />
                  <div className="ml10 flex-center">
                    <Typography
                      className={`txt-regular fs14 ${
                        active === "holidayCalendar" ? "blue-color" : ""
                      }`}
                    >
                      Holiday calender
                    </Typography>
                  </div>
                </div>
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <div className="flex-row mv5 cursor">
                  <CalendarMonthOutlinedIcon
                    sx={{ width: 30, height: 30, color: AppColors.gray2 }}
                  />
                  <div className="ml10 flex-center" onClick={bookAppointment}>
                    <Typography variant="body1" className="txt-regular fs14">
                      Book an appointment
                    </Typography>
                  </div>
                </div>
              </Grid>
              {vetDetails?.active === "Y" ? (
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                  <div className="flex-row mv5 cursor" onClick={conModalOpen}>
                    <MonetizationOnOutlinedIcon
                      sx={{ width: 30, height: 30, color: AppColors.gray2 }}
                    />
                    <div className="ml10 flex-center">
                      <Typography variant="body1" className="txt-regular fs14">
                        Consultation Details
                      </Typography>
                    </div>
                  </div>
                </Grid>
              ) : null}
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <div className="flex-row mv5 cursor" onClick={handleManageSlot}>
                  <EditCalendarOutlinedIcon
                    sx={{
                      width: 30,
                      height: 30,
                      color:
                        active === "manageSlot"
                          ? AppColors?.appPrimary
                          : AppColors.gray2,
                    }}
                  />
                  <div className="ml10 flex-center">
                    <Typography
                      variant="body1"
                      className={`txt-regular fs14 ${
                        active === "manageSlot" ? "blue-color" : ""
                      }`}
                    >
                      Manage Slots
                    </Typography>
                  </div>
                </div>
              </Grid>
            </Grid>
          </Grid>
        ) : null}
        <Grid
          item
          xs={12}
          sm={12}
          md={left ? 7 : 9}
          lg={left ? 7 : 9}
          xl={left ? 7 : 9}
          className="border-rt"
        >
          {children}
        </Grid>
        <Grid
          item
          xs={12}
          sm={12}
          md={left ? 2.5 : 3}
          lg={left ? 2.5 : 3}
          xl={left ? 2.5 : 3}
          className="back-white"
        >
          <Grid container className="mv20 ph20 scroll-90vh">
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              {!left ? (
                <div
                  style={{
                    fontSize: "14px",
                    fontFamily: "Montserrat",
                    fontWeight: "500",
                    color: "#75808A",
                  }}
                >
                  Recent Transactions
                </div>
              ) : (
                <Typography variant="body1" className="text-bold mb10 fs14">
                  Upcoming Appointments
                </Typography>
              )}
            </Grid>
            {left ? (
              <>
                {upcomingAppointments?.length > 0 ? (
                  upcomingAppointments?.map((upAp, i) => {
                    const aptmnt = upAp?.appoinment;
                    return (
                      <Grid
                        item
                        xs={12}
                        sm={12}
                        md={12}
                        lg={12}
                        xl={12}
                        className="mv10 upcom-card"
                        key={i + aptmnt?.appoimentId}
                      >
                        <Grid container>
                          <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                            <img
                              src={
                                aptmnt?.petImage ?? "https://picsum.photos/200"
                              }
                              alt={
                                aptmnt?.petImage ?? "https://picsum.photos/200"
                              }
                              className="pet-card-img"
                            />
                          </Grid>
                          <Grid item xs={9} sm={9} md={9} lg={9} xl={9}>
                            <div className="flex-row mv5">
                              <div className="flex-center">
                                <Typography className="font-bold fs14 capitalize">
                                  {aptmnt?.petName}
                                </Typography>
                                <Typography
                                  className={`ml5 font-medium fs14 capitalize ${
                                    aptmnt?.gender === "male"
                                      ? "card-blue-color"
                                      : "card-rose-color"
                                  }`}
                                >
                                  {`(${aptmnt?.gender})`}
                                </Typography>
                              </div>
                              <div className="flex1-end">
                                <div className="gray-dot" />
                                <Typography className="ml3 txt-regular card-gray2 fs12">
                                  {aptmnt?.appoimentTime}
                                </Typography>
                              </div>
                            </div>
                            <div className="flex-row mv5">
                              <div className="flex-center">
                                <div className="gray-dot" />
                                <Typography
                                  className={`ml3 font-medium fs12 capitalize ${
                                    upAp?.appoinmentType === "Physical" ||
                                    "Virtual"
                                      ? "blue3"
                                      : upAp?.appoinmentType === "Vaccination"
                                      ? "card-green-color"
                                      : ""
                                  }`}
                                >
                                  {`${
                                    upAp?.appoinmentType === "Physical" ||
                                    "Virtual"
                                      ? "Consultation"
                                      : ""
                                  } | ${upAp?.problemType} - ${
                                    upAp?.problems?.[0]
                                  }`}
                                </Typography>
                              </div>
                            </div>
                          </Grid>
                        </Grid>
                      </Grid>
                    );
                  })
                ) : (
                  <div className="no-rec">No records available</div>
                )}
              </>
            ) : (
              <>
                {getPayment?.length > 0 ? (
                  getPayment?.map((pay, i) => {
                    return (
                      <Grid
                        item
                        xs={12}
                        sm={12}
                        md={12}
                        lg={12}
                        xl={12}
                        className="mv10 upcom-card-wo-back"
                      >
                        <Grid container>
                          <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                            <img
                              src={pay?.petImage}
                              alt="https://picsum.photos/200"
                              className="pet-card-img"
                            />
                          </Grid>
                          <Grid item xs={9} sm={9} md={9} lg={9} xl={9}>
                            <div className="flex-row mv5">
                              <div className="flex-center">
                                <Typography className="font-bold fs14 capitalize">
                                  {pay?.petName}
                                </Typography>
                                <Typography
                                  // className={`ml5 capitalize font-medium fs14 card-blue-color`}
                                  className={`ml5 font-medium fs14 capitalize ${
                                    pay?.gender === "male"
                                      ? "card-blue-color"
                                      : "card-rose-color"
                                  }`}
                                >
                                  {/* {pay?.gender} */}
                                  {`(${pay?.gender})`}
                                </Typography>
                              </div>
                              <div
                                className="paymentstatuspaid"
                                style={{ marginLeft: 40 }}
                              >
                                Rs {pay?.totalAmt}
                              </div>
                            </div>
                            <div className="flex-row mv5">
                              <div className="flex-center">
                                <div
                                  style={{
                                    color: "#75808A",
                                    fontSize: "12px",
                                  }}
                                >
                                  {moment(pay?.createdDate).format(
                                    "MMM DD, YYYY"
                                  )}
                                </div>
                              </div>
                            </div>
                          </Grid>
                        </Grid>
                      </Grid>
                    );
                  })
                ) : (
                  <div className="no-reco">No records available</div>
                )}
              </>
            )}
            {/* <Grid
              item
              xs={12}
              sm={12}
              md={12}
              lg={12}
              xl={12}
              className="mv10 upcom-card"
            >
              <Grid container>
                <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                  <img
                    src="https://picsum.photos/200"
                    alt="https://picsum.photos/200"
                    className="pet-card-img"
                  />
                </Grid>
                <Grid item xs={9} sm={9} md={9} lg={9} xl={9}>
                  <div className="flex-row mv5">
                    <div className="flex-center">
                      <Typography className="font-bold fs14 capitalize">
                        Rosy
                      </Typography>
                      <Typography
                        className={`ml5 font-medium fs14 card-rose-color`}
                      >
                        {`(Female)`}
                      </Typography>
                    </div>
                    <div className="flex1-end">
                      <div className="gray-dot" />
                      <Typography className="ml3 txt-regular card-gray2 fs12">
                        10:00
                      </Typography>
                    </div>
                  </div>
                  <div className="flex-row mv5">
                    <div className="flex-center">
                      <div className="gray-dot" />
                      <Typography className="ml3 font-medium blue3 fs12">
                        Consultation | Eyes - Discharge
                      </Typography>
                    </div>
                  </div>
                </Grid>
              </Grid>
            </Grid>

            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              lg={12}
              xl={12}
              className="mv10 upcom-card"
            >
              <Grid container>
                <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                  <img
                    src="https://picsum.photos/200"
                    alt="https://picsum.photos/200"
                    className="pet-card-img"
                  />
                </Grid>
                <Grid item xs={9} sm={9} md={9} lg={9} xl={9}>
                  <div className="flex-row mv5">
                    <div className="flex-center">
                      <Typography className="font-bold fs14 capitalize">
                        Ranger
                      </Typography>
                      <Typography
                        className={`ml5 font-medium fs14 card-blue-color`}
                      >
                        {`(Male)`}
                      </Typography>
                    </div>
                    <div className="flex1-end">
                      <div className="gray-dot" />
                      <Typography className="ml3 txt-regular card-gray2 fs12">
                        11:00
                      </Typography>
                    </div>
                  </div>
                  <div className="flex-row mv5">
                    <div className="flex-center">
                      <div className="gray-dot" />
                      <Typography className="ml3 font-medium card-green-color fs12">
                        Consultation | 1st - Vaccination
                      </Typography>
                    </div>
                  </div>
                </Grid>
              </Grid>
            </Grid> */}

            {/* {!left ? (
              <>
                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  xl={12}
                  className="mt20"
                >
                  <Typography variant="body1" className="text-bold mb10 fs14">
                    Emergency case
                  </Typography>
                </Grid>

                <Grid
                  item
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  xl={12}
                  className="mv10 upcom-card-wo-back"
                >
                  <Grid container>
                    <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                      <img
                        src="https://picsum.photos/200"
                        alt="https://picsum.photos/200"
                        className="pet-card-img"
                      />
                    </Grid>
                    <Grid item xs={9} sm={9} md={9} lg={9} xl={9}>
                      <div className="flex-row mv5">
                        <div className="flex-center">
                          <Typography className="font-bold fs14 capitalize">
                            Ranger
                          </Typography>
                          <Typography
                            className={`ml5 font-medium fs14 card-blue-color`}
                          >
                            {`(Male)`}
                          </Typography>
                        </div>
                      </div>
                      <div className="flex-row mv5">
                        <div className="flex-center">
                          <div className="gray-dot" />
                          <Typography className="ml3 font-medium red2 fs12">
                            Consultation | Emergency
                          </Typography>
                        </div>
                      </div>
                    </Grid>
                  </Grid>
                </Grid>
              </>
            ) : null} */}
          </Grid>
        </Grid>

        {/* <div className="breakline"></div> */}

        {/* <Grid item xs={12} className="mv10"> */}
        {/* <Grid container> */}
        {/* <Grid item xs={3}>
              {bill ? (
                <img
                  src="http://137.184.130.244:1993/api/v2/pets/downloadFile/pets_2f4940cf-2738-4300-9953-5c2c530b87fe.jpeg"
                  alt="https://picsum.photos/200"
                  className="pet-card-img"
                />
              ) : (
                <img
                  src="https://picsum.photos/200"
                  alt="https://picsum.photos/200"
                  className="pet-card-img"
                />
              )}
            </Grid> */}
        {/* <Grid item xs={9}>
              <div className="flex-row mv5">
                <div className="flex-center">
                  <Typography className="font-bold fs14 capitalize">
                    Ranger
                  </Typography>
                  <Typography className="ml5 font-medium fs14 card-blue-color">
                    (Male)
                  </Typography>
                </div>
                <div className="flex1-end">
                  {!bill ? <div className="gray-dot" /> : null}
                  {!bill ? (
                    <Typography className="ml3 txt-regular card-gray2 fs12">
                      11:00
                    </Typography>
                  ) : (
                    <div className="paymentstatusnew">Rs 500</div>
                  )}
                </div>
              </div>
              <div className="flex-row mv5">
                <div className="flex-center">
                  {!bill ? <div className="gray-dot" /> : null}
                  {bill ? (
                    <Typography
                      className="ml3 font-medium card-green-color fs12"
                      style={{ color: "#75808A" }}
                    >
                      5 May, 2024
                    </Typography>
                  ) : (
                    <Typography className="ml3 font-medium card-green-color fs12">
                      Consultation | 1st - Vaccination
                    </Typography>
                  )}
                </div>
              </div>
            </Grid> */}
        {/* </Grid> */}
        {/* </Grid> */}

        {/* {!bill ? (
          <>
            <Grid item xs={12} className="mt20">
              <Typography variant="body1" className="text-bold mb10 fs14">
                Emergency case
              </Typography>
            </Grid>

            <Grid item xs={12} className="mv10 upcom-card-wo-back">
              <Grid container>
                <Grid item xs={3}>
                  <img
                    src="https://picsum.photos/200"
                    alt="https://picsum.photos/200"
                    className="pet-card-img"
                  />
                </Grid>
                <Grid item xs={9}>
                  <div className="flex-row mv5">
                    <div className="flex-center">
                      <Typography className="font-bold fs14 capitalize">
                        Ranger
                      </Typography>
                      <Typography className="ml5 font-medium fs14 card-blue-color">
                        (Male)
                      </Typography>
                    </div>
                  </div>
                  <div className="flex-row mv5">
                    <div className="flex-center">
                      <div className="gray-dot" />
                      <Typography className="ml3 font-medium red2 fs12">
                        Consultation | Emergency
                      </Typography>
                    </div>
                  </div>
                </Grid>
              </Grid>
            </Grid>
          </>
        ) : null} */}
      </Grid>
      <CommonPaymentUpdateModal
        open={conModVisible}
        onClose={conModalOpen}
        onApiSuccess={onApiSuccess}
        vet={vetDetails}
      />

      <VetBookAppointment
        modalVisible={modalBookVisible}
        setModalBookVisible={setModalBookVisible}
        selectVet={vetDetails}
      />

      <CustomModal
        open={profileEditModVisible}
        onClose={onEditProfileModClose}
        header="Edit Profile"
        rightModal
        modalWidth={30}
      >
        <Grid container spacing={1} className="ph20">
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <CustomUpload
              uploadText="Profile Picture"
              onUploadFile={onUploadFile}
              value={profileValues?.image?.previewUrl}
              profileImg
              imageHeight={140}
            />
          </Grid>
          {/* <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <div className="txt-mont fs14 fw-600 ">User Type</div>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <Checkbox
              radio
              onChange={(e) => handleChange("type", e?.target?.value)}
              radios={[
                { label: "Vet", value: "Vet" },
                { label: "Other", value: "Other" },
              ]}
              defaultValue="Vet"
              disabled
            />
          </Grid> */}
          {/* {profileValues?.type === "Vet" ? (
            <Grid item xs={4} sm={4} md={3} lg={3} xl={3}>
              <div className="txt-mont fs14 fw-600 ">Salutation</div>
              <Select
                list={salutationList}
                value={profileValues?.salutation}
                handleChange={(e) =>
                  handleChange("salutation", e?.target?.value)
                }
                name="salutation"
                select
                error={profileError?.salutation}
                helperText={profileHelps?.salutation}
              />
            </Grid>
          ) : null} */}
          <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
            <div className="txt-mont fs14 fw-600 ">Name</div>
            <CustomTextField
              // label="Name"
              // placeholder="Name"
              name="name"
              fullWidth
              handleChange={(e) => handleChange("name", e?.target?.value)}
              value={profileValues?.name}
              helperText={profileHelps?.name}
              error={profileError?.name}
              labelTop
            />
          </Grid>

          <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
            <div className="txt-mont fs14 fw-600 ">Role</div>
            <Select
              list={newRoleList}
              value={profileValues?.role}
              handleChange={(e) => handleChange("role", e?.target?.value)}
              select
              // label="Role"
              error={profileError?.role}
              helperText={profileHelps?.role}
              labelTop
            />
          </Grid>

          {profileValues?.type === "Vet" ? (
            <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
              <div className="txt-mont fs14 fw-600 ">Speciality</div>
              <Select
                list={specialtyList}
                value={profileValues?.speciality}
                handleChange={(e) =>
                  handleChange("speciality", e?.target?.value)
                }
                name="speciality"
                select
                error={profileError?.speciality}
                helperText={profileHelps?.speciality}
              />
            </Grid>
          ) : null}
          {profileValues?.type === "Vet" ? (
            <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
              <div className="txt-mont fs14 fw-600 ">Consultation Type</div>

              <Select
                list={typeList}
                value={profileValues?.conType}
                handleChange={(e) => handleChange("conType", e?.target?.value)}
                multiSelectTagCheck
                error={profileHelps?.conType}
                helperText={profileError?.conType}
              />
            </Grid>
          ) : null}

          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <div className="txt-mont fs14 fw-600 ">Phone Number</div>
            <CustomTextField
              // list={specialtyList}
              value={profileValues?.contactNumber}
              handleChange={(e) =>
                handleChange(e?.target?.value, "contactNumber")
              }
              name="Contact Number"
              // label={nameExpan?.["speciality"]}
              // select
              error={profileHelps?.contactNumber}
              fullWidth
              helperText={profileError?.contactNumber}
              labelTop
            />
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <div className="txt-mont fs14 fw-600 ">Email</div>
            <CustomTextField
              name="email"
              fullWidth
              handleChange={(e) => handleChange("email", e?.target?.value)}
              value={profileValues?.email}
              helperText={profileHelps?.email}
              error={profileError?.email}
              disabled
            />
          </Grid>
          {/* <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <div className="txt-mont fs14 fw-600 ">Password</div>
            <CustomTextField
              name="password"
              fullWidth
              handleChange={(e) => handleChange("password", e?.target?.value)}
              value={profileValues?.password}
              helperText={profileHelps?.password}
              error={profileError?.password}
              disabled
            />
          </Grid> */}

          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <div className="flex1-end">
              <div className="w20Per">
                <CustomButton text="Update" onClick={handleUpdate} />
              </div>
            </div>
          </Grid>
        </Grid>
      </CustomModal>
    </>
  );
};

export default VetAndUpcomingAppointments;
