import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Dialog,
  DialogActions,
  DialogTitle,
  Grid,
  Typography,
} from "@mui/material";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Button from "../../../components/CustomButton";
import CustomSwitch from "../../../components/CustomSwitch";
import TopBar from "../../../components/TopBar/TopBar";
import Header from "../../../layouts/header";
import {
  getSlotDetailsBySlotId,
  getVirtualSlotsBySlotId,
  updateSlotStatusByDayId,
  updateSlotStatusMultiple,
} from "../../../redux/reducers/vetSlice";
import { AppColors } from "../../../util/AppColors";
import "./ManageSlot.css";
import VetAndUpcomingAppointments from "../VetAndUpcomingAppointments/VetAndUpcomingAppointments";
import CustomButton from "../../../components/CustomButton";
import Select from "../../../components/Select/Select";
import NavigateNextOutlinedIcon from "@mui/icons-material/NavigateNextOutlined";
import NavigateBeforeOutlinedIcon from "@mui/icons-material/NavigateBeforeOutlined";
import {
  doctorSlotDayByDisable,
  doctorSlotTimeByDisable,
  getSlotById,
} from "../../../redux/reducers/clinicSlice";
import { hideLoader, showLoader } from "../../../redux/reducers/loaderSlice";

const ManageSlot = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const params = useParams();
  const slotData = useSelector((state) => state.clinic.getSlot);
  const vetSlotDetails = useSelector((state) => state.vet.slotDetails);
  const [selectedDayId, setSelectedDayId] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [selectedSwitchValue, setSelectedSwitchValue] = useState(null);
  const [selectedType, setSelectedType] = useState("today");
  const [selectMode, setSelectMode] = useState("all");
  const [selectedTimeIds, setSelectedTimeIds] = useState([]);

  useState(() => {
    if (location?.state?.slotId || params?.slotId) {
      dispatch(
        getSlotDetailsBySlotId(params?.slotId ?? location?.state?.slotId)
      );
    }
  }, []);

  useEffect(() => {
    getSlotData();
  }, [selectMode, selectedType, params?.vetId]);

  useEffect(() => {
    if (selectedDayId) handleSelectedRow(selectedDayId);
  }, [vetSlotDetails]);

  const getSlotsDetailsByType = (typ) => {
    return slotData?.filter((slot) => slot.type === typ);
  };

  const handleSelectedRow = (id) => {
    if (selectedDayId === id) return setSelectedDayId(null);
    setSelectedDayId(id);
    setSelectedSlots([]);
  };

  const handleDialogClose = () => setDialogOpen(!dialogOpen);

  const handleUnAvailableSlots = async () => {
    if (selectedSwitchValue) return onChangeSwitch(selectedSwitchValue);

    const timeIds = selectedSlots?.map((slot) => {
      return slot?.slotTimeId;
    });

    const apiRes = await dispatch(updateSlotStatusMultiple({ timeIds }));
    if (apiRes?.payload) {
      setSelectedDayId(null);
      setSelectedSlots([]);
      dispatch(
        getSlotDetailsBySlotId(params?.slotId ?? location?.state?.slotId)
      );
    }

    handleDialogClose();
  };

  const getTimeSlotWithFormat = (slot) => {
    return slot?.split("-").shift();
  };

  // const handleSelectedSlot = (slot) => {
  //   const isSlotPreAvail = selectedSlots?.find((sl) => sl === slot);
  //   // const isSlotPreAvail = selectedSlots?.find(
  //   //   (sl) => sl?.slotTimeId === slot?.slotTimeId
  //   // );
  //   console.log("isSlotPreAvail------>>",isSlotPreAvail)
  //   let reqArr = [];
  //   if (isSlotPreAvail) {
  //     reqArr = selectedSlots?.filter((sl) => sl !== slot);
  //     // reqArr = selectedSlots?.filter(
  //     //   (sl) => sl?.slotTimeId !== slot?.slotTimeId
  //     // );
  //     console.log("reqArr------>>",reqArr)

  //   } else {
  //     reqArr = [...selectedSlots, slot];
  //     console.log("reqArrelse------>>",reqArr)

  //   }
  //   setSelectedSlots(reqArr);
  //   console.log("selectedsolt------>>",selectedSlots)

  // };

  // const handleSelectedSlot = (timeSlot) => {
  //   console.log("solt------->>", timeSlot);
  //   setSelectedSlots((prevSelectedSlots) => {
  //     if (prevSelectedSlots.includes(timeSlot)) {
  //       return prevSelectedSlots.filter((slot) => slot !== timeSlot);
  //     } else {
  //       return [...prevSelectedSlots, timeSlot];
  //     }
  //   });

  //   const body = {
  //     timeIds: [timeSlot.slotTimeId],
  //   };
  //   dispatch(doctorSlotTimeByDisable(body));

  // };
  const handleSelectedSlot = (slot) => {
    if (!selectedDayId) setSelectedDayId(slot?.slotdayId);

    if (
      slot?.slotdayId ===
      (selectedDayId !== null ? selectedDayId : slot?.slotdayId)
    ) {
      const prevSlot = selectedSlots?.find(
        (ss) => ss?.slotTimeId === slot?.slotTimeId
      );
      if (prevSlot) {
        const reqSlots = selectedSlots?.filter(
          (sts) => sts?.slotTimeId !== slot?.slotTimeId
        );
        if (reqSlots?.length === 0) setSelectedDayId(null);
        return setSelectedSlots(reqSlots);
      }
      setSelectedSlots([...selectedSlots, slot]);
    }
    // setSelectedSlots((prevSelectedSlots) => {
    //   let newSelectedSlots;
    //   let newSelectedTimeIds;

    //   if (prevSelectedSlots.includes(timeSlot)) {
    //     newSelectedSlots = prevSelectedSlots.filter(
    //       (slot) => slot !== timeSlot
    //     );
    //     newSelectedTimeIds = selectedTimeIds.filter(
    //       (id) => id !== timeSlot.slotTimeId
    //     );
    //   } else {
    //     newSelectedSlots = [...prevSelectedSlots, timeSlot];
    //     newSelectedTimeIds = [...selectedTimeIds, timeSlot.slotTimeId];
    //   }
    //   setSelectedTimeIds(newSelectedTimeIds);

    //   // Dispatch the action with the updated timeIds
    //   const body = { timeIds: newSelectedTimeIds };

    //   dispatch(doctorSlotTimeByDisable(body));
    //   return newSelectedSlots;
    // });
  };

  const handleMarkAsUnAvailable = async () => {
    const timeIds = selectedSlots?.map((slts) => slts?.slotTimeId);
    const apiRes = await dispatch(doctorSlotTimeByDisable({ timeIds }));
    if (apiRes?.payload) {
      getSlotData();
      setSelectedDayId(null);
      setSelectedSlots([]);
    }
  };

  const onChangeSwitch = async (d, slot) => {
    const data = { vetId: params?.vetId, slotdayId: slot?.slotdayId };
    dispatch(doctorSlotDayByDisable(data)).then(async (res) => {
      if (selectedType === "today") {
        const date = moment(new Date()).format("YYYY-MM-DD");
        const url = `?filter=${selectMode}&type=${selectedType}&date=${date}`;
        const vetId = params?.vetId;
        const metaData = { vetId, url };
        await dispatch(getSlotById(metaData));
      } else {
        const url = `?filter=${selectMode}&type=${selectedType}`;
        const vetId = params?.vetId;
        const metaData = { vetId, url };
        await dispatch(getSlotById(metaData));
      }
    });
  };

  const getSlotData = async () => {
    if (selectedType === "today") {
      const date = moment(new Date()).format("YYYY-MM-DD");
      const url = `?filter=${selectMode}&type=${selectedType}&date=${date}`;
      const vetId = params?.vetId;
      const metaData = { vetId, url };
      await dispatch(getSlotById(metaData));
    } else {
      const url = `?filter=${selectMode}&type=${selectedType}`;
      const vetId = params?.vetId;
      const metaData = { vetId, url };
      await dispatch(getSlotById(metaData));
    }
  };

  const handleSelectType = async (type) => {
    setSelectedType(type);
    dispatch(showLoader());
    if (selectedType === "today") {
      const date = moment(new Date()).format("YYYY-MM-DD");
      const url = `?filter=${selectMode}&type=${selectedType}&date=${date}`;
      const vetId = params?.vetId;
      const metaData = { vetId, url };
      await dispatch(getSlotById(metaData));
    } else {
      const url = `?filter=${selectMode}&type=${selectedType}`;
      const vetId = params?.vetId;
      const metaData = { vetId, url };
      await dispatch(getSlotById(metaData));
    }
    dispatch(hideLoader());
  };

  const handleSelectMode = async (mode) => {
    setSelectMode(mode.target.value);
    dispatch(showLoader());
    if (selectedType === "today") {
      const date = moment(new Date()).format("YYYY-MM-DD");
      const url = `?filter=${selectMode}&type=${selectedType}&date=${date}`;
      const vetId = params?.vetId;
      const metaData = { vetId, url };
      dispatch(getSlotById(metaData));
    } else {
      const url = `?filter=${selectMode}&type=${selectedType}`;
      const vetId = params?.vetId;
      const metaData = { vetId, url };
      await dispatch(getSlotById(metaData));
    }
    dispatch(hideLoader());
  };

  const getFirstThreeLetters = (day) => {
    return day.substring(0, 3);
  };

  const CommonRow = ({ slot, key, type }) => {
    return (
      <div className="flex-row w100Per mt10" key={key + type}>
        <div className="w15Per flex-start-center">
          {/* <Typography className="txt-regular fs12 table-black">
            {moment(slot?.slotDate).format("MMM DD")}
          </Typography> */}
        </div>

        <div className="w15Per flex-start-center">
          <Typography className="txt-regular fs12 table-black">
            {getFirstThreeLetters(slot?.day)}
          </Typography>
        </div>
        <div
          className={`flex-start-center ${
            selectedSlots?.length > 0 && selectedDayId === slot?.slotdayId
              ? "w40Per"
              : "w65Per"
          }`}
        >
          <div className="flex-row scrollx">
            {slot?.slotTime?.map((st, i) => (
              <>
                <Typography
                  key={i + st?.time}
                  className={`txt-regular table-time-black cursor ${
                    i !== 0 ? "ml10" : ""
                  } ${
                    selectedSlots?.includes(st)
                      ? "table-time-selected"
                      : st?.status === "N"
                      ? "table-time-disabled"
                      : "table-time-back"
                  }`}
                  onClick={() => handleSelectedSlot(st)}
                >
                  {st?.time}
                </Typography>
              </>
            ))}
          </div>
        </div>
        <div
          className={`flex-start-center ${
            selectedSlots?.length > 0 && selectedDayId === slot?.slotdayId
              ? "w30Per"
              : "w5Per"
          }`}
        >
          <div className="flex-row ml5">
            <div className="flex-center">
              <CustomSwitch
                value={slot?.status}
                onChange={(e) => onChangeSwitch(e, slot)}
                greenToGray
              />
              {selectedSlots?.length > 0 &&
              selectedDayId === slot?.slotdayId ? (
                <Typography
                  className="txt-regular fs12 mark-balck ml5 cursor"
                  onClick={handleMarkAsUnAvailable}
                >
                  Mark as unavailable
                </Typography>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <VetAndUpcomingAppointments
        vetId={location?.state?.vetId}
        active="manageSlot"
      >
        <Grid container className="ph2">
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={12}
            xl={12}
            className="back-white p10"
          >
            <div className="flex-row">
              <div className="flex-start">
                <div className="flex-center">
                  <Typography
                    className={`font-bold fs14 cursor day-type-box ${
                      selectedType === "today" ? "black" : "gray2"
                    }`}
                    // onClick={() => {setSelectedType("today")}}
                    onClick={() => handleSelectType("today")}
                  >
                    Today
                  </Typography>
                  <Typography
                    className={`font-bold fs14 cursor day-type-box ${
                      selectedType === "week" ? "black" : "gray2"
                    }`}
                    // onClick={() => {setSelectedType("week")}}
                    onClick={() => handleSelectType("week")}
                  >
                    Week
                  </Typography>
                </div>
              </div>
              <div className="flex1-center">
                <div className="flex-row">
                  <div className="flex-center">
                    <NavigateBeforeOutlinedIcon className="calendar-arrow no-cursor" />
                    <Typography className="text-bold mh20">
                      {selectedType === "today"
                        ? moment(new Date()).format("MMM DD, YYYY")
                        : `${moment(new Date()).format("MMM DD")} - ${moment(
                            new Date(
                              new Date().setDate(new Date().getDate() + 6)
                            )
                          ).format("DD, YYYY")}`}
                    </Typography>
                    <NavigateNextOutlinedIcon className="calendar-arrow no-cursor" />
                  </div>
                </div>
              </div>
              <div className="w20Per">
                <Select
                  list={[
                    { name: "All", value: "all" },
                    { name: "Virtual", value: "virtual" },
                    { name: "Physical", value: "physical" },
                  ]}
                  value={selectMode ?? "All"}
                  name={"All"}
                  // handleChange={(e) =>{ setSelectMode(e?.target?.value); getSlotData()}}
                  handleChange={(e) => handleSelectMode(e)}
                  select
                />
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
            className="mv3 back-white"
          >
            <div className="p20 scroll-80vh">
              {selectMode === "virtual" || selectMode === "all" ? (
                <>
                  <Typography className="text-bold">Virtual</Typography>
                  <div className="flex-row mt10">
                    <div className="w15Per">
                      {/* <Typography className="txt-regular fs14 table-gray">
                        Date
                      </Typography> */}
                    </div>
                    <div className="w15Per">
                      <Typography className="txt-regular fs14 table-gray">
                        Day
                      </Typography>
                    </div>
                    <div className="w70Per">
                      <Typography className="txt-regular fs14 table-gray">
                        Slots
                      </Typography>
                    </div>
                  </div>

                  <div className="table-gary-bar mv5 " />
                  {getSlotsDetailsByType("Virtual")?.length > 0
                    ? getSlotsDetailsByType("Virtual")?.map((slot, i) => (
                        <CommonRow slot={slot} type="Virtual" key={i} />
                      ))
                    : null}
                </>
              ) : null}

              {selectMode === "physical" || selectMode === "all" ? (
                <>
                  <Typography
                    className={`text-bold ${
                      selectMode === "all" ? "mt20" : ""
                    }`}
                  >
                    Physical
                  </Typography>
                  <div className="flex-row mt10">
                    <div className="w15Per">
                      {/* <Typography className="txt-regular fs14 table-gray">
                        Date
                      </Typography> */}
                    </div>
                    <div className="w15Per">
                      <Typography className="txt-regular fs14 table-gray">
                        Day
                      </Typography>
                    </div>
                    <div className="w70Per">
                      <Typography className="txt-regular fs14 table-gray">
                        Slots
                      </Typography>
                    </div>
                  </div>

                  <div className="table-gary-bar mv5 " />
                  {getSlotsDetailsByType("Physical")?.length > 0
                    ? getSlotsDetailsByType("Physical")?.map((slot, i) => (
                        <CommonRow slot={slot} type="Physical" key={i} />
                      ))
                    : null}
                </>
              ) : null}
            </div>
          </Grid>
        </Grid>
      </VetAndUpcomingAppointments>
    </>
  );
};

export default ManageSlot;
