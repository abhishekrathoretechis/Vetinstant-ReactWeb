import MoreVertIcon from "@mui/icons-material/MoreVert";
import NavigateBeforeOutlinedIcon from "@mui/icons-material/NavigateBeforeOutlined";
import NavigateNextOutlinedIcon from "@mui/icons-material/NavigateNextOutlined";
import { Divider, Grid, Menu, MenuItem, Typography } from "@mui/material";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { getVetAppointmentsByIdAndFilter } from "../../../redux/reducers/clinicSlice";
import VetAndUpcomingAppointments from "../../CommonScreens/VetAndUpcomingAppointments/VetAndUpcomingAppointments";
import { getDateList } from "../../../util/function";

const VetCalendar = () => {
  const location = useLocation();

  console.log('Location----->',location)
  const dispatch = useDispatch();
  const [selectedType, setSelectedType] = useState("today");
  const [timeList, setTimeList] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const vetAppointments = useSelector(
    (state) => state?.clinic?.vetAppointments
  );
  const [dateList, setDateList] = useState([]);

  useEffect(() => {
    const reqTimes = createTimeSlots(
      "08:00",
      "22:00",
      60
      // vetAppointments?.[0]?.startTime,
      // vetAppointments?.[0]?.endTime,
      // vetAppointments?.[0]?.duration
    );
    setTimeList(reqTimes);
    getDateLists();
    // dispatch(
    //   getVetAppointmentsByIdAndFilter(
    //     `${location?.state?.vet?.doctorId}?type=${selectedType}`
    //   )
    // )
  }, []);

  useEffect(() => {
    dispatch(
      getVetAppointmentsByIdAndFilter(
        `${location?.state?.vet?.doctorId}?type=${selectedType}${selectedType === "date"
          ? `&date=${moment(selectedDate).format("YYYY-MM-DD")}`
          : ""
        }`
      )
    );
  }, [selectedType, selectedDate]);

  const getDateLists = async () => {
    const dates = await getDateList();
    setDateList(dates);
  };

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  function createTimeSlots(startTime, endTime, duration) {
    // Helper function to pad single digit numbers with a leading zero
    function pad(num) {
      return num < 10 ? "0" + num : num;
    }

    // Helper function to format a Date object to HH:mm string
    function formatTime(date) {
      return pad(date.getHours()) + ":" + pad(date.getMinutes());
    }

    // Parse the start and end times
    const startParts = startTime?.split(":")?.map(Number);
    const endParts = endTime?.split(":")?.map(Number);

    // Create Date objects for the start and end times
    const start = new Date();
    start.setHours(startParts[0], startParts[1], 0, 0);

    const end = new Date();
    end.setHours(endParts[0], endParts[1], 0, 0);

    // Calculate the duration in milliseconds
    const durationMs = duration * 60 * 1000;

    // Generate the time slots
    const slots = [];
    let current = new Date(start);
    while (current <= end) {
      slots.push(formatTime(current));
      current = new Date(current.getTime() + durationMs);
    }

    return slots;
  }

  const handleDateChange = (value) => {
    const reqDate = new Date(selectedDate);
    reqDate.setDate(
      value === "add" ? reqDate.getDate() + 1 : reqDate.getDate() - 1
    );
    setSelectedDate(reqDate);
  };

  const checkSameDay = () => {
    return new Date().getDate() !== new Date(selectedDate).getDate();
  };

  return (
    <VetAndUpcomingAppointments vetId={location?.state?.vet?.doctorId}>
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
                  className={`font-bold fs14 cursor day-type-box ${selectedType === "today" ? "black" : "gray2"
                    }`}
                  onClick={() => setSelectedType("today")}
                >
                  Today
                </Typography>
              </div>
            </div>
            <div className="flex1-center">
              <div className="flex-row">
                <div className="flex-center">
                  <NavigateBeforeOutlinedIcon
                    className={`calendar-arrow ${selectedType === "date" && checkSameDay()
                        ? "cursor"
                        : "no-cursor"
                      }`}
                    onClick={() => handleDateChange("minus")}
                  />
                  <Typography className="text-bold mh20">
                    {selectedType === "today"
                      ? moment(new Date()).format("MMM DD, YYYY")
                      : selectedType === "date"
                        ? moment(new Date(selectedDate)).format("MMM DD, YYYY")
                        : `${moment(new Date()).format("MMM DD")} - ${moment(
                          new Date(new Date().setDate(new Date().getDate() + 6))
                        ).format("DD, YYYY")}`}
                  </Typography>
                  <NavigateNextOutlinedIcon
                    className={`calendar-arrow ${selectedType === "date" ? "cursor" : "no-cursor"
                      }`}
                    onClick={() => handleDateChange("add")}
                  />
                </div>
              </div>
            </div>
            <div className="w20Per">
              <div className="flex-center">
                <Typography
                  className={`font-bold fs14 cursor day-type-box ${selectedType === "date" ? "black" : "gray2"
                    }`}
                  onClick={() => setSelectedType("date")}
                >
                  Day
                </Typography>
                <Typography
                  className={`font-bold fs14 cursor day-type-box ${selectedType === "week" ? "black" : "gray2"
                    }`}
                  onClick={() => setSelectedType("week")}
                >
                  Week
                </Typography>
              </div>
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
          className="mt3 back-white card-columns"
        >
          <div
            className={`${selectedType !== "week" ? "w100Per" : "scrollx w160Per"
              }`}
          >
            {selectedType === "week" ? (
              <>
                <div className="flex-row h70AliCen">
                  <div className="w10Per" />

                  <div className="w1Per">
                    <div className="flex-center">
                      <div className="box-ver-split" />
                    </div>
                  </div>
                  {dateList?.map((dt, i) => (
                    <>
                      <div
                        className="w20Per ph5 pv2"
                        key={i + dt?.name + "docname"}
                      >
                        <div className="flex-center">
                          <Typography className="text-bold">
                            {moment(dt).format("ddd DD")}
                          </Typography>
                        </div>
                      </div>
                      <div className="w1Per" key={i + dt?.name + "verbar"}>
                        <div className="flex-center">
                          <div className="box-ver-split" />
                        </div>
                      </div>
                    </>
                  ))}
                </div>
                <div className="box-hor-split" />
              </>
            ) : null}

            {timeList?.map((tm, i) => {
              const slot = vetAppointments?.find(
                (ap) => ap?.appoimentTime === tm
              );

              return (
                <div key={i}>
                  {selectedType !== "week" ? (
                    <div className="flex-row h70AliCen">
                      <div className="w10Per">
                        <div className="flex-center">
                          <Typography className="font-bold fs12 gray6">
                            {tm}
                          </Typography>
                        </div>
                      </div>
                      <div className="w1Per">
                        <div className="flex-center">
                          <div className="box-ver-split" />
                        </div>
                      </div>
                      <div className="w89Per ph5 pv2">
                        {slot ? (
                          <div
                            className={
                              slot?.appoinmentType === "Vaccination"
                                ? "cal-green-box"
                                : slot?.appoinmentType === "Physical" ||
                                  slot?.appoinmentType === "Virtual"
                                  ? "cal-blue-box"
                                  : slot?.appoinmentType === "Emergency"
                                    ? "cal-red-box"
                                    : "cal-rose-box"
                            }
                          >
                            <div className="flex-row">
                              <div className="flex-column jus-con-spa-bet h50">
                                <div className="flex-row">
                                  <img
                                    src="https://picsum.photos/200"
                                    alt="https://picsum.photos/200"
                                    className="pet-card-img2"
                                  />
                                  <div
                                    className={`ml10 txt-regular white-color fs8 card-consultation ${slot?.appoinmentType === "Physical"
                                        ? "card-con-blue-back"
                                        : slot?.appoinmentType === "Virtual"
                                          ? "card-top-rose-color"
                                          : "card-con-gray-back"
                                      }`}
                                  >
                                    {slot?.appoinmentType}
                                  </div>
                                </div>
                                <Typography className="text-bold fs10 capitalize">
                                  {`${slot?.appoinmentType === "Physical" ||
                                      slot?.appoinmentType === "Virtual"
                                      ? "Consultation"
                                      : slot?.appoinmentType === "Vaccination"
                                        ? "Vaccination"
                                        : slot?.appoinmentType === "Emergency"
                                          ? "Emergency"
                                          : "Other"
                                    } | ${slot?.petName}`}
                                </Typography>
                              </div>

                              <div className="flex1-end">
                                <div
                                  className="flex-center"
                                // onClick={() => handleDotboxToggle(i)}
                                >
                                  {/* <MoreVertIcon
                                    className="card-3dot-color"
                                    onClick={handleClick}
                                    size="small"
                                    sx={{
                                      ml: 2,
                                      cursor: "pointer",
                                      transition: "color 0.3s ease",
                                      ":hover": {
                                        color: "#1976d2",
                                      },
                                    }}
                                    aria-controls={
                                      open ? "account-menu" : undefined
                                    }
                                    aria-haspopup="true"
                                    aria-expanded={open ? "true" : undefined}
                                  /> */}
                                </div>
                              </div>
                            </div>
                            <Menu
                              anchorEl={anchorEl}
                              id="account-menu"
                              open={open}
                              onClose={handleClose}
                              onClick={handleClose}
                              PaperProps={{
                                elevation: 0,
                              }}
                              transformOrigin={{
                                horizontal: "right",
                                vertical: "top",
                              }}
                              anchorOrigin={{
                                horizontal: "right",
                                vertical: "bottom",
                              }}
                            >
                              <MenuItem
                                onClick={handleClose}
                                sx={{
                                  fontFamily: "Montserrat",
                                  fontWeight: "400",
                                  fontSize: "14px",
                                }}
                              >
                                Reschedule
                              </MenuItem>
                              <Divider />
                              <MenuItem
                                onClick={handleClose}
                                sx={{
                                  fontFamily: "Montserrat",
                                  fontWeight: "400",
                                  fontSize: "14px",
                                }}
                              >
                                Mark as unavailable
                              </MenuItem>
                            </Menu>
                          </div>
                        ) : // <div className="cal-card-disable"/>
                          null}
                      </div>
                    </div>
                  ) : (
                    <div className="flex-row h70AliCen">
                      <div className="w10Per">
                        <div className="flex-center">
                          <Typography className="font-bold fs12 gray6">
                            {tm}
                          </Typography>
                        </div>
                      </div>
                      <div className="w1Per">
                        <div className="flex-center">
                          <div className="box-ver-split" />
                        </div>
                      </div>
                      {dateList?.map((dt, i) => {
                        const dateMatch = vetAppointments?.find(
                          (ap) =>
                            ap?.appoimentTime === tm &&
                            ap?.appoinmentDate === dt
                        );

                        return (
                          <>
                            <div className="w20Per ph5 pv2">
                              {dateMatch ? (
                                <div
                                  className={
                                    dateMatch?.appoinmentType === "Vaccination"
                                      ? "cal-green-box"
                                      : dateMatch?.appoinmentType ===
                                        "Physical" ||
                                        dateMatch?.appoinmentType === "Virtual"
                                        ? "cal-blue-box"
                                        : dateMatch?.appoinmentType ===
                                          "Emergency"
                                          ? "cal-red-box"
                                          : "cal-rose-box"
                                  }
                                >
                                  <div className="flex-column jus-con-spa-bet h50">
                                    <div className="flex-row">
                                      <img
                                        src={dateMatch?.petImage}
                                        alt=""
                                        className="pet-card-img2"
                                      />
                                      <Typography
                                        className={`font-bold fs8 cal-time ml10 ${dateMatch?.type === "Vaccination"
                                            ? "green-back"
                                            : dateMatch?.type === "Consultaion"
                                              ? "card-bot-blue-back"
                                              : slot?.type === "Emergency"
                                                ? "card-bot-red-back"
                                                : "card-bot-rose-back"
                                          }`}
                                      >
                                        {dateMatch?.appoinmentType}
                                      </Typography>
                                    </div>

                                    <Typography className="font-bold fs10">
                                      {`${dateMatch?.appoinmentType ===
                                          "Physical" ||
                                          dateMatch?.appoinmentType === "Virtual"
                                          ? "Consultation"
                                          : dateMatch?.appoinmentType ===
                                            "Vaccination"
                                            ? "Vaccination"
                                            : dateMatch?.appoinmentType ===
                                              "Emergency"
                                              ? "Emergency"
                                              : "Other"
                                        } | ${dateMatch?.petName}`}
                                    </Typography>
                                  </div>
                                </div>
                              ) : null}
                            </div>
                            <div
                              className="w1Per"
                              key={i + dt?.name + "verbar"}
                            >
                              <div className="flex-center">
                                <div className="box-ver-split" />
                              </div>
                            </div>
                          </>
                        );
                      })}
                    </div>
                  )}
                  {/* {i !== 0 && i !== timeList?.length - 1 ? ( */}
                  <div className="box-hor-split" />
                  {/* ) : null} */}
                </div>
              );
            })}
          </div>
        </Grid>
      </Grid>
    </VetAndUpcomingAppointments>
  );
};

export default VetCalendar;
