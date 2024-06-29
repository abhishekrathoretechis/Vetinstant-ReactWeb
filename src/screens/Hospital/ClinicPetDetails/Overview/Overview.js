import { Grid, Typography } from "@mui/material";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import moment from "moment";
import { useState } from "react";
import { useSelector } from "react-redux";
import CustomButton from "../../../../components/CustomButton";
import { useDispatch } from "react-redux";
import {
  checkedCallInApi,
  checkedInApi,
  updateCompleted,
  updateConsult,
  updateFinalize,
} from "../../../../redux/reducers/clinicSlice";
import { updateAppointmentStatus } from "../../../../redux/reducers/vetSlice";
import CustomModal from "../../../../components/CustomModal/CustomModal";
import CustomSelect from "../../../../components/Select/Select";
import CustomTextField from "../../../../components/CustomTextField";

const Overview = ({ getPetData, getPereventiveData, appointment, title }) => {
  const dispatch = useDispatch();
  const [isVideoCallEnabled, setVideoCallEnabled] = useState(false);
  const [titleText, setTitleText] = useState(title);
  const [modalVisible,setModalVisible] = useState(false)
  const [selectedColor, setSelectedColor] = useState("red");
  const [searchTypeValue, setSearchTypeValue] = useState("");
  const searchList = [
    { name: "She is fluffy", color: "red" },
    { name: "she is a SOAB", color: "blue" },
    { name: "Sleepy head", color: "red" },
    { name: "sada", color: "green" },
    { name: "Split Deposit", color: "blue" },
  ];
  const [upperData, setUpperData] = useState( [
    { name: "Chicken", color: "white" },
    { name: "Paracetamol", color: "white" },
    { name: "Latex", color: "white" },
    
  ]);

  const appDet = useSelector(
    (state) => state?.pet?.petDetails?.data?.appointment
  );

  const vaccinationData = getPereventiveData?.filter(
    (item) => item?.type === "vaccination"
  );

  const dewormingData = getPereventiveData?.filter(
    (item) => item?.type === "deworming"
  );

  const fleaTreatmentData = getPereventiveData?.filter(
    (item) => item?.type === "fleaTreatment"
  );

  const myMeeting = async (element) => {
    const roomID = appDet?.videoCallId;
    const userID = appDet?.doctorId?.toString();
    const userName = appDet?.doctorName;
    const token = "faeb80d20908d605f3acbf67f8c25191";
    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      704271205,
      token,
      roomID,
      userID,
      userName
    );

    const zp = ZegoUIKitPrebuilt.create(kitToken);
    zp.joinRoom({
      container: element,
      scenario: {
        mode: ZegoUIKitPrebuilt.GroupCall,
      },
      onLeaveRoom: async () => {
        setVideoCallEnabled(false);
        localStorage.setItem(
          "videoCallPageReloaded",
          JSON.stringify({
            state: appDet,
          })
        );
        window.location.reload();
      },
      showLeavingView: false,
      showScreenSharingButton: false,
      maxUsers: 2,
      showPreJoinView: false,
      showTextChat: false,
      showRoomDetailsButton: false,
    });
  };

  const handleCallIn = async () => {
    // const apiSuccess = await dispatch(
    //   makeDoctorCallIn({
    //     // hospitalId: problemDetails?.vet?.hospitalId,
    //     // callId: state?._id,
    //   })
    // );
    // if (apiSuccess?.payload) {
    //   // socket.emit("pendingCall", {
    //   //   info: "callInDone",
    //   //   // doctorId: problemDetails?.vet?._id,
    //   //   // callId: state?._id,
    //   //   // userId: problemDetails?.call?.userId,
    //   //   // petId: problemDetails?.pet?._id,
    //   // });
    //   const reqObj = { status: "completed" };
    //   // await dispatch(
    //   //   updateCallPending({
    //   //     callId: state?._id,
    //   //     reqObj,
    //   //   })
    //   // );
    // }
  };

  const handleCheckin = () => {
    const data = {
      appointmentId: appointment?.appoinment?.appoimentId,
      doctorId: appointment?.appoinment?.doctorId,
    };

    dispatch(checkedInApi(data)).then((res) => {
      console.log("resP------>", res);
    });
  };

  const handleJoinVideoCall = () => {
    setVideoCallEnabled(true);
    if (navigator.mediaDevices.getUserMedia !== null) {
      var options = {
        video: true,
        audio: true,
      };
      navigator.getUserMedia(options, function (e) {
        console.log("background error : " + e.name);
      });
    }
    dispatch(
      updateAppointmentStatus({
        appId: appointment?.appoinment?.appoimentId,
        status: "inprogress",
      })
    );
  };

  const callButtonApi = () => {
    if (titleText === "Upcoming") {
      const data = {
        appointmentId: appointment?.appoinment?.appoimentId,
        doctorId: appointment?.appoinment?.doctorId,
      };

      dispatch(checkedInApi(data)).then((response) => {
        if (response?.payload) {
          setTitleText("Checked-in");
        }
      });
    } else if (titleText === "Checked-in") {
      const data = {
        appointmentId: appointment?.appoinment?.appoimentId,
        doctorId: appointment?.appoinment?.doctorId,
      };
      dispatch(checkedCallInApi(data)).then((response) => {
        if (response?.payload) {
          setTitleText("Consultation");
        }
      });
    } else if (titleText === "Consultation") {
      dispatch(updateFinalize(appointment?.appoinment?.appoimentId)).then(
        (response) => {
          if (response?.payload) {
            setTitleText("Finalize");
          }
        }
      );
    } else {
      dispatch(updateCompleted(appointment?.appoinment?.appoimentId)).then(
        (response) => {
          if (response?.payload) {
            setTitleText("Completed");
          }
        }
      );
    }
  };

  const handleModClose = ()=> {
    setModalVisible(!modalVisible)
  }
  const handleRemoveItem = (index) => {
    const newData = upperData.filter((_, i) => i !== index);
    setUpperData(newData);
  };

  const handleSelect = (e) => {
    setSelectedColor(e.target.value);
  };

  return (
    <>
      {isVideoCallEnabled ? (
        <div ref={myMeeting} className="vid-cal-con" />
      ) : null}
      <Grid item xs={12} className="mv3 back-white">
        {getPetData?.map((problem, i) => (
          <div key={i}>
            <div className="flex-row" style={{ alignItems: "center" }}>
              <div
                className="flex-row"
                style={{
                  width: "70%",
                  backgroundColor: "#F2F1F1",
                  padding: 5,
                  borderRadius: "4px",
                }}
              >
                <Typography
                  className={`font-medium fs10 card-time  ${
                    appDet?.appoinmentType === "Physical"
                      ? "card-bot-blue-back"
                      : "virtual-bg"
                  }  white-color
                flex-center`}
                >
                  {appDet?.appoinmentType}
                </Typography>

                <div className="flex-center">
                  <div className="gray-dot2 ml10 " />
                  <Typography
                    className="fs14 ml5 "
                    style={{ fontWeight: "650" }}
                  >
                    {moment(appDet?.appoinmentDate).format("DD, MMM YYYY")}
                  </Typography>
                </div>

                <div className="flex-center">
                  {/* <div className="gray-dot2 ml10 " /> */}
                  {/* <Typography className="font-medium gray-color fs14 ml5">
                  {appDet?.appoimentTime}
                </Typography> */}
                  <div className="ml10 card-light-blue-back card-time">
                    <Typography className="txt-regular card-blue2 fs12">
                      {appDet?.appoimentTime}
                    </Typography>
                  </div>
                </div>
              </div>
              <div className="flex-end flexPoint7">
                {titleText === "Upcoming" ||
                titleText === "Checked-in" ||
                titleText === "Consultation" ||
                titleText === "Finalize" ? (
                  <div className="">
                    <CustomButton
                      text={` ${
                        // appDet?.appoinmentType === "Virtual"
                        //   ? "Join Video Call"
                        //   : "Checked-in"
                        titleText === "Upcoming"
                          ? "Check-in"
                          : titleText === "Checked-in"
                          ? "Call-in"
                          : titleText === "Consultation"
                          ? "Finalize"
                          : titleText === "Finalize"
                          ? "Checkout"
                          : ""
                      } `}
                      onClick={() => {
                        // appDet?.appoinmentType === "Virtual"
                        //   ? handleJoinVideoCall()
                        //   : handleCheckin();
                        callButtonApi();
                      }}
                      smallBtn
                    />
                  </div>
                ) : title === "Billing" || title === "Completed" ? null : null}
              </div>
            </div>

            <Grid container spacing={1}>
              {/* {!isVideoCallEnabled ? (
            <Grid item xs={12} sm={12} md={12} lg={4} xl={4}>
              <div className="left-con-white">
                <div className="flex-row">
                  <div style={{ width: "30%" }}>
                    <div className="flex1-start">
                      {problemDetails?.pet?.photo ? (
                        <img
                          alt={problemDetails?.pet?.photo}
                          src={problemDetails?.pet?.photo}
                          className="detail-img"
                        />
                      ) : (
                        <div className="detail-empty-img" />
                      )}
                    </div>
                  </div>
                  <div className="w50Per ml15">
                    <div className="text600 mv2">Pet Name</div>
                    <div className="text400 mv2">
                      {problemDetails?.pet?.name}
                    </div>
                    <div className="text600 mt20">Pet Parent Name</div>
                    <div className="text400 mv2">
                      {problemDetails?.call?.userName}
                    </div>
                  </div>
                  <div className="w20Per flex-center flex-column">
                    <div className="vetAppint-blue-back flex-center">
                      <div className="flex-column">
                        <div className="text600-white flex-center">
                          {moment(problemDetails?.call?.extraInfo).format(
                            "MMM"
                          )}
                        </div>
                        <div className="text800-white flex-center">
                          {moment(problemDetails?.call?.extraInfo).format("DD")}
                        </div>
                      </div>
                    </div>
                    <div className="flex-row mv3">
                      <img
                        src={
                          require("../../../assets/images/svg/time.svg").default
                        }
                        alt="myIcon"
                      />
                      <div className="text800-fs10 ml3">
                        {moment(problemDetails?.call?.extraInfo).format(
                          "HH:mm"
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="left-con-box mt20">
                  <div className="flex-row">
                    <div className="w50Per">
                      <div className="text600 mv2">Gender</div>
                      <div className="text400 mv2">
                        {problemDetails?.pet?.gender === "male"
                          ? "Male"
                          : "Female"}
                      </div>
                      <div className="text600 mv2">Weight</div>
                      <div className="text400 mv2">
                        {problemDetails?.pet?.weight} kg
                      </div>
                    </div>
                    <div className="w50Per">
                      <div className="text600 mv2">Date of Birth & Age</div>
                      <div className="text400 mv2">
                        {moment(problemDetails?.pet?.dob).format(
                          "Do MMMM YYYY"
                        )}
                        , {moment(problemDetails?.pet?.dob).fromNow(true)}
                      </div>
                      <div className="text600 mv2">Breed</div>
                      <div className="text400 mv2">
                        {problemDetails?.pet?.breed}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="left-con-box mt20">
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                      <div className="flex-row">
                        <div className="text600 mv2">Consultation Type:</div>
                        <div className="text400 vetAppint-con-type">
                          {problemDetails?.call?.appointmentType}
                        </div>
                      </div>

                      {problemDetails?.call?.appointmentType === "Virtual" ? (
                        <>
                          <div className="flex-row mv3">
                            <div className="text600 mv2">
                              Call link valid for:
                            </div>
                            <div className="text800 ml5">
                              {getExpiryTime(
                                new Date(problemDetails?.call?.deleteAfter)
                              )}
                            </div>
                          </div>
                          <div className="flex-row mv3">
                            <div className="w30Per">
                              <Button
                                text="Video Call"
                                leftIcon
                                startIcon={<VideocamOutlinedIcon />}
                                onClick={() => setVideoCallEnabled(true)}
                                grayBtn={disableBtn(
                                  updatedCall
                                    ? updatedCall?.extraInfo
                                    : problemDetails?.call?.extraInfo
                                )}
                                disabled={disableBtn(
                                  updatedCall
                                    ? updatedCall?.extraInfo
                                    : problemDetails?.call?.extraInfo
                                )}
                              />
                            </div>
                          </div>
                        </>
                      ) : (
                          updatedCall
                            ? !updatedCall?.callIn
                            : !problemDetails?.call?.callIn
                        ) ? (
                        <div className="flex-row mv3">
                          <div className="w30Per">
                            <Button
                              text="Call-in"
                              smallBtn
                              disabled={
                                disableBtn(
                                  updatedCall
                                    ? updatedCall?.extraInfo
                                    : problemDetails?.call?.extraInfo
                                ) ||
                                (updatedCall
                                  ? !updatedCall?.checkIn
                                  : !problemDetails?.call?.checkIn)
                              }
                              onClick={handleCallIn}
                              grayBtn={
                                disableBtn(
                                  updatedCall
                                    ? updatedCall?.extraInfo
                                    : problemDetails?.call?.extraInfo
                                ) ||
                                (updatedCall
                                  ? !updatedCall?.checkIn
                                  : !problemDetails?.call?.checkIn)
                              }
                            />
                          </div>
                        </div>
                      ) : null}
                    </Grid>
                  </Grid>
                </div>
              </div>
            </Grid>
          ) : null} */}
              {/* {!isVideoCallEnabled ? (
            <Grid item xs={12} sm={12} md={12} lg={8} xl={8}>
              <div className="right-con-white-wh">
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                  <div className="tab-sty">
                    <div
                      className={`${
                        activeTab === "PetData" ? "tab-active-btn" : "tab-txt"
                      } cursor`}
                      onClick={() => setActiveTab("PetData")}
                    >
                      Pet Data
                    </div>
                    <div
                      className={`${
                        activeTab === "MedicalHistory"
                          ? "tab-active-btn"
                          : "tab-txt"
                      } cursor`}
                      onClick={() => setActiveTab("MedicalHistory")}
                    >
                      Medical History
                    </div>
                    {problemDetails?.call?.appointmentType === "Virtual" ||
                    (problemDetails?.call?.appointmentType === "Physical" &&
                    updatedCall
                      ? !updatedCall?.isPrescriptionGiven
                      : !problemDetails?.call?.isPrescriptionGiven) ? (
                      <div
                        className={`${
                          activeTab === "Prescription"
                            ? "tab-active-btn"
                            : "tab-txt"
                        } cursor`}
                        onClick={() => setActiveTab("Prescription")}
                      >
                        Prescription
                      </div>
                    ) : null}
                  </div>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                  <div className="top-emp-space" />
                </Grid>
                {activeTab === "PetData" ? (
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <div className="mh20 mv20">
                      <div
                        className="flex-row cursor"
                        onClick={() =>
                          setPetDataActTab(
                            petDataActTab === "ExamD" ? null : "ExamD"
                          )
                        }
                      >
                        {petDataActTab === "ExamD" ? (
                          <ArrowDropDownIcon sx={strokeObj} />
                        ) : (
                          <ArrowRightIcon sx={strokeObj} />
                        )}
                        <div className="text blue-color align-center-wh ml5">
                          ExamD
                        </div>
                      </div>
                      {petDataActTab === "ExamD" ? (
                        <CommonExamDSummaryComponent
                          medicalHistory={problemDetails}
                        />
                      ) : null}
                      <div
                        className="flex-row cursor mv20"
                        onClick={() => {
                          setPetDataActTab(
                            petDataActTab === "CurrDiaSummary"
                              ? null
                              : "CurrDiaSummary"
                          );
                        }}
                      >
                        {petDataActTab === "CurrDiaSummary" ? (
                          <ArrowDropDownIcon sx={strokeObj} />
                        ) : (
                          <ArrowRightIcon sx={strokeObj} />
                        )}
                        <div className="text blue-color align-center-wh ml5">
                          Current diagnosis summary
                        </div>
                      </div>
                      {petDataActTab === "CurrDiaSummary" ? (
                        <CommonComplaintSummaryComponent
                          medicalHistory={problemDetails}
                        />
                      ) : null}
                      <div
                        className="flex-row cursor mv20"
                        onClick={() => {
                          setPetDataActTab(
                            petDataActTab === "ViewSuppDoc"
                              ? null
                              : "ViewSuppDoc"
                          );
                        }}
                      >
                        {petDataActTab === "ViewSuppDoc" ? (
                          <ArrowDropDownIcon sx={strokeObj} />
                        ) : (
                          <ArrowRightIcon sx={strokeObj} />
                        )}
                        <div className="text blue-color align-center-wh ml5">
                          View supported documents
                        </div>
                      </div>
                      {petDataActTab === "ViewSuppDoc" ? (
                        <CommonOtherComponent medicalHistory={problemDetails} />
                      ) : null}
                    </div>
                  </Grid>
                ) : null}
                {activeTab === "MedicalHistory" ? (
                  <PetMedicalHistoryList
                    state={{ petId: problemDetails?.pet?._id }}
                  />
                ) : null}
                {/* {activeTab === "Prescription" ? (
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <div className="mh20 mv20">
                      <div className="flex-row mb20">
                        <div
                          className="txt-semi-bold fs12 blue-color cursor"
                          // onClick={handleAddNewRow}
                        >
                          Add medication
                        </div>
                        <div
                          className="align-center-wh cursor"
                          // onClick={handleAddNewRow}
                        >
                          <img
                            src={require("../../../assets/images/png/PlusIcon.png")}
                            alt="myIcon"
                            className="img-wh20 ml5 cursor"
                          />
                        </div>
                      </div> */}

              {/* {medList?.map((med, ind) => (
                        <Grid container spacing={2} key={ind}>
                          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <div className="txt-semi-bold fs14 mt10">
                              {ind + 1}) Medicine
                            </div>
                            <CustomTextField
                              label=""
                              placeholder=""
                              name="medicine"
                              fullWidth
                              // handleChange={(e) => {
                              //   handleChangeValue(
                              //     e.target.value,
                              //     e.target.name,
                              //     ind
                              //   );
                              // }}
                              // value={med?.medicine}
                            />
                          </Grid>
                          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <div className="txt-semi-bold fs14 mt10">Dose</div>
                            <CustomTextField
                              label=""
                              placeholder=""
                              name="dose"
                              fullWidth
                              // handleChange={(e) => {
                              //   handleChangeValue(
                              //     e.target.value,
                              //     e.target.name,
                              //     ind
                              //   );
                              // }}
                              // value={med?.dose}
                              type="number"
                            />
                          </Grid>
                          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <div className="txt-semi-bold fs14">From</div>
                            <CustomTextField
                              label=""
                              placeholder=""
                              name="fromDate"
                              fullWidth
                              // handleChange={(e) => {
                              //   handleChangeValue(
                              //     e.target.value,
                              //     e.target.name,
                              //     ind
                              //   );
                              // }}
                              // value={med?.fromDate}
                              mobileDate
                            />
                          </Grid>
                          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <div className="txt-semi-bold fs14">To</div>
                            <CustomTextField
                              label=""
                              placeholder=""
                              name="toDate"
                              fullWidth
                              // handleChange={(e) => {
                              //   handleChangeValue(
                              //     e.target.value,
                              //     e.target.name,
                              //     ind
                              //   );
                              // }}
                              // value={med?.toDate}
                              mobileDate
                            />
                          </Grid>

                          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <div className="txt-semi-bold fs14">Duration</div>
                          </Grid>

                          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            <div className="flex-row mtMin15 ml5">
                              <div className="w20Per">
                                <div className="flex-row align-center-wh">
                                  <CustomCheckbox
                                    label=""
                                    // checked={med?.isMorn}
                                    // onChange={(e) => {
                                    //   handleChangeValue(!e, "isMorn", ind);
                                    // }}
                                  />
                                  <div className="mlMin15 align-center-wh">
                                    // {/* <WbSunnyOutlinedIcon sx={timeStroke} /> 
                                  </div>
                                </div>
                              </div>

                              <div className="w20Per">
                                <div className="flex-row align-center-wh">
                                  <CustomCheckbox
                                    label=""
                                    // checked={med?.isNoon}
                                    // onChange={(e) => {
                                    //   handleChangeValue(!e, "isNoon", ind);
                                    // }}
                                  />
                                  <div className="mlMin15 align-center-wh">
                                    {/* <AddOutlinedIcon sx={timeStroke} />\
                                  </div>
                                </div>
                              </div>

                              <div className="w20Per">
                                <div className="flex-row">
                                  <div className="align-center-wh">
                                    <CustomCheckbox
                                      label=""
                                      // checked={med?.isNight}
                                      // onChange={(e) => {
                                      //   handleChangeValue(!e, "isNight", ind);
                                      // }}
                                    />
                                  </div>
                                  <div className="mlMin15 align-center-wh">
                                    {/* <DarkModeOutlinedIcon sx={timeStroke} /> 
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Grid>
                        </Grid>
                      ))} */}
              {/* <Grid container spacing={2}>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                          <div className="txt-semi-bold fs14 mv10">Advice</div>
                          <CustomTextField
                            label=""
                            placeholder=""
                            name="advice"
                            fullWidth
                            multiline
                            rows={3}
                            // handleChange={handleChangedPresValue}
                            // value={presValues?.advice}
                          />
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                          <div className="txt-semi-bold fs14 mv10">
                            Diagnostics prescription:
                          </div>
                          <CustomTextField
                            label=""
                            placeholder=""
                            name="diaPrescription"
                            fullWidth
                            multiline
                            rows={3}
                            // handleChange={handleChangedPresValue}
                            // value={presValues?.diaPrescription}
                          />
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                          <div className="txt-semi-bold fs14 mv10">
                            Vet’s note & diagnosis:
                          </div>
                          <CustomTextField
                            label=""
                            placeholder=""
                            name="vetNotes"
                            fullWidth
                            multiline
                            rows={3}
                            // handleChange={handleChangedPresValue}
                            // value={presValues?.vetNotes}
                          />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                          <div className="flex-start">
                            <div className="w60Per">
                              <CustomButton
                                text="Add more medication"
                                whiteBtn
                                // onClick={handleAddNewRow}
                              />
                            </div>
                          </div>
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                          <div className="flex-end">
                            <div className="w30Per">
                              <CustomButton
                                text="Submit"
                                // onClick={handleAddPrescription}
                              />
                            </div>
                          </div>
                        </Grid>
                      </Grid>
                    </div>
                  </Grid>
                ) : null}
              </div>
            </Grid>
          ) : null}  */}
            </Grid>
            {/* <div className="flex-row">
            <Typography
              className={`font-medium w9Per fs10 card-time card-bot-blue-back  white-color`}
            >
              Physical
            </Typography>
            <div className="flex-center">
              <div className="gray-dot2 ml10 " />
              <Typography className="font-medium black fs14 ml5">
                22, May 2024
              </Typography>
            </div>

            <div className="flex-center">
              <div className="gray-dot2 ml10 " />
              <Typography className="font-medium gray-color fs14 ml5">
                10:45
              </Typography>
            </div>
          </div> */}

            <div
              className="flex-row"
              style={{
                width: "70%",
                backgroundColor: "#F2F1F1",
                padding: 8,
                borderRadius: "4px",
                marginTop:'15px'
              }}
            >
              <img src={require("../../../../assets/images/png/allerge.png")} />

              <div className="flex-center">
                <Typography className="fs14 ml5 " style={{ fontWeight: "650" }}>
                  Allergies:
                </Typography>
              </div>

              <div className="flex-center">
                {/* <div className="gray-dot2 ml10 " /> */}
                {/* <Typography className="font-medium gray-color fs14 ml5">
                  {appDet?.appoimentTime}
                </Typography> */}

                <Typography className="fs14 ml5 " style={{ fontWeight: "650",color:'#FF754A' }}>
                  Chicken, Paracetamol, Latex
                </Typography>
                <div style={{marginLeft:'5px'}} onClick={()=>setModalVisible(true)}>
                <img src={require("../../../../assets/images/png/edit-new.png")} />
                </div>
              </div>
            </div>

            <Typography className="font-bold mt20">
              Compliants Summary
            </Typography>
            <Typography className="font-bold gray7 fs12 mt10 capitalize">
              Latest Diagnoses: {problem.problemType}
            </Typography>

            <Typography className="font-medium black fs12 mt10">
              Symptoms:
            </Typography>

            <div className="flex-row mt10">
              {problem?.problems?.map((prb, j) => (
                <Typography
                  className={`font-medium fs10 card-time blu-back white-color ${
                    j !== 0 ? "ml5" : ""
                  }`}
                >
                  {prb}
                </Typography>
              ))}
            </div>

            <Grid container spacing={2} className="mt10">
              {problem?.image1 && (
                <Grid item xs={3}>
                  <img
                    src={problem?.image1}
                    alt={problem?.image1}
                    className="img-view"
                  />
                </Grid>
              )}
              {problem?.image2 && (
                <Grid item xs={3}>
                  <img
                    src={problem?.image2}
                    alt={problem?.image2}
                    className="img-view"
                  />
                </Grid>
              )}
              {problem?.images && (
                <Grid item xs={3}>
                  <img
                    src={problem?.images}
                    alt={problem?.images}
                    className="img-view"
                  />
                </Grid>
              )}
            </Grid>

            <Typography className="txt-regular black fs12 mt10">
              How long the issue has been there: {problem?.numberOfDays} days
            </Typography>

            {/* {getPereventiveData?.length > 0 && (
            <>
              <Typography className="font-bold fs14 mt20">Preventive</Typography>

              <Grid container spacing={2} className="mt10">
                <Grid item xs={4}>
                  <Typography className="font-bold fs14">Vaccinations</Typography>
                  {vaccinationData?.map((vac, k) => (
                    <div key={k} className="mt10">
                      <div className="flex-column">
                        <div className="flex-row">
                          <Typography className="fs12 txt-semi-bold gray7 flex-center">
                            {vac?.remark}
                          </Typography>
                          <CreateOutlinedIcon className="green-pen ml3" />
                        </div>
                        <Typography className="fs12 font-bold black2 mt3">
                          {vac?.name}
                        </Typography>
                        <div className="flex-row">
                          <div className="flex-center">
                            <div className="gray-dot2" />
                            <Typography className="fs10 font-bold orange2 mt3 mb3 ml3">
                              Due Date: {vac?.date}
                            </Typography>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </Grid>

                <Grid item xs={4}>
                  <Typography className="font-bold fs14">Deworming</Typography>
                  {dewormingData?.map((dew, l) => (
                    <div key={l} className="mt10">
                      <div className="flex-column">
                        <div className="flex-row">
                          <Typography className="fs12 txt-semi-bold gray7 flex-center">
                            {dew?.remark}
                          </Typography>
                          <CreateOutlinedIcon className="green-pen ml3" />
                        </div>
                        <Typography className="fs12 font-bold black2 mt3">
                          {dew?.name}
                        </Typography>
                        <div className="flex-row">
                          <div className="flex-center">
                            <div className="gray-dot2" />
                            <Typography className="fs10 font-bold orange2 mt3 mb3 ml3">
                              Due Date: {dew?.date}
                            </Typography>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </Grid>

                <Grid item xs={4}>
                  <Typography className="font-bold fs14">Flea Treatment</Typography>
                  {fleaTreatmentData?.map((flea, m) => (
                    <div key={m} className="mt10">
                      <div className="flex-column">
                        <div className="flex-row">
                          <Typography className="fs12 txt-semi-bold gray7 flex-center">
                            {flea?.remark}
                          </Typography>
                          <CreateOutlinedIcon className="green-pen ml3" />
                        </div>
                        <Typography className="fs12 font-bold black2 mt3">
                          {flea?.name}
                        </Typography>
                        <div className="flex-row">
                          <div className="flex-center">
                            <div className="gray-dot2" />
                            <Typography className="fs10 font-bold orange2 mt3 mb3 ml3">
                              Due Date: {flea?.date}
                            </Typography>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </Grid>
              </Grid>
            </>
          )} */}
          </div>
        ))}
      </Grid>

      <CustomModal
        open={modalVisible}
        onClose={handleModClose}
        header="Allergies"
        rightModal
        modalWidth={30}
      >
        <div className=" ph20">
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12} className="mt10">
            <div className="flex-row">
              {upperData.map((item, index) => {
                return (
                  <>
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={12}
                      lg={12}
                      xl={12}
                      // className="flex-row"
                    >
                      <Typography
                        className="fs14 flex-row" style={{ fontWeight: "650",color:'#FF754A' }}
                        
                      >
                        {item?.name}
                        <img
                          src={require("../../../../assets/images/png/cross.png")}
                          className="ml5 cursor "
                          alt="Remove"
                          onClick={() => handleRemoveItem(index)}
                        />
                      </Typography>
                    </Grid>
                  </>
                );
              })}
            </div>
          </Grid>
          <Typography className="text-bold mb10 fs14 mt20">Add New</Typography>
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={12}
            xl={12}
            className="flex-row-between mt20"
          >
            {/* <Grid item xs={2.5} sm={2.5} md={2.5} lg={2.5} xl={2.5}>
              <CustomSelect
                list={[
                  { name: "Red", value: "red" },
                  { name: "Orange", value: "orange" },
                  { name: "Yellow", value: "yellow" },
                  { name: "Orange", value: "orange" },
                ]}
                value={selectedColor}
                handleChange={handleSelect}
                name="color"
                color
              />
            </Grid> */}
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <CustomTextField
                placeholder="Name"
                name="name"
                fullWidth
                labelTop
              />
            </Grid>

            <Grid item xs={2.5} sm={2.5} md={2.5} lg={2.5} xl={2.5}>
              <CustomButton text="Add" />
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12} xl={12} className="mt10">
            <CustomTextField
              placeholder="Search for tags"
              name="name"
              fullWidth
              handleChange={(e) => setSearchTypeValue(e.target.value)}
              value={searchTypeValue}
              search
            />
          </Grid>
          {/* {searchTypeValue && (
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} className="mt10">
              <div className="flex-row-wrap1  mv10 gap10">
                {searchList.map((item, index) => {
                  return (
                    <>
                      <Grid item xs={3.5} sm={3.5} md={3.5} lg={3.5} xl={3.5}>
                        <Typography
                          className={`font-medium fs10 card-time card-bot-${item?.color}-back white-color flex-center`}
                        >
                          {item?.name}
                        </Typography>
                      </Grid>
                    </>
                  );
                })}
              </div>
            </Grid>
          )} */}

          <div className="flex1-end mt20">
            <Grid item xs={6} sm={6} md={3} lg={3} xl={3}>
              <CustomButton text="Save" />
            </Grid>
          </div>
        </div>
      </CustomModal>
    </>
  );
};

export default Overview;
