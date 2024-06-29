import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomModal from "../../../components/CustomModal/CustomModal";
import CustomTextField from "../../../components/CustomTextField";
import CustomUpload from "../../../components/CustomUpload";
import TopBar from "../../../components/TopBar/TopBar";
import Header from "../../../layouts/header";
import {
  getDoctorByVetId,
  getDoctorDetailsByVetId,
  updateVetProfile,
} from "../../../redux/reducers/doctorSlice";
import CustomButton from "../../../components/CustomButton";
import CustomSwitch from "../../../components/CustomSwitch";

const initialFile = { file: null, imagePreviewUrl: "" };
const nameExpan = {
  name: "Name",
  speciality: "Speciality",
  contact: "Contact",
  hospitalName: "Hospital Name",
  teleConFee: "Tele-Consultatin fee",
  phyConFee: "Physical Consultation fee",
};

const VetProfile = () => {
  const dispatch = useDispatch();
  const [isModalVisible, setModalVisible] = useState(false);
  const vet = useSelector((state) => state.doctor.vetDetails);
  const [fileUploadUrl, setFileUploadUrl] = useState(initialFile);
  const [mobile, setMobile] = useState(vet?.mobile ?? vet?.user?.mobile);

  useEffect(() => {
    dispatch(getDoctorDetailsByVetId());
  }, []);

  useEffect(() => {
    if (!vet?.image) return;
    setFileUploadUrl({ ...initialFile, imagePreviewUrl: vet?.image });
  }, [vet]);

console.log("vetvet", vet);
  const handleModalClose = () => {
    setModalVisible(!isModalVisible);
  };

  const onUploadFile = (e) => {
    const reader = new FileReader();
    const file = e?.target?.files[0];
    reader.onloadend = () => {
      setFileUploadUrl({ file, imagePreviewUrl: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async () => {
    const form = new FormData();
    if (mobile !== vet?.mobile ?? vet?.user?.mobile) {
      form.append("mobile", mobile);
    }
    if (fileUploadUrl?.file !== null && vet?.image !== fileUploadUrl?.file) {
      form.append("image", fileUploadUrl?.file);
    }
    const apiSuccess =  dispatch(updateVetProfile(form));
    if (apiSuccess?.payload) {
      setModalVisible(false);
      dispatch(getDoctorDetailsByVetId())
    }
  };

  return (
    <>
      <Header name="Vetinstant" />
      <TopBar name="Profile" rightVerBtnShow={false} />
      <div className="com-mar">
        <Grid container spacing={1}>
          <Grid item xs={12} sm={12} md={12} lg={4} xl={4}>
            <div className="left-con-white">
              <div className="flex-row">
                <div className="flex1-start">
                  {vet?.image ? (
                    <img
                      alt={vet?.image}
                      src={vet?.image}
                      className="detail-img"
                    />
                  ) : (
                    <div className="detail-empty-img" />
                  )}
                </div>
                <div className="flex1-end">
                  <img
                    src={
                      require("../../../assets/images/svg/editIcon.svg").default
                    }
                    alt="myIcon"
                    className="cursor"
                    onClick={() => setModalVisible(true)}
                  />
                </div>
              </div>
              <div className="left-con-box mt20">
                <div className="flex-row">
                  <div className="flex1-start">
                    <div className="text600 mv2">Name</div>
                  </div>
                  <div className="flex1-end">
                    <CustomSwitch
                      value={!vet?.block}
                      // onChange={onChangeSwitch}
                      greenToRed
                    />
                  </div>
                </div>

                <div className="text400 mv2">{`${vet?.salutation} ${vet?.user?.name}`}</div>
                <div className="text600 mv2">Specialty</div>
                <div className="text400 mv2">{vet?.speciality}</div>
                <div className="text600 mv2">Contact Number</div>
                <div className="text400 mv2">{vet?.mobile}</div>
                <div className="text600 mv2">Email</div>
                <div className="text400 mv2">{vet?.emailID}</div>
              </div>
              <div className="left-con-box mt20">
                <Grid container spacing={2}>
                  <Grid item xs={8} sm={8} md={8} lg={8} xl={8}>
                    <div className="text600 mv2">Consultation Type</div>
                    <div className="text400 mv2">Physical</div>
                    <div className="text400 mv2">Virtual</div>
                  </Grid>
                  <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                    <div className="text600 mv2">Fees</div>
                    <div className="text400 mv2">{vet?.physicalFee}</div>
                    <div
                      className={`text400 ${
                        !vet?.virtualFee ? "mt20mb2" : "mv2"
                      }`}
                    >
                      {vet?.virtualFee}
                    </div>
                  </Grid>
                </Grid>
              </div>
              <div className="left-con-box mt20">
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <div className="text600 mv2">Doctor Signature</div>
                  </Grid>
                </Grid>
              </div>
            </div>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={8} xl={8}>
            <div className="right-con-white-wh">
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <div className="tab-sty">
                  <div className="tab-txt ml15">About me</div>
                </div>
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <div className="top-emp-space" />
                <div className="text400 mv20 mh20">
                  Lorem Ipsum is simply dummy text of the printing and
                  typesetting industry. Lorem Ipsum has been the industry's
                  standard dummy text ever since the 1500s
                </div>
              </Grid>
            </div>
          </Grid>
        </Grid>
      </div>
      <CustomModal
        open={isModalVisible}
        onClose={handleModalClose}
        header="Modify"
        headerCenter
        modal
        modalWidth={50}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <CustomUpload
              uploadText={"Tab to add a profile picture"}
              onUploadFile={onUploadFile}
              value={fileUploadUrl?.imagePreviewUrl}
              center
              imageHeight={75}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <CustomTextField
              label={nameExpan?.["name"]}
              placeholder={nameExpan?.["name"]}
              name="name"
              fullWidth
              value={vet?.user?.name}
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <CustomTextField
              label={nameExpan?.["speciality"]}
              placeholder={nameExpan?.["speciality"]}
              name="speciality"
              fullWidth
              value={vet?.speciality}
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <CustomTextField
              label={nameExpan?.["hospitalName"]}
              placeholder={nameExpan?.["hospitalName"]}
              name="hospitalName"
              fullWidth
              value={vet?.hospital?.name}
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <CustomTextField
              label={nameExpan?.["contact"]}
              placeholder={nameExpan?.["contact"]}
              name="contact"
              fullWidth
              value={mobile ?? vet?.mobile}
              handleChange={(e) => setMobile(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <CustomTextField
              label={nameExpan?.["teleConFee"]}
              placeholder={nameExpan?.["teleConFee"]}
              name="teleConFee"
              fullWidth
              value={vet?.fee}
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <CustomTextField
              label={nameExpan?.["phyConFee"]}
              placeholder={nameExpan?.["phyConFee"]}
              name="phyConFee"
              fullWidth
              value={vet?.visitFee}
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <div className="flex-center">
              <div>
                <CustomButton
                  text={"Update your profile"}
                  onClick={handleSubmit}
                />
              </div>
            </div>
          </Grid>
        </Grid>
      </CustomModal>
    </>
  );
};

export default VetProfile;
