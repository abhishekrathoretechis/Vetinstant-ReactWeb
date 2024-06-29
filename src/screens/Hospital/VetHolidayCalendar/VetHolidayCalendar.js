import { useLocation } from "react-router-dom";
import VetAndUpcomingAppointments from "../../CommonScreens/VetAndUpcomingAppointments/VetAndUpcomingAppointments";
import { Grid, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  getClinicHolidays,
  updateClinicHolidays,
} from "../../../redux/reducers/clinicSlice";
import { useEffect, useState } from "react";
import moment from "moment";
import CustomTextField from "../../../components/CustomTextField";

const initialValues = { date: new Date(), holliday: "" };

const VetHolidayCalendar = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [holidayValues, setHolidayValues] = useState(initialValues);
  const holidays = useSelector((state) => state?.clinic?.holidays);

  useEffect(() => {
    dispatch(getClinicHolidays());
  }, []);

  const handleAddHoliday = async () => {
    const apiRes = await dispatch(
      updateClinicHolidays({
        ...holidayValues,
        date: moment(new Date(holidayValues?.date)).format("YYYY-MM-DD"),
      })
    );
    if (apiRes?.payload) {
      dispatch(getClinicHolidays());
      setHolidayValues(initialValues);
    }
  };

  const handleChageHolliday = (e) => {
    const { name, value } = e?.target;
    setHolidayValues({ ...holidayValues, [name]: value });
  };

  const handleDelHoliday = (ind) => {
    const reqHolidays = holidays?.filter((hol) => hol?.i !== ind);
    // setHolidays(reqHolidays);
  };

  return (
    <VetAndUpcomingAppointments
      vetId={location?.state?.vetId}
      active="holidayCalendar"
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
          <div className="mv10 ph20">
            <div className="flex-row mt20">
              <Typography className="font-medium fs14">
                Holiday Calendar
              </Typography>
              <img
                src={require("../../../assets/images/png/PlusIcon.png")}
                alt=""
                className="h20 cursor ml20"
                onClick={handleAddHoliday}
              />
            </div>

            <Grid container spacing={2} className="mt15">
              <Grid item xs={5} sm={5} md={2} lg={2} xl={2}>
                <Typography className="w20Per font-bold fs14 blue-color">
                  Date
                </Typography>
              </Grid>
              <Grid item xs={5} sm={5} md={3} lg={3} xl={3}>
                <Typography className="w20Per font-bold fs14 blue-color">
                  Occasion
                </Typography>
              </Grid>
              <div className="box-hor-split mv10" />
            </Grid>

            {holidays?.map((hl, i) => (
              <Grid container spacing={2}>
                <Grid item xs={5} sm={5} md={2} lg={2} xl={2}>
                  <Typography className="txt-regular fs14">
                    {moment(new Date(hl?.date)).format("MMMM DD")}
                  </Typography>
                </Grid>
                <Grid item xs={5} sm={5} md={3} lg={3} xl={3}>
                  <Typography className="txt-regular fs14">
                    {hl?.holliday}
                  </Typography>
                </Grid>
                <Grid item xs={2} sm={2} md={1} lg={1} xl={1}>
                  <div className="flex-end">
                    <img
                      src={require("../../../assets/images/png/del.png")}
                      alt=""
                      className="h20 cursor"
                      onClick={() => handleDelHoliday(i)}
                    />
                  </div>
                </Grid>
                <div className="box-hor-split mv10" />
              </Grid>
            ))}

            <Grid container spacing={2}>
              <Grid item xs={5} sm={5} md={2} lg={2} xl={2}>
                <CustomTextField
                  name="date"
                  fullWidth
                  mobileDate
                  handleChange={handleChageHolliday}
                  value={holidayValues?.date}
                />
              </Grid>
              <Grid item xs={7} sm={7} md={4} lg={4} xl={4}>
                <CustomTextField
                  name="holliday"
                  fullWidth
                  handleChange={handleChageHolliday}
                  value={holidayValues?.holliday}
                />
              </Grid>
              <div className="box-hor-split mv10" />
            </Grid>
          </div>
        </Grid>
      </Grid>
    </VetAndUpcomingAppointments>
  );
};

export default VetHolidayCalendar;
