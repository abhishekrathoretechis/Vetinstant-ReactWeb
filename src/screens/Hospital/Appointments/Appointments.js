import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import NavigateBeforeOutlinedIcon from "@mui/icons-material/NavigateBeforeOutlined";
import NavigateNextOutlinedIcon from "@mui/icons-material/NavigateNextOutlined";
import { Grid, Typography, Container, Toolbar } from "@mui/material";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAppointsmentsByClinic } from "../../../redux/reducers/clinicSlice";
import { getDateList } from "../../../util/function";
import Select from "../../../components/Select/Select";
import TopBar from "../../../components/TopBar/TopBar";
import CustomTextField from "../../../components/CustomTextField";
import CustomButton from "../../../components/CustomButton";

const vets = [
  {
    name: "Murthy",
    date: "2024-06-07",
    slots: [
      { time: "09:00", petName: "Jimmy", type: "Consultaion" },
      { time: "11:00", petName: "Rocky", type: "Vaccination" },
      { time: "11:30", petName: "Jimmy", type: "Emergency" },
    ],
  },
  {
    name: "Raja",
    date: "2024-06-08",
    slots: [
      { time: "09:30", petName: "Jimmy", type: "Emergency" },
      { time: "10:30", petName: "Rocky", type: "Vaccination" },
      { time: "11:00", petName: "Jimmy", type: "Other" },
      { time: "12:00", petName: "Jimmy", type: "Other" },
    ],
  },
  {
    name: "Kumar",
    date: "2024-06-07",
    slots: [
      { time: "09:00", petName: "Jimmy", type: "Vaccination" },
      { time: "11:00", petName: "Rocky", type: "Consultaion" },
      { time: "11:30", petName: "Jimmy", type: "Emergency" },
    ],
  },
  {
    name: "Sankar",
    date: "2024-06-07",
    slots: [
      { time: "09:30", petName: "Jimmy", type: "Consultaion" },
      { time: "11:30", petName: "Rocky", type: "Other" },
      { time: "12:00", petName: "Jimmy", type: "Emergency" },
    ],
  },
  {
    name: "Mohammad",
    date: "2024-06-09",
    slots: [
      { time: "10:30", petName: "Jimmy", type: "Other" },
      { time: "11:30", petName: "Rocky", type: "Vaccination" },
      { time: "12:00", petName: "Jimmy", type: "Emergency" },
    ],
  },
  {
    name: "David",
    date: "2024-06-11",
    slots: [
      { time: "09:30", petName: "Jimmy", type: "Consultaion" },
      { time: "11:30", petName: "Rocky", type: "Vaccination" },
      { time: "12:00", petName: "Jimmy", type: "Other" },
    ],
  },
  {
    name: "Murthy",
    date: "2024-06-07",
    slots: [
      { time: "09:00", petName: "Jimmy", type: "Consultaion" },
      { time: "11:00", petName: "Rocky", type: "Vaccination" },
      { time: "11:30", petName: "Jimmy", type: "Emergency" },
    ],
  },
  {
    name: "Raja",
    date: "2024-06-08",
    slots: [
      { time: "09:30", petName: "Jimmy", type: "Emergency" },
      { time: "10:30", petName: "Rocky", type: "Vaccination" },
      { time: "11:00", petName: "Jimmy", type: "Other" },
      { time: "12:00", petName: "Jimmy", type: "Other" },
    ],
  },
  {
    name: "Kumar",
    date: "2024-06-07",
    slots: [
      { time: "09:00", petName: "Jimmy", type: "Vaccination" },
      { time: "11:00", petName: "Rocky", type: "Consultaion" },
      { time: "11:30", petName: "Jimmy", type: "Emergency" },
    ],
  },
  {
    name: "Sankar",
    date: "2024-06-07",
    slots: [
      { time: "09:30", petName: "Jimmy", type: "Consultaion" },
      { time: "11:30", petName: "Rocky", type: "Other" },
      { time: "12:00", petName: "Jimmy", type: "Emergency" },
    ],
  },
  {
    name: "Mohammad",
    date: "2024-06-09",
    slots: [
      { time: "10:30", petName: "Jimmy", type: "Other" },
      { time: "11:30", petName: "Rocky", type: "Vaccination" },
      { time: "12:00", petName: "Jimmy", type: "Emergency" },
    ],
  },
  {
    name: "David",
    date: "2024-06-11",
    slots: [
      { time: "09:30", petName: "Jimmy", type: "Consultaion" },
      { time: "11:30", petName: "Rocky", type: "Vaccination" },
      { time: "12:00", petName: "Jimmy", type: "Other" },
    ],
  },
];

const Appointments = () => {
  const dispatch = useDispatch();
  const appointments = useSelector((state) => state.clinic.appointments);
  const [selectedType, setSelectedType] = useState("today");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [timeList, setTimeList] = useState([]);
  const [dateList, setDateList] = useState([]);
  const vetList = appointments?.doctors;
  const appointmentList = appointments?.data;

  useEffect(() => {
    dispatch(getAppointsmentsByClinic(`?type=today`));
    getDateAndTimeLists();
  }, []);

  useEffect(() => {
    dispatch(
      getAppointsmentsByClinic(
        `?type=${selectedType}${selectedType === "date"
          ? `&date=${moment(selectedDate).format("YYYY-MM-DD")}`
          : ""
        }`
      )
    );
  }, [selectedType, selectedDate]);

  const getDateAndTimeLists = async () => {
    const reqTimes = await createTimeSlots("08:00", "22:00", 30);
    setTimeList(reqTimes);
    const dates = await getDateList();
    setDateList(dates);
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
    const startParts = startTime.split(":").map(Number);
    const endParts = endTime.split(":").map(Number);

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
    <>
      <TopBar>
        <Container maxWidth="xl">
          <Toolbar variant="regular">
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <div className="flex-row">
                <div className="top-row-cen-con w100Per">
                  <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                    <CustomTextField
                      placeholder="Search"
                      name="name"
                      fullWidth
                      search
                    />
                  </Grid>
                  {/* <Grid item xs={4} sm={2} md={2} lg={1} xl={1} className="ml20">
                    <CustomButton text="Create" />
                  </Grid> */}
                  {/* <div className="top-row-right-con w15Per topBar-select">
                    <Select
                      list={[
                        { name: "All", value: "all" },
                        { name: "Vets", value: "vets" },
                        { name: "Others", value: "others" },
                      ]}
                      value={"all"}
                      // handleChange={(e) => handleSelect(e, "location")}
                      name="vet"
                      select
                    />
                  </div> */}
                </div>
              </div>
            </Grid>
          </Toolbar>
        </Container>
      </TopBar>
      <Container maxWidth="xl" className="ph40">
        <div className="back-white brd-r20">
          <Grid container className="mv10 ph20">
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} className="p10">
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

                <div className="flex-end">
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
            </Grid>

            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              lg={12}
              xl={12}
              className="p10 card-columns"
            >
              <div
                className="scrollx"
                style={{ width: '100%' }}
              >
                {/* <div className="box-hor-split" /> */}
                <div className="flex-row h70AliCen brd-top">
                  <div className="w10Per">
                    {selectedType === "week" ? (
                      <div className="flex-center">
                        <CalendarMonthIcon className="gray2 w30h30" />
                      </div>
                    ) : (
                      <div />
                    )}
                  </div>
                  <div className="w1Per">
                    <div className="flex-center">
                      <div className="box-ver-split" />
                    </div>
                  </div>
                  {vetList?.map((vt, i) => (
                    <>
                      <div
                        className="w20Per ph5 pv2 grid-box"
                        key={i + vt?.name + "docname"}
                      >
                        <div className="flex-center">
                          <Typography className="text-bold capitalize fs14">
                            {`Dr. ${vt?.name}`}
                          </Typography>
                        </div>
                      </div>
                      <div className="w1Per" key={i + vt?.name + "verbar"}>
                        <div className="flex-center">
                          <div className="box-ver-split" />
                        </div>
                      </div>
                    </>
                  ))}
                </div>

                {selectedType === "week"
                  ? dateList?.map((dl, i) => {
                    return (
                      <div key={i + dl}>
                        {/* <div className="box-hor-split" /> */}
                        <div className="flex-row h70AliCen brd-top">
                          <div className="w10Per">
                            <div className="flex-center">
                              <Typography className="font-bold fs12 gray6">
                                {moment(dl).format("ddd DD")}
                              </Typography>
                            </div>
                          </div>
                          <div className="w1Per">
                            <div className="flex-center">
                              <div className="box-ver-split" />
                            </div>
                          </div>
                          {vetList?.map((vet, i) => {
                            let aptType = "Others";

                            const dayData = appointmentList?.filter(
                              (ap) =>
                                ap?.doctorId === vet?.doctorId &&
                                ap?.appoinmentDate === dl
                            );
                            if (dayData?.length > 0) {
                              const emer = dayData?.find(
                                (dd) => dd?.appoinmentType === "Emergency"
                              );
                              const vacc = dayData?.find(
                                (dd) => dd?.appoinmentType === "Vaccination"
                              );
                              const consData = dayData?.find(
                                (dd) =>
                                  dd?.appoinmentType === "Physical" ||
                                  dd?.appoinmentType === "Virtual"
                              );

                              aptType = emer
                                ? "Emergency"
                                : vacc
                                  ? "Vaccination"
                                  : consData
                                    ? "Consultaion"
                                    : "Others";
                            }

                            return dayData?.length > 0 ? (
                              <>
                                <div className="w20Per ph5 pv2 grid-box">
                                  <div
                                    className={
                                      aptType === "Vaccination"
                                        ? "cal-green-box"
                                        : aptType === "Consultaion"
                                          ? "cal-blue-box"
                                          : aptType === "Emergency"
                                            ? "cal-red-box"
                                            : "cal-rose-box"
                                    }
                                  >
                                    <div className="flex-column jus-con-spa-bet h50">
                                      <div className="flex-row">
                                        {dayData?.length > 0
                                          ? dayData
                                            ?.slice(0, 2)
                                            ?.map((st, si) => (
                                              <Typography
                                                className={`${si !== 0 ? "ml2" : ""
                                                  } font-bold fs8 cal-time ${aptType === "Vaccination"
                                                    ? "green-back"
                                                    : aptType === "Consultaion"
                                                      ? "card-bot-blue-back"
                                                      : aptType === "Emergency"
                                                        ? "card-bot-red-back"
                                                        : "card-bot-rose-back"
                                                  }`}
                                              >
                                                {st?.appoimentTime}
                                              </Typography>
                                            ))
                                          : null}
                                      </div>
                                      {dayData?.length > 2 ? (
                                        <Typography className="font-bold fs10 card-black">
                                          + {dayData?.length - 2} more
                                        </Typography>
                                      ) : (
                                        <div />
                                      )}
                                    </div>
                                  </div>
                                </div>
                                {<div className="w1Per">
                                  <div className="flex-center">
                                    <div className="box-ver-split" />
                                  </div>
                                </div>}
                              </>
                            ) : (
                              <>
                                <div className="w20Per ph5 pv2 grid-box" />
                                <div className="w1Per">
                                  <div className="flex-center">
                                    <div className="box-ver-split" />
                                  </div>
                                </div>
                              </>
                            );
                          })}
                        </div>
                        {/* {dateList?.length === i + 1 ? (
                            <div className="box-hor-split" />
                          ) : null} */}
                      </div>
                    );
                  })
                  : timeList?.map((tl, i) => {
                    return (
                      <div key={i + tl}>
                        {/* <div className="box-hor-split" /> */}
                        <div className="flex-row h70AliCen brd-top">
                          <div className="w10Per">
                            <div className="flex-center">
                              <Typography className="font-bold fs12 gray6">
                                {tl}
                              </Typography>
                            </div>
                          </div>
                          <div className="w1Per">
                            <div className="flex-center">
                              <div className="box-ver-split" />
                            </div>
                          </div>
                          {vetList?.map((vet, i) => {
                            const apnt = appointmentList?.find(
                              (at) =>
                                at?.appoimentTime === tl &&
                                at?.doctorId === vet?.doctorId
                            );

                            return apnt ? (
                              <>
                                <div className="w20Per ph5 pv2 grid-box">
                                  <div
                                    className={
                                      apnt?.type === "Vaccination"
                                        ? "cal-green-box"
                                        : apnt?.type === "Virtual" ||
                                          apnt?.type === "Physical"
                                          ? "cal-blue-box"
                                          : apnt?.type === "Emergency"
                                            ? "cal-red-box"
                                            : "cal-rose-box"
                                    }
                                  >
                                    <div className="flex-column jus-con-spa-bet h50">
                                      <div className="flex-row">
                                        <Typography
                                          className={`font-bold fs8 cal-time ${apnt?.type === "Vaccination"
                                            ? "green-back"
                                            : apnt?.type === "Virtual" ||
                                              apnt?.type === "Physical"
                                              ? "card-bot-blue-back"
                                              : apnt?.type === "Emergency"
                                                ? "card-bot-red-back"
                                                : "card-bot-rose-back"
                                            }`}
                                        >
                                          {tl}
                                        </Typography>
                                        <img
                                          src="https://picsum.photos/200"
                                          alt="https://picsum.photos/200"
                                          className="pet-card-img2 ml10"
                                        />
                                      </div>

                                      <Typography className="font-bold fs10">
                                        {`${apnt?.appoinmentType} | ${apnt?.petName}`}
                                      </Typography>
                                    </div>
                                  </div>
                                </div>
                                <div className="w1Per">
                                  <div className="flex-center">
                                    <div className="box-ver-split" />
                                  </div>
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="w20Per ph5 pv2 grid-box" />
                                <div className="w1Per">
                                  <div className="flex-center">
                                    <div className="box-ver-split" />
                                  </div>
                                </div>
                              </>
                            );
                          })}
                        </div>
                        {/* {timeList?.length === i + 1 ? (
                            <div className="box-hor-split" />
                          ) : null} */}
                      </div>
                    );
                  })}
              </div>
            </Grid>
          </Grid>
        </div>
      </Container>
    </>
  );
};

export default Appointments;
