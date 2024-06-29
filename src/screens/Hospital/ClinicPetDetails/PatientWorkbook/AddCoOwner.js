import React from "react";
import CustomModal from "../../../../components/CustomModal/CustomModal";
import { Grid } from "@mui/material";
import CustomTextField from "../../../../components/CustomTextField";
import CustomButton from "../../../../components/CustomButton";

const AddCoOwner = ({ modalVisible, setModalBookVisible }) => {
  const handleModClose = () => {
    setModalBookVisible(false);
  };
  return (
    <div>
      <CustomModal
        open={modalVisible}
        onClose={handleModClose}
        header="CO-OWNER Details"
        rightModal
        modalWidth={30}
      >
        <div className=" ph20">
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} className="mb20">
          <div className="text-bold fs14 mb5 ">Name</div>

          <CustomTextField
            name="name"
            fullWidth
            placeholder={"Name"}
            backgroundColor={"##E2E2E2"}
          />
        </Grid>
        <div className="flex-row-between">

        <Grid item xs={5.5} sm={5.5} md={5.5} lg={5.5} xl={5.5} className="mb20">
          <div className="text-bold fs14 mb5 ">Email</div>

          <CustomTextField
            name="name"
            fullWidth
            placeholder={"Name"}
            backgroundColor={"##E2E2E2"}
          />
        </Grid>
        <Grid item xs={5.5} sm={5.5} md={5.5} lg={5.5} xl={5.5} className="mb20">
          <div className="text-bold fs14 mb5 ">Contact Number</div>

          <CustomTextField
            name="name"
            fullWidth
            placeholder={"Name"}
            backgroundColor={"##E2E2E2"}
          />
        </Grid>
        </div>

        <div className="flex1-end mt20">
        <Grid item xs={6} sm={6} md={3} lg={3} xl={3}>
          <CustomButton text="Save"  />
        </Grid>
      </div>

      </div>
      </CustomModal>
    </div>
  );
};

export default AddCoOwner;
