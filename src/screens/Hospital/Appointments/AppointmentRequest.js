import React, { useState } from "react";
import TopBar from "../../../components/TopBar/TopBar";
import { Grid, Toolbar } from "@mui/material";
import CustomTextField from "../../../components/CustomTextField";
import CustomSelect from "../../../components/Select/Select";
import CustomTable from "../../../components/CustomTable";
import CustomButton from "../../../components/CustomButton";
import img1 from '../../../assets/images/png/profilepic.png'
const tableHeaders = [
  "petname",
  "gender",
  "breed",
  "username",
  "vetname",
  "appointmentdatetime",
  "button",
];
const AppointmentRequest = () => {
  const [searchTypeValue, setSearchTypeValue] = useState("");
  const [tablePets, setTablePets] = useState([
    {
      petname: "Ranger",
      petImage:img1,
      gender: "male",
      breed: "Great Dane",
      username: "Karan",
      vetname: "Dr. Rahul",
      appointmentdatetime: "23 May, 2024, 12:00",
      button: (
        <div className="flex-row gap10">
          <CustomButton smallBtn text={"Approve"} />
          <CustomButton smallBtn redBtn text={"Decline"} />
        </div>
      ),
    },
    {
      petname: "Maggie",
      petImage:img1,
      gender: "female",
      breed: "Golden Retriever",
      username: "Anushka",
      vetname: "Dr. Aditya",
      appointmentdatetime: "24 May, 2024, 11:00",
      button: (
        <div className="flex-row gap10">
          <CustomButton smallBtn text={"Approve"} />
          <CustomButton smallBtn redBtn text={"Decline"} />
        </div>
      ),
    },
  ]);

  return (
    <div>
      <TopBar>
        <Toolbar variant="regular">
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <div className="flex-row">
              <div className="top-row-cen-con w100Per">
                <Grid item xs={4} sm={5} md={5} lg={5} xl={5}>
                  <CustomTextField
                    placeholder="Search"
                    name="name"
                    fullWidth
                    handleChange={(e) => setSearchTypeValue(e.target.value)}
                    value={searchTypeValue}
                    search
                    backgroundColor="#E3CECE52"
                  />
                </Grid>

                <div className="top-row-right-con w15Per topBar-select">
                  <CustomSelect
                    list={[
                      { name: "All", value: "all" },
                      { name: "Recent", value: "recent" },
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
      </TopBar>

      <CustomTable columns={tableHeaders} datas={tablePets} grey={true} />
    </div>
  );
};

export default AppointmentRequest;
