import { Grid } from "@mui/material";
import { useState } from "react";
import CustomButton from "../../../../components/CustomButton";
import Diagnostics from "./Diagnostics";
import Prescription from "./Prescription";
import Preventive from "./Preventive";
import ClinicalNotes from "./ClinicalNotes";

const PatientWorkbook = (appointment) => {
  const [activeTab, setActiveTab] = useState("ClinicNotes");
  const [modVisible, setModVisible] = useState(false);

  return (
    <>
      <Grid
        item
        xs={12}
        sm={12}
        md={12}
        lg={12}
        xl={12}
        className="mv3 bg-white"
      >
        <Grid container spacing={1}>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <div className="back-white">
              <div className="flex-row">
                <div className="w15Per">
                  <CustomButton
                    text="Clinical Notes"
                    onClick={() => setActiveTab("ClinicNotes")}
                    tabOutlined
                    yellowBtn={activeTab === "ClinicNotes"}
                  />
                </div>
                <div className="w5Per">
                  <div className="flex-center">
                    <div className="ver-bar-h30" />
                  </div>
                </div>
                <div className="w15Per">
                  <CustomButton
                    text="Preventive"
                    onClick={() => setActiveTab("Preventive")}
                    tabOutlined
                    yellowBtn={activeTab === "Preventive"}
                  />
                </div>
                <div className="w5Per">
                  <div className="flex-center">
                    <div className="ver-bar-h30" />
                  </div>
                </div>
                <div className="w15Per">
                  <CustomButton
                    text="Prescription"
                    onClick={() => setActiveTab("Prescription")}
                    tabOutlined
                    yellowBtn={activeTab === "Prescription"}
                  />
                </div>
                <div className="w5Per">
                  <div className="flex-center">
                    <div className="ver-bar-h30" />
                  </div>
                </div>
                <div className="w15Per">
                  <CustomButton
                    text="Diagnostics"
                    onClick={() => setActiveTab("Diagnostics")}
                    tabOutlined
                    yellowBtn={activeTab === "Diagnostics"}
                  />
                </div>
{/* 
                 <div className="flex-end flexPoint7">
                  {activeTab === "ClinicNotes" ? (
                    <div>
                      <CustomButton
                        text="Create SOAP Notes"
                        smallBtn
                        onClick={() => setModVisible(true)}
                      />
                    </div>
                  ) : null} 
                </div> */}
              </div>
            </div>
          </Grid>
          {activeTab === "ClinicNotes" ? (
            <ClinicalNotes
              modVisible={modVisible}
              setModVisible={setModVisible}
              appointment={appointment}

            />
          ) : null}
          {activeTab === "Preventive" ? (
            <Preventive modVisible={modVisible} setModVisible={setModVisible} />
          ) : null}
          {activeTab === "Prescription" ? (
            <Prescription
              modVisible={modVisible}
              setModVisible={setModVisible}
            />
          ) : null}
          {activeTab === "Diagnostics" ? (
            <Diagnostics
              modVisible={modVisible}
              setModVisible={setModVisible}
            />
          ) : null}
        </Grid>
      </Grid>
    </>
  );
};

export default PatientWorkbook;
