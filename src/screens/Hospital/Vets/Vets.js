import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import {
  FormHelperText,
  Container,
  Grid,
  Typography,
  Toolbar,
} from "@mui/material";
import dayjs from "dayjs";
import { number } from "prop-types";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CustomButton from "../../../components/CustomButton";
import CustomCard from "../../../components/CustomCard/CustomCard";
import Checkbox from "../../../components/CustomCheckbox";
import CustomModal from "../../../components/CustomModal/CustomModal";
import CustomTextField from "../../../components/CustomTextField";
import Select from "../../../components/Select/Select";
import TopBar from "../../../components/TopBar/TopBar";
import {
  createClinicDoctors,
  createClinicSlots,
  createOthers,
} from "../../../redux/reducers/clinicSlice";
import {
  getClinicVets,
  getGlobalDays,
  getVetsSlots,
  updateVet,
  updateVetBlockStatus,
} from "../../../redux/reducers/vetSlice";
import { AppColors } from "../../../util/AppColors";
import { ErrorStrings } from "../../../util/ErrorString";
import { EmailRegex } from "../../../util/Validations";
import { dayList, newRoleList } from "../../../util/arrayList";
import {
  clinicRolesList,
  salutationList,
  specialtyList,
  typeList,
} from "../../../util/dropList";
import generatePass from "../../../util/randomPassword";
import CommonPaymentUpdateModal from "../CommonPaymentUpdateModal/CommonPaymentUpdateModal";
import "./Vets.css";
import moment from "moment";
import CustomCheckbox from "../../../components/CustomCheckbox";
import { CheckBox } from "@mui/icons-material";

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

const initialValues = {
  salutation: "",
  name: "",
  speciality: "",
  contactNumber: "",
  conType: [],
  email: "",
  password: "",
  role: "",
};

const initialSlotValues = {
  Monday: {
    startTime: new Date(),
    endTime: new Date(new Date().setMinutes(new Date().getMinutes() + 30)),
    number: "15",
  },
  Tuesday: {
    startTime: new Date(),
    endTime: new Date(new Date().setMinutes(new Date().getMinutes() + 30)),
    number: "15",
  },
  Wednesday: {
    startTime: new Date(),
    endTime: new Date(new Date().setMinutes(new Date().getMinutes() + 30)),
    number: "15",
  },
  Thursday: {
    startTime: new Date(),
    endTime: new Date(new Date().setMinutes(new Date().getMinutes() + 30)),
    number: "15",
  },
  Friday: {
    startTime: new Date(),
    endTime: new Date(new Date().setMinutes(new Date().getMinutes() + 30)),
    number: "15",
  },
  Saturday: {
    startTime: new Date(),
    endTime: new Date(new Date().setMinutes(new Date().getMinutes() + 30)),
    number: "15",
  },
  Sunday: {
    startTime: new Date(),
    endTime: new Date(new Date().setMinutes(new Date().getMinutes() + 30)),
    number: "15",
  },
  selectedDays: [],
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

const initialFile = { file: null, imagePreviewUrl: "" };

const initialUpdateValue = { virEntryFee: number, phyEntryFee: number };
const initialUpdateError = { virEntryFee: false, phyEntryFee: false };

const breakObj = {
  startTime: new Date(),
  endTime: new Date(new Date().setHours(new Date().getHours() + 1)),
  error: false,
  help: "",
};

const Vets = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const vets = useSelector((state) => state.vet.vets);
  const schedule = useSelector((state) => state.vet.globalDays);
  const slotList = useSelector((state) => state.vet.slotList);
  const [conModVisible, setConModVisible] = useState(false);
  const [vetValues, setVetValues] = useState(initialValues);

  const [vetErrors, setVetErrors] = useState(initialError);
  const [vetHelps, setVetHelps] = useState(initialHelp);
  const [showPassword, setShowPassword] = useState(false);
  const [isAutoGenPass, setAutoGenPass] = useState(false);
  const [selectedVet, setSelectedVet] = useState(null);
  const [searchValue, setSearchValue] = useState("");

  const [searchTypeValue, setSearchTypeValue] = useState("vet-name");
  const [fileUploadUrl, setFileUploadUrl] = useState(initialFile);
  const [file, setFiles] = useState();
  const [hospital, setHospital] = useState(null);
  const [updateValue, setUpdateValue] = useState(initialUpdateValue);
  const [updateErrors, setUpdateErrors] = useState(initialUpdateError);
  const [updateHelps, setUpdateHelps] = useState(initialUpdateValue);
  const defaultUrl = `?type=${searchTypeValue}`;
  const [createModVisible, setCreateModalVisible] = useState(false);
  const [createUserType, setCreateUserType] = useState("Vet");
  const [availModVisible, setAvailModVisible] = useState(false);
  const [breaks, setBreaks] = useState([]);
  const [slotValues, setSlotValues] = useState(initialSlotValues);
  const [slotErrors, setSlotErrors] = useState();
  const [allowedAvailabilityTypes, setAllowedAvailabilityTypes] = useState([]);
  const [availabilityType, setAvailabilityType] = useState(null);
  const [timeError, setTimeError] = useState(false);
  const [durationError, setDurationError] = useState(false);
  const [appointmentOption, setAppointmentOption] = useState(false);

  const dayMap = {
    mon: "Monday",
    tue: "Tuesday",
    wen: "Wednesday",
    thu: "Thursday",
    fri: "Friday",
    sat: "Saturday",
    sun: "Sunday",
  };

  useEffect(() => {
    dispatch(getClinicVets());
    dispatch(getGlobalDays());
  }, []);

  const validateSlot = (name, value) => {
    let error = "";
    switch (name) {
      case "startTime":
        if (!value) {
          error = "Start time is required";
        }
        break;
      case "endTime":
        if (!value) {
          error = "End time is required";
        } else if (value <= slotValues.startTime) {
          error = "End time must be after start time";
        }
        break;
      default:
        break;
    }
    setSlotErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error,
    }));
  };

  const filteredVets = vets?.filter((vet) =>
    (vet.name?.toLowerCase() || "").includes(searchValue?.toLowerCase())
  );

  const handleRemoveBreakTime = (index) => {
    const updatedBreaks = breaks.filter((_, i) => i !== index);
    setBreaks(updatedBreaks);
  };

  const conModalOpen = () => {
    setConModVisible(!conModVisible);
  };

  const emailValidation = (value) => {
    if (value === "") {
      setVetErrors({ ...vetErrors, email: true });
      setVetHelps({ ...vetHelps, email: ErrorStrings.emptyEmail });
    }
    if (value !== "") {
      if (!EmailRegex.test(value)) {
        setVetErrors({ ...vetErrors, email: true });
        setVetHelps({ ...vetHelps, email: ErrorStrings.inValidEmail });
      } else {
        setVetErrors({ ...vetErrors, email: false });
        setVetHelps({ ...vetHelps, email: "" });
      }
    }
  };

  const passValidation = (value) => {
    if (value === "") {
      setVetErrors({ ...vetErrors, password: true });
      setVetHelps({ ...vetHelps, password: ErrorStrings.emptyPass });
      return;
    }
    if (value.length < 6) {
      setVetErrors({ ...vetErrors, password: true });
      setVetHelps({ ...vetHelps, password: ErrorStrings.inValidPass });
      return;
    }
    setVetErrors({ ...vetErrors, password: false });
    setVetHelps({ ...vetHelps, password: "" });
  };

  const mobileValidation = (value) => {
    if (value === "") {
      setVetErrors({ ...vetErrors, contactNumber: true });
      setVetHelps({ ...vetHelps, contactNumber: ErrorStrings.emptyMobile });
      return;
    }
    if (value.length < 10 || value.length > 10) {
      setVetErrors({ ...vetErrors, contactNumber: true });
      setVetHelps({ ...vetHelps, contactNumber: ErrorStrings.inValidMobile });
      return;
    }
    setVetErrors({ ...vetErrors, contactNumber: false });
    setVetHelps({ ...vetHelps, contactNumber: "" });
  };

  const handleChange = (e) => {
    setVetValues({ ...vetValues, [e.target.name]: e.target.value });
    if (e.target.name === "email") return emailValidation(e.target.value);
    if (e.target.name === "password") return passValidation(e.target.value);
    if (e.target.name === "contactNumber") {
      return mobileValidation(e.target.value);
    }
    const { name, value } = e.target;
    if (vetErrors[name]) {
      setVetErrors({ ...vetErrors, [name]: false });
      setVetHelps({ ...vetHelps, [name]: "" });
    }

    setVetValues({ ...vetValues, [name]: value });

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

  const handleChangeSlot = (day, e) => {
    const { name, value } = e.target;
    setSlotValues((prevValues) => ({
      ...prevValues,
      [day]: {
        ...prevValues[day],
        [name]: value,
      },
    }));

    if (name === "endTime" || name === "startTime") {
      const timeDiff = getTimeDiff(
        name === "endTime" ? value : slotValues[day].endTime,
        name === "startTime" ? value : slotValues[day].startTime
      );
      setTimeError(timeDiff < 15);
    }

    if (name === "number") {
      setDurationError(value < 15);
    }
  };

  const getTimeDiff = (endTime, startTime) => {
    const differenceValue =
      (new Date(endTime).getTime() - new Date(startTime).getTime()) / 1000 / 60;
    return differenceValue;
  };

  const handleChangeBreak = (index, name, value) => {
    const updatedBreaks = [...breaks];
    updatedBreaks[index] = { ...updatedBreaks[index], [name]: value };
    setBreaks(updatedBreaks);
  };

  const handleValidation = () => {
    const errorList = [];
    const woErrorList = [];
    Object.keys(vetValues).forEach(function (key, index) {
      if (key === "email") {
        if (vetValues?.[key] === "") return errorList?.push(key);

        if (!EmailRegex.test(vetValues?.[key])) {
          return errorList?.push(key);
        } else woErrorList.push(key);
      } else if (key === "password") {
        if (selectedVet) return;
        if (vetValues?.[key] === "") return errorList?.push(key);

        if (vetValues?.[key]?.length < 6) {
          return errorList?.push(key);
        } else woErrorList.push(key);
      } else if (key === "mobile") {
        if (selectedVet) return;
        if (vetValues?.[key] === "") return errorList?.push(key);

        if (vetValues?.[key]?.length < 10 || vetValues?.[key]?.length > 10) {
          return errorList?.push(key);
        } else woErrorList.push(key);
      } else {
        if (vetValues?.[key]?.length === 0 || vetValues?.[key] === "") {
          return errorList?.push(key);
        }
        woErrorList.push(key);
      }
    });
    let errorObj = {};
    let errorHelperObj = {};
    let correctObj = {};
    let helperObj = {};
    //set Error
    if (errorList?.length > 0) {
      errorList?.forEach((key) => {
        errorObj = { ...errorObj, [key]: true };
        const value = vetValues?.[key];
        if (key === "email") {
          if (value === "") {
            errorHelperObj = {
              ...errorHelperObj,
              [key]: ErrorStrings.emptyEmail,
            };
            return;
          }
          if (!EmailRegex.test(value)) {
            errorHelperObj = {
              ...errorHelperObj,
              [key]: ErrorStrings.inValidEmail,
            };
            return;
          }
        }
        if (key === "password") {
          if (value === "") {
            errorHelperObj = {
              ...errorHelperObj,
              [key]: ErrorStrings.emptyPass,
            };
            return;
          }
          if (value < 6) {
            errorHelperObj = {
              ...errorHelperObj,
              [key]: ErrorStrings.inValidPass,
            };
          }
        }
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
    // const validation = handleValidation();
    // if (validation?.errorList?.length > 0) return;
    const form = new FormData();
    // form.append("salutation", );
    form.append("name", vetValues?.salutation + "." + vetValues?.name);
    form.append("speciality", vetValues?.speciality);
    form.append("mobile", vetValues?.contactNumber);
    form.append("consulationType", vetValues?.conType);
    form.append("email", vetValues?.email);
    if (!selectedVet) form.append("password", vetValues?.password);
    if (fileUploadUrl?.file) form.append("image", file);

    let apiSuccess;
    if (selectedVet?.doctorId) {
      apiSuccess = await dispatch(
        updateVet({ form, vetId: selectedVet?.doctorId })
      );
    } else {
      apiSuccess = await dispatch(createVet(form));
    }

    if (apiSuccess?.payload) {
      dispatch(getClinicVets());
      setConModVisible(false);
      handleReset();
    }
  };

  const handleReset = () => {
    setFileUploadUrl(initialFile);
    setVetValues(initialValues);
    setVetErrors(initialError);
    setVetHelps(initialHelp);
    setAutoGenPass(false);
    setSelectedVet(null);
    setUpdateValue(initialUpdateValue);
    setUpdateHelps(initialUpdateValue);
    setUpdateErrors(initialUpdateError);
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

  const handleSelect = (e, key) => {
    // setVetValues({ ...vetValues, [key]: e.target.value });
    const { value } = e.target;

    // Reset the error message when an item is selected
    if (vetErrors[key]) {
      setVetErrors({ ...vetErrors, [key]: false });
      setVetHelps({ ...vetHelps, [key]: "" });
    }

    setVetValues({ ...vetValues, [key]: value });
  };

  const handleSelectSlot = (e, key) => {
    // setVetValues({ ...vetValues, [key]: e.target.value });
    const { value } = e.target;

    // Reset the error message when an item is selected
    // if (vetErrors[key]) {
    //   setVetErrors({ ...vetErrors, [key]: false });
    //   setVetHelps({ ...vetHelps, [key]: "" });
    // }

    setSlotValues({ ...slotValues, [key]: value });
  };

  const handleSearch = () => {
    const url = `${searchValue?.length > 0 ? `?search=${searchValue}` : ""}${
      searchTypeValue
        ? `${searchValue?.length > 0 ? "&" : "?"}type=${searchTypeValue}`
        : ""
    }`;
    dispatch(getClinicVets(url));
  };

  const handleResetBtn = () => {
    setSearchTypeValue("vet-name");
    setSearchValue("");
    dispatch(getClinicVets(defaultUrl));
  };

  const onUploadFile = (e) => {
    const reader = new FileReader();
    const file = e.target.files[0];
    setFiles(e.target.files[0]);

    reader.onloadend = () => {
      setFileUploadUrl({
        file: e.target.files[0],
        imagePreviewUrl: reader.result,
      });
    };
    reader.readAsDataURL(file);
  };

  const importVet = () => {
    console.log("import clinic");
  };

  const downloadVet = () => {
    console.log("download clinic");
  };

  const handleModify = (vet) => {
    setSelectedVet(vet);
  };

  const handleMangeSlot = (vet) => {
    console.log(vet);
    navigate(`/vet-details/${vet?.doctorId}`, {
      state: { vet, clinicName: hospital?.name, activeTab: "Availability" },
    });
  };

  const handleChangeSwitch = async (e, vet) => {
    const apiRes = await dispatch(
      updateVetBlockStatus({
        vetId: vet?.doctorId,
        active: e.target.value ? "Y" : "N",
      })
    );
    if (apiRes?.payload) {
      dispatch(getClinicVets());
    }
  };

  const handleCardClick = (vet) => {
    navigate("/vet-calendar", { state: { vet } });
    // navigate(`/vet-details/${vet?.doctorId}`, {
    //   state: { vet, clinicName: hospital?.name },
    // });
  };

  const handleUpdateFeeUpdateSuccess = async () => {
    setSelectedVet(null);
    setConModVisible(!conModVisible);
    dispatch(getClinicVets());
  };

  const handleAutoGenPassword = () => {
    setAutoGenPass(!isAutoGenPass);
    if (!isAutoGenPass) {
      const pass = generatePass();
      setVetValues({ ...vetValues, password: pass });
    } else {
      setVetValues({ ...vetValues, password: "" });
    }
  };

  const onClickCalendar = (vet) => {
    setSelectedVet(vet);
    dispatch(getVetsSlots(vet?.doctorId));
    if (vet?.consulationType?.length > 0) {
      setAllowedAvailabilityTypes(vet?.consulationType);
      setAvailabilityType(vet?.consulationType[0]);
    } else {
      setAllowedAvailabilityTypes([]);
    }
    if (vet?.active === "Y") {
      setAvailModVisible(!availModVisible);
    }
  };
  const onClickDollar = (vet) => {
    setSelectedVet(vet);

    if (vet?.active === "Y") {
      setConModVisible(!conModVisible);
    }
  };
  const handleCreate = () => {
    setCreateModalVisible(true);
  };

  const handleAvailModal = () => {
    setAvailModVisible(!availModVisible);
    setSlotValues(initialSlotValues);
    setBreaks([]);
    setAllowedAvailabilityTypes([]);
  };

  const createModalOpen = () => {
    setCreateUserType("Vet");
    setCreateModalVisible(!createModVisible);
    setVetValues(initialValues);
  };

  const handleChangeUserType = (e) => {
    setCreateUserType(e.target.value);
    setVetValues(initialValues);
  };

  const handleSelectedDays = (selectedDay) => {
    const dayValue = selectedDay.value;
    const isSelected = slotValues.selectedDays.includes(dayValue);

    setSlotValues((prevValues) => {
      const newSelectedDays = isSelected
        ? prevValues.selectedDays.filter((day) => day !== dayValue)
        : [...prevValues.selectedDays, dayValue];

      return {
        ...prevValues,
        selectedDays: newSelectedDays,
      };
    });
  };

  const handleAddbreakTime = () => {
    if (breaks?.length >= 3) return;
    setBreaks([
      ...breaks,
      {
        ...breakObj,
        startTime: new Date(),
        endTime: new Date(),
        i: breaks?.length ?? 0,
      },
    ]);
  };

  const makeDoctorSlots = async () => {
    if (durationError || timeError) return;

    const dayRequest = slotValues?.selectedDays?.map((day) => {
      const dayKey = dayMap[day];
      return {
        day: dayKey,
        startTime: moment(new Date(slotValues[dayKey]?.startTime)).format(
          "HH:mm"
        ),
        endTime: moment(new Date(slotValues[dayKey]?.endTime)).format("HH:mm"),
        duration: parseInt(slotValues[dayKey]?.number, 10),
        status: true,
      };
    });
    const dayRequestForPhysicalCheck = schedule?.map((day) => {
      const dayKey = dayMap[day?.day];
      return {
        day: dayKey,
        startTime: day?.startTime,
        endTime: day?.endTime,
        duration: day?.duration,
        status: day?.status,
      };
    });
    const data = {
      type: availabilityType,
      physical: false,
      dayRequest:
        appointmentOption && availabilityType === "Physical"
          ? dayRequestForPhysicalCheck
          : dayRequest,
    };

    if (breaks?.length > 0) {
      data.breakTime = breaks.map((br) => {
        return {
          startTime: moment(new Date(br.startTime)).format("HH:mm"),
          endTime: moment(new Date(br.endTime)).format("HH:mm"),
        };
      });
    }

    const metaData = { vetId: selectedVet?.doctorId, data };
    await dispatch(createClinicSlots(metaData)).then((res) => {
      if (res?.meta?.requestStatus === "fulfilled") {
        setAvailModVisible(!availModVisible);
        setSlotValues(initialSlotValues);
        setBreaks([]);
        setAllowedAvailabilityTypes([]);
      }
    });
  };

  const resetFormValues = () => {
    setVetValues({
      name: null,
      salutation: null,
      speciality: null,
      email: null,
      password: null,
      conType: [],
    });
  };

  const resetOtherValues = () => {
    setVetValues({
      name: null,
      role: null,

      email: null,
      password: null,
    });
  };

  const validateField = (value) => {
    if (Array?.isArray(value)) {
      return value?.length > 0;
    } else {
      return typeof value === "string" && value.trim() !== "";
    }
  };

  const createVet = () => {
    // Validate fields
    const nameValid = validateField(vetValues?.name);
    // const salutationValid = validateField(vetValues?.salutation);
    const specialityValid = validateField(vetValues?.speciality);
    const emailValid = validateField(vetValues?.email);
    const passwordValid = validateField(vetValues?.password);
    const conTypeValid = validateField(vetValues?.conType);
    const roleValid = validateField(vetValues?.role);

    // If any validation fails, update the state to show errors
    if (
      !nameValid ||
      // !salutationValid ||
      !specialityValid ||
      !emailValid ||
      !passwordValid ||
      !conTypeValid ||
      !roleValid
    ) {
      setVetErrors({
        name: !nameValid,
        // salutation: !salutationValid,
        speciality: !specialityValid,
        email: !emailValid,
        password: !passwordValid,
        conType: !conTypeValid,
        role: !roleValid,
      });
      setVetHelps({
        name: nameValid ? "" : "This Field is required",
        // salutation: salutationValid ? "" : "This Field is required",
        speciality: specialityValid ? "" : "This Field is required",
        email: emailValid ? "" : "Invalid email format",
        password: passwordValid
          ? ""
          : "Password must be at least 6 characters long",
        conType: conTypeValid ? "" : "This Field is required",
        role: roleValid ? "" : "This Field is required",
      });
      console.log("Validation failed");
      return;
    }

    console.log("Validation passed, proceeding with API call");

    // Proceed with vet creation if all validations pass
    const data = new FormData();
    data.append("name", vetValues.name);
    // data.append("salutation", "Dr.");
    data.append("speciality", vetValues.speciality);
    data.append("role", vetValues.role);
    data.append("email", vetValues.email);
    data.append("password", vetValues.password);
    data.append("consulationType", vetValues.conType);
    data.append("mobile", vetValues?.contactNumber);

    dispatch(createClinicDoctors(data))
      .then((res) => {
        console.log("API call response:", res);
        if (res?.payload?.data?.status === 200) {
          setCreateModalVisible(false);
          resetFormValues();
          dispatch(getClinicVets());
        }
      })
      .catch((error) => {
        console.error("API call failed:", error);
      });
  };

  const createOther = () => {
    // Validate fields
    const nameValid = validateField(vetValues?.name);

    const emailValid = validateField(vetValues?.email);
    const passwordValid = validateField(vetValues?.password);
    const roleValid = validateField(vetValues?.role);

    // If any validation fails, update the state to show errors
    if (!nameValid || !emailValid || !passwordValid || !roleValid) {
      setVetErrors({
        name: !nameValid,

        email: !emailValid,
        password: !passwordValid,
        role: !roleValid,
      });
      setVetHelps({
        name: nameValid ? "" : "This Field is required",

        email: emailValid ? "" : "Invalid email format",
        password: passwordValid
          ? ""
          : "Password must be at least 6 characters long",
        role: roleValid ? "" : "This Field is required",
      });
      return;
    }

    // Proceed with vet creation if all validations pass
    const data = new FormData();
    data.append("name", vetValues?.name);
    data.append("role", vetValues?.role);
    data.append("salutation", vetValues?.salutation);

    data.append("email", vetValues?.email);
    data.append("password", vetValues?.password);
    data.append("mobile", vetValues?.contactNumber);

    dispatch(createOthers(data)).then((res) => {
      if (res?.meta?.requestStatus === "fulfilled") {
        setCreateModalVisible(false);
        resetOtherValues();
        // dispatch(getClinicVets());
      }
    });
  };

  const handleAppointmentOptionChange = () => {
    setAppointmentOption(!appointmentOption);
    setSlotValues(initialSlotValues)
  };
  return (
    <>
      <TopBar>
        <Container maxWidth="xl">
          <Toolbar variant="regular">
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <div className="flex-row">
                <div className="top-row-cen-con w100Per">
                  <Grid item xs={12} sm={12} md={5} lg={5} xl={5}>
                    <CustomTextField
                      placeholder="Search"
                      name="name"
                      fullWidth
                      handleChange={(e) => setSearchValue(e.target.value)}
                      value={searchValue}
                      search
                      backgroundColor="#E3CECE52"
                    />
                  </Grid>
                  <Grid
                    item
                    xs={4}
                    sm={2}
                    md={2}
                    lg={1}
                    xl={1}
                    className="ml20"
                  >
                    <CustomButton text="Create" onClick={handleCreate} />
                  </Grid>
                  <div className="top-row-right-con w15Per topBar-select">
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
                  </div>
                </div>
              </div>
            </Grid>
          </Toolbar>
        </Container>
      </TopBar>
      <Container maxWidth="xl">
        {filteredVets?.length > 0 ? (
          <CustomCard
            list={filteredVets}
            onClickCalendar={
              onClickCalendar
              // handleMangeSlot
            }
            onClickDollar={onClickDollar}
            onChangeSwitch={handleChangeSwitch}
            onCardClick={handleCardClick}
            users
          />
        ) : (
          <div className="no-record">No doctors found</div>
        )}
        <CommonPaymentUpdateModal
          open={conModVisible}
          onClose={conModalOpen}
          onApiSuccess={handleUpdateFeeUpdateSuccess}
          vet={selectedVet}
        />

        <CustomModal
          open={createModVisible}
          onClose={createModalOpen}
          header="Create"
          rightModal
          modalWidth={30}
        >
          <Grid container spacing={1} className="ph20">
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <div className="txt-mont fs14 fw-600 ">User Type</div>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <Checkbox
                radio
                onChange={handleChangeUserType}
                radios={[
                  { label: "Vet", value: "Vet" },
                  { label: "Other", value: "Other" },
                ]}
                defaultValue={createUserType}
              />
            </Grid>
            {createUserType === "Other" ? (
              <Grid item xs={4} sm={4} md={3} lg={3} xl={3}>
                <div className="txt-mont fs14 fw-600 ">Salutation</div>
                <Select
                  list={salutationList}
                  value={vetValues?.salutation}
                  handleChange={(e) => handleSelect(e, "salutation")}
                  name="salutation"
                  // label={nameExpan?.["salutation"]}
                  select
                  error={vetErrors?.salutation}
                  helperText={vetHelps?.salutation}
                  labelTop
                />
              </Grid>
            ) : null}
            <Grid
              item
              xs={createUserType === "Other" ? 8 : 6}
              sm={createUserType === "Other" ? 8 : 6}
              md={createUserType === "Other" ? 9 : 6}
              lg={createUserType === "Other" ? 9 : 6}
              xl={createUserType === "Other" ? 9 : 6}
            >
              <div className="txt-mont fs14 fw-600 ">Name</div>
              <CustomTextField
                // label={nameExpan?.["name"]}
                // placeholder={nameExpan?.["name"]}
                name="name"
                fullWidth
                handleChange={handleChange}
                value={vetValues?.name}
                helperText={vetHelps?.name}
                error={vetErrors?.name}
                labelTop
              />
            </Grid>
            {createUserType === "Other" || createUserType === "Vet" ? (
              <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                <div className="txt-mont fs14 fw-600 ">Role</div>
                <Select
                  list={
                    createUserType === "Vet" ? newRoleList : clinicRolesList
                  }
                  value={vetValues?.role}
                  handleChange={(e) => handleSelect(e, "role")}
                  select
                  // label="Role"
                  error={vetErrors?.role}
                  helperText={vetHelps?.role}
                  labelTop
                />
              </Grid>
            ) : null}

            {createUserType === "Vet" ? (
              <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                <div className="txt-mont fs14 fw-600 ">Speciality</div>
                <Select
                  list={specialtyList}
                  value={vetValues?.speciality}
                  handleChange={(e) => handleSelect(e, "speciality")}
                  name="speciality"
                  // label={nameExpan?.["speciality"]}
                  select
                  error={vetErrors?.speciality}
                  helperText={vetHelps?.speciality}
                  labelTop
                />
              </Grid>
            ) : null}
            {createUserType === "Vet" ? (
              <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                <div className="txt-mont fs14 fw-600 ">Consultation Type</div>

                <Select
                  list={typeList}
                  value={vetValues?.conType}
                  handleChange={handleMultiSelect}
                  multiSelectTagCheck
                  // label={nameExpan?.["conType"]}
                  error={vetErrors?.conType}
                  helperText={vetHelps?.conType}
                  labelTop
                />
              </Grid>
            ) : null}

            {createUserType === "Vet" || createUserType === "Other" ? (
              <Grid
                item
                xs={createUserType === "Vet" ? 12 : 6}
                sm={createUserType === "Vet" ? 12 : 6}
                md={createUserType === "Vet" ? 12 : 6}
                lg={createUserType === "Vet" ? 12 : 6}
                xl={createUserType === "Vet" ? 12 : 6}
              >
                <div className="txt-mont fs14 fw-600 ">Phone Number</div>
                <CustomTextField
                  // list={specialtyList}
                  value={vetValues?.contactNumber}
                  handleChange={(e) => handleSelect(e, "contactNumber")}
                  name="Contact Number"
                  // label={nameExpan?.["speciality"]}
                  // select
                  error={vetErrors?.speciality}
                  fullWidth
                  helperText={vetHelps?.speciality}
                  labelTop
                />
              </Grid>
            ) : null}

            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <div className="txt-mont fs14 fw-600 ">Email</div>
              <CustomTextField
                // label={nameExpan?.["email"]}
                // placeholder={nameExpan?.["email"]}
                name="email"
                fullWidth
                handleChange={handleChange}
                value={vetValues?.email}
                helperText={vetHelps?.email}
                error={vetErrors?.email}
                // labelTop
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <div className="txt-mont fs14 fw-600 ">Password</div>
              <CustomTextField
                // label={nameExpan?.["password"]}
                // placeholder={nameExpan?.["password"]}
                name="password"
                fullWidth
                handleChange={handleChange}
                value={vetValues?.password}
                helperText={vetHelps?.password}
                error={vetErrors?.password}
                showPassword={showPassword}
                handleClickShowPassword={() => setShowPassword(!showPassword)}
                labelTop
                // password
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <Checkbox
                label="Auto-Generate Password"
                checked={isAutoGenPass}
                onChange={handleAutoGenPassword}
              />
            </Grid>
            <div className="flex1-end">
              <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                <CustomButton
                  text="Register"
                  onClick={createUserType === "Vet" ? createVet : createOther}
                />
              </Grid>
            </div>
          </Grid>
        </CustomModal>
        <CustomModal
          open={availModVisible}
          onClose={handleAvailModal}
          header="Set Availability"
          rightModal
          modalWidth={30}
        >
          <div className="scroll-80vh">
            <Grid container spacing={1} className="ph20 ">
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <div className="flex-row">
                  {/* <Typography
                className={`font-medium fs14 w50Per flex-center cursor ${
                  availabilityType === "Physical"
                    ? "con-type-selected"
                    : "con-type-un-selected"
                }`}
                // w33Per
                onClick={() => setAvailabilityType("Physical")}
              >
                Physical
              </Typography>
              <Typography
                className={`font-medium fs14 w50Per flex-center cursor ${
                  availabilityType === "Virtual"
                    ? "con-type-selected"
                    : "con-type-un-selected"
                }`}
                // w33Per
                onClick={() => setAvailabilityType("Virtual")}
              >
                Virtual
              </Typography> */}
                  {/* <Typography
                className={`font-medium fs14 w33Per flex-center cursor ${
                  availabilityType === "HomeVisit"
                    ? "con-type-selected"
                    : "con-type-un-selected"
                }`}
                onClick={() => setAvailabilityType("HomeVisit")}
              >
                Home Visit
              </Typography> */}

                  {allowedAvailabilityTypes?.includes("Physical") && (
                    <Typography
                      className={`font-medium fs14 w50Per flex-center cursor ${
                        availabilityType === "Physical"
                          ? "con-type-selected"
                          : "con-type-un-selected"
                      }`}
                      onClick={() => {
                        setAvailabilityType("Physical");
                        setAppointmentOption(false);
                        setSlotValues(initialSlotValues);
                      }}
                    >
                      Physical
                    </Typography>
                  )}
                  {allowedAvailabilityTypes?.includes("Virtual") && (
                    <Typography
                      className={`font-medium fs14 w50Per flex-center cursor ${
                        availabilityType === "Virtual"
                          ? "con-type-selected"
                          : "con-type-un-selected"
                      }`}
                      onClick={() => {
                        setAvailabilityType("Virtual");
                        setAppointmentOption(false);
                        setSlotValues(initialSlotValues);
                      }}
                    >
                      Virtual
                    </Typography>
                  )}
                </div>
              </Grid>

              {availabilityType === "Physical" ? (
                <>
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <CustomCheckbox
                      label="Use Clinic Schedule"
                      checked={appointmentOption}
                      onChange={handleAppointmentOptionChange}
                    />
                  </Grid>

                  {appointmentOption ? (
                    <div>
                      {schedule?.map((item, index) => {
                        return (
                          <div className="flex-row mv2">
                            <div className="text blue-color ph10 w50Per capitalize ">
                              {dayMap[item.day]}{" "}
                            </div>
                            <div className="text black-color ml20">
                              {item.startTime}
                            </div>
                            <div className="text black-color  ml10">-</div>
                            <div className="text black-color  ml20">
                              {item.endTime}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <>
                      <Grid item xs={6} sm={12} md={12} lg={12} xl={12}>
                        <Typography className="font-bold fs14">
                          Manage Availability
                        </Typography>
                        <div className="mt15">
                          {dayList?.map((day, i) => (
                            <div
                              className="flex-row mt10 cursor "
                              style={{
                                display: "flex",
                                alignItems: "center",
                                marginTop: 12,
                              }}
                              key={i}
                            >
                              <Checkbox
                                checked={slotValues?.selectedDays?.includes(
                                  day?.value
                                )}
                                onChange={() => handleSelectedDays(day)}
                                color="primary"
                              />
                              <Typography className="font-bold fs14 day-unselected">
                                {day.shortName}
                              </Typography>

                              <Grid item xs={4} className="ml10">
                                <CustomTextField
                                  label="Start Time"
                                  placeholder="Start Time"
                                  name="startTime"
                                  fullWidth
                                  handleChange={(e) =>
                                    handleChangeSlot(dayMap[day.value], e)
                                  }
                                  value={
                                    slotValues[dayMap[day.value]].startTime
                                  }
                                  mobileTime
                                  is12HourFomat={false}
                                />
                              </Grid>
                              <Grid item xs={4} className="ml10">
                                <CustomTextField
                                  label="End Time"
                                  placeholder="End Time"
                                  name="endTime"
                                  fullWidth
                                  handleChange={(e) =>
                                    handleChangeSlot(dayMap[day.value], e)
                                  }
                                  value={slotValues[dayMap[day.value]].endTime}
                                  mobileTime
                                  is12HourFomat={false}
                                />
                              </Grid>
                              <Grid item xs={4} className="ml10">
                                <CustomTextField
                                  label="(in mins)"
                                  placeholder="(in mins)"
                                  name="number"
                                  fullWidth
                                  handleChange={(e) =>
                                    handleChangeSlot(dayMap[day.value], e)
                                  }
                                  value={slotValues[dayMap[day.value]].number}
                                />
                              </Grid>
                            </div>
                          ))}
                        </div>
                      </Grid>
                      {timeError ? (
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                          <FormHelperText error>
                            End time smaller than Start time
                          </FormHelperText>
                        </Grid>
                      ) : null}
                      {durationError ? (
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                          <FormHelperText error>
                            Minimun slot duration is 15 minutes
                          </FormHelperText>
                        </Grid>
                      ) : null}
                    </>
                  )}
                </>
              ) : (
                <>
                  <Grid item xs={6} sm={12} md={12} lg={12} xl={12}>
                    <Typography className="font-bold fs14">
                      Manage Availability
                    </Typography>
                    <div className="mt15">
                      {dayList?.map((day, i) => (
                        <div
                          className="flex-row mt10 cursor "
                          style={{
                            display: "flex",
                            alignItems: "center",
                            marginTop: 12,
                          }}
                          key={i}
                        >
                          <Checkbox
                            checked={slotValues?.selectedDays?.includes(
                              day?.value
                            )}
                            onChange={() => handleSelectedDays(day)}
                            color="primary"
                          />
                          <Typography className="day-unselected font-bold fs14">
                            {day.shortName}
                          </Typography>

                          <Grid item xs={4} className="ml10">
                            <CustomTextField
                              label="Start Time"
                              placeholder="Start Time"
                              name="startTime"
                              fullWidth
                              handleChange={(e) =>
                                handleChangeSlot(dayMap[day.value], e)
                              }
                              value={slotValues[dayMap[day.value]]?.startTime}
                              mobileTime
                              is12HourFomat={false}
                            />
                          </Grid>
                          <Grid item xs={4} className="ml10">
                            <CustomTextField
                              label="End Time"
                              placeholder="End Time"
                              name="endTime"
                              fullWidth
                              handleChange={(e) =>
                                handleChangeSlot(dayMap[day.value], e)
                              }
                              value={slotValues[dayMap[day.value]]?.endTime}
                              mobileTime
                              is12HourFomat={false}
                            />
                          </Grid>
                          <Grid item xs={4} className="ml10">
                            <CustomTextField
                              label="(in mins)"
                              placeholder="(in mins)"
                              name="number"
                              fullWidth
                              handleChange={(e) =>
                                handleChangeSlot(dayMap[day.value], e)
                              }
                              value={slotValues[dayMap[day.value]].number}
                            />
                          </Grid>
                        </div>
                      ))}
                    </div>
                  </Grid>

                  {timeError ? (
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                      <FormHelperText error>
                        End time smaller than Start time
                      </FormHelperText>
                    </Grid>
                  ) : null}
                  {durationError ? (
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                      <FormHelperText error>
                        Minimun slot duration is 15 minutes
                      </FormHelperText>
                    </Grid>
                  ) : null}
                </>
              )}
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <div className="flex-row">
                  <Typography className="font-bold fs14">Break Time</Typography>
                  <div className="ml10">
                    <AddCircleOutlineIcon
                      sx={{ color: AppColors.appPrimary }}
                      onClick={handleAddbreakTime}
                      className="cursor"
                    />
                  </div>
                </div>
              </Grid>
              {breaks?.length > 0
                ? breaks?.map((br, i) => (
                    <div className="mlr20mtb10 w100Per" key={i}>
                      <Grid container key={i} spacing={1}>
                        <Grid item xs={5} sm={5} md={4} lg={4} xl={4}>
                          <CustomTextField
                            label="Start Time"
                            placeholder="Start Time"
                            name="startTime"
                            fullWidth
                            handleChange={(e) =>
                              handleChangeBreak(i, "startTime", e.target.value)
                            }
                            value={br?.startTime}
                            error={br?.error}
                            helperText={br?.error ? br?.help : null}
                            mobileTime
                            is12HourFomat={false}
                          />
                        </Grid>
                        <Grid item xs={5} sm={5} md={4} lg={4} xl={4}>
                          <CustomTextField
                            label="End Time"
                            placeholder="End Time"
                            name="endTime"
                            fullWidth
                            handleChange={(e) =>
                              handleChangeBreak(i, "endTime", e.target.value)
                            }
                            value={br?.endTime}
                            error={br?.error}
                            helperText={br?.error ? br?.help : null}
                            mobileTime
                            is12HourFomat={false}
                          />
                        </Grid>
                        <Grid item xs={2} sm={2} md={4} lg={4} xl={4}>
                          <RemoveCircleOutlineIcon
                            sx={{ color: AppColors.redBtn }}
                            className="cursor align-center-h50"
                            onClick={() => handleRemoveBreakTime(i)}
                          />
                        </Grid>
                      </Grid>
                    </div>
                  ))
                : null}
              <div className="flex1-end">
                <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                  <CustomButton
                    text="Save"
                    onClick={makeDoctorSlots}
                    disabled={timeError || durationError}
                  />
                </Grid>
              </div>
            </Grid>
          </div>
        </CustomModal>
      </Container>
    </>
  );
};

export default Vets;
