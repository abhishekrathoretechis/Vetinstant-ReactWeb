import React, { useEffect, useState } from "react";
import { AppColors } from "../../../util/AppColors";
import CustomCheckbox from "../../../components/CustomCheckbox";
import Select from "../../../components/Select/Select";
import { Grid, Card, Typography, CardMedia } from "@mui/material";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import CustomButton from "../../../components/CustomButton";
import CustomTextField from "../../../components/CustomTextField";
import CalendarComponent from "../ClinicPets/CalenderComponent";
import {
  serviceType,
  typeAppointemnt,
  typeList,
  typeListNew,
} from "../../../util/dropList";
import CustomModal from "../../../components/CustomModal/CustomModal";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import {
  createPetAppointment,
  getClinicPets,
  getSlotByDoctorId,
  getSlotTime,
  petAppointment,
  petAppointmentImmediate,
} from "../../../redux/reducers/petSlice";
import { useNavigate } from "react-router-dom";
import { conditionList } from "../../../util/arrayList";

const initialErrors = {
  typeOfAppointment: false,
  serviceType: false,
  consultationType: false,
  reason: false,
};
const initialHelpers = {
  typeOfAppointment: "",
  serviceType: "",
  consultationType: "",
  reason: "",
};

const initialValues = {
  typeOfAppointment: "Phone",
  serviceType: "Consultation",
  consultationType: "Virtual",
  reason: "",
  dob:""
};
const VetBookAppointment = ({
  modalVisible,
  setModalBookVisible,
  selectVet,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState("");
  const [appointmentOption, setAppointmentOption] = useState(null);
  const pets = useSelector((state) => state.pet.clinicPets);
  const slotList = useSelector((state) => state.pet.slotList) || [];
  const [petId, setPetId] = useState(null);
  const [petDetails, setPetDetails] = useState(null);
  const [petValues, setPetValues] = useState(initialValues);
  const [searchText, setSearchText] = useState("");
  const [petErrors, setPetErrors] = useState(initialErrors);
  const [petHelpers, setPetHelpers] = useState(initialHelpers);
  const [selectTimeId, setSelectTimeId] = useState();
  const [selectTime, setSelectTime] = useState();
  const [slotId, setSlotId] = useState();
  const [appointmentError, setAppointmentError] = useState(false);
  const [selectTimeIdError, setSelectTimeIdError] = useState(false);
  const [selectedDateError, setSelectedDateError] = useState(false);
  const [petDetailsError, setPetDetailsError] = useState(false);

  const defaultUrl = `?type=all&search=${searchText}`;

  useEffect(() => {
    // dispatch(getClinicPets(defaultUrl));
    getClinicPetsData();
  }, [searchText]);

  const handleDateClick = async (day) => {
    // setSelectedDateError(false);
    // setSelectedDate(day);
    const date =
      moment(new Date(day)).format("YYYY-MM-DD") 
      // ??
      // moment(selectedDate).format("YYYY-MM-DD");

    const doctorId = selectVet?.doctorId;
    const contType = petValues?.consultationType;
    const metaData = { doctorId, contType, date };
    await dispatch(getSlotTime(metaData));
  };

  const getClinicPetsData = () => {
    dispatch(getClinicPets(defaultUrl));
  };

  const handleSelectTime = (time) => {
    setSelectTime(time?.time);
    setSelectTimeId(time?.slotTimeId);
    setSelectTimeIdError(false);
  };

  const handleAppointmentOptionChange = (event) => {
    setAppointmentOption(event.target.value);
    setAppointmentError(false);
  };

  const handleReset = () => {
    setPetValues(initialValues);
    setPetErrors(initialErrors);
    setPetHelpers(initialHelpers);
    setAppointmentOption("");
    setSelectTime(null);
    setSelectTimeId(null);
    // setSelectedDate(null);
    setSlotId(null);
    setPetDetails(null);
    setSearchText("");
    // setSelectedDateError(false);
    setAppointmentError(false);
    setSelectTimeIdError(false);
  };

  const modelOpen = () => {
    handleReset();
    setModalBookVisible(!modalVisible);
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
        [e.target.name]: ` Required Field`,
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
      if (appointmentOption !== "Immediate" || key !== "dob") {
        if (petValues?.[key]?.length === 0 || petValues?.[key] === "") {
          return errorList?.push(key);
        }
        woErrorList.push(key);
      }
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
          [key]: `Required Field`,
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

  const petAppointmentCreate = async () => {
    const validation = handleValidation();
    if (validation?.errorList?.length > 0) return;
    if (
      appointmentOption === null ||
      appointmentOption === undefined ||
      appointmentOption === ""
    ) {
      setAppointmentError(true);
    } else if (
      petDetails === null ||
      petDetails === undefined ||
      petDetails === ""
    ) {
      setPetDetailsError(true);
    } else {
      if (appointmentOption === "Immediate") {
        const data = {
          bookingType: petValues?.typeOfAppointment,
          consultationMode: petValues?.consultationType,
          serviceType: petValues?.serviceType,
          reason: petValues?.reason,
          doctorId: selectVet?.doctorId,
          slotId: slotId,
        };
        const metaData = { petId, data };
        dispatch(petAppointmentImmediate(metaData)).then((res) => {
          if (res?.payload?.status === 200) {
            modelOpen();
            navigate("/dashboard");
          }
        });
      } else {
        if (
          selectTimeId === null ||
          selectTimeId === undefined ||
          selectTimeId === ""
        ) {
          setSelectTimeIdError(true);
        } else {
          const data = {
            bookingType: petValues?.typeOfAppointment,
            consultationMode: petValues?.consultationType,
            serviceType: petValues?.serviceType,
            reason: petValues?.reason,
            appointmentDate: moment(petValues?.dob).format("YYYY-MM-DD"),
            appoimentTime: selectTime,
            doctorId: selectVet?.doctorId,
            timeId: selectTimeId,
            slotId: slotId,
          };

          const metaData = { petId, data };
          await dispatch(petAppointment(metaData)).then((res) => {
            if (res?.payload?.status === 200) {
              modelOpen();
              navigate("/dashboard");
            }
          });
        }
      }
    }
  };

  const handleSlot = async (value) => {
    const getId = selectVet?.doctorId;
    const type = value;
    const metaData = { getId, type };
    await dispatch(getSlotByDoctorId(metaData)).then((res) => {
      setSlotId(res?.payload?.data?.slotId);
    });
  };

  return (
    <CustomModal
      open={modalVisible}
      onClose={modelOpen}
      header="Book an Appointment"
      rightModal
      modalWidth={30}
    >
      <Grid container spacing={2} className="ph20 scroll-80vh">
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <Card
                sx={{
                  borderRadius: 1,
                  padding: 2,
                  borderTopColor: AppColors.appPrimary,
                }}
                className="CustomCard-back-appointment-vet"
              >
                <div className="maint">
                  <div className="flex-row">
                    <Grid item xs={3}>
                      <div className="flex-center">
                        {selectVet?.image ? (
                          <CardMedia
                            image={selectVet?.image}
                            className="CustomCard-img3-bill"
                          />
                        ) : (
                          <div className="CustomCard-empty-img flex-center" />
                        )}
                      </div>
                    </Grid>
                    <Grid item xs={9}>
                      <div className="flex-row">
                        <div className="flex-start">
                          <div className="flex-column">
                            <div className="flex-row">
                              <Typography
                                variant="body1"
                                className="mb5 font-bold fs14 capitalize"
                              >
                                Dr. {selectVet?.name}
                              </Typography>
                            </div>
                            <Typography
                              variant="body2"
                              className="mb10 txt-regular card-gray-color fs12"
                            >
                              {selectVet?.speciality}
                            </Typography>
                          </div>
                        </div>
                      </div>
                    </Grid>
                  </div>
                </div>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {petDetails === null && (
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12} className="mb20">
            <CustomTextField
              name="reason"
              fullWidth
              search
              placeholder={"Pet Search"}
              backgroundColor={"##E2E2E2"}
              value={searchText}
              handleChange={(e) => setSearchText(e.target.value)}
            />
            {petDetailsError && (
              <Typography color="error" className="ml5 mt5 fs14">
                Pet is Requried
              </Typography>
            )}
          </Grid>
        )}

        {searchText && (
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            {pets?.pets?.map((pet) => (
              <Grid
                container
                spacing={1}
                key={pet?.petId}
                className="cursor"
                onClick={() => {
                  setPetId(pet?.petId);
                  setPetDetails(pet);
                  setPetDetailsError(false);
                  setSearchText("")
                }}
              >
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                  <Grid container spacing={1}>
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
                                {pet.petImage ? (
                                  <CardMedia
                                    image={pet.petImage}
                                    className="CustomCard-img3-bill"
                                  />
                                ) : (
                                  <div className="CustomCard-empty-img" />
                                )}
                              </div>
                            </Grid>
                            <Grid item xs={9}>
                              <div className="flex-row">
                                <div className="flex-start">
                                  <div className="flex-column">
                                    <div className="flex-row">
                                      <Typography
                                        variant="body1"
                                        className="mb10 font-bold fs14 capitalize"
                                      >
                                        {pet.petName}
                                      </Typography>
                                      <Typography
                                        variant="body1"
                                        className={`ml5 font-medium capitalize fs14 ${
                                          pet.gender === "male"
                                            ? "card-blue-color"
                                            : "card-rose-color"
                                        }`}
                                      >
                                        ({pet.gender})
                                      </Typography>
                                    </div>
                                    <Typography
                                      variant="body2"
                                      className="mb10 txt-regular card-gray-color fs12"
                                    >
                                      {pet.breed}
                                    </Typography>
                                  </div>
                                </div>
                              </div>
                            </Grid>
                          </div>
                          <div>
                            <div className="flex-row parentcontainer">
                              <div className="flex-row iconcontainer">
                                <AccountCircleOutlinedIcon
                                  sx={{ width: 25, height: 25 }}
                                />
                                <Typography className="font-bold fs14 capitalize flex-center h35">
                                  {pet.userName}
                                </Typography>
                              </div>
                              <div className="meeting-doctor">
                                {moment(pet.dob).fromNow()} ({pet.dob})
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            ))}
          </Grid>
        )}

        {petDetails && (
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <Grid container spacing={1}>
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
                          {petDetails.petImage ? (
                            <CardMedia
                              image={petDetails.petImage}
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
                              <Typography
                                variant="body1"
                                className="mb10 font-bold fs14 capitalize"
                              >
                                {petDetails.petName}
                              </Typography>
                              <Typography
                                variant="body1"
                                className={`ml5 font-medium capitalize fs14 ${
                                  petDetails.gender === "male"
                                    ? "card-blue-color"
                                    : "card-rose-color"
                                }`}
                              >
                                ({petDetails.gender})
                              </Typography>
                            </div>
                            <Typography
                              variant="body2"
                              className="mb10 txt-regular card-gray-color fs12"
                            >
                              {petDetails.breed}
                            </Typography>
                          </div>
                        </div>
                      </div>
                      <div></div>
                    </div>
                    <div>
                      <div className="flex-row parentcontainer">
                        <div className="flex-row iconcontainer">
                          <AccountCircleOutlinedIcon
                            sx={{ width: 25, height: 25 }}
                          />
                          <Typography className="font-bold fs14 capitalize flex-center h35">
                            {petDetails.userName}
                          </Typography>
                        </div>
                        <div className="meeting-doctor">
                          {moment(petDetails.dob).fromNow()} ({petDetails.dob})
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </Grid>
            </Grid>
          </Grid>
        )}

        <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
          <div className="txt-mont fs14">Booking Type</div>
          <Select
            list={typeAppointemnt}
            value={petValues.typeOfAppointment}
            handleChange={(e) => handleSelect(e, "typeOfAppointment")}
            name="typeOfAppointment"
            select
            helperText={petHelpers?.typeOfAppointment}
            error={petErrors?.typeOfAppointment}
            labelTop
          />
        </Grid>

        <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
          <div className="txt-mont fs14">Consultation mode</div>
          <Select
            list={
              petValues.typeOfAppointment === "Walk-in" ? typeListNew : typeList
            }
            value={ petValues.typeOfAppointment === "Walk-in" ? "Physical" : petValues.consultationType }
            handleChange={(e) => {
              handleSelect(e, "consultationType");
              handleSlot(e.target.value, "consultationType");
              // setSelectedDate(null);
              if(petValues?.dob){
                handleDateClick();

              }
            }}
            name="consultationType"
            select
            helperText={petHelpers?.consultationType}
            error={petErrors?.consultationType}
            labelTop
          />
        </Grid>

        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <div className="txt-mont fs14">Service type</div>
          <Select
            list={serviceType}
            value={petValues.serviceType}
            handleChange={(e) => handleSelect(e, "serviceType")}
            select
            helperText={petHelpers?.serviceType}
            error={petErrors?.serviceType}
            labelTop
          />
        </Grid>

        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <div className="txt-mont fs14 ">Reason</div>
          <Select
            list={conditionList}
            value={petValues?.reason}
            handleChange={(e) => handleSelect(e, "reason")}
            select
            helperText={petHelpers?.reason}
            error={petErrors?.reason}
            labelTop
          />
        </Grid>

        {petValues.typeOfAppointment !== "Phone" && (
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12} className="mbminus">
            <div className="flex-row">
              <div className="txt-mont fs14 mt10">Appointment :</div>
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
        )}

        {petValues.typeOfAppointment === "Phone" && (
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12} className="mbminus">
            <div className="flex-row">
              <div className="txt-mont fs14 mt10">Appointment :</div>
              <div className="ml5">
                <CustomCheckbox
                  radio
                  value={appointmentOption}
                  onChange={handleAppointmentOptionChange}
                  radios={[{ label: "Later", value: "Later" }]}
                />
              </div>
            </div>
            {appointmentError && (
              <Typography color="error" className="ml5 mt5 fs14">
                Appointment is Required
              </Typography>
            )}
          </Grid>
        )}

        {appointmentOption === "Later" && (
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <div className="txt-mont fs14">Date</div>
            <div className="mb20">
              {/* <CustomTextField
                name="dob"
                value={
                  selectedDate ? moment(selectedDate).format("DD/MM/YYYY") : ""
                }
                helperText={petHelpers?.dob}
                error={petErrors?.dob}
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
                  handleDateClick(e.target.value);
                }}
              />
            </div>
          </Grid>
        )}

        {/* {appointmentOption === "Later" && (
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <CalendarComponent
              handleDateClick={handleDateClick}
              selectedDate={selectedDate}
            />
            {selectedDateError && (
              <Typography color="error" className="ml5 mt5 fs14">
                Date is Required
              </Typography>
            )}
          </Grid>
        )} */}

        {appointmentOption === "Later" && petValues?.dob && (
          <>
            {slotList
              ?.filter((item) => item?.status === "Y")
              ?.map((item, i) => {
                return (
                  <div key={item.slotTimeId} className="flex-row">
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
                );
              })}
          </>
        )}
        {selectTimeIdError && (
          <Typography color="error" className="ml5 mt5 fs14">
            Time is Required
          </Typography>
        )}
      </Grid>

      <div className="flex1-end">
        <Grid item xs={6} sm={6} md={3} lg={3} xl={3}>
          <CustomButton text="Submit" onClick={petAppointmentCreate} />
        </Grid>
      </div>
    </CustomModal>
  );
};

export default VetBookAppointment;
