import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import { AudioRecorder, useAudioRecorder } from "react-audio-voice-recorder";
import CustomButton from "../../../../components/CustomButton";
import { Grid, Typography, TextField } from "@mui/material";
import editNew from "../../../../assets/images/png/edit-new.png";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { postClinicalNotes } from "../../../../redux/reducers/clinicSlice";
import { hideLoader, showLoader } from "../../../../redux/reducers/loaderSlice";
import moment from "moment";
import { showSnackBar } from "../../../../redux/reducers/snackSlice";

// Set the app element for accessibility purposes
Modal.setAppElement("#root");

const ClinicalNotes = ({ modVisible, setModVisible, appointment }) => {
  const dispatch = useDispatch();
  const [audioBlob, setAudioBlob] = useState(null);
  const [recordData, setRecordData] = useState(null);
  const [editingSection, setEditingSection] = useState(null);
  const recorder = useAudioRecorder();
  const clinicNotes = useSelector(
    (state) => state?.pet?.petDetails?.data?.notes[0]
  );
  const [sections, setSections] = useState({
    Subjective: "",
    Objective: "",
    Assessment: "",
    Plan: "",
    Conclusion: "",
    Summary: "",
    KeyIdentification: "",
  });

  useEffect(() => {
    const extractSections = (note) => {
      const subjectiveMatch = note?.match(
        /(\*\*Subjective:\*\*\n)([\s\S]*?)(?=\*\*Objective:\*\*)/
      );
      const objectiveMatch = note?.match(
        /(\*\*Objective:\*\*\n)([\s\S]*?)(?=\*\*Assessment:\*\*)/
      );
      const assessmentMatch = note?.match(
        /(\*\*Assessment:\*\*\n)([\s\S]*?)(?=\*\*Plan:\*\*)/
      );
      const planMatch = note?.match(
        /(\*\*Plan:\*\*\n)([\s\S]*?)(?=\*\*Conclusion:\*\*)/
      );
      const conclusionMatch = note?.match(
        /(\*\*Conclusion:\*\*\n)([\s\S]*?)(?=\*\*Additional Information\*\*)/
      );

      setSections({
        Subjective: subjectiveMatch ? subjectiveMatch[2].trim() : "",
        Objective: objectiveMatch ? objectiveMatch[2].trim() : "",
        Assessment: assessmentMatch ? assessmentMatch[2].trim() : "",
        Plan: planMatch ? planMatch[2].trim() : "",
        Conclusion: conclusionMatch ? conclusionMatch[2].trim() : "",
      });
    };

    extractSections(recordData?.medical_note);
  }, [recordData]);

  const handleEditClick = (section) => {
    setEditingSection(section);
  };

  const handleInputChange = (event, section) => {
    setSections({
      ...sections,
      [section]: event.target.value,
    });
  };
  const addAudioElement = (blob) => {
    setAudioBlob(blob);
    const url = URL.createObjectURL(blob);
    const audio = document.createElement("audio");
    audio.src = url;
    audio.controls = true;
    document.body.appendChild(audio);
  };

  const saveAudio = () => {
    if (audioBlob) {
      const url = URL.createObjectURL(audioBlob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = "recording.webm";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }
  };

  const ApiCall = async () => {
    if (!audioBlob) return;
    dispatch(showLoader());
    const formData = new FormData();
    formData.append("audio_file", audioBlob, "recording.webm");
    try {
      const response = await axios.post(
        "http://18.232.151.79:8000/soap_note",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setRecordData(response.data);
      dispatch(hideLoader());
      dispatch(
        showSnackBar({
          message: "Record created successfully!",
          type: "success",
        })
      );
      console.log("API Response:", response.data);
    } catch (error) {
      console.error("Error uploading audio:", error);
      dispatch(hideLoader());
    }
  };

  const handleFinilize = () => {
    setEditingSection(null);
    const data = {
      // "clinical_keys": "String",
      // "summary": "String",
      subjective: sections?.Subjective,
      objective: sections?.Objective,
      assessment: sections?.Assessment,
      plan: sections?.Plan,
      conclusion: sections?.Conclusion,
      // "tag": "String"
    };
    const appId = appointment?.appointment?.appoinment?.appoimentId;
    const metaData = { appId, data };
    dispatch(postClinicalNotes(metaData));
    dispatch(
      showSnackBar({
        message: "Changes updated successfully!",
        type: "success",
      })
    );
  };

  return (
    <div className="w100Per mt20 common-pb-50">
      {modVisible && (
        <div
          className="flex-column p15"
          style={{ backgroundColor: "#F7F7F7", borderRadius: "10px" }}
        >
          <div className="flex-row-between">
            <div className="heading-fw600 fs14 black">Transcription</div>
            <div>
              <div className="txt-regular fs12 text-align-right">
                {moment(new Date()).format("DD MMM, YYYY")}
              </div>
              <div className="txt-regular fs12 text-align-right">
                {moment(new Date()).format("HH:mm")}
              </div>
            </div>
          </div>
          <div>
            <AudioRecorder
              recorder={recorder}
              onRecordingComplete={addAudioElement}
              audioTrackConstraints={{
                noiseSuppression: true,
                echoCancellation: true,
              }}
              showVisualizer={true}
              downloadFileExtension="mp3"
            />
          </div>
        </div>
      )}
      {audioBlob && (
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <div className="flex-end mt20">
            <div className="">
              <CustomButton text="Generate SOAP" onClick={ApiCall} />
            </div>
          </div>
        </Grid>
      )}

      {recordData ? (
        <>
          {[
            "Summary",
            "Subjective",
            "Objective",
            "Assessment",
            "Plan",
            "Conclusion",
            "Key Identification/Diagnosis",
          ].map((section) => (
            <div key={section} className="mt20">
              <div className="flex-row-between-align-center">
                <div className="heading-fw600 fs14 black">{section}</div>
                <div
                  className="cursor"
                  onClick={() => handleEditClick(section)}
                >
                  <img src={editNew} alt="edit" />
                </div>
              </div>
              <div
                style={{
                  border: "2px solid #E3E3EB",
                  borderRadius: "10px",
                }}
                className="text400 mt10 back-white"
              >
                {editingSection === section ? (
                  <TextField
                    fullWidth
                    value={sections[section]}
                    onChange={(event) => handleInputChange(event, section)}
                  />
                ) : (
                  <div className="p15">{sections[section]}</div>
                )}
              </div>
            </div>
          ))}
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <div className="clinic-mod-btn-pos mt20">
              <div className="mr10" onClick={ApiCall}>
                <Typography className="red-color fs14 txt-semi-bold">
                  Regenerate
                </Typography>
              </div>
              <div className="ml10">
                <CustomButton
                  text="Finalize"
                  smallBtn
                  onClick={handleFinilize}
                />
              </div>
            </div>
          </Grid>
        </>
      ) : clinicNotes ? (
        <>
          {/* KeyIdentifier */}
          <div className="mt20">
            <div className="flex-row-between-align-center">
              <div className="heading-fw600 fs14 black">
                Key Identification/Diagnosis
              </div>
            </div>
            <div
              style={{
                border: "2px solid #E3E3EB",
                borderRadius: "10px",
              }}
              className="text400 mt10 p15 back-white"
            >
              {clinicNotes?.clinical_keys}
            </div>
          </div>
          {/* Summary */}
          <div className="mt20">
            <div className="flex-row-between-align-center">
              <div className="heading-fw600 fs14 black">Summary</div>
            </div>
            <div
              style={{
                border: "2px solid #E3E3EB",
                borderRadius: "10px",
              }}
              className="text400 mt10 p15 back-white"
            >
              {clinicNotes?.summary}
            </div>
          </div>

          {/* subjective */}

          <div className="mt20">
            <div className="flex-row-between-align-center">
              <div className="heading-fw600 fs14 black">Subjective</div>
            </div>
            <div
              style={{
                border: "2px solid #E3E3EB",
                borderRadius: "10px",
              }}
              className="text400 mt10 p15 back-white"
            >
              {clinicNotes?.subjective}
            </div>
          </div>

          {/* objective*/}

          <div className="mt20">
            <div className="flex-row-between-align-center">
              <div className="heading-fw600 fs14 black">Objective</div>
            </div>
            <div
              style={{
                border: "2px solid #E3E3EB",
                borderRadius: "10px",
              }}
              className="text400 mt10 p15 back-white"
            >
              {clinicNotes?.objective}
            </div>
          </div>

          {/* assessment*/}

          <div className="mt20">
            <div className="flex-row-between-align-center">
              <div className="heading-fw600 fs14 black">Assessment</div>
            </div>
            <div
              style={{
                border: "2px solid #E3E3EB",
                borderRadius: "10px",
              }}
              className="text400 mt10 p15 back-white"
            >
              {clinicNotes?.assessment}
            </div>
          </div>

          {/* Plan*/}

          <div className="mt20">
            <div className="flex-row-between-align-center">
              <div className="heading-fw600 fs14 black">Plan</div>
            </div>
            <div
              style={{
                border: "2px solid #E3E3EB",
                borderRadius: "10px",
              }}
              className="text400 mt10 p15 back-white"
            >
              {clinicNotes?.plan}
            </div>
          </div>

          {/* conclusion*/}

          <div className="mt20">
            <div className="flex-row-between-align-center">
              <div className="heading-fw600 fs14 black">Conclusion</div>
            </div>
            <div
              style={{
                border: "2px solid #E3E3EB",
                borderRadius: "10px",
              }}
              className="text400 mt10 p15 back-white"
            >
              {clinicNotes?.conclusion}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="no-rec">No records available</div>
          <div className="flex-center mb20">
            <div className="">
              <CustomButton
                text="Create SOAP Notes"
                onClick={() => setModVisible(true)}
                smallBtn
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ClinicalNotes;
