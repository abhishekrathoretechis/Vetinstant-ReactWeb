import { Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomButton from "../../components/CustomButton";
import CustomCheckbox from "../../components/CustomCheckbox";
import CustomModal from "../../components/CustomModal/CustomModal";
import CustomTextField from "../../components/CustomTextField";
import Select from "../../components/Select/Select";
import {
  bookPetAppointment,
  getServices,
} from "../../redux/reducers/clinicSlice";
import {
  getVetsSlots,
  getVetsSlotsWithType,
} from "../../redux/reducers/vetSlice";
import { dayList, issueList } from "../../util/arrayList";
import { typeAppointemnt, typeList } from "../../util/dropList";

const initialErrors = {
  typeOfAppointment: false,
  serviceType: false,
  consultationType: false,
  issueType: false,
  reason: false,
  vetName: false,
};
const initialHelpers = {
  typeOfAppointment: "",
  serviceType: "",
  consultationType: "",
  issueType: "",
  reason: "",
  vetName: "",
};
const nameExpan = {
  typeOfAppointment: "Type of Appointment",
  serviceType: "Service Type",
  consultationType: "Consultation",
  issueType: "Issue Type",
  reason: "Reason",
  vetName: "Vet Name",
};

const CommonAppointmentPetComponent = ({
  modalVisible,
  setModalVisible,
  storePetId,
  storePetOwnerName,
  storePetUserName,
}) => {
  const initialValues = {
    typeOfAppointment: "",
    serviceType: "",
    consultationType: "Virtual",
    issueType: "",
    reason: "",
    vetName: "",
  };
  const dispatch = useDispatch();
  const vetSlots = useSelector((state) => state.vet.slotList);
  const slotList = useSelector((state) => state.vet.type);
  const [petValues, setPetValues] = useState(initialValues);
  const [petErrors, setPetErrors] = useState(initialErrors);
  const [petHelpers, setPetHelpers] = useState(initialHelpers);
  const [appointmentOption, setAppointmentOption] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [slotId, setSlotId] = useState(null);

  const userId = localStorage.getItem("userId");
  const hospitalId = localStorage.getItem("hospitalId");

  const vetDetails = vetSlots?.map((item, index) => ({
    id: item?._id,
    name: item?.name,
    value: item?._id,
    isSelected: false,
  }));
  const getServicesData = useSelector((state) => state?.clinic?.services);
  const transformedDataServices = getServicesData?.map((item, index) => ({
    id: item?._id,
    name: item?.name,
    value: item?._id,
    isSelected: false,
  }));

  useEffect(() => {
    dispatch(getServices());

    dispatch(getVetsSlots(petValues?.consultationType));
    const id = petValues?.vetName;
    const type = petValues?.consultationType;
    const metaData = { type, id };
    if (id && type) dispatch(getVetsSlotsWithType(metaData));
  }, [petValues]);

  const handleAppointmentOptionChange = (event) => {
    setAppointmentOption(event.target.value);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const handleReset = () => {
    setPetValues(initialValues);
    setPetErrors(initialErrors);
    setPetHelpers(initialHelpers);
    setAppointmentOption("");
    setSelectedDate("");
    setSelectedTime("");
    setSlotId("");
  };

  const modelOpen = () => {
    handleReset();
    setModalVisible(!modalVisible);
  };

  const handleSelect = (e, key) => {
    setPetValues({ ...petValues, [key]: e.target.value });
  };

  const handleChange = (e) => {
    setPetValues({ ...petValues, [e.target.name]: e.target.value });

    if (e.target.value === "") {
      setPetErrors({ ...petErrors, [e.target.name]: true });
      setPetHelpers({
        ...petHelpers,
        [e.target.name]: `${nameExpan?.[e.target.name]} Required Field`,
      });
    }
    if (e.target.value !== "") {
      setPetErrors({ ...petErrors, [e.target.name]: false });
      setPetHelpers({ ...petHelpers, [e.target.name]: "" });
    }
  };

  const handleValidation = () => {
    const errorList = [];
    const woErrorList = [];
    Object.keys(petValues).forEach(function (key, index) {
      if (petValues?.[key]?.length === 0 || petValues?.[key] === "") {
        return errorList?.push(key);
      }
      woErrorList.push(key);
    });
    let errorObj = {};
    let errHelperObj = {};
    let correctObj = {};
    let helperObj = {};
    //set Error
    if (errorList?.length > 0) {
      errorList?.forEach((key) => {
        errorObj = { ...errorObj, [key]: true };
        const value = petValues?.[key];

        errHelperObj = {
          ...errHelperObj,
          [key]: `${nameExpan?.[key]} Required Field`,
        };
      });
    }
    //Remove Error
    if (woErrorList?.length > 0) {
      woErrorList?.forEach((key) => {
        correctObj = { ...correctObj, [key]: false };
        helperObj = { ...helperObj, [key]: "" };
      });
    }
    setPetErrors({ ...petErrors, ...correctObj, ...errorObj });
    setPetHelpers({ ...petHelpers, ...helperObj, ...errHelperObj });
    return { errorList, woErrorList };
  };

  const handleSubmit = async () => {
    // const validation = handleValidation();
    // if (validation?.errorList?.length > 0) return;
    const data = {
      userName: storePetOwnerName,
      userId: userId,
      petId: storePetId,
      petName: storePetUserName,
      hospId: hospitalId,
      appointmentType: petValues?.consultationType,
      typeOfAppointment: petValues?.typeOfAppointment,
      serviceType: petValues?.serviceType,
      issueType: petValues?.issueType,
      reason: petValues?.reason,
      appointment: appointmentOption,
      docname: petValues?.vetName,
      docId: petValues?.vetName,
      clinicId: hospitalId,
    };
    if (appointmentOption === "Later") data.slot = slotId;

    dispatch(bookPetAppointment(data)).then((res) => {
      modelOpen();
    });
  };

  const handleDateClick = (day) => {
    setSelectedDate(day);
  };
  const handleSelectedTime = (time, id) => {
    setSlotId(id);
    if (selectedTime === time) {
      setSelectedTime(null); // Deselect if already selected
    } else {
      setSelectedTime(time);
    }
  };

  return (
    <CustomModal
      open={modalVisible}
      onClose={modelOpen}
      header="Book an Appointment"
      modal
      modalWidth={50}
    >
      <div className="scroll-60vh ">
        <Grid container spacing={1.5} className="mb20 mt10">
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <CustomTextField
              label={"Pet Name"}
              placeholder={"Pet Name"}
              name="Pet Name"
              fullWidth
              value={storePetUserName}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <CustomTextField
              label={"Pet Owner Name"}
              placeholder={"Pet Owner Name"}
              name="Pet Owner Name"
              fullWidth
              value={storePetOwnerName}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <Select
              list={typeAppointemnt}
              value={petValues?.typeOfAppointment}
              handleChange={(e) => handleSelect(e, "typeOfAppointment")}
              name="typeOfAppointment"
              label={nameExpan?.["typeOfAppointment"]}
              select
              error={petErrors?.typeOfAppointment}
              helperText={petHelpers?.typeOfAppointment}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <Select
              list={transformedDataServices}
              value={petValues?.serviceType}
              handleChange={(e) => handleSelect(e, "serviceType")}
              name="serviceType"
              label={nameExpan?.["serviceType"]}
              select
              error={petErrors?.serviceType}
              helperText={petHelpers?.serviceType}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <Select
              list={typeList}
              value={petValues?.consultationType}
              handleChange={(e) => handleSelect(e, "consultationType")}
              name="consultationType"
              label={nameExpan?.["consultationType"]}
              select
              error={petErrors?.consultationType}
              helperText={petHelpers?.consultationType}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <Select
              list={issueList}
              select
              label={nameExpan?.["issueType"]}
              placeholder={nameExpan?.["issueType"]}
              name="issueType"
              fullWidth
              handleChange={(e) => handleSelect(e, "issueType")}
              value={petValues?.issueType}
              helperText={petHelpers?.issueType}
              error={petErrors?.issueType}
            />
          </Grid>
        </Grid>

        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
          <CustomTextField
            label={nameExpan?.["reason"]}
            placeholder={nameExpan?.["reason"]}
            name="reason"
            fullWidth
            handleChange={handleChange}
            value={petValues?.reason}
            helperText={petHelpers?.reason}
            error={petErrors?.reason}
            multiline
          />
        </Grid>

        <div className="Radio-button">
          <Typography align="left" marginTop={1.5}>
            Appointment
          </Typography>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6} className="ml10">
            {petValues?.typeOfAppointment === "WalkIn" ? (
              <CustomCheckbox
                radio
                value={appointmentOption}
                onChange={handleAppointmentOptionChange}
                radios={[{ label: "Immediate", value: "Immediate" }]}
                defaultValue={appointmentOption ?? "Immediate"}
              />
            ) : (
              <>
                {slotList && slotList.length > 0 ? (
                  <CustomCheckbox
                    radio
                    value={appointmentOption}
                    onChange={handleAppointmentOptionChange}
                    radios={[
                      { label: "Immediate", value: "Immediate" },
                      { label: "Later", value: "Later" },
                    ]}
                    defaultValue={appointmentOption}
                  />
                ) : (
                  <CustomCheckbox
                    radio
                    value={appointmentOption}
                    onChange={handleAppointmentOptionChange}
                    radios={[{ label: "Immediate", value: "Immediate" }]}
                    defaultValue={appointmentOption ?? "Immediate"}
                  />
                )}
              </>
            )}
          </Grid>
        </div>

        <Grid container spacing={1.5} className="mb20">
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <Select
              list={vetDetails}
              label={nameExpan?.["vetName"]}
              placeholder={nameExpan?.["vetName"]}
              name="vetName"
              fullWidth
              handleChange={(e) => handleSelect(e, "vetName")}
              value={petValues?.vetName}
              helperText={petHelpers?.vetName}
              error={petErrors?.vetName}
              select
            />
          </Grid>
          {appointmentOption === "Later" && (
            <>
              {slotList && slotList.length > 0 && (
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                  <CustomTextField
                    label={"Date/Time"}
                    placeholder={"Date/Time"}
                    name="Date/Time"
                    fullWidth
                    value={`${selectedDate ? selectedDate + " " : ""}${
                      selectedTime || ""
                    }`}
                  />

                  <div>
                    <div className="row mt10">
                      {dayList?.map((day, i) => {
                        const isDaySelected = slotList?.some(
                          (slot) => slot.day.toLowerCase() === day?.value
                        );
                        const isDaySelected1 = slotList?.find(
                          (slot) => slot.day.toLowerCase() === day?.value
                        );

                        const dayOfMonth = parseInt(
                          isDaySelected1?.date?.split("-")[0],
                          10
                        );
                        return (
                          <div
                            key={i}
                            style={{ position: "relative" }}
                            className={
                              isDaySelected
                                ? "day-selected cursor"
                                : "day-unselected"
                            }
                            onClick={() =>
                              isDaySelected &&
                              handleDateClick(isDaySelected1?.date)
                            }
                          >
                            {day?.shortName}
                            {typeof dayOfMonth === "number" &&
                              !isNaN(dayOfMonth) && ( // Check if dayOfMonth is a valid number
                                <div
                                  style={{
                                    position: "absolute",
                                    bottom: -27,
                                  }}
                                  className="text-bold"
                                >
                                  {dayOfMonth}
                                </div>
                              )}
                          </div>
                        );
                      })}
                    </div>

                    {selectedDate && (
                      <div className="flex-row width mt20">
                        {slotList
                          ?.find((slot) => slot?.date === selectedDate)
                          ?.slots?.map((timeSlot) => (
                            <div
                              key={timeSlot?._id}
                              className={`cursor ml10 fs12 mt10 bgContainer ${
                                selectedTime === timeSlot.time
                                  ? "bgContainerSelected"
                                  : "bgContainerUnselected"
                              }`}
                              onClick={() =>
                                handleSelectedTime(
                                  timeSlot?.time,
                                  timeSlot?._id
                                )
                              }
                            >
                              {timeSlot?.time?.split("-")[0]}
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </Grid>
              )}
            </>
          )}
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
          <div className="clinic-mod-btn-pos">
            <div className="mb20 mr10">
              <CustomButton text="Submit" onClick={handleSubmit} />
            </div>
          </div>
        </Grid>
      </div>
    </CustomModal>
  );
};

export default CommonAppointmentPetComponent;
