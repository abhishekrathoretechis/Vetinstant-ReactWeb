import {
  Box,
  Card,
  CardMedia,
  Container,
  Grid,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import CustomButton from "../../../../components/CustomButton";
import CustomModal from "../../../../components/CustomModal/CustomModal";
import CustomTextField from "../../../../components/CustomTextField";
import Select from "../../../../components/Select/Select";
import {
  createPrescription,
  getPetPrescriptions,
} from "../../../../redux/reducers/petSlice";
import { AppColors } from "../../../../util/AppColors";
import {
  MedicalSuppliments,
  MedicationList,
  frequencyList,
} from "../../../../util/arrayList";

const initialErrors = {
  type: false,
  name: false,
  dosage: false,
  remarks: false,
  duration: false,
  durationType: false,
  quantity: false,
};

const initialHelpers = {
  type: "",
  name: "",
  dosage: "",
  remarks: "",
  duration: "",
  durationType: "",
  quantity: "",
};

const tableNameExpan = {
  type: "Type",
  name: "Name",
  dosage: "Dosage",
  duration: "Duration",
  frequency: "Frequency",
  meal: "",
};

const tableHeaders = [
  "type",
  "name",
  "dosage",
  "duration",
  "frequency",
  "meal",
];
const initialPres = {
  type: "medications",
  name: "",
  dosage: "1",
  duration: "1",
  frequency: "1-1-1",
  meal: "afterMeal",
};

const Prescription = ({ setModVisible, modVisible }) => {
  const location = useLocation();
  const dispatch = useDispatch();
  const { appointment } = location.state || {};
  const [prescriptionErrors, setPrescriptionError] = useState(initialErrors);
  const [prescriptionHelpers, setPrescriptionHelpers] =
    useState(initialHelpers);
  const [prescriptionList, setPrescriptionList] = useState([
    { ...initialPres, i: 0 },
  ]);
  const [remark, setRemark] = useState("");
  const [prevModVisible, setPrevModVisible] = useState(false);
  const [isPreUploaded, setPreUploaded] = useState(false);
  const petDet = useSelector((state) => state?.pet?.petDetails?.data);
  const apntmnt = petDet?.appointment;
  const [viewPresValue, setViewPresValue] = useState(null);
  const prescriptions = useSelector((state) => state?.pet?.prescriptions);
  const [searchValue, setSearchValue] = useState("");
  const metHisDet = useSelector(
    (state) => state?.pet?.petDetails?.data?.medicalHistory
  );
  const [page, setPage] = useState(1);
  const itemsPerLoad = 3;
  const defaultUrl = `?page=1&itemSize=${itemsPerLoad}`;
  const user = localStorage.getItem("user");
  const profile = JSON.parse(user);

  useEffect(() => {
    dispatch(
      getPetPrescriptions({
        petId: appointment?.appoinment?.petId,
        url: defaultUrl,
      })
    );
  }, []);

  const handleAddPrescription = async () => {
    const prescription = prescriptionList?.map((pre) => {
      const freq = pre?.frequency?.split("-");
      return {
        type: pre?.type,
        name: pre?.name,
        does: pre?.dosage,
        duration: pre?.duration,
        meal: pre?.meal,
        morning: freq?.[0] === "1" ? true : false,
        afternoon: freq?.[1] === "1" ? true : false,
        night: freq?.[2] === "1" ? true : false,
      };
    });
    const data = {
      status: "Pending",
      remark,
      prescription,
      issue: metHisDet?.[0]?.problemType ?? "",
    };
    dispatch(
      createPrescription({
        appointmentId: appointment?.appoinment?.appoimentId,
        data,
      })
    ).then((res) => {
      if (res?.payload?.status === 200) {
        dispatch(
          getPetPrescriptions({
            petId: appointment?.appoinment?.petId,
            url: defaultUrl,
          })
        );
        setPage(1);
        setPreUploaded(true);
      }
    });
  };

  const handleAddNewPres = () => {
    setPrescriptionList([
      ...prescriptionList,
      { ...initialPres, i: prescriptionList?.length },
    ]);
  };

  const handleChangePresValue = (name, value, ind) => {
    const reqList = prescriptionList?.map((pl, i) => {
      if (i === ind) {
        return { ...pl, [name]: value };
      }
      return pl;
    });
    setPrescriptionList(reqList);
  };

  const handlePreModClose = () => {
    setViewPresValue(null);
    setPrevModVisible(false);
  };

  const getPresItems = (type) => {
    const filteredList = viewPresValue
      ? viewPresValue?.prescriptionDetails?.filter((pd) => pd?.type === type)
      : prescriptionList?.filter((pl) => pl?.type === type);

    return filteredList?.length > 0 ? (
      filteredList?.map((li, i) => {
        return (
          <div className="gray-back-con">
            <div className="flex-row">
              <div className="w85Per">
                <div className="flex-row">
                  <div className="font-bold fs12 black">{li?.name}</div>
                  <div className="flex-row flex-center ml10">
                    <div className="gray-dot" />
                    <div className="txt-regular fs12 black4 ml5">
                      {li?.dosage ?? li?.does}{" "}
                      {type === "medications" ? "tablet" : "spoon"}
                    </div>
                  </div>
                  <div className="flex-row flex-center ml10">
                    <div className="gray-dot" />
                    <div className="txt-regular fs12 black4 ml5">
                      {li?.duration} days
                    </div>
                  </div>
                  <div className="flex-row flex-center ml10">
                    <div className="gray-dot" />
                    <div className="txt-regular fs12 black4 ml5">
                      {li?.meal === "afterMeal" ? "After Meal" : "Before Meal"}
                    </div>
                  </div>
                </div>
              </div>
              <div className="blue-back-con fs12 font-medium">
                {viewPresValue
                  ? `${li?.morning ? "1" : "0"}-${li?.afternoon ? "1" : "0"}-${
                      li?.night ? "1" : "0"
                    }`
                  : li?.frequency}
              </div>
            </div>
          </div>
        );
      })
    ) : (
      <div className="no-rec">No records available</div>
    );
  };

  const handleViewPres = (presc) => {
    setViewPresValue(presc);
    setPrevModVisible(true);
  };

  const handleChangePage = (e, selectedPage) => {
    dispatch(
      getPetPrescriptions({
        petId: appointment?.appoinment?.petId,
        url: `?page=${selectedPage}&itemSize=${itemsPerLoad}`,
      })
    );
    setPage(selectedPage);
  };

  return (
    <>
      <div className="scroll-80vh w100Per">
        <Grid container className="back-white">
          {!modVisible && apntmnt?.prescriptionStatus !== "Y" ? (
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <div className="mt20 flex-center">
                <div className="no-rec">
                  No records yet. Create a new prescription now
                </div>
              </div>
              <div className="flex-center mb20">
                <div className="w15Per">
                  <CustomButton
                    text="Create"
                    onClick={() => setModVisible(true)}
                    smallBtn
                  />
                </div>
              </div>
            </Grid>
          ) : apntmnt?.prescriptionStatus !== "Y" ? (
            <Container maxWidth="xl">
              <Box className="pv20">
                <TableContainer>
                  <Table sx={{ minWidth: 200 }} aria-labelledby="tableTitle">
                    <TableHead>
                      <TableRow>
                        {tableHeaders?.map((hl, i) => (
                          <TableCell
                            key={i}
                            style={{
                              backgroundColor: AppColors.tableGrayHead,
                              color: AppColors.white,
                              textAlign: "left",
                            }}
                            sortDirection={false}
                            className={`table-header-text ${
                              hl === "name" ? "w30Per" : "w15Per"
                            }`}
                          >
                            {tableNameExpan?.[hl]}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {prescriptionList?.map((pr, ind) => (
                        <TableRow tabIndex={-1} key={ind}>
                          {tableHeaders?.map((th, index) => (
                            <TableCell key={index + th + "tr"} component="th">
                              {th === "type" ? (
                                <Select
                                  list={[
                                    {
                                      name: "Medications",
                                      value: "medications",
                                    },
                                    {
                                      name: "Supplements",
                                      value: "supplements",
                                    },
                                  ]}
                                  value={pr?.type}
                                  select
                                  handleChange={(e) => {
                                    handleChangePresValue(
                                      "type",
                                      e?.target?.value,
                                      ind
                                    );
                                  }}
                                  error={prescriptionErrors?.type}
                                  helperText={prescriptionHelpers?.type}
                                />
                              ) : th === "name" ? (
                                <Select
                                  list={
                                    pr?.type === "supplements"
                                      ? MedicalSuppliments
                                      : pr?.type === "medications"
                                      ? MedicationList
                                      : []
                                  }
                                  value={pr?.name}
                                  newSelect
                                  handleChange={(e) => {
                                    handleChangePresValue("name", e, ind);
                                  }}
                                  error={prescriptionErrors?.name}
                                  helperText={prescriptionHelpers?.name}
                                />
                              ) : th === "dosage" ? (
                                <CustomTextField
                                  fullWidth
                                  handleChange={(e) =>
                                    handleChangePresValue(
                                      "dosage",
                                      e?.target?.value,
                                      ind
                                    )
                                  }
                                  value={pr?.dosage}
                                  error={prescriptionErrors?.dosage}
                                  helperText={prescriptionHelpers?.dosage}
                                  endIcon
                                  inputIcon={
                                    pr?.type === "supplements"
                                      ? "spoon"
                                      : "tablet"
                                  }
                                />
                              ) : th === "duration" ? (
                                <CustomTextField
                                  fullWidth
                                  handleChange={(e) =>
                                    handleChangePresValue(
                                      "duration",
                                      e?.target?.value,
                                      ind
                                    )
                                  }
                                  value={pr?.duration}
                                  error={prescriptionErrors?.dosage}
                                  helperText={prescriptionHelpers?.dosage}
                                  endIcon
                                  inputIcon="days"
                                />
                              ) : th === "frequency" ? (
                                <Select
                                  list={frequencyList}
                                  value={pr?.frequency}
                                  select
                                  handleChange={(e) =>
                                    handleChangePresValue(
                                      "frequency",
                                      e?.target?.value,
                                      ind
                                    )
                                  }
                                  error={prescriptionErrors?.name}
                                  helperText={prescriptionHelpers?.name}
                                />
                              ) : (
                                <Select
                                  list={[
                                    {
                                      name: "Before Meal",
                                      value: "beforeMeal",
                                    },
                                    {
                                      name: "After Meal",
                                      value: "afterMeal",
                                    },
                                  ]}
                                  value={pr?.meal}
                                  select
                                  handleChange={(e) => {
                                    handleChangePresValue(
                                      "meal",
                                      e?.target?.value,
                                      ind
                                    );
                                  }}
                                  error={prescriptionErrors?.type}
                                  helperText={prescriptionHelpers?.type}
                                />
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
              {!isPreUploaded ? (
                <div className="flex-end">
                  <div className="w15Per">
                    <CustomButton
                      text="Add New"
                      smallBtn
                      onClick={handleAddNewPres}
                    />
                  </div>
                </div>
              ) : null}
              <div className="mv20">
                <CustomTextField
                  fullWidth
                  multiline
                  placeholder="Advice"
                  rows={3}
                  handleChange={(e) => setRemark(e?.target?.value)}
                  value={remark}
                />
              </div>
              <div className="flex-end">
                <div className="w15Per">
                  <CustomButton
                    text="Preview"
                    smallBtn
                    onClick={() => setPrevModVisible(true)}
                  />
                </div>
                {!isPreUploaded ? (
                  <div className="w15Per ml15">
                    <CustomButton
                      text="Submit"
                      smallBtn
                      onClick={handleAddPrescription}
                    />
                  </div>
                ) : null}
              </div>
            </Container>
          ) : null}
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12} className="ph20">
            <div className="box-hor-split mv20" />
            <div className="font-bold fs14 mv20 blue-color">
              Prescription History
            </div>
            <div className="flex-center">
              <div className="w75Per">
                <CustomTextField
                  search
                  placeholder="Search"
                  fullWidth
                  backgroundColor="#E3CECE52"
                  value={searchValue}
                  handleChange={(e) => setSearchValue(e?.target?.value)}
                />
              </div>
            </div>
            <div className="pb100 w100Per">
              {prescriptions?.data?.filter((pr) =>
                pr?.doctorName
                  ?.toLowerCase()
                  ?.includes(searchValue.toLowerCase())
              )?.length > 0 ? (
                prescriptions?.data
                  ?.filter((pr) =>
                    pr?.doctorName
                      ?.toLowerCase()
                      ?.includes(searchValue.toLowerCase())
                  )
                  ?.map((pres, ind) => (
                    <div className="flex-row mv10" key={ind + "pres"}>
                      <div className="w20Per">
                        <div className="flex-center h110">
                          <div className="flex-column flex-center">
                            <Typography className="black5 fs10 txt-regular">
                              {moment(new Date(pres?.createdDate)).format(
                                "DD MMM"
                              )}
                            </Typography>
                            <Typography className="black5 fs10 txt-regular mt10">
                              {moment(new Date(pres?.createdDate)).format(
                                "YYYY"
                              )}
                            </Typography>
                          </div>
                        </div>
                      </div>
                      <div className="w80Per">
                        <Card
                          sx={{
                            borderRadius: 1,
                            paddingLeft: 0,
                            paddingRight: 0,
                            paddingTop: 1,
                            paddingBottom: 1,
                            marginTop: 2,
                          }}
                          className="cursor inner-cards h110"
                        >
                          <Grid container>
                            <Grid
                              item
                              xs={12}
                              sm={12}
                              md={12}
                              lg={12}
                              xl={12}
                              className="mt10"
                            >
                              <div className="card-top-color card-top-blue-color" />
                            </Grid>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                              <div className="ph10">
                                <div className="flex-row">
                                  <div className="w90Per">
                                    <div className="flex-start">
                                      <div className="flex-column w10Per">
                                        <div className="h50">
                                          <CardMedia
                                            image={apntmnt?.doctorImage}
                                            className="img-h40"
                                          />
                                        </div>
                                        <div className="card-light-blue-back card-time flex-center">
                                          <Typography className="txt-regular card-blue2 fs12">
                                            {pres?.appoimentTime ??
                                              apntmnt?.appoimentTime}
                                          </Typography>
                                        </div>
                                      </div>
                                      <div className="flex-column ml15 jus-con-spa-bet">
                                        <div className="h50">
                                          <Typography className="font-bold fs14 black capitalize">
                                            Dr. {apntmnt?.doctorName}
                                          </Typography>
                                          <Typography className="gray7 fs14 font-medium mt5 capitalize">
                                            {pres?.issue}
                                            {/* Ear Infection, Kennel Cough */}
                                          </Typography>
                                        </div>
                                        <div className="card-con-blue-back card-time flex-center w100Px">
                                          <Typography className="txt-regular white-color fs12">
                                            {apntmnt?.appoinmentType}
                                          </Typography>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="w10Per">
                                    <div className="flex1-center h90">
                                      <CustomButton
                                        text="View"
                                        smallBtn
                                        onClick={() => handleViewPres(pres)}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </Grid>
                          </Grid>
                        </Card>
                      </div>
                    </div>
                  ))
              ) : (
                <div className="no-rec">No records available</div>
              )}
              {prescriptions?.data?.filter((pr) =>
                pr?.doctorName
                  ?.toLowerCase()
                  ?.includes(searchValue.toLowerCase())
              )?.length > 0 ? (
                Math.ceil(prescriptions?.totalRecords / itemsPerLoad) > 1 ? (
                  <div className="flex-end">
                    <Pagination
                      count={Math.ceil(
                        prescriptions?.totalRecords / itemsPerLoad
                      )}
                      variant="outlined"
                      color="primary"
                      page={page}
                      onChange={handleChangePage}
                    />
                  </div>
                ) : null
              ) : null}
            </div>
          </Grid>
        </Grid>
      </div>
      <CustomModal
        open={prevModVisible}
        onClose={handlePreModClose}
        header=""
        modal
        modalWidth={50}
      >
        <div className="scroll-80vh">
          <div className="p5">
            <div className="blue-box-examD">
              <div className="flex-row">
                <div className="w33Per">
                  <div className="flex-column">
                    <div className="flex-row mt10">
                      <div className="font-bold fs14 blue-color">Pet Name:</div>
                      <div className="font-bold fs14 black capitalize ml5">
                        {appointment?.appoinment?.petName}
                      </div>
                    </div>
                    <div className="flex-row mv5">
                      <div className="font-bold fs14 blue-color">Breed:</div>
                      <div className="txt-regular fs14 black capitalize ml5">
                        {appointment?.appoinment?.breed}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w33Per">
                  <div className="flex-column">
                    <div className="flex-row mt10">
                      <div className="font-bold fs14 blue-color">Vet Name:</div>
                      <div className="font-bold fs14 black ml5 capitalize">
                       Dr. {appointment?.appoinment?.doctorName}
                      </div>
                    </div>
                    <div className="flex-row mv5">
                      <div className="font-bold fs14 blue-color">Date:</div>
                      <div className="txt-regular fs14 black ml5">
                        {viewPresValue
                          ? moment(viewPresValue?.createdDate).format(
                              "DD, MMM YYYY"
                            )
                          : moment().format("DD, MMM YYYY")}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w33Per">
                  <div className="flex-end">
                    <img
                      alt=""
                      src={
                        profile?.image ??
                        require("../../../../assets/images/png/applologo.png")
                      }
                      className="img-h50"
                    />
                  </div>
                </div>
              </div>
              <div className="box-hor-split mv10" />
              <div className="font-bold fs14 blue-color mv10">Medications</div>
              {getPresItems("medications")}
              <div className="font-bold fs14 blue-color mv10">Supplements</div>
              {getPresItems("supplements")}
              <div className="font-bold fs14 blue-color mv10">Advice</div>
              <CustomTextField
                fullWidth
                multiline
                placeholder="Advice"
                rows={3}
                value={viewPresValue ? viewPresValue?.remark : remark}
              />
              <div className="flex-row mv20">
                <img
                  src={require("../../../../assets/images/png/qrcodedown.png")}
                  alt=""
                  className="img-h50"
                />
                <div className="blu-back wh50 flex-center">
                  <img
                    src={require("../../../../assets/images/png/VetInstantLogo.png")}
                    alt=""
                    className="img-h40"
                  />
                </div>
                <div className="flex-center">
                  <div className="font-bold fs14 ml20">
                    Scan to download our app
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CustomModal>
    </>
  );
};

export default Prescription;
