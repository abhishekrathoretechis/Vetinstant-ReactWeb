import { Grid, Typography } from "@mui/material";
import CustomModal from "../../../components/CustomModal/CustomModal";
import CustomSwitch from "../../../components/CustomSwitch";
import CustomTextField from "../../../components/CustomTextField";
import CustomButton from "../../../components/CustomButton";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  updateVetFee,
  updateVetFeeConsulatation,
} from "../../../redux/reducers/vetSlice";

const CommonPaymentUpdateModal = ({ open, onClose, vet, onApiSuccess }) => {
  const dispatch = useDispatch();
  const [consultationDetails, setConsultationDetails] = useState([]);
  useEffect(() => {
    if (!vet) return;
    const consultaions = [
      {
        type: "Virtual",
        isSelected: vet?.consulationType?.find((con) => con === "Virtual")
          ? true
          : false,
        amount: vet?.virtualFee ?? 0,
      },
      {
        type: "Physical",
        isSelected: vet?.consulationType?.find((con) => con === "Physical")
          ? true
          : false,
        amount: vet?.physicalFee ?? 0,
      },
      // {
      //   type: "HomeVisit",
      //   isSelected: vet?.consulationType?.find((con) => con === "HomeVisit")
      //     ? true
      //     : false,
      //   amount: vet?.homeVisitFee ?? 0,
      // },
    ];
    setConsultationDetails(consultaions);
  }, [vet]);

  const handleChangeConsultation = (con, name, value) => {
    const reqCons = consultationDetails?.map((c) => {
      if (c.type === con.type) return { ...c, [name]: value };
      return c;
    });
    setConsultationDetails(reqCons);
  };

  const handleUpdateFee = async () => {
    const data = {};
    const selectedConsultationTypes = [];
    consultationDetails?.forEach((con) => {
      if (con?.isSelected === true) {
        if (con?.type === "Virtual") {
          data.virtualFee = parseInt(con?.amount);
          selectedConsultationTypes.push(con?.type);
          data.consulationType = selectedConsultationTypes;
        }
        if (con?.type === "Physical") {
          data.physicalFee = parseInt(con?.amount);
          selectedConsultationTypes.push(con?.type);
          data.consulationType = selectedConsultationTypes;
        }
        // if (con?.type === "HomeVisit") {
        //   data.homeVisitFee = parseInt(con?.amount);
        // }
        // selectedConsultationTypes.push(con?.type);
        // data.consultationType = selectedConsultationTypes;
      }
    });

    const vetId = vet?.doctorId;
    const metaData = { vetId, data: { ...data } };

    try {
      const apiRes = await dispatch(updateVetFeeConsulatation(metaData));
      if (apiRes?.payload) onApiSuccess();
    } catch (error) {
      console.error("Error updating fee:", error);
    }
  };

  return (
    <CustomModal
      open={open}
      onClose={onClose}
      header="Consultation Details"
      rightModal
      modalWidth={30}
    >
      <Grid container spacing={1} className="ph20">
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <Typography className="fw-600 fs14">
            Consultation Type
          </Typography>
        </Grid>
        {consultationDetails?.map((con, i) => {
          const vetConHave = vet?.consulationType?.find((c) => c === con?.type);
          return (
            <Grid
              container
              spacing={1}
              className="mt10 ph20"
              key={con?.type + i}
            >
              <Grid
                item
                xs={4}
                sm={4}
                md={4}
                lg={4}
                xl={4}
                className="flex-start-center"
              >
                <Typography className="font-medium fs14">
                  {con?.type}
                </Typography>
              </Grid>
              <Grid
                item
                xs={4}
                sm={4}
                md={2}
                lg={2}
                xl={2}
                className="flex-start-center"
              >
                <CustomSwitch
                  value={con?.isSelected}
                  onChange={(e) => {
                    handleChangeConsultation(con, "isSelected", e.target.value);
                  }}
                  greenToGray
                // disabled={vetConHave}
                />
              </Grid>
              <Grid
                item
                xs={4}
                sm={4}
                md={6}
                lg={6}
                xl={6}
                className="flex-start-center"
              >
                {/* <CustomTextField
                  name="amount"
                  fullWidth
                  handleChange={(e) =>
                    handleChangeConsultation(con, "amount", e.target.value)
                  }
                  value={con?.amount}
                  startIcon
                  inputIcon="Rs"
                  type="number"
                  disabled={!con?.isSelected}
                /> */}
              </Grid>
            </Grid>
          );
        })}
        <div className="flex1-end mt20">
          <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
            <CustomButton text="Save" onClick={handleUpdateFee} />
          </Grid>
        </div>
      </Grid>
    </CustomModal>
  );
};

export default CommonPaymentUpdateModal;
