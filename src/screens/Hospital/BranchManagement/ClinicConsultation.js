import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Checkbox from "../../../components/CustomCheckbox";
import CustomSelect from "../../../components/Select/Select";
import {
  getClinicHolidays,
  getClinicOpeningHours,
  getClinicTerms,
  updateClinicHolidays,
  updateClinicOpeningHours,
  updateStatusConsultation,
} from "../../../redux/reducers/clinicSlice";
import {
  NewRefundList,
  Percentage50and100List,
  PercentageZeroList,
  PrepaidPostpaidList,
  profileSettingsDays,
} from "../../../util/arrayList";
import "./BranchManagement.css";
import BranchManagementMain from "./BranchManagementMain";
import { Grid, Typography } from "@mui/material";
import CustomButton from "../../../components/CustomButton";
import moment from "moment";
import CustomTextField from "../../../components/CustomTextField";

const initialValues = { date: new Date(), holliday: "" };

const ClinicConsultation = () => {
  const dispatch = useDispatch();
  const { termsAndConditions, openingHours } = useSelector(
    (state) => state?.clinic
  );
  const [selectedConsultations, setSelectedConsultations] = useState([]);
  const [dayList, setDayList] = useState(profileSettingsDays);
  const [holidayValues, setHolidayValues] = useState(initialValues);
  const holidays = useSelector((state) => state?.clinic?.holidays);
  const dateZeroHrMin = new Date(new Date().setHours(0, 0, 0, 0));
  const [isEditEnabled, setEditEnabled] = useState(false);

  useEffect(() => {
    dispatch(getClinicTerms());
    dispatch(getClinicOpeningHours());
    dispatch(getClinicHolidays());
  }, []);

  useEffect(() => {
    const data = [];
    termsAndConditions?.filter((trm) => {
      if (trm?.status === "Y") data?.push(trm?.consultationType);
    });
    setSelectedConsultations(data);
  }, [termsAndConditions]);

  useEffect(() => {
    getRequiredDateList();
  }, [openingHours]);

  const getRequiredTime = (srtTime = "00:00", enTime = "00:00") => {
    const [stHr, stMin] = srtTime?.split(":");
    const [edHr, edMin] = enTime?.split(":");
    const strtTime = new Date(new Date().setHours(stHr, stMin, 0, 0));
    const endTim = new Date(new Date().setHours(edHr, edMin, 0, 0));
    return { startTime: strtTime, endTime: endTim };
  };

  const getRequiredDateList = () => {
    if (!openingHours) return;
    const reqList = dayList?.map((dl) => {
      const dayObj = openingHours?.find((oh) => oh?.day === dl?.value);
      const requiredTime = getRequiredTime(dayObj?.startTime, dayObj?.endTime);

      return {
        ...dl,
        isSelected: dayObj?.status,
        startTime: requiredTime?.startTime,
        endTime: requiredTime?.endTime,
        duration: dayObj?.duration,
      };
    });
    setDayList(reqList);
  };

  const handleChangeCheckbox = async (name) => {
    const isPrev = selectedConsultations?.find((con) => con === name);
    const reqCons = isPrev
      ? selectedConsultations?.filter((con) => con !== name)
      : [...selectedConsultations, name];

    await setSelectedConsultations(reqCons);
    const selectedTerm = termsAndConditions?.find(
      (trm) => trm?.consultationType === name
    );
    const reTerm = selectedTerm ?? {
      consultationType: name,
      paymentType: "prepaid",
      termsfront: "50",
      refundType: "Y",
      refund: "100",
    };

    const reqTermsAndConditions = [{ ...reTerm, status: isPrev ? "N" : "Y" }];

    updateTermsAndConditions(reqTermsAndConditions);
  };

  const updateTermsAndConditions = async (termsAndConditions) => {
    const apiRes = await dispatch(updateStatusConsultation(termsAndConditions));
    if (apiRes?.payload) dispatch(getClinicTerms());
  };

  const checkCondition = (name, value, consultation, con) => {
    return name === value && consultation === con;
  };

  

  const onChangeCheckbox = (i, isSelected) => {
    setDayList(
      dayList?.map((dl, ind) => {
        if (ind === i) return { ...dl, isSelected };
        return dl;
      })
    );
  };

  const handleDelHoliday = (ind) => {
    const reqHolidays = holidays?.filter((hol) => hol?.i !== ind);
    // setHolidays(reqHolidays);
  };

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

  const handleClinicSchedule = (name, value, i) => {
    setDayList(
      dayList?.map((dl, ind) => {
        if (ind === i) {
          return { ...dl, [name]: value };
        }
        return dl;
      })
    );
  };

  const handleGlobalTimeSave = async () => {
    const data = dayList?.map((d) => {
      return {
        status: d?.isSelected,
        day: d?.value,
        startTime: moment(new Date(d?.startTime)).format("HH:mm"),
        endTime: moment(new Date(d?.endTime)).format("HH:mm"),
        duration: d?.duration,
      };
    });
    const apiRes = await dispatch(updateClinicOpeningHours({ data }));
    if (apiRes?.payload) {
      dispatch(getClinicOpeningHours());
      setEditEnabled(false);
    }
  };

  return (
    <BranchManagementMain active="consultation">
      <div className="consultation-white-con scroll-80vh">
        <div className="flex-start">
          <p className="font-bold fs14 blue-color mr20">
            Select the type of consultation you offer:
          </p>

          <Checkbox
            label="Virtual"
            checked={selectedConsultations?.includes("Virtual")}
            onChange={() => handleChangeCheckbox("Virtual")}
          />

          <Checkbox
            label="Physical"
            checked={selectedConsultations?.includes("Physical")}
            onChange={() => handleChangeCheckbox("Physical")}
          />

          {/* <Checkbox
            label="HomeVisit"
            checked={selectedConsultations?.includes("HomeVisit")}
            onChange={() => handleChangeCheckbox("HomeVisit")}
          /> */}
        </div>
       
        <div className="mv10">
          <Typography className="font-medium fs14">Clinic schedule</Typography>
          <Grid container spacing={2} className="mt5">
            <Grid item xs={2} sm={2} md={2} lg={2} xl={2}>
              <Typography className="font-bold fs14 blue-color">Day</Typography>
            </Grid>
            <Grid item xs={2} sm={2} md={2} lg={2} xl={2}>
              <Typography className="font-bold fs14 blue-color">
                Start Time
              </Typography>
            </Grid>
            {/* <div className="w2Per" /> */}
            <Grid item xs={2} sm={2} md={2} lg={2} xl={2}>
              <Typography className="font-bold fs14 blue-color">
                End Time
              </Typography>
            </Grid>
            <Grid item xs={2} sm={2} md={2} lg={2} xl={2}>
              <Typography className="font-bold fs14 blue-color">
                Slot Duration
              </Typography>
            </Grid>

            <div className="flex-end">
              <div className="w10Per">
                <CustomButton
                  text={isEditEnabled ? "Save" : "Edit"}
                  smallBtn
                  onClick={() => {
                    if (isEditEnabled) {
                      handleGlobalTimeSave();
                    } else {
                      setEditEnabled(!isEditEnabled);
                    }
                  }}
                />
              </div>
            </div>
          </Grid>
          <div className="box-hor-split mv5" />
          {dayList?.map((dl, i) => (
            <Grid container spacing={2} className="mt5">
              <Grid
                item
                xs={2}
                sm={2}
                md={2}
                lg={2}
                xl={2}
                className="flex-start-center"
              >
                <div className="flex-row">
                  <div className="flex-center">
                    {isEditEnabled ? (
                      <Checkbox
                        checked={dl?.isSelected}
                        onChange={() => onChangeCheckbox(i, !dl?.isSelected)}
                      />
                    ) : null}
                    <div
                      className={`txt-regular fs14 blue-color ${
                        isEditEnabled ? "mlMin15 mtMin5" : ""
                      }`}
                    >
                      {dl?.name}
                    </div>
                  </div>
                </div>
              </Grid>

              <Grid item xs={2} sm={2} md={2} lg={2} xl={2}>
                <CustomTextField
                  name="startTime"
                  fullWidth
                  mobileTime
                  handleChange={(e) =>
                    handleClinicSchedule("startTime", e?.target?.value, i)
                  }
                  value={!dl?.isSelected ? dateZeroHrMin : dl?.startTime}
                  disabled={!dl?.isSelected || !isEditEnabled}
                  is12HourFomat={false}
                />
              </Grid>
              {/* <div className="w2Per flex-center">-</div> */}
              <Grid item xs={2} sm={2} md={2} lg={2} xl={2}>
                <CustomTextField
                  name="endTime"
                  fullWidth
                  mobileTime
                  handleChange={(e) =>
                    handleClinicSchedule("endTime", e?.target?.value, i)
                  }
                  value={!dl?.isSelected ? dateZeroHrMin : dl?.endTime}
                  disabled={!dl?.isSelected || !isEditEnabled}
                  is12HourFomat={false}
                />
              </Grid>
              <Grid item xs={2} sm={2} md={2} lg={2} xl={2}>
                <CustomTextField
                  name="duration"
                  fullWidth
                  handleChange={(e) =>
                    handleClinicSchedule("duration", e?.target?.value, i)
                  }
                  value={!dl?.isSelected ? "0" : dl?.duration}
                  disabled={!dl?.isSelected || !isEditEnabled}
                  endIcon
                  inputIcon="Mins"
                  type="number"
                />
              </Grid>
            </Grid>
          ))}
        </div>
        <div className="mv10">
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
            <Grid item xs={5} sm={5} md={2} lg={2} xl={2}>
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
              <Grid item xs={5} sm={5} md={2} lg={2} xl={2}>
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
      </div>
    </BranchManagementMain>
  );
};

export default ClinicConsultation;
