import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import VideocamOutlinedIcon from "@mui/icons-material/VideocamOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import { Grid } from "@mui/material";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { default as Button } from "../../../components/CustomButton";
import Checkbox from "../../../components/CustomCheckbox";
import CustomTextField from "../../../components/CustomTextField";
import TopBar from "../../../components/TopBar/TopBar";
import socket from "../../../components/socket";
import Header from "../../../layouts/header";
import { getMedicalHistoryByCallId } from "../../../redux/reducers/medicalHistorySlice";
import { updateCallPending } from "../../../redux/reducers/mixedSlice";
import { createPetPrescription } from "../../../redux/reducers/petSlice";
import {
  getCallPendingById,
  makeDoctorCallIn,
} from "../../../redux/reducers/vetSlice";
import { AppColors } from "../../../util/AppColors";
import { disableBtn, getExpiryTime } from "../../../util/function";
import { getAge } from "../../../util/getAge";
import { CommonComplaintSummaryComponent } from "../../CommonComponents/CommonComplaintSummaryComponent";
import { CommonExamDSummaryComponent } from "../../CommonComponents/CommonExamDSummaryComponent";
import { CommonOtherComponent } from "../../CommonComponents/CommonOtherComponent";
import PetMedicalHistoryList from "../../CommonScreens/PetMedicalHistoryList/PetMedicalHistoryList";

const strokeObj = { stroke: AppColors.appPrimary, strokeWidth: 2 };
const timeStroke = { stroke: AppColors.appPrimary, height: 15, width: 15 };

const initMed = {
  medicine: "",
  dose: "",
  fromDate: new Date(),
  toDate: new Date(),
  isMorn: false,
  isNoon: false,
  isNight: false,
};

const initValue = { advice: "", diaPrescription: "", vetNotes: "" };

const VetAppointmentDetails = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(
    location?.state?.activeTab ?? "PetData"
  );
  const [petDataActTab, setPetDataActTab] = useState(null);
  const [medList, setMedList] = useState([{ ...initMed, i: 0 }]);
  const [presValues, setPresValues] = useState(initValue);
  const [isVideoCallEnabled, setVideoCallEnabled] = useState(false);
  const state = location?.state;
  const problemDetails = useSelector((state) => state.medicalHistory.detail);
  const [updatedCall, setUpdatedCall] = useState(null);

  useEffect(() => {
    socket.on("pendingCall", (data) => {
      if (
        data?.info === "checkInDone" ||
        data?.info === "prescriptionAdded" ||
        data?.info === "callInDone"
      ) {
        if (
          data?.doctorId === problemDetails?.vet?._id &&
          data?.callId === state?._id
        ) {
          getUpdatedCall();
        }
      }
    });
  }, []);

  const getUpdatedCall = async () => {
    const apiRes = await dispatch(getCallPendingById(state?._id));
    if (apiRes?.payload) setUpdatedCall(apiRes.payload);
  };

  useEffect(() => {
    if (activeTab === "PetData") {
      dispatch(getMedicalHistoryByCallId(location?.state?.appoimentId));
    }
  }, [activeTab]);
  console.log("location?.statelocation?.state", location?.state);
  const handleAddNewRow = () => {
    setMedList([...medList, { ...initMed, i: medList?.length }]);
  };

  const handleChangeValue = (value, name, i) => {
    const requiredList = medList?.map((med, index) => {
      if (i === index) return { ...med, [name]: value };
      return med;
    });
    setMedList(requiredList);
  };

  console.log("problemDetailsproblemDetails", problemDetails);
  const handleChangedPresValue = (e) => {
    setPresValues({
      ...presValues,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddPrescription = async () => {
    const data = {
      advice: presValues?.advice,
      prescription: presValues?.diaPrescription,
      diagnosis: presValues?.vetNotes,
      medication: medList?.map((med) => ({
        ...med,
        timingDuration: `${med?.isMorn ? "1" : "0"}-${med?.isNoon ? "1" : "0"
          }-${med?.isNight ? "1" : "0"}`,
      })),
      docname: problemDetails?.vet?.name,
      doctor: problemDetails?.vet?._id,
      callId: state?._id,
      date: new Date(),
    };
    const apiSuccess = await dispatch(
      createPetPrescription({ petId: problemDetails?.pet?._id, data })
    );
    if (apiSuccess?.payload) {
      setPresValues(initValue);
      setMedList([{ ...initMed, i: 0 }]);
      setActiveTab("PetData");
      const reqObj = { isPrescriptionGiven: true };
      const callPenRes = await dispatch(
        updateCallPending({
          callId: state?._id,
          reqObj,
        })
      );
      if (callPenRes?.payload) {
        socket.emit("pendingCall", {
          info: "prescriptionAdded",
          doctorId: problemDetails?.vet?._id,
          callId: state?._id,
        });
      }
    }
  };

  const myMeeting = async (element) => {
    const roomID = state?._id;
    const userID = problemDetails?.vet?._id;
    const userName = problemDetails?.vet?.name;
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
        const reqObj = { status: "completed" };
        await dispatch(
          updateCallPending({
            callId: state?._id,
            reqObj,
          })
        );
        setActiveTab("Prescription");
        setVideoCallEnabled(false);
        localStorage.setItem(
          "videoCallPageReloaded",
          JSON.stringify({
            state: location?.state,
            activeTab: "Prescription",
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
    const apiSuccess = await dispatch(
      makeDoctorCallIn({
        hospitalId: problemDetails?.vet?.hospitalId,
        callId: state?._id,
      })
    );
    if (apiSuccess?.payload) {
      socket.emit("pendingCall", {
        info: "callInDone",
        doctorId: problemDetails?.vet?._id,
        callId: state?.appoimentId,
        userId: problemDetails?.call?.userId,
        petId: problemDetails?.pet?._id,
      });
      const reqObj = { status: "completed" };
      await dispatch(
        updateCallPending({
          callId: state?._id,
          reqObj,
        })
      );
    }
  };

  return (
    <>
      <Header name="Vetinstant" />
      <TopBar name="Appointments" rightVerBtnShow={false} />
      <div className="com-mar">
        <Grid container spacing={1}>
          {isVideoCallEnabled ? (
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <div
                ref={myMeeting}
                style={{ width: "100%", height: "80vh" }}
              ></div>
            </Grid>
          ) : null}
          {!isVideoCallEnabled ? (
            <Grid item xs={12} sm={12} md={12} lg={4} xl={4}>
              <div className="left-con-white">
                <div className="flex-row">
                  <div style={{ width: "30%" }}>
                    <div className="flex1-start">
                      {location?.state?.petImage ? (
                        <img
                          alt={location?.state?.petImage}
                          src={location?.state?.petImage}
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
                      {location?.state?.petName}
                    </div>
                    <div className="text600 mt20">Pet Parent Name</div>
                    <div className="text400 mv2">
                      {location?.state?.userName}
                    </div>
                  </div>
                  <div className="w20Per flex-center flex-column">
                    <div className="vetAppint-blue-back flex-center">
                      <div className="flex-column">
                        <div className="text600-white flex-center">
                          {moment(location?.state?.expaire).format(
                            "MMM"
                          )}
                        </div>
                        <div className="text800-white flex-center">
                          {moment(location?.state?.expaire).format("DD")}
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
                        {moment(location?.state?.expaire).format(
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
                      <div className="text400 mv2 capitalize">
                        {location?.state.gender === "male"
                          ? "Male"
                          : "Female"}
                      </div>
                      <div className="text600 mv2">Weight</div>
                      <div className="text400 mv2">
                        {location?.state.weight} kg
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
                          {location?.state?.appointmentType}
                        </div>
                      </div>

                      {location?.state?.appointmentType === "Virtual" ? (
                        <>
                          <div className="flex-row mv3">
                            <div className="text600 mv2">
                              Call link valid for:
                            </div>
                            <div className="text800 ml5">
                              {getExpiryTime(
                                new Date(location?.state?.expaire)
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
          ) : null}
          {!isVideoCallEnabled ? (
            <Grid item xs={12} sm={12} md={12} lg={8} xl={8}>
              <div className="right-con-white-wh">
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                  <div className="tab-sty">
                    <div
                      className={`${activeTab === "PetData" ? "tab-active-btn" : "tab-txt"
                        } cursor`}
                      onClick={() => setActiveTab("PetData")}
                    >
                      Pet Data
                    </div>
                    <div
                      className={`${activeTab === "MedicalHistory"
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
                        className={`${activeTab === "Prescription"
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
                          medicalHistory={problemDetails?.diagnosis}
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
                          medicalHistory={problemDetails?.medicalHistory}
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
                        <CommonOtherComponent medicalHistory={problemDetails?.otherRecord} />
                      ) : null}
                    </div>
                  </Grid>
                ) : null}
                {activeTab === "MedicalHistory" ? (
                  <PetMedicalHistoryList
                    state={{ petId: problemDetails?.pet?._id }}
                  />
                ) : null}
                {activeTab === "Prescription" ? (
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <div className="mh20 mv20">
                      <div className="flex-row mb20">
                        <div
                          className="txt-semi-bold fs12 blue-color cursor"
                          onClick={handleAddNewRow}
                        >
                          Add medication
                        </div>
                        <div
                          className="align-center-wh cursor"
                          onClick={handleAddNewRow}
                        >
                          <img
                            src={require("../../../assets/images/png/PlusIcon.png")}
                            alt="myIcon"
                            className="img-wh20 ml5 cursor"
                          />
                        </div>
                      </div>

                      {medList?.map((med, ind) => (
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
                              handleChange={(e) => {
                                handleChangeValue(
                                  e.target.value,
                                  e.target.name,
                                  ind
                                );
                              }}
                              value={med?.medicine}
                            />
                          </Grid>
                          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                            <div className="txt-semi-bold fs14 mt10">Dose</div>
                            <CustomTextField
                              label=""
                              placeholder=""
                              name="dose"
                              fullWidth
                              handleChange={(e) => {
                                handleChangeValue(
                                  e.target.value,
                                  e.target.name,
                                  ind
                                );
                              }}
                              value={med?.dose}
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
                              handleChange={(e) => {
                                handleChangeValue(
                                  e.target.value,
                                  e.target.name,
                                  ind
                                );
                              }}
                              value={med?.fromDate}
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
                              handleChange={(e) => {
                                handleChangeValue(
                                  e.target.value,
                                  e.target.name,
                                  ind
                                );
                              }}
                              value={med?.toDate}
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
                                  <Checkbox
                                    label=""
                                    checked={med?.isMorn}
                                    onChange={(e) => {
                                      handleChangeValue(!e, "isMorn", ind);
                                    }}
                                  />
                                  <div className="mlMin15 align-center-wh">
                                    <WbSunnyOutlinedIcon sx={timeStroke} />
                                  </div>
                                </div>
                              </div>

                              <div className="w20Per">
                                <div className="flex-row align-center-wh">
                                  <Checkbox
                                    label=""
                                    checked={med?.isNoon}
                                    onChange={(e) => {
                                      handleChangeValue(!e, "isNoon", ind);
                                    }}
                                  />
                                  <div className="mlMin15 align-center-wh">
                                    <AddOutlinedIcon sx={timeStroke} />
                                  </div>
                                </div>
                              </div>

                              <div className="w20Per">
                                <div className="flex-row">
                                  <div className="align-center-wh">
                                    <Checkbox
                                      label=""
                                      checked={med?.isNight}
                                      onChange={(e) => {
                                        handleChangeValue(!e, "isNight", ind);
                                      }}
                                    />
                                  </div>
                                  <div className="mlMin15 align-center-wh">
                                    <DarkModeOutlinedIcon sx={timeStroke} />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Grid>
                        </Grid>
                      ))}
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                          <div className="txt-semi-bold fs14 mv10">Advice</div>
                          <CustomTextField
                            label=""
                            placeholder=""
                            name="advice"
                            fullWidth
                            multiline
                            rows={3}
                            handleChange={handleChangedPresValue}
                            value={presValues?.advice}
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
                            handleChange={handleChangedPresValue}
                            value={presValues?.diaPrescription}
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
                            handleChange={handleChangedPresValue}
                            value={presValues?.vetNotes}
                          />
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                          <div className="flex-start">
                            <div className="w60Per">
                              <Button
                                text="Add more medication"
                                whiteBtn
                                onClick={handleAddNewRow}
                              />
                            </div>
                          </div>
                        </Grid>
                        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                          <div className="flex-end">
                            <div className="w30Per">
                              <Button
                                text="Submit"
                                onClick={handleAddPrescription}
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
          ) : null}
        </Grid>
      </div>
    </>
  );
};

export default VetAppointmentDetails;
