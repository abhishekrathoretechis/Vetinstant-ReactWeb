import { Grid, Container } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import CustomButton from "../../../components/CustomButton";
import { getPetsCompliantSummary } from "../../../redux/reducers/petSlice";
import { AppColors } from "../../../util/AppColors";
import CommonClinicPetDetails from "../../CommonScreens/CommonClinicPetDetails/CommonClinicPetDetails";
import Overview from "./Overview/Overview";
import PatientWorkbook from "./PatientWorkbook/PatientWorkbook";
// import History from "./History";
import Billing from "./Billing/Billing";

const ClinicPetDetails = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { appointment, bill } = location?.state || {};
  const { title } = location.state || {};

  const getPetData = useSelector(
    (state) => state?.pet?.petDetails?.data?.medicalHistory
  );
  const getPereventiveData = useSelector(
    (state) => state?.pet?.petDetails?.data?.prevetive
  );
  const [selectedTab, setSelectedTab] = useState(
    location?.state?.selectedTab ?? "overView"
  );

  useEffect(() => {
    getcompliantSummary();
  }, []);

  const getcompliantSummary = () => {
    dispatch(getPetsCompliantSummary(appointment?.appoinment?.appoimentId));
  };

  return (
    <CommonClinicPetDetails upcomingVisible={selectedTab === "overView"}>
      <Grid container className="ph2">
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          lg={12}
          xl={12}
          className="back-white p10 bs-margin"
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <div className="clinic-custom-tab-buttons">
                <CustomButton
                  text="Overview"
                  onClick={() => setSelectedTab("overView")}
                  tabSelectdBtn={selectedTab === "overView"}
                  textBtn={selectedTab !== "overView"}
                  color={AppColors.grayBtn2}
                />
                <CustomButton
                  text="Patient Workbook"
                  onClick={() => setSelectedTab("patientWorkbook")}
                  tabSelectdBtn={selectedTab === "patientWorkbook"}
                  textBtn={selectedTab !== "patientWorkbook"}
                  color={AppColors.grayBtn2}
                />
                <CustomButton
                  text="Billing"
                  onClick={() => setSelectedTab("billing")}
                  tabSelectdBtn={selectedTab === "billing"}
                  textBtn={selectedTab !== "billing"}
                  color={AppColors.grayBtn2}
                />
              </div>
            </Grid>
            {/* <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                <CustomButton
                  text="History"
                  onClick={() => setSelectedTab("history")}
                  tabSelectdBtn={selectedTab === "history"}
                  textBtn={selectedTab !== "history"}
                  color={AppColors.grayBtn2}
                />
              </Grid> */}
          </Grid>
        </Grid>
        {selectedTab === "overView" ? (
          <Overview
            getPetData={getPetData}
            getPereventiveData={getPereventiveData}
            appointment={appointment}
            title={title}
          />
        ) : null}
        {selectedTab === "patientWorkbook" ? <PatientWorkbook appointment={appointment}
        /> : null}
        {selectedTab === "billing" ? <Billing bill={bill} /> : null}
      </Grid>
    </CommonClinicPetDetails>
  );
};

export default ClinicPetDetails;
