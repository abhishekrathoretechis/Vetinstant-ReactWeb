import { Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import CustomButton from "../../../components/CustomButton";
import CustomCard from "../../../components/CustomCard/CustomCard";
import Checkbox from "../../../components/CustomCheckbox";
import CustomModal from "../../../components/CustomModal/CustomModal";
import CustomTextField from "../../../components/CustomTextField";
import SearchRow from "../../../components/SearchRow/SearchRow";
import TopBar from "../../../components/TopBar/TopBar";
import Header from "../../../layouts/header";
import { getDoctorsByClinicId } from "../../../redux/reducers/clinicSlice";
import {
  updateVetBlockStatus,
  updateVetFee,
} from "../../../redux/reducers/vetSlice";

const searchTypeList = [
  { name: "Clinic Name", value: "name" },
  { name: "Location", value: "location" },
];

const initialUpdateValue = { virEntryFee: "", phyEntryFee: "" };
const initialUpdateError = { virEntryFee: false, phyEntryFee: false };

const ClinicDetails = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const navigate = useNavigate();
  const clinicId = params?.clinicId;
  const clinic = useSelector((state) => state.clinic.doctors);
  const doctors = clinic?.doctors;
  const [isTableView, setTableView] = useState(true);
  const [isCardView, setCardView] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [searchTypeValue, setSearchTypeValue] = useState("");
  const [selectedVet, setSelectedVet] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [updateEnabled, setUpdateEnabled] = useState(initialUpdateError);
  const [updateValue, setUpdateValue] = useState(initialUpdateValue);
  const [updateErrors, setUpdateErrors] = useState(initialUpdateError);
  const [updateHelps, setUpdateHelps] = useState(initialUpdateValue);

  useEffect(() => {
    if (clinicId) dispatch(getDoctorsByClinicId(clinicId));
  }, []);

  useEffect(() => {
    if (!selectedVet) return;
    const reqEnable = {};
    const reqVal = {};
    selectedVet?.appointmentType?.forEach((type) => {
      if (type === "Virtual") reqEnable.virEntryFee = true;
      if (type === "Physical") reqEnable.phyEntryFee = true;
    });
    setUpdateEnabled({ ...updateEnabled, ...reqEnable });
    if (selectedVet?.fee) reqVal.virEntryFee = selectedVet?.fee;
    if (selectedVet?.visitFee) reqVal.phyEntryFee = selectedVet?.visitFee;
    setUpdateValue({ ...updateValue, ...reqVal });
    setModalVisible(!modalVisible);
  }, [selectedVet]);

  const handleBackBtn = () => {
    return navigate(-1);
  };

  const handleMangeSlot = (vet) => {
    navigate(`/vet-details/${vet?.user?._id}`, {
      state: { vet, clinicName: clinic?.name, activeTab: "Availability" },
    });
  };

  const handleCardClick = (vet) => {
    navigate(`/vet-details/${vet?.user?._id}`, {
      state: { vet, clinicName: clinic?.name },
    });
  };

  const handleModify = (vet) => {
    setSelectedVet(vet);
  };

  const handleChangeSwitch = async (e, vet) => {
    const apiRes = await dispatch(
      updateVetBlockStatus({
        vetId: vet?.user?._id,
        data: { block: !vet?.user?.block },
      })
    );
    if (apiRes?.payload) {
      if (clinicId) dispatch(getDoctorsByClinicId(clinicId));
    }
  };

  const handleCardTableView = () => {
    setTableView(!isTableView);
    setCardView(!isCardView);
  };

  const handleSearch = () => {
    const url = `${searchValue?.length > 0 ? `?search=${searchValue}` : ""}${
      searchTypeValue
        ? `${searchValue?.length > 0 ? "&" : "?"}type=${searchTypeValue}`
        : ""
    }`;
    // dispatch(getClinicPayments(url));
  };

  const handleResetBtn = () => {
    setSearchTypeValue(null);
    setSearchValue("");
    dispatch(getDoctorsByClinicId(clinicId));
  };

  const modelOpen = () => {
    handleReset();
    setModalVisible(!modalVisible);
  };

  const handleReset = () => {
    setSelectedVet(null);
    setUpdateEnabled(initialUpdateError);
    setUpdateValue(initialUpdateValue);
    setUpdateHelps(initialUpdateValue);
    setUpdateErrors(initialUpdateError);
  };

  const handleUpdate = async () => {
    const reqObj = {};
    if (updateEnabled?.virEntryFee) reqObj.fee = updateValue?.virEntryFee;
    if (updateEnabled?.phyEntryFee) reqObj.visitFee = updateValue?.phyEntryFee;
    const apiRes = await dispatch(
      updateVetFee({ data: reqObj, vetId: selectedVet?.user?._id })
    );
    if (apiRes?.payload) {
      dispatch(getDoctorsByClinicId(clinicId));
      setModalVisible(false);
      handleReset();
    }
  };

  return (
    <>
      <Header name="Vetinstant" />
      <TopBar
        name={
          clinic?.name
            ? `${clinic?.name ?? ""}, ${clinic?.location?.name ?? ""}`
            : ""
        }
        backBtn={true}
        onClickBackBtn={handleBackBtn}
        adminContact={clinic?.contact}
        contactNumber={clinic?.contact}
        rightVerBtnShow={false}
      />
      <SearchRow
        leftBtnTxt="Reset"
        rightBtnTxt="Search"
        tableView={isTableView}
        cardView={isCardView}
        onClickCardView={handleCardTableView}
        onClickTableView={handleCardTableView}
        onSerchChange={(e) => setSearchValue(e.target.value)}
        searchValue={searchValue}
        searchTypeList={searchTypeList}
        searchTypeValue={searchTypeValue}
        handleChangeSearchValue={(e) => setSearchTypeValue(e.target.value)}
        onClickBlueBtn={handleSearch}
        onClickRedBtn={handleResetBtn}
      />
      {doctors?.length > 0 ? (
        <CustomCard
          small
          list={doctors}
          onManageSlotClick={handleMangeSlot}
          onModifyClick={handleModify}
          onChangeSwitch={handleChangeSwitch}
          onCardClick={handleCardClick}
        />
      ) : (
        <div className="no-record">No doctors found</div>
      )}
      <CustomModal
        open={modalVisible}
        onClose={modelOpen}
        header={`${selectedVet?._id ? "Modify" : "Create Vet"}`}
        headerCenter
        modal
        modalWidth={selectedVet?._id ? 30 : 50}
      >
        <Grid container spacing={2} sx={{ p: 3 }}>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <Typography>Consultation Type</Typography>
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={updateEnabled?.virEntryFee ? 6 : 12}
            lg={updateEnabled?.virEntryFee ? 6 : 12}
            xl={updateEnabled?.virEntryFee ? 6 : 12}
          >
            <Checkbox
              label="Virtual"
              checked={updateEnabled?.virEntryFee}
              onChange={() =>
                setUpdateEnabled({
                  ...updateEnabled,
                  virEntryFee: !updateEnabled?.virEntryFee,
                })
              }
            />
          </Grid>
          {updateEnabled?.virEntryFee ? (
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <CustomTextField
                label="Entry Fee"
                placeholder="Entree Fee"
                name="virEntryFee"
                fullWidth
                handleChange={(e) =>
                  setUpdateValue({
                    ...updateValue,
                    virEntryFee: e.target.value,
                  })
                }
                value={updateValue?.virEntryFee}
                helperText={updateHelps?.virEntryFee}
                error={updateErrors?.virEntryFee}
                type="number"
              />
            </Grid>
          ) : null}
          <Grid
            item
            xs={12}
            sm={12}
            md={updateEnabled?.phyEntryFee ? 6 : 12}
            lg={updateEnabled?.phyEntryFee ? 6 : 12}
            xl={updateEnabled?.phyEntryFee ? 6 : 12}
          >
            <Checkbox
              label="Physical"
              checked={updateEnabled?.phyEntryFee}
              onChange={() =>
                setUpdateEnabled({
                  ...updateEnabled,
                  phyEntryFee: !updateEnabled?.phyEntryFee,
                })
              }
            />
          </Grid>
          {updateEnabled?.phyEntryFee ? (
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <CustomTextField
                label="Entry Fee"
                placeholder="Entree Fee"
                name="phyEntryFee"
                fullWidth
                handleChange={(e) =>
                  setUpdateValue({
                    ...updateValue,
                    phyEntryFee: e.target.value,
                  })
                }
                value={updateValue?.phyEntryFee}
                helperText={updateHelps?.phyEntryFee}
                error={updateErrors?.erphyEntryFeeror}
                type="number"
              />
            </Grid>
          ) : null}
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <div className="clinic-mod-btn-pos">
              <div>
                <CustomButton text="Save" onClick={handleUpdate} />
              </div>
            </div>
          </Grid>
        </Grid>
      </CustomModal>
    </>
  );
};

export default ClinicDetails;
