import AddCircleIcon from "@mui/icons-material/AddCircle";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import {
  Dialog,
  DialogActions,
  DialogTitle,
  Divider,
  FormHelperText,
  Grid,
} from "@mui/material";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  default as Button,
  default as CustomButton,
} from "../../../components/CustomButton";
import Checkbox from "../../../components/CustomCheckbox";
import CustomModal from "../../../components/CustomModal/CustomModal";
import CustomSwitch from "../../../components/CustomSwitch";
import CustomTextField from "../../../components/CustomTextField";
import TopBar from "../../../components/TopBar/TopBar";
import Header from "../../../layouts/header";
import { createClinicSlots } from "../../../redux/reducers/clinicSlice";
import {
  getDoctorSlotDetilsById,
  getDoctorSlots,
} from "../../../redux/reducers/doctorSlice";
import {
  updateSlotStatusMultiple,
  updateSlotStatusVetByDayId,
} from "../../../redux/reducers/vetSlice";
import { AppColors } from "../../../util/AppColors";
import { dayList } from "../../../util/arrayList";
import "./VetAvailability.css";

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

const VetAvailability = () => {
  const dispatch = useDispatch();
  const virtualSlots = useSelector((state) => state.doctor.virtualSlots);
  const physicalSlots = useSelector((state) => state.doctor.physicalSlots);
  const [slotModalVisible, setSlotModalVisible] = useState(false);
  const [radioActive, setRadioActive] = useState("Virtual");
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [slotValues, setSlotValues] = useState(initialSlotValues);
  const [slotHelps, setSlotHelps] = useState(initialSlotHelps);
  const [slotErrors, setSlotErrors] = useState(initialSlotErrors);
  const [dateError, setDateError] = useState(false);
  const [slotSelectedDays, setSlotSelectedDays] = useState(dayList);
  const [slotDayNotSelected, setSlotDayNotSelected] = useState(false);
  const [timeError, setTimeError] = useState(false);
  const [breakList, setBreakList] = useState([]);
  const [breakTimeErr, setBreakTimeErr] = useState(false);
  const [tableSlots, setTableSlots] = useState([]);
  const [selectedSlotType, setSelectedSlotType] = useState("Virtual");
  const vetSlots = useSelector((state) => state.doctor.slotDetails);
  const [selectedDayId, setSelectedDayId] = useState(null);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSwitchValue, setSelectedSwitchValue] = useState(null);
  const [selectedSlotId, setSelectedSlotId] = useState(null);

  useEffect(() => {
    dispatch(getDoctorSlots());
    setUpdatedTime();
  }, []);

  useEffect(() => {
    setTableSlots(vetSlots);
    if (selectedDayId) handleSelectedRow(selectedDayId);
  }, [vetSlots]);

  const setUpdatedTime = () => {
    setSlotValues({
      ...slotValues,
      startDate: new Date(),
      endDate: new Date(),
      startTime: new Date(),
      endTime: new Date(new Date().setHours(new Date().getHours() + 1)),
    });
  };

  const handleSelectedRow = (slotId) => {
    if (selectedDayId === slotId) return setSelectedDayId(null);
    setSelectedDayId(slotId);
    setSelectedSlots([]);
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
    setSelectedSlot(null);
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

  const handleRemoveBreakTime = (i) => {
    const filteredList = breakList?.filter((br) => br?.i !== i);
    const reqList = filteredList?.map((li, index) => {
      return { ...li, i: index };
    });
    setBreakList(reqList);
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
    return { errorList, woErrorList };
  };

  const checkDaysSelected = (list) => {
    const checkedList = list?.filter((li) => li?.isSelected);
    return checkedList?.length > 0 ? false : true;
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

    if (dateDiffInDays > 30 || dateDiffInDays < 0) return setDateError(true);

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
    // data.clinic = await localStorage.getItem("hospitalId");
    data.type = radioActive;
    const apiRes = dispatch(createClinicSlots(data));
    if (apiRes?.payload) {
      handleSlotModalClose();
      dispatch(getDoctorSlots());
    }

    // if (radioActive === "Virtual") {
    //   const apiRes = await dispatch(storeDoctorVirtualSlots(data));
    // } else if (radioActive === "Physical") {
    //   const apiRes = await dispatch(storeDoctorPhysicalSlots(data));
    // }
  };

  const getSlotIsSelectedOrNot = (slot) => {
    return selectedSlots?.find((sl) => sl?.slotTimeId === slot?.slotTimeId);
  };

  const getTimeSlotWithFormat = (slot) => {
    return slot?.split("-").shift();
  };

  const handleSelectedSlot = (slot) => {
    const isSlotPreAvail = selectedSlots?.find(
      (sl) => sl?.slotTimeId === slot?.slotTimeId
    );
    let reqArr = [];
    if (isSlotPreAvail) {
      reqArr = selectedSlots?.filter(
        (sl) => sl?.slotTimeId !== slot?.slotTimeId
      );
    } else {
      reqArr = [...selectedSlots, slot];
    }
    setSelectedSlots(reqArr);
  };

  const handleDialogClose = () => setDialogOpen(!dialogOpen);

  const onChangeSwitch = async (d) => {
    const apiRes = await dispatch(updateSlotStatusVetByDayId(d?.slotdayId));

    if (apiRes?.payload) {
      dispatch(getDoctorSlotDetilsById(selectedSlotId));
      setSelectedSwitchValue(null);
      setSelectedDayId(null);
      setDialogOpen(false);
    }
  };

  const handleUnAvailableSlots = async () => {
    if (selectedSwitchValue) return onChangeSwitch(selectedSwitchValue);
    const timeIds = selectedSlots?.map((slot) => {
      return slot?.slotTimeId;
    });
    const apiRes = await dispatch(updateSlotStatusMultiple({ timeIds }));

    if (apiRes?.payload) {
      dispatch(getDoctorSlotDetilsById(selectedSlotId));
      setSelectedDayId(null);
      setSelectedSlots([]);
    }
    handleDialogClose();
  };

  const handleManage = (type, slotId) => {
    setSelectedSlotType(type);
    setSelectedDayId(null);
    setSelectedSlotId(slotId);
    setTableSlots([]);
    setSelectedSlots([]);
    dispatch(getDoctorSlotDetilsById(slotId));
  };

  return (
    <>
      <Header name="Vetinstant" />
      <TopBar name="Availability" rightVerBtnShow={false} />
      <div className="com-mar">
        <Grid container spacing={1}>
          <Grid item xs={12} sm={12} md={12} lg={4} xl={4}>
            <div className="left-con-white">
              <div className="ph10">
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={6} md={8} lg={8} xl={8}>
                    <div className="text-bold-12 blue-color align-center">
                      Virtual consulting hours
                    </div>
                  </Grid>
                  <Grid item xs={6} sm={6} md={4} lg={4} xl={4}>
                    <div className="flex1-end">
                      <CustomButton
                        text="Add Slot"
                        onClick={() => setSlotModalVisible(!slotModalVisible)}
                        smallBtn
                      />
                    </div>
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Divider />
                  </Grid>
                  {virtualSlots?.length > 0
                    ? virtualSlots?.map((slot, i) => (
                        <>
                          <Grid
                            container
                            spacing={2}
                            key={i}
                            className={i > 0 ? "mt10" : ""}
                          >
                            <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                              <div className="flex-row mt10 ml15">
                                <div className="text-bold-12">From Date:</div>
                                <div className="text-12 ml5">
                                  {moment(slot?.startDate).format("DD/MM/YYYY")}
                                </div>
                              </div>
                            </Grid>
                            <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                              <div className="flex-row mt10 ml15">
                                <div className="text-bold-12">End Date:</div>
                                <div className="text-12 ml5">
                                  {moment(slot?.endDate).format("DD/MM/YYYY")}
                                </div>
                              </div>
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
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
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                              <div className="flex-row">
                                <div className="text400 ml15">
                                  {/* 12 - 1 pm, 3 - 4 pm, 6 - 7 pm */}
                                </div>
                                <div className="flex1-end">
                                  <div
                                    className="flex-row blue-tran-btn cursor ml10"
                                    onClick={() => {
                                      handleManage("Virtual", slot?.slotId);
                                    }}
                                  >
                                    <div className="red-color text-bold-12">
                                      Manage
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Grid>
                          </Grid>
                        </>
                      ))
                    : null}
                </Grid>
              </div>
              <div className="ph10 mt20 mb20">
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <div className="text-bold-12 blue-color align-center">
                      Physical consulting hours
                    </div>
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Divider />
                  </Grid>
                  {physicalSlots?.length > 0
                    ? physicalSlots?.map((slot, i) => (
                        <>
                          <Grid
                            container
                            spacing={2}
                            key={i}
                            className={i > 0 ? "mt10" : ""}
                          >
                            <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                              <div className="flex-row mt10 ml15">
                                <div className="text-bold-12">From Date:</div>
                                <div className="text-12 ml5">
                                  {moment(slot?.startDate).format("DD/MM/YYYY")}
                                </div>
                              </div>
                            </Grid>
                            <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                              <div className="flex-row mt10 ml15">
                                <div className="text-bold-12">End Date:</div>
                                <div className="text-12 ml5">
                                  {moment(slot?.endDate).format("DD/MM/YYYY")}
                                </div>
                              </div>
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
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
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                              <div className="flex-row">
                                <div className="text400 ml15">
                                  {/* 12 - 1 pm, 3 - 4 pm, 6 - 7 pm */}
                                </div>
                                <div className="flex1-end">
                                  <div
                                    className="flex-row blue-tran-btn cursor"
                                    onClick={() => {
                                      handleManage("Physical", slot?.slotId);
                                    }}
                                  >
                                    <div className="red-color text-bold-12">
                                      Manage
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Grid>
                          </Grid>
                        </>
                      ))
                    : null}
                </Grid>
              </div>
            </div>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={8} xl={8}>
            <div className="right-con-white-wh">
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <div className="tab-sty">
                  <div className="tab-txt ml15">Manage slots</div>
                </div>
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <div className="top-emp-space" />
                <div className="vetAvail-table-head">
                  <div className="blue-bold-txt w15Per">Date</div>
                  <div className="blue-bold-txt w25Per">Days</div>
                  <div className="blue-bold-txt w35Per">Consultation Type</div>
                  <div className="blue-bold-txt w20Per">Status</div>
                  <div className="blue-bold-txt w5Per" />
                </div>
                {tableSlots?.length > 0 ? (
                  tableSlots?.map((ts, i) => (
                    <>
                      <div key={i} className="vetAvail-table-data-row">
                        <div className="text400 w15Per">
                          {moment(ts?.slotDate).format("YYYY-MMM-DD")}
                        </div>
                        <div className="text400 w25Per capitalize">
                          {moment(ts?.slotDate).format("dddd")}
                        </div>
                        <div className="text400 w35Per">{selectedSlotType}</div>
                        <div className="text400 w20Per">
                          <CustomSwitch
                            value={ts?.status === "N" ? false : true}
                            onChange={() => {
                              if (ts?.status === "N") return onChangeSwitch(ts);
                              setSelectedSwitchValue(ts);
                              setDialogOpen(!dialogOpen);
                            }}
                            greenToRed
                          />
                        </div>
                        <div
                          className="text400 w5Per"
                          onClick={() => handleSelectedRow(ts?.slotTimeId)}
                        >
                          {selectedDayId === ts?.slotTimeId ? (
                            <ExpandLessIcon
                              sx={{ color: AppColors.appPrimary }}
                            />
                          ) : (
                            <ExpandMoreIcon
                              sx={{ color: AppColors.appPrimary }}
                            />
                          )}
                        </div>
                      </div>
                      {selectedDayId === ts?.slotTimeId ? (
                        <div className="vetAvail-selected-row">
                          <div className="w80Per">
                            {ts?.slotTime.length > 0 ? (
                              <div className="manageslot-row">
                                {ts?.slotTime?.map((t, inx) => (
                                  <div
                                    className={`text400 cursor ${
                                      getSlotIsSelectedOrNot(t)
                                        ? "vetAvail-selected-slot"
                                        : t?.status === "N"
                                        ? "vetAvail-unavailable"
                                        : "vetAvail-slot"
                                    }`}
                                    key={inx}
                                    onClick={() => handleSelectedSlot(t)}
                                  >
                                    {getTimeSlotWithFormat(t?.time)}
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text400">No slots available</div>
                            )}
                          </div>
                          {selectedSlots?.length > 0 ? (
                            <div
                              className="text-bold red-color w20Per jus-cen cursor"
                              onClick={handleDialogClose}
                            >
                              Mark as Unavailable
                            </div>
                          ) : null}
                        </div>
                      ) : null}
                    </>
                  ))
                ) : (
                  <div className="no-rec">No records available</div>
                )}
              </Grid>
            </div>
          </Grid>
        </Grid>
      </div>
      <Dialog
        open={dialogOpen}
        onClose={handleDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          <div className="text-bold blue-color">Mark as unavailable</div>
          <div className="text400 mv10">
            Are you sure you want mark the slots as unavailable?
          </div>
        </DialogTitle>

        <DialogActions>
          <div className="flex1-center">
            <Grid container spacing={2}>
              <div className="w50Per flex1-center">
                <Grid item xs={6} sm={4} md={2} lg={2} xl={2}>
                  <Button onClick={handleDialogClose} text="Cancel" smallBtn />
                </Grid>
              </div>
              <div className="w50Per flex1-center">
                <Grid item xs={6} sm={4} md={2} lg={2} xl={2}>
                  <Button
                    autoFocus
                    text="Confirm"
                    redBtn
                    smallBtn
                    onClick={handleUnAvailableSlots}
                  />
                </Grid>
              </div>
            </Grid>
          </div>
        </DialogActions>
      </Dialog>
      <CustomModal
        open={slotModalVisible}
        onClose={handleSlotModalClose}
        header={`${selectedSlot ? "Edit" : "Add"} Slot`}
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
                    radios={[
                      { label: "Virtual", value: "Virtual" },
                      { label: "Physical", value: "Physical" },
                    ]}
                    defaultValue={radioActive ?? "Virtual"}
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
                  {slotValues?.startDate > slotValues?.endDate
                    ? "End Date is smaller than Start Date"
                    : "Please choose date range between 30 days"}
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

export default VetAvailability;
