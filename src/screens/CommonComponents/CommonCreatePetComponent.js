import { Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import CustomButton from "../../components/CustomButton";
import Checkbox from "../../components/CustomCheckbox";
import CustomModal from "../../components/CustomModal/CustomModal";
import CustomTextField from "../../components/CustomTextField";
import CustomUpload from "../../components/CustomUpload";
import Select from "../../components/Select/Select";
import { createPet, createPetNewRegister } from "../../redux/reducers/petSlice";
import { ErrorStrings } from "../../util/ErrorString";
import { EmailRegex } from "../../util/Validations";
import { breedList, genderList, petType, yesNoList } from "../../util/dropList";
import generatePass from "../../util/randomPassword";
import { AppColors } from "../../util/AppColors";
import CommonAppointmentPetComponent from "./CommonAppointmentPetComponent";
import moment from "moment";

const initialValues = {
  breed: "",
  name: "",
  gender: "",
  dobAndAge: new Date(),
  isSpayed: "",
  weight: "",
  petOwnerName: "",
  contactNumber: "",
  email: "",
  password: "",
};
const initialErrors = {
  breed: false,
  name: false,
  gender: false,
  dobAndAge: false,
  isSpayed: false,
  weight: false,
  petOwnerName: false,
  contactNumber: false,
  email: false,
  password: false,
};
const initialHelpers = {
  breed: "",
  name: "",
  gender: "",
  dobAndAge: "",
  isSpayed: "",
  weight: "",
  petOwnerName: "",
  contactNumber: "",
  email: "",
  password: "",
};
const initialFile = { file: null, imagePreviewUrl: "" };

const nameExpan = {
  breed: "Breed",
  name: "Name",
  gender: "Gender",
  dobAndAge: "Date of Birth & Age",
  isSpayed: "Neutered/Spayed",
  weight: "Weight",
  petOwnerName: "Pet Owner Name",
  contactNumber: "Contact Number",
  email: "Email",
  password: "Password",
};

const CommonCreatePetComponent = ({
  modalVisible,
  setModalVisible,
  onApiDone,
}) => {
  const dispatch = useDispatch();
  const [petValues, setPetValues] = useState(initialValues);

  const [petErrors, setPetErrors] = useState(initialErrors);
  const [petHelpers, setPetHelpers] = useState(initialHelpers);
  const [petFileUploadUrl, setPetFileUploadUrl] = useState(initialFile);
  const [showPassword, setShowPassword] = useState(false);
  const [isAutoGenPass, setAutoGenPass] = useState(false);
  const [allFieldsFilled, setAllFieldsFilled] = useState(false);
  const [storePetId, setStorePetId] = useState("");
  const [storePetOwnerName, setStorePetOwnerName] = useState("");
  const [storePetUserName, setStorePetUserName] = useState("");
  const [modalAppointmentVisible, setModalAppointmentVisible] = useState(false);

  useEffect(() => {
    const checkAllFieldsFilled = () => {
      for (const key in petValues) {
        if (petValues[key] === "" || petValues[key] === null) {
          setAllFieldsFilled(false);
          return;
        }
      }
      setAllFieldsFilled(true);
    };

    checkAllFieldsFilled();
  }, [petValues]);

  const onUploadFile = (e, type) => {
    const reader = new FileReader();
    const file = e.target.files[0];
    reader.onloadend = () => {
      if (type === "pet") {
        setPetFileUploadUrl({
          file: e.target.files[0],
          imagePreviewUrl: reader.result,
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleReset = () => {
    setPetValues(initialValues);
    setPetErrors(initialErrors);
    setPetHelpers(initialHelpers);
    setAutoGenPass(false);
    setPetFileUploadUrl(initialFile);
  };

  const modelOpen = () => {
    handleReset();
    setModalVisible(!modalVisible);
  };

  const handleSelect = (e, key) => {
    setPetValues({ ...petValues, [key]: e.target.value });
  };

  const emailValidation = (value) => {
    if (value === "") {
      setPetErrors({ ...petErrors, email: true });
      setPetHelpers({ ...petHelpers, email: ErrorStrings.emptyEmail });
    }
    if (value !== "") {
      if (!EmailRegex.test(value)) {
        setPetErrors({ ...petErrors, email: true });
        setPetHelpers({ ...petHelpers, email: ErrorStrings.inValidEmail });
      } else {
        setPetErrors({ ...petErrors, email: false });
        setPetHelpers({ ...petHelpers, email: "" });
      }
    }
  };

  const passValidation = (value) => {
    if (value === "") {
      setPetErrors({ ...petErrors, password: true });
      setPetHelpers({ ...petHelpers, password: ErrorStrings.emptyPass });
      return;
    }
    if (value.length < 6) {
      setPetErrors({ ...petErrors, password: true });
      setPetHelpers({ ...petHelpers, password: ErrorStrings.inValidPass });
      return;
    }
    setPetErrors({ ...petErrors, password: false });
    setPetHelpers({ ...petHelpers, password: "" });
  };

  const handleChange = (e) => {
    setPetValues({ ...petValues, [e.target.name]: e.target.value });
    if (e.target.name === "email") return emailValidation(e.target.value);
    if (e.target.name === "password") return passValidation(e.target.value);

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

  const handleAutoGenPassword = () => {
    setAutoGenPass(!isAutoGenPass);
    if (!isAutoGenPass) {
      const pass = generatePass();
      setPetValues({ ...petValues, password: pass });
    } else {
      setPetValues({ ...petValues, password: "" });
    }
  };

  const handleValidation = () => {
    const errorList = [];
    const woErrorList = [];
    Object.keys(petValues).forEach(function (key, index) {
      if (key === "email") {
        if (petValues?.[key] === "") return errorList?.push(key);

        if (!EmailRegex.test(petValues?.[key])) {
          return errorList?.push(key);
        } else woErrorList.push(key);
      } else if (key === "password") {
        if (petValues?.[key] === "") return errorList?.push(key);
        if (petValues?.[key]?.length < 6) {
          return errorList?.push(key);
        } else woErrorList.push(key);
      } else {
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
        if (key === "email") {
          if (value === "") {
            return (errHelperObj = {
              ...errHelperObj,
              [key]: ErrorStrings.emptyEmail,
            });
          }
          if (!EmailRegex.test(value)) {
            errHelperObj = {
              ...errHelperObj,
              [key]: ErrorStrings.inValidEmail,
            };
            return;
          }
        }
        if (key === "password") {
          if (value === "") {
            errHelperObj = { ...errHelperObj, [key]: ErrorStrings.emptyPass };
            return;
          }
          if (value < 6) {
            errHelperObj = { ...errHelperObj, [key]: ErrorStrings.inValidPass };
          }
        }
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
    const validation = handleValidation();
    if (validation?.errorList?.length > 0) return;
    const form = new FormData();
    form.append("petType", "dog");
    form.append("breed", petValues?.breed);
    form.append("petName", petValues?.name);
    form.append("gender", petValues?.gender);
    form.append(
      "dob",
      moment(new Date(petValues?.dobAndAge)).format("YYYY-MM-DD")
    );
    form.append("isSpayed", petValues?.isSpayed);
    form.append("weight", petValues?.weight);
    form.append("userName", petValues?.petOwnerName);
    form.append("userMobile", petValues?.contactNumber);
    form.append("email", petValues?.email);
    form.append("password", petValues?.password);
    if (petFileUploadUrl?.file) {
      form.append("petImage", petFileUploadUrl?.file);
    }
    const apiSuccess = await dispatch(createPet(form));
    if (apiSuccess?.payload) {
      onApiDone();
      setModalVisible(false);
      handleReset();
    }
  };

  const handleSubmitNew = async () => {
    const validation = handleValidation();
    if (validation?.errorList?.length > 0) return;
    const form = new FormData();
    form.append("type", "dog");
    form.append("breed", petValues?.breed);
    form.append("name", petValues?.name);
    form.append("gender", petValues?.gender);
    form.append("dob", petValues?.dobAndAge);
    form.append("isSpayed", petValues?.isSpayed);
    form.append("weight", petValues?.weight);
    form.append("ownerName", petValues?.petOwnerName);
    form.append("mobile", petValues?.contactNumber);
    form.append("emailID", petValues?.email);
    form.append("password", petValues?.password);
    if (petFileUploadUrl?.file) {
      form.append("photo", petFileUploadUrl?.file);
    }
    const apiSuccess = await dispatch(createPetNewRegister(form));
    if (apiSuccess?.payload) {
      setModalAppointmentVisible(true);
      setStorePetId(apiSuccess?.payload?.newPet?._id);
      setStorePetUserName(apiSuccess?.payload?.newPet?.name);
      setStorePetOwnerName(petValues?.petOwnerName);
      onApiDone();
      setModalVisible(false);
      handleReset();
    }
  };

  return (
    <div>
      <CustomModal
        open={modalVisible}
        onClose={modelOpen}
        header="Create Pet"
        headerCenter
        modal
        modalWidth={50}
      >
        <Grid container spacing={1.5}>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <CustomUpload
              uploadText={"Tab to add a pet picture"}
              onUploadFile={(e) => onUploadFile(e, "pet")}
              value={petFileUploadUrl?.imagePreviewUrl}
              center
              imageHeight={50}
            />
          </Grid>
       

          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <Select
              list={breedList}
              value={petValues?.breed}
              handleChange={(e) => handleSelect(e, "breed")}
              name="breed"
              label={nameExpan?.["breed"]}
              select
              error={petErrors?.breed}
              helperText={petHelpers?.breed}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <CustomTextField
              label={nameExpan?.["name"]}
              placeholder={nameExpan?.["name"]}
              name="name"
              fullWidth
              handleChange={handleChange}
              value={petValues?.name}
              helperText={petHelpers?.name}
              error={petErrors?.name}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <Select
              list={genderList}
              value={petValues?.gender}
              handleChange={(e) => handleSelect(e, "gender")}
              name="gender"
              label={nameExpan?.["gender"]}
              select
              error={petErrors?.gender}
              helperText={petHelpers?.gender}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <CustomTextField
              label={nameExpan?.["dobAndAge"]}
              placeholder={nameExpan?.["dobAndAge"]}
              name="dobAndAge"
              fullWidth
              handleChange={handleChange}
              value={petValues?.dobAndAge}
              helperText={petHelpers?.dobAndAge}
              error={petErrors?.dobAndAge}
              mobileDate
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <Select
              list={yesNoList}
              value={petValues?.isSpayed}
              handleChange={(e) => handleSelect(e, "isSpayed")}
              name="isSpayed"
              label={nameExpan?.["isSpayed"]}
              select
              error={petErrors?.isSpayed}
              helperText={petHelpers?.isSpayed}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <CustomTextField
              label={nameExpan?.["weight"]}
              placeholder={nameExpan?.["weight"]}
              name="weight"
              fullWidth
              handleChange={handleChange}
              value={petValues?.weight}
              helperText={petHelpers?.weight}
              error={petErrors?.weight}
              endIcon
              inputIcon="KG"
              type="number"
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <CustomTextField
              label={nameExpan?.["petOwnerName"]}
              placeholder={nameExpan?.["petOwnerName"]}
              name="petOwnerName"
              fullWidth
              handleChange={handleChange}
              value={petValues?.petOwnerName}
              helperText={petHelpers?.petOwnerName}
              error={petErrors?.petOwnerName}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <CustomTextField
              label={nameExpan?.["contactNumber"]}
              placeholder={nameExpan?.["contactNumber"]}
              name="contactNumber"
              fullWidth
              handleChange={handleChange}
              value={petValues?.contactNumber}
              helperText={petHelpers?.contactNumber}
              error={petErrors?.contactNumber}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <CustomTextField
              label={nameExpan?.["email"]}
              placeholder={nameExpan?.["email"]}
              name="email"
              fullWidth
              handleChange={handleChange}
              value={petValues?.email}
              helperText={petHelpers?.email}
              error={petErrors?.email}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <CustomTextField
              label={nameExpan?.["password"]}
              placeholder={nameExpan?.["password"]}
              name="password"
              password
              fullWidth
              value={petValues?.password}
              handleChange={handleChange}
              showPassword={showPassword}
              handleClickShowPassword={() => setShowPassword(!showPassword)}
              helperText={petHelpers?.password}
              error={petErrors?.password}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={5} lg={5} xl={5}>
            <Checkbox
              label="Auto-Generate Password"
              checked={isAutoGenPass}
              onChange={handleAutoGenPassword}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={4} lg={4} xl={4}>
            <div className="mr10 mt10">
              <Typography
                variant="body1"
                onClick={handleSubmitNew}
                style={{
                  cursor: "pointer",
                  color: allFieldsFilled
                    ? AppColors.appPrimary
                    : AppColors.gray,
                }}
              >
                Register + Appointment
              </Typography>
            </div>
          </Grid>

          <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
            <div>
              <div className="clinic-mod-btn-pos">
                <div className="mr10">
                  <CustomButton text="Reset" onClick={handleReset} grayBtn />
                </div>
                <div className="ml10">
                  <CustomButton text="Register" onClick={handleSubmit} />
                </div>
              </div>
            </div>
          </Grid>
        </Grid>
      </CustomModal>
      <CommonAppointmentPetComponent
        modalVisible={modalAppointmentVisible}
        setModalVisible={setModalAppointmentVisible}
        storePetId={storePetId}
        storePetOwnerName={storePetOwnerName}
        storePetUserName={storePetUserName}
      />
    </div>
  );
};

export default CommonCreatePetComponent;
