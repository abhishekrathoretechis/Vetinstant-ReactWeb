import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { Divider, FormHelperText, Grid } from "@mui/material";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import CustomButton from "../../../components/CustomButton";
import Checkbox from "../../../components/CustomCheckbox";
import CustomModal from "../../../components/CustomModal/CustomModal";
import CustomSwitch from "../../../components/CustomSwitch";
import Table from "../../../components/CustomTable";
import CustomTextField from "../../../components/CustomTextField";
import CustomUpload from "../../../components/CustomUpload";
import SearchRow from "../../../components/SearchRow/SearchRow";
import {
  default as CustomSelect,
  default as Select,
} from "../../../components/Select/Select";
import TopBar from "../../../components/TopBar/TopBar";
import Header from "../../../layouts/header";
import {
  createClinicSlots,
  getDoctorAppointsmentsById,
} from "../../../redux/reducers/clinicSlice";
import { hideLoader, showLoader } from "../../../redux/reducers/loaderSlice";
import {
  getVetsSlots,
  updateVet,
  updateVetBlockStatus,
} from "../../../redux/reducers/vetSlice";
import { AppColors } from "../../../util/AppColors";
import { dayList } from "../../../util/arrayList";
import {
  dateFilterTodayLastWeek,
  paymentSearchTypeList,
  salutationList,
  specialtyList,
  typeList,
} from "../../../util/dropList";
import "./VetDetails.css";

const appointmentTableHeaders = [
  // "appointmentId",
  "pets",
  "userName",
  "vets",
  "dateAndTime",
  "consultationType",
];
const nameExpan = {
  salutation: "Salutation",
  name: "Name",
  speciality: "Speciality",
  conType: "Consultation Type",
  contactNumber: "Contact Number",
  email: "Email",
  startDate: "Start Date",
  endDate: "End Date",
  startTime: "Start Time",
  endTime: "End Time",
  slotDuration: "Slot Duration(in Mins)",
  noOfPatientsPerHour: "No. of patients/hr",
};
const initialValues = {
  salutation: "",
  name: "",
  speciality: "",
  contactNumber: "",
  conType: [],
  email: "",
};
const initialError = {
  salutation: false,
  name: false,
  speciality: false,
  conType: false,
  contactNumber: false,
  email: false,
};

const initialHelp = {
  salutation: "",
  name: "",
  speciality: "",
  conType: "",
  contactNumber: "",
  email: "",
};
const initialFile = { file: null, imagePreviewUrl: "" };
const initialSlotValues = {
  startDate: new Date(),
  endDate: new Date(),
  startTime: new Date(),
  endTime: new Date(new Date().setHours(new Date().getHours() + 1)),
  slotDuration: "15",
};
const initialSlotErrors = {
  startDate: false,
  endDate: false,
  startTime: false,
  endTime: false,
  slotDuration: false,
};
const initialSlotHelps = {
  startDate: "",
  endDate: "",
  startTime: "",
  endTime: "",
  slotDuration: "",
};

const breakObj = {
  startTime: new Date(),
  endTime: new Date(new Date().setHours(new Date().getHours() + 1)),
  error: false,
  help: "",
};

const VetDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();
  const location = useLocation();
  const [state, setState] = useState(location?.state);
  const [user, setUser] = useState(location?.state?.vet);
  const [isTableView, setTableView] = useState(true);
  const [isCardView, setCardView] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [searchTypeValue, setSearchTypeValue] = useState("vet-name");
  const [searchDateValue, setSearchDateValue] = useState("last");
  const [activeTab, setActiveTab] = useState("Appointments");
  const appointments = useSelector(
    (state) => state?.clinic?.doctorAppointments?.appointments
  );
  const appointmentType = useSelector((s) => s?.clinic?.appointmentType);
  const [tableAppintments, setTableAppointments] = useState([]);
  const [selectedVet, setSelectedVet] = useState(null);
  const [vetValues, setVetValues] = useState(initialValues);
  const [vetErrors, setVetErrors] = useState(initialError);
  const [vetHelps, setVetHelps] = useState(initialHelp);
  const [fileUploadUrl, setFileUploadUrl] = useState(initialFile);
  const [modalVisible, setModalVisible] = useState(false);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const [slotModalVisible, setSlotModalVisible] = useState(false);
  const [slotValues, setSlotValues] = useState(initialSlotValues);
  const [slotErrors, setSlotErrors] = useState(initialSlotErrors);
  const [slotHelps, setSlotHelps] = useState(initialSlotHelps);
  const [slotSelectedDays, setSlotSelectedDays] = useState(dayList);
  const [slotDayNotSelected, setSlotDayNotSelected] = useState(false);
  const [timeError, setTimeError] = useState(false);
  const [dateError, setDateError] = useState(false);
  const slots = useSelector((state) => state.vet.slotList);
  const [radioActive, setRadioActive] = useState("Virtual");
  const [breakList, setBreakList] = useState([]);
  const [breakTimeErr, setBreakTimeErr] = useState(false);
  const defaultUrl = `?limt=${rowsPerPage}&skip=0&filter=last-week&type=vet-name`;
  const [conTypeDrop, setConTypeDrop] = useState(
    [
      { label: "Virtual", value: "Virtual" },
      { label: "Physical", value: "Physical" },
    ]
    // []
  );

  useEffect(() => {
    setState(location?.state);
    setUser(location?.state?.vet);
    if (location?.state?.activeTab === "Availability") {
      return setActiveTab("Availability");
    }
    setUpdatedTime();
  }, []);

  // useEffect(() => {
  //   const reqAppoints = appointmentType?.map((app) => {
  //     return { label: app, value: app };
  //   });
  //   setConTypeDrop(reqAppoints);
  // }, [appointmentType]);

  useEffect(() => {
    getTableAppointments(appointments);
  }, [appointments]);

  useEffect(() => {
    if (!selectedVet) return;
    const vet = selectedVet?.vet;
    setVetValues({
      ...vetValues,
      // salutation: user?.salutation ?? "",
      name: user?.name ?? "",
      speciality: user?.speciality ?? "",
      contactNumber: user?.mobile ?? "",
      email: user?.email ?? "",
      // conType: appointmentType ?? [],
    });
    setFileUploadUrl({
      ...initialFile,
      imagePreviewUrl: user?.image,
    });
    setModalVisible(!modalVisible);
  }, [selectedVet]);

  useEffect(() => {
    if (activeTab === "Availability") {
      dispatch(getVetsSlots(location?.state?.vet?.doctorId));
    }
    if (activeTab === "Appointments") {
      dispatch(
        getDoctorAppointsmentsById({
          vetId: location?.state?.vet?.doctorId,
          type: searchDateValue,
        })
      );
    }
  }, [activeTab]);

  useEffect(() => {
    dispatch(
      getDoctorAppointsmentsById({
        vetId: location?.state?.vet?.doctorId,
        type: searchDateValue,
      })
    );
  }, [searchDateValue]);

  const setUpdatedTime = () => {
    setSlotValues({
      ...slotValues,
      startDate: new Date(),
      endDate: new Date(),
      startTime: new Date(),
      endTime: new Date(new Date().setHours(new Date().getHours() + 1)),
    });
  };

  const getTableAppointments = (appointmentsList) => {
    dispatch(showLoader());
    const reqAppointments = appointmentsList?.map((app) => {
      return {
        // appointmentId: app?._id,
        pets: app?.petName,
        userName: app?.userName,
        vets: app?.doctorName,
        dateAndTime:
          moment(app?.appoinmentDate).format("MMM DD") +
          " " +
          app?.appoimentTime,
        consultationType: app?.appoinmentType,
      };
    });
    setTableAppointments(reqAppointments);
    dispatch(hideLoader());
  };

  const handleBackBtn = () => {
    return navigate(-1);
  };

  const handleCardTableView = () => {
    setTableView(!isTableView);
    setCardView(!isCardView);
  };

  const handleSearch = () => {
    setPage(1);
    const url = `?limit=${rowsPerPage}&skip=0${
      searchValue?.length > 0 ? `&search=${searchValue}` : ""
    }${searchTypeValue ? `&type=${searchTypeValue}` : ""}${
      searchDateValue ? `&filter=${searchDateValue}` : ""
    }`;
    setTableAppointments([]);
    dispatch(
      getDoctorAppointsmentsById({
        vetId: location?.state?.vet?.doctorId,
        type: searchDateValue,
      })
    );
  };

  const handleResetBtn = () => {
    setPage(1);
    setSearchTypeValue("vet-name");
    setSearchValue("");
    setTableAppointments([]);
    dispatch(
      getDoctorAppointsmentsById({
        vetId: location?.state?.vet?.doctorId,
        type: searchDateValue,
      })
    );
  };

  const modelOpen = () => {
    handleReset();
    setModalVisible(!modalVisible);
  };

  const handleReset = () => {
    setSelectedVet(null);
    setVetValues(initialValues);
    setVetErrors(initialError);
    setVetHelps(initialHelp);
    setModalVisible(false);
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

  const handleSelect = (e, key) => {
    setVetValues({ ...vetValues, [key]: e.target.value });
  };

  const handleChange = (e) => {
    setVetValues({ ...vetValues, [e.target.name]: e.target.value });
    if (e.target.value === "") {
      setVetErrors({ ...vetErrors, [e.target.name]: true });
      setVetHelps({
        ...vetHelps,
        [e.target.name]: `${nameExpan?.[e.target.name]} Required Field`,
      });
    }
    if (e.target.value !== "") {
      setVetErrors({ ...vetErrors, [e.target.name]: false });
      setVetHelps({ ...vetHelps, [e.target.name]: "" });
    }
  };

  const getDateDiff = (endDate, startDate) => {
    const diffTime = new Date(endDate) - new Date(startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getTimeDiff = (endTime, startTime) => {
    const differenceValue =
      (new Date(endTime).getTime() - new Date(startTime).getTime()) / 1000 / 60;
    return differenceValue;
  };

  const handleSlotChange = (e) => {
    setSlotValues({ ...slotValues, [e.target.name]: e.target.value });
    if (e.target.name === "endDate" || "startDate") {
      const dateDiff = getDateDiff(
        e.target.name === "endDate" ? e.target.value : slotValues?.endDate,
        e.target.name === "startDate" ? e.target.value : slotValues?.startDate
      );
      if (dateDiff >= 0 && dateDiff < 31) setDateError(false);
      if (dateDiff > 30) setDateError(true);
    }
    if (e.target.name === "endTime" || "startTime") {
      const timeDiff = getTimeDiff(
        e.target.name === "endTime" ? e.target.value : slotValues?.endTime,
        e.target.name === "startTime" ? e.target.value : slotValues?.startTime
      );
      if (timeDiff >= 1) setTimeError(false);
      if (timeDiff < 1) setTimeError(true);
    }
    if (e.target.value === "") {
      setSlotErrors({ ...slotErrors, [e.target.name]: true });
      setSlotHelps({
        ...slotHelps,
        [e.target.name]: `${nameExpan?.[e.target.name]} Required Field`,
      });
    }
    if (e.target.value !== "") {
      if (e.target.name === "slotDuration") {
        if (e.target.value < 1) {
          setSlotErrors({ ...slotErrors, [e.target.name]: true });
          setSlotHelps({
            ...slotHelps,
            [e.target.name]:
              radioActive === "Virtual"
                ? "Min value of Duration is 1"
                : "Min value of Patient is 1",
          });
          return;
        }
      }
      setSlotErrors({ ...slotErrors, [e.target.name]: false });
      setSlotHelps({ ...slotHelps, [e.target.name]: "" });
    }
  };

  const handleBreakTimeChange = (e, i) => {
    const reqArr = breakList?.map((br) => {
      if (br?.i === i) {
        const endTime =
          e.target.name === "endTime" ? e.target.value : br?.endTime;
        const startTime =
          e.target.name === "startTime" ? e.target.value : br?.startTime;
        const timeDiff = getTimeDiff(endTime, startTime);
        const error =
          timeDiff < 15 && timeDiff > 0
            ? true
            : timeDiff < 0
            ? true
            : slotValues?.startTime > startTime
            ? true
            : slotValues?.endTime < endTime
            ? true
            : false;
        const help =
          timeDiff < 15 && timeDiff > 0
            ? "Min break value is 15"
            : slotValues?.startTime > startTime
            ? "Break Start Time is smaller than Start Time"
            : slotValues?.endTime < endTime
            ? "Break End Time is less than End Time"
            : "End time smaller than Start time";
        return {
          ...br,
          [e.target.name]: e.target.value,
          error,
          help,
        };
      }
      return br;
    });
    setBreakList(reqArr);
  };

  const handleMultiSelect = (event) => {
    const {
      target: { value },
    } = event;
    setVetValues({
      ...vetValues,
      conType: typeof value === "string" ? value.split(",") : value,
    });
    setVetErrors({
      ...vetErrors,
      conType: value?.length > 0 ? false : true,
    });
    setVetHelps({
      ...vetHelps,
      conType:
        value?.length > 0 ? "" : `${nameExpan?.["conType"]} Required Field`,
    });
  };

  const handleValidation = (values) => {
    const errorList = [];
    const woErrorList = [];
    Object.keys(values).forEach(function (key, index) {
      if (key === "slotDuration" && values?.[key] < 1) {
        return errorList?.push(key);
      }
      if (values?.[key]?.length === 0 || values?.[key] === "") {
        return errorList?.push(key);
      }
      woErrorList.push(key);
    });
    let errorObj = {};
    let errorHelperObj = {};
    let correctObj = {};
    let helperObj = {};
    //set Error
    if (errorList?.length > 0) {
      errorList?.forEach((key) => {
        errorObj = { ...errorObj, [key]: true };
        errorHelperObj = {
          ...errorHelperObj,
          [key]: `${nameExpan?.[key]} Required Field`,
        };
      });
    }
    //remove Error
    if (woErrorList?.length > 0) {
      woErrorList?.forEach((key) => {
        correctObj = { ...correctObj, [key]: false };
        helperObj = { ...helperObj, [key]: "" };
      });
    }
    setVetErrors({ ...vetErrors, ...correctObj, ...errorObj });
    setVetHelps({ ...vetHelps, ...helperObj, ...errorHelperObj });
    return { errorList, woErrorList };
  };

  const handleSubmit = async () => {
    const validation = handleValidation(vetValues);
    if (validation?.errorList?.length > 0) return;
    const form = new FormData();
    // form.append("salutation", vetValues?.salutation);
    form.append("name", vetValues?.salutation + "." + vetValues?.name);
    form.append("speciality", vetValues?.speciality);
    form.append("mobile", vetValues?.contactNumber);
    // form.append("appointmentType", vetValues?.conType);
    form.append("email", vetValues?.email);
    if (fileUploadUrl?.file) form.append("image", fileUploadUrl?.file);
    const apiSuccess = await dispatch(
      updateVet({ form, vetId: selectedVet?.vet?._id })
    );
    if (apiSuccess?.payload) {
      setModalVisible(false);
      handleReset();
      handleBackBtn();
    }
  };

  const onChangeSwitch = async (e) => {
    const apiRes = await dispatch(
      updateVetBlockStatus({
        vetId: user?.doctorId,
        active: user?.active === "N" ? "Y" : "N",
      })
    );
    if (apiRes?.payload) return navigate(-1);
  };

  const handleChangePage = (e, selectedPage) => {
    const reqSkip = (selectedPage - 1) * rowsPerPage;
    setPage(selectedPage);
    setTableAppointments([]);
    dispatch(
      getDoctorAppointsmentsById({
        vetId: location?.state?.vet?.doctorId,
        type: searchDateValue,
      })
      // getDoctorAppointsmentsById({
      //   vetId: user?._id ?? params?.vetId,
      //   url: `?limit=${rowsPerPage}&skip=${reqSkip}${
      //     searchValue?.length > 0 ? `&search=${searchValue}` : ""
      //   }${searchTypeValue ? `&type=${searchTypeValue}` : ""}`,
      // })
    );
  };

  const handleSlotModalClose = () => {
    setSlotModalVisible(!slotModalVisible);
    setRadioActive("Virtual");
    setSlotValues(initialSlotValues);
    setSlotErrors(initialSlotErrors);
    setSlotHelps(initialSlotHelps);
    setSlotDayNotSelected(false);
    setSlotSelectedDays(dayList);
    setTimeError(false);
    setDateError(false);
    setBreakList([]);
  };

  const checkDaysSelected = (list) => {
    const checkedList = list?.filter((li) => li?.isSelected);
    return checkedList?.length > 0 ? false : true;
  };

  const handleSelectedDays = (selectedDay) => {
    const requiredDays = slotSelectedDays?.map((day) => {
      if (selectedDay?.id === day?.id) {
        return { ...day, isSelected: !day?.isSelected };
      }
      return day;
    });
    setSlotSelectedDays(requiredDays);
    if (requiredDays?.length > 0) setSlotDayNotSelected(false);
    if (requiredDays?.length === 0) setSlotDayNotSelected(true);
  };

  const getSeletedDays = (dayList) => {
    const requiredDays = [];
    dayList?.forEach((day) => {
      if (day?.isSelected) {
        requiredDays.push(day?.value);
      }
    });
    return requiredDays;
  };

  const getBreakTimeError = () => {
    const reqArr = breakList?.filter((bl) => bl?.error);
    return reqArr?.length > 0 ? true : false;
  };

  const handleSlotSubmit = async () => {
    const validation = handleValidation(slotValues);
    if (validation?.errorList?.length > 0) return;
    const daysSelected = checkDaysSelected(slotSelectedDays);
    if (daysSelected) return setSlotDayNotSelected(true);
    const dateDiffInDays = getDateDiff(
      slotValues?.endDate,
      slotValues?.startDate
    );
    if (dateDiffInDays > 30) return setDateError(true);
    const timeDiffInMin = getTimeDiff(
      slotValues?.endTime,
      slotValues?.startTime
    );
    if (timeDiffInMin < 1) return setTimeError(true);
    const data = {
      days: getSeletedDays(slotSelectedDays),
      startDate: moment(new Date(slotValues?.startDate)).format("YYYY-MM-DD"),
      endDate: moment(new Date(slotValues?.endDate)).format("YYYY-MM-DD"),
      startTime: moment(new Date(slotValues?.startTime)).format("HH:mm"),
      endTime: moment(new Date(slotValues?.endTime)).format("HH:mm"),
      number: slotValues?.slotDuration,
    };
    if (breakList?.length > 0) {
      const breakTimeErr = getBreakTimeError();
      if (breakTimeErr) return setBreakTimeErr(true);
      setBreakTimeErr(false);
      const reqBreakList = breakList?.map((br) => {
        return {
          startTime: moment(new Date(br?.startTime)).format("HH:mm"),
          endTime: moment(new Date(br?.endTime)).format("HH:mm"),
        };
      });
      data.breakTime = reqBreakList;
    }
    data.type = radioActive;
    const apiRes = await dispatch(
      createClinicSlots({ doctorId: location?.state?.vet?.doctorId, data })
    );
    if (apiRes?.payload) {
      handleSlotModalClose();
      dispatch(getVetsSlots(location?.state?.vet?.doctorId ?? params?.vetId));
    }
  };

  const handleChangeRadio = (e) => {
    setRadioActive(e.target.value);
    setSlotValues({
      ...initialSlotValues,
      slotDuration: e.target.value === "Virtual" ? "15" : "4",
    });
    setSlotErrors(initialSlotErrors);
    setSlotHelps(initialSlotHelps);
    setSlotDayNotSelected(false);
    setSlotSelectedDays(dayList);
    setTimeError(false);
    setDateError(false);
    setBreakTimeErr(false);
  };

  const handleAddbreakTime = () => {
    if (breakList?.length >= 3) return;
    setBreakList([
      ...breakList,
      {
        ...breakObj,
        startTime: slotValues?.startTime,
        endTime: slotValues?.endTime,
        i: breakList?.length ?? 0,
      },
    ]);
  };

  const handleRemoveBreakTime = (i) => {
    const filteredList = breakList?.filter((br) => br?.i !== i);
    const reqList = filteredList?.map((li, index) => {
      return { ...li, i: index };
    });
    setBreakList(reqList);
  };

  return (
    <>
      <div className="com-mar mv10">
        <Grid container spacing={1}>
          <Grid item xs={12} sm={12} md={12} lg={4} xl={4}>
            <div className="left-con-white">
              <div className="flex-row">
                <div className="flex1-start">
                  {user?.image ? (
                    <img
                      alt={user?.image}
                      src={user?.image}
                      className="detail-img"
                    />
                  ) : (
                    <div className="detail-empty-img" />
                  )}
                </div>
                <div className="flex1-end">
                  <img
                    src={
                      require("../../../assets/images/svg/editIcon.svg").default
                    }
                    alt="myIcon"
                    className="cursor"
                    onClick={() => setSelectedVet(state)}
                  />
                </div>
              </div>
              <div className="left-con-box mt20">
                <div className="flex-row">
                  <div className="flex1-start">
                    <div className="text600 mv2">Name</div>
                  </div>
                  <div className="flex1-end">
                    <CustomSwitch
                      value={user?.active === "N" ? false : true}
                      onChange={onChangeSwitch}
                      greenToRed
                    />
                  </div>
                </div>

                <div className="text400 mv2">{user?.name}</div>
                <div className="text600 mv2">Specialty</div>
                <div className="text400 mv2">{user.speciality}</div>
                <div className="text600 mv2">Contact Number</div>
                <div className="text400 mv2">{user?.mobile}</div>
                <div className="text600 mv2">Email</div>
                <div className="text400 mv2">{user?.email}</div>
              </div>
              <div className="left-con-box mt20">
                <Grid container spacing={2}>
                  <Grid item xs={8} sm={8} md={8} lg={8} xl={8}>
                    <div className="text600 mv2">Consultation Type</div>
                    <div className="text400 mv2">Physical</div>
                    <div className="text400 mv2">Virtual</div>
                  </Grid>
                  <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                    <div className="text600 mv2">Fees</div>
                    <div className="text400 mv2">{user?.physicalFee}</div>
                    <div
                      className={`text400 ${
                        !user?.virtualFee ? "mt20mb2" : "mv2"
                      }`}
                    >
                      {user?.virtualFee}
                    </div>
                  </Grid>
                </Grid>
              </div>
            </div>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={8} xl={8}>
            <div className="right-con-white-wh">
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <div className="tab-sty">
                  <div
                    className={`${
                      activeTab === "Appointments"
                        ? "tab-active-btn"
                        : "tab-txt"
                    } cursor`}
                    onClick={() => setActiveTab("Appointments")}
                  >
                    Appointments
                  </div>
                  <div
                    className={`${
                      activeTab === "Availability"
                        ? "tab-active-btn"
                        : "tab-txt"
                    } cursor`}
                    onClick={() => setActiveTab("Availability")}
                  >
                    Availability
                  </div>
                </div>
              </Grid>
              {activeTab === "Appointments" ? (
                <>
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <SearchRow
                      leftBtnTxt="Reset"
                      rightBtnTxt="Search"
                      tableView={isTableView}
                      cardView={isCardView}
                      onClickCardView={handleCardTableView}
                      onClickTableView={handleCardTableView}
                      onSerchChange={(e) => setSearchValue(e.target.value)}
                      searchValue={searchValue}
                      searchTypeList={paymentSearchTypeList}
                      searchTypeValue={searchTypeValue}
                      handleChangeSearchValue={(e) =>
                        setSearchTypeValue(e.target.value)
                      }
                      onClickBlueBtn={handleSearch}
                      onClickRedBtn={handleResetBtn}
                      isCustomSty
                    />
                  </Grid>
                  <Grid
                    container
                    spacing={0}
                    direction="row"
                    alignItems="center"
                  >
                    <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                      <div className="flex-start mar-min7">
                        <CustomSelect
                          label="Search By Date"
                          list={dateFilterTodayLastWeek}
                          value={searchDateValue}
                          handleChange={(e) =>
                            setSearchDateValue(e.target.value)
                          }
                        />
                      </div>
                    </Grid>
                    <Grid item xs={8} sm={8} md={8} lg={8} xl={8}>
                      <div className="right-txt">
                        <div
                          style={{
                            fontFamily: "Montserrat",
                            color: "#838383",
                            fontSize: 14,
                          }}
                        >
                          {`No of Appointments: ${appointments?.totalRecords}`}
                        </div>
                      </div>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <div style={{ overflow: "scroll", height: 300 }}>
                      <Table
                        columns={appointmentTableHeaders}
                        datas={tableAppintments}
                        isCustomTableSty
                        page={page}
                        rowsPerPage={rowsPerPage}
                        totalRecords={appointments?.totalRecords}
                        handleChangePage={handleChangePage}
                      />
                    </div>
                  </Grid>
                </>
              ) : activeTab === "Availability" ? (
                <div className="mlr10mtb20">
                  <div className="mt20 mb20">
                    <Grid container spacing={2}>
                      <Grid item xs={6} sm={6} md={9} lg={9} xl={9}>
                        <div className="text-bold-12 blue-color align-center">
                          Virtual consulting hours
                        </div>
                      </Grid>
                      <Grid item xs={6} sm={6} md={3} lg={3} xl={3}>
                        <div className="flex1-end">
                          <CustomButton
                            text="Add Slot"
                            onClick={() =>
                              setSlotModalVisible(!slotModalVisible)
                            }
                            smallBtn
                          />
                        </div>
                      </Grid>
                      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Divider />
                      </Grid>
                      {slots?.length > 0
                        ? slots
                            ?.filter((sl) => sl?.type === "Virtual")
                            ?.map((slot, i) => (
                              <Grid
                                container
                                spacing={2}
                                key={i}
                                className={i > 0 ? "mt10" : ""}
                              >
                                <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                                  <div className="flex-row mh20 mt10">
                                    <div className="text-bold-12">
                                      From Date:
                                    </div>
                                    <div className="text-12 ml5">
                                      {moment(slot?.startDate).format(
                                        "DD/MM/YYYY"
                                      )}
                                    </div>
                                  </div>
                                </Grid>
                                <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                                  <div className="flex-row mh20 mt10">
                                    <div className="text-bold-12">
                                      End Date:
                                    </div>
                                    <div className="text-12 ml5">
                                      {moment(slot?.endDate).format(
                                        "DD/MM/YYYY"
                                      )}
                                    </div>
                                  </div>
                                </Grid>
                                <Grid
                                  item
                                  xs={12}
                                  sm={12}
                                  md={12}
                                  lg={12}
                                  xl={12}
                                >
                                  <div className="days-row">
                                    {dayList?.map((day, i) => {
                                      return (
                                        <div
                                          key={i}
                                          className={
                                            slot?.days?.find(
                                              (d) => day?.value === d
                                            )
                                              ? "day-selected"
                                              : "day-unselected"
                                          }
                                        >
                                          {day?.shortName}
                                        </div>
                                      );
                                    })}
                                  </div>
                                </Grid>
                                <Grid
                                  item
                                  xs={12}
                                  sm={12}
                                  md={12}
                                  lg={12}
                                  xl={12}
                                >
                                  <div className="flex1-end">
                                    <div
                                      className="flex-row blue-tran-btn cursor ml10"
                                      onClick={() => {
                                        navigate(
                                          `/manage-slot/${
                                            user?._id ?? params?.vetId
                                          }/${slot?.slotId}`,
                                          {
                                            state: {
                                              clinicName: state?.clinicName,
                                              vetId: user?._id ?? params?.vetId,
                                              slotId: slot?.slotId,
                                              slotType: "Virtual",
                                            },
                                          }
                                        );
                                      }}
                                    >
                                      <div className="red-color text-bold-12">
                                        Manage
                                      </div>
                                    </div>
                                  </div>
                                </Grid>
                              </Grid>
                            ))
                        : null}
                    </Grid>
                  </div>

                  <div className="mt20 mb20">
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <div className="text-bold-12 blue-color align-center">
                          Physical consulting hours
                        </div>
                      </Grid>
                      <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Divider />
                      </Grid>
                      {slots?.length > 0
                        ? slots
                            ?.filter((sl) => sl?.type === "Physical")
                            ?.map((slot, i) => (
                              <Grid
                                container
                                spacing={2}
                                key={i}
                                className={i > 0 ? "mt10" : ""}
                              >
                                <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                                  <div className="flex-row mh20 mt10">
                                    <div className="text-bold-12">
                                      From Date:
                                    </div>
                                    <div className="text-12 ml5">
                                      {moment(slot?.startDate).format(
                                        "DD/MM/YYYY"
                                      )}
                                    </div>
                                  </div>
                                </Grid>
                                <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                                  <div className="flex-row mh20 mt10">
                                    <div className="text-bold-12">
                                      End Date:
                                    </div>
                                    <div className="text-12 ml5">
                                      {moment(slot?.endDate).format(
                                        "DD/MM/YYYY"
                                      )}
                                    </div>
                                  </div>
                                </Grid>
                                <Grid
                                  item
                                  xs={12}
                                  sm={12}
                                  md={12}
                                  lg={12}
                                  xl={12}
                                >
                                  <div className="days-row">
                                    {dayList?.map((day, i) => {
                                      return (
                                        <div
                                          key={i}
                                          className={
                                            slot?.days?.find(
                                              (d) => day?.value === d
                                            )
                                              ? "day-selected"
                                              : "day-unselected"
                                          }
                                        >
                                          {day?.shortName}
                                        </div>
                                      );
                                    })}
                                  </div>
                                </Grid>
                                <Grid
                                  item
                                  xs={12}
                                  sm={12}
                                  md={12}
                                  lg={12}
                                  xl={12}
                                >
                                  <div className="flex1-end">
                                    <div
                                      className="flex-row blue-tran-btn cursor"
                                      onClick={() => {
                                        navigate(
                                          `/manage-slot/${
                                            user?._id ?? params?.vetId
                                          }/${slot?.slotId}`,
                                          {
                                            state: {
                                              clinicName: state?.clinicName,
                                              vetId: user?._id ?? params?.vetId,
                                              slotId: slot?.slotId,
                                              slotType: "Physical",
                                            },
                                          }
                                        );
                                      }}
                                    >
                                      <div className="red-color text-bold-12">
                                        Manage
                                      </div>
                                    </div>
                                  </div>
                                </Grid>
                              </Grid>
                            ))
                        : null}
                    </Grid>
                  </div>
                </div>
              ) : null}
            </div>
          </Grid>
        </Grid>
      </div>
      <CustomModal
        open={modalVisible}
        onClose={modelOpen}
        header="Modify"
        headerCenter
        modal
        modalWidth={50}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <CustomUpload
              uploadText={"Tab to add a profile picture"}
              onUploadFile={onUploadFile}
              value={fileUploadUrl?.imagePreviewUrl}
              center
              imageHeight={75}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
            <Select
              list={salutationList}
              value={vetValues?.salutation}
              handleChange={(e) => handleSelect(e, "salutation")}
              name="salutation"
              label={nameExpan?.["salutation"]}
              select
              error={vetErrors.salutation}
              helperText={vetHelps?.salutation}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
            <CustomTextField
              label={nameExpan?.["name"]}
              placeholder={nameExpan?.["name"]}
              name="name"
              fullWidth
              handleChange={handleChange}
              value={vetValues?.name}
              helperText={vetHelps?.name}
              error={vetErrors?.name}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <Select
              list={specialtyList}
              value={vetValues?.speciality}
              handleChange={(e) => handleSelect(e, "speciality")}
              name="speciality"
              label={nameExpan?.["speciality"]}
              select
              error={vetErrors.speciality}
              helperText={vetHelps?.speciality}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <CustomTextField
              label={nameExpan?.["contactNumber"]}
              placeholder={nameExpan?.["contactNumber"]}
              name="contactNumber"
              fullWidth
              handleChange={handleChange}
              value={vetValues?.contactNumber}
              helperText={vetHelps?.contactNumber}
              error={vetErrors?.contactNumber}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <Select
              list={typeList}
              value={vetValues?.conType}
              handleChange={handleMultiSelect}
              multiSelectTagCheck
              label={nameExpan?.["conType"]}
              error={vetErrors?.conType}
              helperText={vetHelps?.conType}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <CustomTextField
              label={nameExpan?.["email"]}
              placeholder={nameExpan?.["email"]}
              name="email"
              fullWidth
              handleChange={handleChange}
              value={vetValues?.email}
              helperText={vetHelps?.email}
              error={vetErrors?.email}
              disabled={selectedVet?._id ? true : false}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <div className="clinic-mod-btn-pos">
              <div className="mr10">
                <CustomButton text="Reset" onClick={handleReset} grayBtn />
              </div>
              <div className="ml10">
                <CustomButton
                  text={selectedVet?._id ? "Update" : "Register"}
                  onClick={handleSubmit}
                />
              </div>
            </div>
          </Grid>
        </Grid>
      </CustomModal>
      <CustomModal
        open={slotModalVisible}
        onClose={handleSlotModalClose}
        header="Add Slot"
        headerCenter
        modal
        modalWidth={50}
      >
        <div className="scroll-60vh">
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <div className="flex-row">
                <div className="text-bold flex-center">Consultation Type</div>
                <div className="flex-center ml15">
                  <Checkbox
                    radio
                    onChange={handleChangeRadio}
                    radios={conTypeDrop}
                    defaultValue={radioActive ?? conTypeDrop?.[0]}
                  />
                </div>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
              <CustomTextField
                label={nameExpan?.["startDate"]}
                placeholder={nameExpan?.["startDate"]}
                name="startDate"
                fullWidth
                handleChange={handleSlotChange}
                value={slotValues?.startDate}
                helperText={slotHelps?.startDate}
                error={slotErrors?.startDate}
                mobileDate
              />
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
              <CustomTextField
                label={nameExpan?.["endDate"]}
                placeholder={nameExpan?.["endDate"]}
                name="endDate"
                fullWidth
                handleChange={handleSlotChange}
                value={slotValues?.endDate}
                helperText={slotHelps?.endDate}
                error={slotErrors?.endDate}
                mobileDate
                minDate={slotValues?.startDate}
              />
            </Grid>
            {dateError ? (
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <FormHelperText error>
                  Please choose date range between 30 days
                </FormHelperText>
              </Grid>
            ) : null}
            <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
              <CustomTextField
                label={nameExpan?.["startTime"]}
                placeholder={nameExpan?.["startTime"]}
                name="startTime"
                fullWidth
                handleChange={handleSlotChange}
                value={slotValues?.startTime}
                helperText={slotHelps?.startTime}
                error={slotErrors?.startTime}
                mobileTime
                is12HourFomat={false}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
              <CustomTextField
                label={nameExpan?.["endTime"]}
                placeholder={nameExpan?.["endTime"]}
                name="endTime"
                fullWidth
                handleChange={handleSlotChange}
                value={slotValues?.endTime}
                helperText={slotHelps?.endTime}
                error={slotErrors?.endTime}
                mobileTime
                is12HourFomat={false}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
              <CustomTextField
                label={
                  radioActive === "Virtual"
                    ? nameExpan?.["slotDuration"]
                    : nameExpan?.["noOfPatientsPerHour"]
                }
                placeholder={
                  radioActive === "Virtual"
                    ? nameExpan?.["slotDuration"]
                    : nameExpan?.["noOfPatientsPerHour"]
                }
                name="slotDuration"
                fullWidth
                handleChange={handleSlotChange}
                value={slotValues?.slotDuration}
                helperText={slotHelps?.slotDuration}
                error={slotErrors?.slotDuration}
                type="number"
                endIcon
                inputIcon={radioActive === "Virtual" ? "mins" : "/hr"}
              />
            </Grid>
            {timeError ? (
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <FormHelperText error>
                  End time smaller than Start time
                </FormHelperText>
              </Grid>
            ) : null}
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <div className="text-bold">Days</div>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <>
                <div className="flex-row-wrap ml5 mr5">
                  {slotSelectedDays?.map((day, i) => (
                    <Checkbox
                      label={day?.name}
                      checked={day?.isSelected}
                      key={i}
                      onChange={(e) => handleSelectedDays(day)}
                    />
                  ))}
                </div>
                {slotDayNotSelected ? (
                  <FormHelperText error>
                    Please Select at least one day
                  </FormHelperText>
                ) : null}
              </>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <div className="flex-row text-bold align-center-wh">
                Break Time
                <div className="text ml5">(Without slots)</div>
                {breakList?.length < 3 ? (
                  <AddCircleIcon
                    sx={{ color: AppColors.appPrimary }}
                    onClick={handleAddbreakTime}
                    className="cursor"
                  />
                ) : null}
              </div>
            </Grid>
            {breakList?.length > 0
              ? breakList?.map((br, i) => (
                  <div className="mlr20mtb10 w100Per" key={i}>
                    <Grid container key={i} spacing={2}>
                      <Grid item xs={5} sm={5} md={4} lg={4} xl={4}>
                        <CustomTextField
                          label={nameExpan?.["startTime"]}
                          placeholder={nameExpan?.["startTime"]}
                          name="startTime"
                          fullWidth
                          handleChange={(e) => handleBreakTimeChange(e, i)}
                          value={br?.startTime}
                          error={br?.error}
                          helperText={br?.error ? br?.help : null}
                          mobileTime
                          is12HourFomat={false}
                        />
                      </Grid>
                      <Grid item xs={5} sm={5} md={4} lg={4} xl={4}>
                        <CustomTextField
                          label={nameExpan?.["endTime"]}
                          placeholder={nameExpan?.["endTime"]}
                          name="endTime"
                          fullWidth
                          handleChange={(e) => handleBreakTimeChange(e, i)}
                          value={br?.endTime}
                          error={br?.error}
                          helperText={br?.error ? br?.help : null}
                          mobileTime
                          is12HourFomat={false}
                        />
                      </Grid>
                      <Grid item xs={2} sm={2} md={4} lg={4} xl={4}>
                        <RemoveCircleIcon
                          sx={{ color: AppColors.redBtn }}
                          className="cursor align-center-h50"
                          onClick={() => handleRemoveBreakTime(i)}
                        />
                      </Grid>
                      {/* {br?.error ? (
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                          <FormHelperText error>{br?.help}</FormHelperText>
                        </Grid>
                      ) : null} */}
                    </Grid>
                  </div>
                ))
              : null}
            {breakTimeErr ? (
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <FormHelperText error>
                  Provide valid break time list
                </FormHelperText>
              </Grid>
            ) : null}

            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <div className="flex1-center">
                <Grid item xs={6} sm={4} md={3} lg={2} xl={2}>
                  <CustomButton text="Save" onClick={handleSlotSubmit} />
                </Grid>
              </div>
            </Grid>
          </Grid>
        </div>
      </CustomModal>
    </>
  );
};

export default VetDetails;
