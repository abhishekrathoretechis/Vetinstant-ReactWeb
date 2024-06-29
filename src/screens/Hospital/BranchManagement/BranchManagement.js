import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CallIcon from "@mui/icons-material/Call";
import EditIcon from "@mui/icons-material/Edit";
import LockResetIcon from "@mui/icons-material/LockReset";
import MailIcon from "@mui/icons-material/Mail";
import SettingsIcon from "@mui/icons-material/Settings";
import { Grid, Typography } from "@mui/material";
import React, { useState } from "react";
import Table from "../../../components/CustomTable";
import { AppColors } from "../../../util/AppColors";
import BranchManagementMain from "./BranchManagementMain";
import CustomButton from "../../../components/CustomButton";
import CustomModal from "../../../components/CustomModal/CustomModal";
import Select from "../../../components/Select/Select";
import Checkbox from "../../../components/CustomCheckbox";
import CustomTextField from "../../../components/CustomTextField";
import { LocationList, clinicFilterList } from "../../../util/arrayList";

const tableHeaders = [
  "logo",
  "branchLocation",
  "authorisedPerson",
  "email",
  "phone",
  "pay",
];

const branch = [
  {
    logo: (
      <div>
        <img src={require("../../../assets/images/png/adyar.png")} alt="" />
      </div>
    ),
    branchLocation: "Adyar",
    authorisedPerson: "Shiva Kumar",
    email: "apollohospitals@apollo.com",
    phone: "+91 85025 16466",
    pay: (
      <div>
        <img src={require("../../../assets/images/png/editNew.png")} alt="" />
      </div>
    ),
  },
  {
    logo: (
      <div>
        <img src={require("../../../assets/images/png/guindy.png")} alt="" />
      </div>
    ),
    branchLocation: "Guindy",
    authorisedPerson: "Rahul Raj",
    email: "apollohospitals@apollo.com",
    phone: "+91 91025 16466",
    pay: (
      <div>
        <img src={require("../../../assets/images/png/editNew.png")} alt="" />
      </div>
    ),
  },
];

function BranchManagement() {
  const [payModalVisible, setPayModalVisible] = useState(false);
  const [payModalVisibleAdd, setPayModalVisibleAdd] = useState(false);
  const [isAutoGenPass, setAutoGenPass] = useState(false);
  const [location, setLocation] = useState("");
  const [authorisedPerson, setAuthorisedPerson] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");
  const [modalData, setModalData] = useState();
  console.log("modalData", modalData);

  const createModalOpen = (li) => {
    setModalData(li);
    setLocation(li?.branchLocation || "");
    setAuthorisedPerson(li?.authorisedPerson || "");
    setContactNumber(li?.phone || "");
    setEmail(li?.email || "");
    setPayModalVisible(true);
  };
  const createModalOpenAdd = (li) => {
    // setModalDataAdd(li);
    setPayModalVisibleAdd(!payModalVisibleAdd);
  };
  return (
    <BranchManagementMain active="branchManagement">
      <Grid container>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <Table
            columns={tableHeaders}
            datas={branch}
            onClickPay={(li) => createModalOpen(li)}
            //   onClickIcon={(li) => openModalWithInvoiceData(li)}
            //   onClickPay={(bil) => {
            //     const bill = bil;
            //     delete bill?.pay;
            //     navigate("/history", { state: { bill } });
            //   }}
            //   page={page}
            //   rowsPerPage={rowsPerPage}
            grey={true}
          />
        </Grid>
        <div
          style={{
            width: "80vw",
            display: "flex",
            justifyContent: "flex-end",
            marginRight: "20px",
            marginTop: "20px",
          }}
        >
          <Grid item xs={1} sm={1} md={1} lg={1} xl={1}>
            <CustomButton
              text={"Add"}
              // redBtn={true}
              smallBtn={true}
              onClick={() => setPayModalVisibleAdd(true)}
            />
          </Grid>
        </div>
      </Grid>
      <CustomModal
        open={payModalVisible}
        onClose={createModalOpen}
        header="Edit Branch"
        rightModal
        modalWidth={30}
      >
        <Grid container spacing={2} className="ph20">
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <div className="txt-semi-bold fs14 black">Profile Picture</div>
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={12}
            xl={12}
            className="top-row-cen-con mt10"
          >
            <img src={require("../../../assets/images/png/imageupload.png")} />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <div className="txt-semi-bold fs14 black">Location</div>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <Select
              list={LocationList}
              value={location}
              handleChange={(e) => setLocation(e?.target?.value)}
              name="paymentMode"
              // label={"Payment Mode"}
              select
            // error={!!errors.breed}
            // helperText={errors.breed}
            />
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={6}
            lg={6}
            xl={6}

          >
            <div className="txt-semi-bold fs14 black">Authorised Person</div>
            <CustomTextField
              // label={"Parent Name"}
              // placeholder={'Name'}
              name="Parent Name"
              fullWidth
              handleChange={(e) => setAuthorisedPerson(e.target.value)}
              value={authorisedPerson}
              // error={!!errors.parentName}
              // helperText={errors.parentName}
              labelTop
            />
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={6}
            lg={6}
            xl={6}

          >
            <div className="txt-semi-bold fs14 black">Contact Number</div>
            <CustomTextField
              // label={"Contact Number"}
              // placeholder={nameExpan?.["password"]}
              name="Contact Number"
              fullWidth
              handleChange={(e) => setContactNumber(e.target.value)}
              value={contactNumber}
              // error={!!errors.userMobile}
              // helperText={errors.userMobile}
              labelTop
            />
          </Grid>

          <Grid
            item
            xs={12}
            sm={12}
            md={6}
            lg={6}
            xl={6}

          >
            <div className="txt-semi-bold fs14 black">Email</div>
            <CustomTextField
              // label={"Contact Number"}
              // placeholder={nameExpan?.["password"]}
              name="Contact Number"
              fullWidth
              handleChange={(e) => setEmail(e.target.value)}
              value={email}
              // error={!!errors.userMobile}
              // helperText={errors.userMobile}
              labelTop
            />
          </Grid>
        </Grid>

        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          lg={12}
          xl={12}
          style={{ marginLeft: "300px", marginTop: "30px" }}
        >
          <div style={{ width: "20px" }}>
            <CustomButton
              text={"Save"}
              // redBtn={true}
              smallBtn={true}
            // onClick={onClickRedBtn}
            />
          </div>
        </Grid>
      </CustomModal>
      <CustomModal
        open={payModalVisibleAdd}
        onClose={createModalOpenAdd}
        header="Add Branch"
        rightModal
        modalWidth={30}
      >
        <Grid container spacing={2} className="ph20">
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <div className="txt-semi-bold fs14 black">Profile Picture</div>
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={12}
            xl={12}
            className="top-row-cen-con mt10"
          >
            <img src={require("../../../assets/images/png/imageupload.png")} />
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <div className="txt-semi-bold fs14 black">Location</div>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <Select
              list={clinicFilterList}
              value={location}
              handleChange={(e) => setLocation(e?.target?.value)}
              name="paymentMode"
              // label={"Payment Mode"}
              select
            // error={!!errors.breed}
            // helperText={errors.breed}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <div className="txt-semi-bold fs14 black">Authorised Person</div>
            <CustomTextField
              // label={"Parent Name"}
              // placeholder={'Name'}
              name="Parent Name"
              fullWidth
              // handleChange={(e) => handleInputChange(e, "parentName")}
              // value={parentName}
              // error={!!errors.parentName}
              // helperText={errors.parentName}
              labelTop
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <div className="txt-semi-bold fs14 black">Contact Number</div>
            <CustomTextField
              // label={"Contact Number"}
              // placeholder={nameExpan?.["password"]}
              name="Contact Number"
              fullWidth
              // handleChange={(e) => handleInputChange(e, "userMobile")}
              // value={userMobile}
              // error={!!errors.userMobile}
              // helperText={errors.userMobile}
              labelTop
            />
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <div className="txt-semi-bold fs14 black">Email</div>
            <CustomTextField
              // label={"Contact Number"}
              // placeholder={nameExpan?.["password"]}
              name="Contact Number"
              fullWidth
              // handleChange={(e) => handleInputChange(e, "userMobile")}
              // value={userMobile}
              // error={!!errors.userMobile}
              // helperText={errors.userMobile}
              labelTop
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <div className="txt-semi-bold fs14 black">Password</div>
            <CustomTextField
              // label={"Contact Number"}
              // placeholder={nameExpan?.["password"]}
              name="Contact Number"
              fullWidth
              // handleChange={(e) => handleInputChange(e, "userMobile")}
              // value={userMobile}
              // error={!!errors.userMobile}
              // helperText={errors.userMobile}
              labelTop
              password
            />
          </Grid>
        </Grid>

        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          lg={12}
          xl={12}
          className="ph20 mt20"
        >
          <Checkbox
            label="Auto-Generate Password"
            checked={isAutoGenPass}
            onChange={() => setAutoGenPass(!isAutoGenPass)}
          />
        </Grid>

        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          lg={12}
          xl={12}
          style={{ marginLeft: "300px" }}
        >
          <div style={{ width: "20px" }}>
            <CustomButton
              text={"Register"}
              // redBtn={true}
              smallBtn={true}
            // onClick={onClickRedBtn}
            />
          </div>
        </Grid>
      </CustomModal>
    </BranchManagementMain>
  );
}

export default BranchManagement;
