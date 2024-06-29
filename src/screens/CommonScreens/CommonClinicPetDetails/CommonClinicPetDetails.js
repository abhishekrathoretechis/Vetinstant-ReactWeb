import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import CallIcon from "@mui/icons-material/Call";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import MailIcon from "@mui/icons-material/Mail";
import OfflineBoltOutlinedIcon from "@mui/icons-material/OfflineBoltOutlined";
import ScaleOutlinedIcon from "@mui/icons-material/ScaleOutlined";
import { Grid, Typography, Container } from "@mui/material";
import { useSelector } from "react-redux";
import CustomButton from "../../../components/CustomButton";
import { AppColors } from "../../../util/AppColors";
import "./CommonClinicPetDetails.css";
import moment from "moment";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import ClinicPetBookAppointment from "../../Hospital/ClinicPets/ClinicPetBookAppointment";
import AddCoOwner from "../../Hospital/ClinicPetDetails/PatientWorkbook/AddCoOwner";
import InternalNotes from "../../Hospital/ClinicPetDetails/PatientWorkbook/InternalNotes";

const CommonClinicPetDetails = ({ children, upcomingVisible, pet }) => {
  const [selectPet, setSelectPet] = useState();
  const [modalBookVisible, setModalBookVisible] = useState(false);
  const [coOwnerModalVisible, setCoOwnerModalVisible] = useState(false);
  const [internalVisible, setInternalVisible] = useState(false);

  const location = useLocation();
  const upcomingAppointments = useSelector(
    (state) => state?.clinic?.vetUpcomingAppointments
  );
  const getPetData = useSelector((state) => state?.pet?.petDetails?.data?.pet);

  const bookAppointment = () => {
    setSelectPet(getPetData);
    setModalBookVisible(true);
  };

  const openCoOwnerModal = () => {
    setCoOwnerModalVisible(true);
  };
  const openInternalModal = () => {
    setInternalVisible(true);
  };

  return (
    <Grid container className="back-white ph20">
      <Grid
        item
        xs={12}
        sm={12}
        md={2.5}
        lg={2.5}
        xl={2.5}
        className="back-white border-rt"
      >
        <Container maxWidth="xl">
          <Typography
            variant="h6"
            className={`card-head-darkblue-color card-head-border-bottom-blue font-bold fs14 capitalize mv5 blue-color`}
          >
            Pet Type : {getPetData?.petType}
          </Typography>
          <Grid container className="mv20">
            <Grid item xs={3} sm={3} md={3} lg={3} xl={2}>
              <img src={getPetData?.petImage} alt="" className="img3" />
            </Grid>
            <Grid item xs={9} sm={9} md={9} lg={9} xl={10}>
              <div className="flex-row">
                <div className="flex-center">
                  <Typography className="font-bold fs14 capitalize mv5">
                    {getPetData?.petName}
                  </Typography>
                  <Typography
                    className={`ml5 font-medium fs14 capitalize card-rose-color ${
                      getPetData?.gender === "male"
                        ? "card-blue-color"
                        : "card-rose-color"
                    }`}
                  >
                    {`(${getPetData?.gender})`}
                  </Typography>
                </div>
              </div>
              <Typography className="mb10 txt-regular table-gray fs12">
                {getPetData?.breed}
              </Typography>

              {/* <Typography className="txt-regular fs14"></Typography> */}
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <div className="flex-row">
                <div className="flex-start">
                  <Typography className="txt-regular gray-color fs12">
                    {moment(
                      getPetData?.dob ?? location?.state?.pet?.dob
                    ).fromNow()}{" "}
                    ({getPetData?.dob})
                  </Typography>
                </div>

                <div className="flex1-end">
                  <img
                    src={require("../../../assets/images/png/weight.png")}
                    alt=""
                    className="img4"
                  />
                  {/* <ScaleOutlinedIcon
                      sx={{ width: 15, height: 15, color: AppColors.black }}
                    /> */}
                  <Typography className="font-bold fs12 ml5">
                    {getPetData?.weight} KG
                  </Typography>
                </div>
              </div>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} className="mt10">
              <Typography className="txt-regular fs12">
                Neutered/Spayed : {getPetData?.isSpayed === true ? "Yes" : "No"}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} className="mt10">
              <Typography className="txt-regular fs12">
                Colour : {getPetData?.color}
              </Typography>
            </Grid>
            <div className="dashed-card mv20 p20">
              <div className="flex-row">
                <AccountCircleOutlinedIcon sx={{ width: 25, height: 25 }} />
                <Typography className="font-bold black fs12 ml10 flex-center">
                  {getPetData?.userName}
                </Typography>
              </div>
              <div className="flex-row mt10">
                <MailIcon
                  sx={{ color: AppColors.appPrimary, width: 20, height: 20 }}
                />
                <div className="flex-center">
                  <Typography className="txt-regular card-gray-color fs12 ml10">
                    {getPetData?.userEmail}
                  </Typography>
                </div>
              </div>
              <div className="flex-row mt10">
                <CallIcon
                  sx={{ color: AppColors.appPrimary, width: 20, height: 20 }}
                />
                <div className="flex-center">
                  <Typography className="txt-regular card-gray-color fs12 ml10">
                    {getPetData?.userMobile}
                  </Typography>
                </div>
              </div>
            </div>
            {/* <div className="w30Per">
                <CustomButton
                  text="Chat"
                  leftIcon
                  startIcon={<ChatOutlinedIcon />}
                />
              </div>
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12} className="mt20">
                <Typography className="text-bold fs14">Notes</Typography>
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Typography className="txt-regular fs14">
                  {getPetData?.description}
                </Typography>
              </Grid>

              <Typography className="txt-regular fs14 yellow-btn mt10">
                Not Insured
              </Typography>

              <Grid item xs={12} sm={12} md={12} lg={12} xl={12} className="mt10">
                <Typography className="font-medium red-color fs14">
                  Outstanding Balance: 45.00
                </Typography>
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12} className="mt10">
                <Typography className="font-medium green-color fs14">
                  Client Credit: 22.00
                </Typography>
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12} className="mt10">
                <Typography className="text-bold table-gray fs16">
                  {"Payments >"}
                </Typography>
              </Grid>*/}
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} className="mt10">
              <Typography className="text-bold mb10 fs14">Shortcuts</Typography>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <div className="flex-row mv5 cursor">
                <CalendarMonthOutlinedIcon
                  sx={{ width: 30, height: 30, color: AppColors.gray2 }}
                />
                <div className="ml10 flex-center" onClick={bookAppointment}>
                  <Typography className="txt-regular fs14">
                    Book an appointment
                  </Typography>
                </div>
              </div>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <div className="flex-row mv5 cursor">
                <DescriptionOutlinedIcon
                  sx={{ width: 30, height: 30, color: AppColors.gray2 }}
                />
                <div className="ml10 flex-center">
                  <Typography className="txt-regular fs14">
                    Patient Files
                  </Typography>
                </div>
              </div>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <div className="flex-row mv5 cursor">
                <OfflineBoltOutlinedIcon
                  sx={{ width: 30, height: 30, color: AppColors.gray2 }}
                />
                <div className="ml10 flex-center">
                  <Typography className="txt-regular fs14">
                    Send for senior consult
                  </Typography>
                </div>
              </div>
            </Grid>
          </Grid>
        </Container>
      </Grid>
      <Grid
        item
        xs={12}
        sm={12}
        md={upcomingVisible ? 7 : 9.5}
        lg={upcomingVisible ? 7 : 9.5}
        xl={upcomingVisible ? 7 : 9.5}
        className={`scrollable-content ${upcomingVisible ? "border-rt" : ""}`}
      >
        <Container maxWidth="xl">{children}</Container>
      </Grid>
      {upcomingVisible ? (
        <Grid
          item
          xs={12}
          sm={12}
          md={2.5}
          lg={2.5}
          xl={2.5}
          className="back-white"
        >
          <Grid container className="mv20 ph20">
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <div className="flex-row-between">
                <Typography className="text-bold mb10 fs14 blue-color">
                  Internal Notes
                </Typography>
                <img
                  src={require("../../../assets/images/png/editNew.png")}
                  onClick={openInternalModal}
                />
              </div>

              <div className="flex-row-between top-row-cen-con mv10">
                <Typography
                  className={`font-medium fs10 card-time 
                 card-bot-red-back
                     white-color 
                flex-center`}
                >
                  Distroyer of Type
                </Typography>

                <Typography
                  className={`font-medium fs10 card-time 
                   virtual-bg
                     white-color 
                flex-center`}
                >
                  Loves Chicken
                </Typography>
              </div>
              <div className="flex-row-between top-row-cen-con mb10">
                <Typography
                  className={`font-medium fs10 card-time 
                 card-top-yellow-color
                     white-color 
                flex-center`}
                >
                  Not Insured
                </Typography>

                <Typography
                  className={`font-medium fs10 card-time 
                  card-top-paleGreen-color
                     white-color 
                flex-center`}
                >
                  Doesn't like nail clip
                </Typography>
              </div>
              <Typography className="text-medium mb10 fs14 red-color">
                Outstanding Balance : 45.00
              </Typography>
              <Typography className="text-medium mb10 fs14 green-color">
                Client Credit : 22.00
              </Typography>

              <div className="flex-row">
                <Typography className="txt-semi-bold mb10 fs14">
                  App Status:
                </Typography>
                <div className="ml20">
                  <CustomButton text="Installed" smallBtn />
                </div>
              </div>

              <div className="flex-row-between mt20">
                <Typography className="text-bold mb10 fs14 blue-color">
                  Pets
                </Typography>
                <img
                  src={require("../../../assets/images/png/PlusIcon.png")}
                  style={{ width: "20px", height: "20px" }}
                />
              </div>

              <div className="flex-row">
                <div>
                  <img
                    src={require("../../../assets/images/png/profilepic.png")}
                  />
                  <div className="ml10 fs12 mt5">Rosy</div>
                </div>

                <div className="ml20">
                  <img
                    src={require("../../../assets/images/png/profilepic.png")}
                  />
                  <div className="ml10 fs12 mt5">Rosy</div>
                </div>
              </div>

              <div className="flex-row-between mt20">
                <Typography className="text-bold mb10 fs14 blue-color">
                  Co-Owner
                </Typography>
                <img
                  src={require("../../../assets/images/png/PlusIcon.png")}
                  style={{ width: "20px", height: "20px" }}
                  className="cursor"
                  onClick={openCoOwnerModal}
                />
              </div>
            </Grid>
          </Grid>

          <Grid container className="mv20 ph20">
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <Typography className="text-bold mb10 fs14">
                Upcoming Appointments
              </Typography>
              {upcomingAppointments?.length > 0 ? (
                upcomingAppointments?.map((upAp, i) => {
                  const aptmnt = upAp?.appoinment;
                  return (
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                      xl={12}
                      className="mv10 upcom-card"
                      key={i + aptmnt?.appoimentId}
                    >
                      <Grid container>
                        <Grid item xs={3} sm={3} md={3} lg={3} xl={3}>
                          <img
                            src={
                              aptmnt?.petImage ?? "https://picsum.photos/200"
                            }
                            alt={
                              aptmnt?.petImage ?? "https://picsum.photos/200"
                            }
                            className="pet-card-img"
                          />
                        </Grid>
                        <Grid item xs={9} sm={9} md={9} lg={9} xl={9}>
                          <div className="flex-row mv5">
                            <div className="flex-center">
                              <Typography className="font-bold fs14 capitalize">
                                {aptmnt?.petName}
                              </Typography>
                              <Typography
                                className={`ml5 font-medium fs14 capitalize ${
                                  aptmnt?.gender === "male"
                                    ? "card-blue-color"
                                    : "card-rose-color"
                                }`}
                              >
                                {`(${aptmnt?.gender})`}
                              </Typography>
                            </div>
                            <div className="flex1-end">
                              <div className="gray-dot" />
                              <Typography className="ml3 txt-regular card-gray2 fs12">
                                {aptmnt?.appoimentTime}
                              </Typography>
                            </div>
                          </div>
                          <div className="flex-row mv5">
                            <div className="flex-center">
                              <div className="gray-dot" />
                              <Typography
                                className={`ml3 font-medium fs12 capitalize ${
                                  upAp?.appoinmentType === "Physical" ||
                                  "Virtual"
                                    ? "blue3"
                                    : upAp?.appoinmentType === "Vaccination"
                                    ? "card-green-color"
                                    : ""
                                }`}
                              >
                                {`${
                                  upAp?.appoinmentType === "Physical" ||
                                  "Virtual"
                                    ? "Consultation"
                                    : ""
                                } | ${upAp?.problemType} - ${
                                  upAp?.problems?.[0]
                                }`}
                              </Typography>
                            </div>
                          </div>
                        </Grid>
                      </Grid>
                    </Grid>
                  );
                })
              ) : (
                <div className="no-rec">No records available</div>
              )}
            </Grid>
          </Grid>
        </Grid>
      ) : null}
      <ClinicPetBookAppointment
        modalVisible={modalBookVisible}
        setModalBookVisible={setModalBookVisible}
        selectPet={selectPet}
      />
      <AddCoOwner
        modalVisible={coOwnerModalVisible}
        setModalBookVisible={setCoOwnerModalVisible}
      />
      <InternalNotes
        modalVisible={internalVisible}
        setModalBookVisible={setInternalVisible}
      />
    </Grid>
  );
};

export default CommonClinicPetDetails;
