import CallIcon from "@mui/icons-material/Call";
import MailIcon from "@mui/icons-material/Mail";
import { Container, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ReactComponent as BranchIcon } from "../../../assets/images/svg/branch.svg";
import { ReactComponent as ChangePasswordIcon } from "../../../assets/images/svg/change-password.svg";
import { ReactComponent as ConsultationIcon } from "../../../assets/images/svg/consultation.svg";
import { ReactComponent as EditIcon } from "../../../assets/images/svg/edit.svg";
import CustomButton from "../../../components/CustomButton";
import CustomModal from "../../../components/CustomModal/CustomModal";
import CustomTextField from "../../../components/CustomTextField";
import CustomUpload from "../../../components/CustomUpload";
import Select from "../../../components/Select/Select";
import {
  getClinicDetails,
  updateClinic,
} from "../../../redux/reducers/clinicSlice";
import { AppColors } from "../../../util/AppColors";

const initialPassValues = { oldPass: "", newPass: "", confirmPass: "" };
const initialProfileValues = {
  image: { file: null, previewUrl: "" },
  clinicName: "",
  location: "",
  contact: "",
  email: "",
};

const initialHelps = { clinicName: "", location: "", contact: "", email: "" };
const initailError = {
  clinicName: false,
  location: false,
  contact: false,
  email: false,
};
const nameExpan = {
  clinicName: "Clinic Name",
  location: "Location",
  contact: "Contact Number",
  email: "Email",
};

const BranchManagementMain = ({ children, active }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [modVisible, setModVisible] = useState(false);
  const [isProfileEdit, setProfileEdit] = useState(false);
  const [passValues, setPassValues] = useState(initialPassValues);
  const [profileValues, setProfileValues] = useState(initialProfileValues);
  const [profileErrors, setProfileErrors] = useState(initailError);
  const [profileHelps, setProfileHelps] = useState(initialHelps);
  const clinicDet = useSelector((state) => state?.clinic?.details);

  useEffect(() => {
    dispatch(getClinicDetails());
  }, []);

  const handleEditProfile = () => {
    setProfileValues({
      clinicName: clinicDet?.name,
      location: clinicDet?.location,
      email: clinicDet?.email,
      contact: clinicDet?.mobile,
      image: { file: null, previewUrl: clinicDet?.image },
    });
    setModVisible(true);
    setProfileEdit(true);
  };

  const handleChangePassword = () => {
    setModVisible(true);
    setProfileEdit(false);
  };

  const handleModClose = () => {
    setModVisible(false);
    setProfileEdit(false);
    setPassValues(initialPassValues);
    setProfileValues(initialProfileValues);
    setProfileErrors(initailError);
    setProfileHelps(initialHelps);
  };

  const handleChangePassVal = (e) => {
    const { name, value } = e?.target;
    setPassValues({ ...passValues, [name]: value });
  };

  const handleSave = async () => {
    if (isProfileEdit) {
      if (Object.values(profileErrors).find((i) => i === true)) return;
      const form = new FormData();
      form.append("name", profileValues?.clinicName);
      form.append("email", profileValues?.email);
      form.append("mobile", profileValues?.contact);
      form.append("location", profileValues?.location);
      if (profileValues?.image?.file) {
        form.append("image", profileValues?.image?.file);
      }
      const apiRes = await dispatch(updateClinic(form));
      if (apiRes?.payload) {
        setProfileValues(initialProfileValues);
        dispatch(getClinicDetails());
        setProfileEdit(false);
        setModVisible(false);
      }
    }
  };

  const onChangeValue = (name, value) => {
    setProfileValues({ ...profileValues, [name]: value });
    setProfileErrors({
      ...profileErrors,
      [name]: value?.length > 0 ? false : true,
    });
    setProfileHelps({
      ...profileErrors,
      [name]: value?.length > 0 ? "" : `${nameExpan?.[name]} is Required Field`,
    });
  };

  const onUploadFile = (e) => {
    const reader = new FileReader();
    const file = e?.target?.files[0];
    reader.onloadend = () => {
      setProfileValues({
        ...profileValues,
        image: { file: e.target.files[0], previewUrl: reader.result },
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <Container maxWidth="xl" className="back-white">
      <Grid container>
        <Grid item xs={12} sm={12} md={3} lg={3} xl={3} className="back-white border-rt">
          <Grid container className="mv20 ph20">
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <div className="flex-row gap10">
                <img src={clinicDet?.image} alt="" className="img7" />
                <div className="mt10">
                  <div className="flex-row gap5">
                    <div className="txt-semi-bold fs14 black">
                      {clinicDet?.name}
                    </div>
                  </div>
                  <div className="text gray-color fs12">
                    {clinicDet?.location}
                  </div>
                </div>
              </div>
            </Grid>

            <div className="dashed-card mv10 p10">
              <div className="flex-row mt5">
                <MailIcon
                  sx={{ color: AppColors.appPrimary, width: 30, height: 30 }}
                />
                <div className="flex-center">
                  <Typography className="txt-regular card-gray-color fs14 ml10">
                    {clinicDet?.email}
                  </Typography>
                </div>
              </div>
              <div className="flex-row mt5">
                <CallIcon
                  sx={{ color: AppColors.appPrimary, width: 30, height: 30 }}
                />
                <div className="flex-center">
                  <Typography className="txt-regular card-gray-color fs14 ml10">
                    {clinicDet?.mobile}
                  </Typography>
                </div>
              </div>
            </div>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} className="mt10">
              <img
                src={require("../../../assets/images/png/chat.png")}
                className="img8"
                alt=""
              />
            </Grid>

            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} className="mt10">
              <Typography className="text-bold mb10 fs14">Shortcuts</Typography>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <div
                className="flex-row mv5 cursor"
                onClick={() => navigate("/branch-management")}
              >
                <BranchIcon
                  style={{
                    width: 25,
                    height: 25,
                    fill:
                      active === "branchManagement"
                        ? AppColors.appPrimary
                        : AppColors.gray2,
                  }}
                />
                {/* <img src={require('../../assets/images/png/branch.png')}/> */}
                <div className="ml10 flex-center">
                  <Typography
                    className={`txt-regular fs14 ${active === "branchManagement" ? "blue-color" : ""
                      }`}
                  >
                    Branch management
                  </Typography>
                </div>
              </div>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <div
                className="flex-row mv5 cursor"
                onClick={() => navigate("/clinic-consultation")}
              >
                <ConsultationIcon
                  style={{
                    width: 25,
                    height: 25,
                    fill:
                      active === "consultation"
                        ? AppColors.appPrimary
                        : AppColors.gray2,
                  }}
                />
                <div className="ml10 flex-center">
                  <Typography
                    className={`txt-regular fs14 ${active === "consultation" ? "blue-color" : ""
                      }`}
                  >
                    Consultation
                  </Typography>
                </div>
              </div>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <div className="flex-row mv5 cursor" onClick={handleEditProfile}>
                <EditIcon
                  style={{
                    width: 25,
                    height: 25,
                    fill:
                      modVisible & isProfileEdit
                        ? AppColors.appPrimary
                        : AppColors.gray2,
                  }}
                />
                <div className="ml10 flex-center">
                  <Typography
                    className={`txt-regular fs14 ${modVisible & isProfileEdit ? "blue-color" : ""
                      }`}
                  >
                    Edit Profile
                  </Typography>
                </div>
              </div>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <div
                className="flex-row mv5 cursor"
                onClick={handleChangePassword}
              >
                <ChangePasswordIcon
                  style={{
                    width: 30,
                    height: 30,
                    fill:
                      modVisible & !isProfileEdit
                        ? AppColors.appPrimary
                        : AppColors.gray2,
                  }}
                />
                <div className="ml10 flex-center">
                  <Typography
                    className={`txt-regular fs14 ${modVisible & !isProfileEdit ? "blue-color" : ""
                      }`}
                  >
                    Change Password
                  </Typography>
                </div>
              </div>
            </Grid>
          </Grid>
        </Grid>
        <Grid
          item
          xs={12}
          sm={12}
          md={9}
          lg={9}
          xl={9}
          className="scrollable-content"
        >
          {children}
        </Grid>
      </Grid>
      <CustomModal
        open={modVisible}
        onClose={handleModClose}
        header={isProfileEdit ? "Edit Profile" : "Change Password"}
        rightModal
        modalWidth={30}
      >
        <div className="mh20">
          {isProfileEdit ? (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <CustomUpload
                  uploadText="Profile Picture"
                  onUploadFile={onUploadFile}
                  value={profileValues?.image?.previewUrl}
                  profileImg
                  imageHeight={140}
                />
              </Grid>
              <Grid
                item
                xs={12}
                sm={12}
                md={12}
                lg={12}
                xl={12}
                className="mt10"
              >
                <CustomTextField
                  label={nameExpan?.clinicName}
                  name="clinicName"
                  fullWidth
                  handleChange={(e) =>
                    onChangeValue("clinicName", e?.target?.value)
                  }
                  value={profileValues?.clinicName}
                  error={profileErrors?.clinicName}
                  helperText={profileHelps?.clinicName}
                  labelTop
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Select
                  list={[
                    { name: "Chennai", value: "Chennai" },
                    { name: "Bangalore", value: "Bangalore" },
                    { name: "Mumbai", value: "Mumbai" },
                  ]}
                  value={profileValues?.location}
                  error={profileErrors?.location}
                  helperText={profileHelps?.location}
                  handleChange={(e) =>
                    onChangeValue("location", e?.target?.value)
                  }
                  label={nameExpan?.location}
                  select
                  labelTop
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <CustomTextField
                  label={nameExpan?.contact}
                  name="contact"
                  fullWidth
                  handleChange={(e) =>
                    onChangeValue("contact", e?.target?.value)
                  }
                  value={profileValues?.contact}
                  error={profileErrors?.contact}
                  helperText={profileHelps?.contact}
                  labelTop
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <CustomTextField
                  label={nameExpan?.email}
                  name="email"
                  fullWidth
                  handleChange={(e) => onChangeValue("email", e?.target?.value)}
                  value={profileValues?.email}
                  error={profileErrors?.email}
                  helperText={profileHelps?.email}
                  labelTop
                  disabled
                />
              </Grid>
            </Grid>
          ) : (
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <CustomTextField
                  label="Old Password"
                  name="oldPass"
                  fullWidth
                  handleChange={handleChangePassVal}
                  value={passValues?.oldPass}
                  labelTop
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <CustomTextField
                  label="New Password"
                  name="newPass"
                  fullWidth
                  handleChange={handleChangePassVal}
                  value={passValues?.newPass}
                  labelTop
                />
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <CustomTextField
                  label="Confirm Password"
                  name="confirmPass"
                  fullWidth
                  handleChange={handleChangePassVal}
                  value={passValues?.confirmPass}
                  labelTop
                />
              </Grid>
            </Grid>
          )}
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <div className="flex-end mt20">
              <div className="w20Per">
                <CustomButton text="Save" onClick={handleSave} />
              </div>
            </div>
          </Grid>
        </div>
      </CustomModal>
    </Container>
  );
};

export default BranchManagementMain;
