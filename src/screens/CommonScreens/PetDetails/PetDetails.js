import { Grid } from "@mui/material";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import CustomButton from "../../../components/CustomButton";
import CustomModal from "../../../components/CustomModal/CustomModal";
import Table from "../../../components/CustomTable";
import CustomTextField from "../../../components/CustomTextField";
import CustomUpload from "../../../components/CustomUpload";
import SearchRow from "../../../components/SearchRow/SearchRow";
import {
  default as CustomSelect,
  default as Select,
} from "../../../components/Select/Select";
import TopBar from "../../../components/TopBar/TopBar";
import Header from "../../../layouts/header";
import { getPetAppointsmentsById } from "../../../redux/reducers/clinicSlice";
import { hideLoader, showLoader } from "../../../redux/reducers/loaderSlice";
import { updatePet } from "../../../redux/reducers/petSlice";
import {
  breedList,
  dateFilterTodayLastWeek,
  genderList,
  paymentSearchTypeList,
  yesNoList,
} from "../../../util/dropList";
import { getAge } from "../../../util/getAge";
import PetMedicalHistoryList from "../PetMedicalHistoryList/PetMedicalHistoryList";
import "./PetDetails.css";

const appointmentTableHeaders = [
  // "appointmentId",
  "userName",
  "vets",
  "dateAndTime",
  "consultationType",
  "status"
];

const nameExpan = {
  breed: "Breed",
  name: "Name",
  gender: "Gender",
  dobAndAge: "Date of Birth & Age",
  isSpayed: "Neutered/Spayed",
  weight: "Weight",
  petOwnerName: "Pet Owner Name",
  contactNumber: "Contact Number",
  email: "Email",
};

const initialValues = {
  breed: "",
  name: "",
  gender: "",
  dobAndAge: new Date(),
  isSpayed: "",
  weight: "",
  petOwnerName: "",
  contactNumber: "",
  email: "",
};
const initialErrors = {
  breed: false,
  name: false,
  gender: false,
  dobAndAge: false,
  isSpayed: false,
  weight: false,
  petOwnerName: false,
  contactNumber: false,
  email: false,
};
const initialHelpers = {
  breed: "",
  name: "",
  gender: "",
  dobAndAge: "",
  isSpayed: "",
  weight: "",
  petOwnerName: "",
  contactNumber: "",
  email: "",
};
const initialFile = { file: null, imagePreviewUrl: "" };

const PetDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();
  const location = useLocation();
  const [pet, setPet] = useState(location?.state);
  const [petOwner, setPetOwner] = useState(location?.state?.owner);
  const [activeTab, setAtciveTab] = useState("Appointments");
  const [isTableView, setTableView] = useState(true);
  const [isCardView, setCardView] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [searchTypeValue, setSearchTypeValue] = useState("");
  const [searchDateValue, setSearchDateValue] = useState("");
  const appointments = useSelector((state) => state.clinic.petAppointments.appointments);
  const [tableAppintments, setTableAppointments] = useState([]);
  const [selectedPet, setSelectedPet] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [petValues, setPetValues] = useState(initialValues);
  const [petErrors, setPetErrors] = useState(initialErrors);
  const [petHelpers, setPetHelpers] = useState(initialHelpers);
  const [petFileUploadUrl, setPetFileUploadUrl] = useState(initialFile);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const defaultUrl = `?limit=${rowsPerPage}&skip=0`;
  const state = location?.state;

  useEffect(() => {
    setPet(location?.state);
    dispatch(
      getPetAppointsmentsById(params?.petId)
    );
  }, []);

  useEffect(() => {
    if (!selectedPet) return;
    setPetValues({
      ...petValues,
      name: selectedPet?.name ?? "",
      breed: selectedPet?.breed ?? "",
      gender: selectedPet?.gender ?? "",
      petOwnerName: selectedPet?.owner?.name ?? "",
      weight: selectedPet?.weight ?? "",
      isSpayed: selectedPet?.isSpayed ?? "",
      contactNumber: selectedPet?.owner?.mobile ?? "",
      dobAndAge: selectedPet?.dob ?? "",
      email: selectedPet?.owner?.emailID ?? "",
    });
    setPetFileUploadUrl({
      ...petFileUploadUrl,
      imagePreviewUrl: selectedPet?.photo,
    });
    setModalVisible(!modalVisible);
  }, [selectedPet]);

  useEffect(() => {
    if (activeTab === "Appointments") {
      dispatch(
        getPetAppointsmentsById({
          petId: pet?._id ?? params?.petId,
          url: defaultUrl,
        })
      );
    }
  }, [activeTab]);

  const getTableAppointments = (appointmentList) => {
    dispatch(showLoader());
    const reqAppointments = appointmentList?.map((app) => {
      return {
        // appointmentId: app?._id,
        vets: app?.doctorName,
        dateAndTime: moment(app?.date).format("MMM DD, HH:mm"),
        consultationType: app?.appointmentType === "V" ? "Virtual": "Physical",
        userName: app?.userName,
        status: app?.appoinmentStatus
      };
    });
    setTableAppointments(reqAppointments);
    dispatch(hideLoader());
  };

  useEffect(() => {
    getTableAppointments(appointments);
  }, [appointments]);

  const handleBackBtn = () => {
    return navigate(-1);
  };

  const handleCardTableView = () => {
    setTableView(!isTableView);
    setCardView(!isCardView);
  };

  const handleSearch = () => {
    const url = `?limit=${rowsPerPage}&skip=0${
      searchValue?.length > 0 ? `&search=${searchValue}` : ""
    }${
      searchTypeValue
        ? `${searchValue?.length > 0 ? "&" : "?"}type=${searchTypeValue}`
        : ""
    }${
      searchDateValue
        ? `${
            searchValue?.length > 0 || searchTypeValue ? "&" : "?"
          }filter=${searchDateValue}`
        : ""
    }`;
    dispatch(
      getPetAppointsmentsById({
        petId: pet?._id ?? params?.petId,
        url,
      })
    );
  };

  const handleResetBtn = () => {
    setSearchTypeValue(null);
    setSearchValue("");
    dispatch(
      getPetAppointsmentsById({
        petId: pet?._id ?? params?.petId,
        url: `${defaultUrl}${
          searchDateValue ? `&filter=${searchDateValue}` : ""
        }`,
      })
    );
  };

  const onUploadFile = (e, type) => {
    const reader = new FileReader();
    const file = e.target.files[0];
    reader.onloadend = () => {
      if (type === "pet") {
        setPetFileUploadUrl({
          file: e.target.files[0],
          imagePreviewUrl: reader.result,
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const modelOpen = () => {
    handleReset();
    setModalVisible(!modalVisible);
  };

  const handleReset = () => {
    setPetValues(initialValues);
    setPetErrors(initialErrors);
    setPetHelpers(initialHelpers);
    setSelectedPet(null);
    setPetFileUploadUrl(initialFile);
  };

  const handleChange = (e) => {
    setPetValues({ ...petValues, [e.target.name]: e.target.value });
    if (e.target.value === "") {
      setPetErrors({ ...petErrors, [e.target.name]: true });
      setPetHelpers({
        ...petHelpers,
        [e.target.name]: `${nameExpan?.[e.target.name]} Required Field`,
      });
    }
    if (e.target.value !== "") {
      setPetErrors({ ...petErrors, [e.target.name]: false });
      setPetHelpers({ ...petHelpers, [e.target.name]: "" });
    }
  };

  const handleValidation = () => {
    const errorList = [];
    const woErrorList = [];
    Object.keys(petValues).forEach(function (key, index) {
      if (petValues?.[key]?.length === 0 || petValues?.[key] === "") {
        return errorList?.push(key);
      }
      woErrorList.push(key);
    });
    let errorObj = {};
    let errHelperObj = {};
    let correctObj = {};
    let helperObj = {};
    //set Error
    if (errorList?.length > 0) {
      errorList?.forEach((key) => {
        errorObj = { ...errorObj, [key]: true };
        errHelperObj = {
          ...errHelperObj,
          [key]: `${nameExpan?.[key]} Required Field`,
        };
      });
    }
    //Remove Error
    if (woErrorList?.length > 0) {
      woErrorList?.forEach((key) => {
        correctObj = { ...correctObj, [key]: false };
        helperObj = { ...helperObj, [key]: "" };
      });
    }
    setPetErrors({ ...petErrors, ...correctObj, ...errorObj });
    setPetHelpers({ ...petHelpers, ...helperObj, ...errHelperObj });
    return { errorList, woErrorList };
  };

  const handleSubmit = async () => {
    const validation = handleValidation();
    if (validation?.errorList?.length > 0) return;
    const form = new FormData();
    form.append("type", "dog");
    form.append("breed", petValues?.breed);
    form.append("name", petValues?.name);
    form.append("gender", petValues?.gender);
    form.append("dob", petValues?.dobAndAge);
    form.append("isSpayed", petValues?.isSpayed);
    form.append("weight", petValues?.weight);
    form.append("ownerName", petValues?.petOwnerName);
    form.append("mobile", petValues?.contactNumber);
    form.append("emailID", petValues?.email);
    if (petFileUploadUrl?.file) {
      form.append("photo", petFileUploadUrl?.file);
    }
    let apiSuccess;
    if (selectedPet?._id) {
      apiSuccess = await dispatch(updatePet({ form, petId: selectedPet?._id }));
      handleBackBtn();
    }
    if (apiSuccess?.payload) {
      setModalVisible(false);
      handleReset();
    }
  };

  const handleSelect = (e, key) => {
    setPetValues({ ...petValues, [key]: e.target.value });
  };

  const handleChangePage = (e, selectedPage) => {
    const reqSkip = (selectedPage - 1) * rowsPerPage;
    setPage(selectedPage);
    dispatch(
      getPetAppointsmentsById({
        petId: pet?._id ?? params?.petId,
        url: `?limit=${rowsPerPage}&skip=${reqSkip}${
          searchValue?.length > 0 ? `&search=${searchValue}` : ""
        }${searchTypeValue ? `&type=${searchTypeValue}` : ""}${
          searchDateValue ? `type=${searchTypeValue}` : ""
        }`,
      })
    );
  };

  return (
    <>
      <Header name="Vetinstant" />
      <TopBar
        name="Pet Profile"
        backBtn={true}
        onClickBackBtn={handleBackBtn}
        rightVerBtnShow={false}
      />
      <div className="com-mar">
        <Grid container spacing={1}>
          <Grid item xs={12} sm={12} md={12} lg={4} xl={4}>
            <div className="left-con-white">
              <div className="flex-row">
                <div className="flex1-start">
                  {pet?.petImage ? (
                    <img
                      alt={pet?.petImage}
                      src={pet?.petImage}
                      className="detail-img"
                    />
                  ) : (
                    <div className="detail-empty-img" />
                  )}
                </div>
                <div className="flex1-end">
                  <img
                    src={
                      require("../../../assets/images/svg/editIcon.svg").default
                    }
                    alt="myIcon"
                    className="cursor"
                    onClick={() => setSelectedPet(pet)}
                  />
                </div>
              </div>
              <div className="left-con-box mt20">
                <div className="flex-row">
                  <div className="flex-start-50per">
                    <div className="flex-column">
                      <div className="text600 mv2">Name</div>
                      <div className="text400 mv2">{pet?.petName}</div>
                      <div className="text600 mv2">Gender</div>
                      <div className="text400 mv2 capitalize">
                        {pet?.gender}
                      </div>
                      <div className="text600 mv2">Neutered/Spayed</div>
                      <div className="text400 mv2">
                        {pet?.isSpayed === "true" ? "Yes" : "No"}
                      </div>
                    </div>
                  </div>
                  <div className="flex-start-50per">
                    <div className="flex-column">
                      <div className="text600 mv2">Date of Birth & Age</div>
                      <div className="text400 mv2">
                        {`${moment(pet?.dob).format("Do MMMM YYYY")}, ${getAge(
                          pet?.dob,
                          false,
                          true
                        )}`}
                      </div>
                      <div className="text600 mv2">Breed</div>
                      <div className="text400 mv2">{pet?.breed}</div>
                      <div className="text600 mv2">Weight</div>
                      <div className="text400 mv2">{`${pet?.weight} kg`}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="left-con-box mt20">
                <div className="text600 mv2">Pet Owner Name</div>
                <div className="text400 mv2">{pet?.userName}</div>
                <div className="text600 mv2">Contact Number</div>
                <div className="text400 mv2">{pet?.userMobile}</div>
                <div className="text600 mv2">Email</div>
                <div className="text400 mv2">{pet?.userEmail}</div>
              </div>
            </div>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={8} xl={8}>
            <div className="right-con-white">
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <div className="tab-sty">
                  <div
                    className={`${
                      activeTab === "Appointments"
                        ? "tab-active-btn"
                        : "tab-txt"
                    } cursor`}
                    onClick={() => setAtciveTab("Appointments")}
                  >
                    Appointments
                  </div>
                  <div
                    className={`${
                      activeTab === "MedicalHistory"
                        ? "tab-active-btn"
                        : "tab-txt"
                    } cursor`}
                    onClick={() => setAtciveTab("MedicalHistory")}
                  >
                    Medical History
                  </div>
                </div>
              </Grid>

              {activeTab === "Appointments" ? (
                <>
                  <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <SearchRow
                      leftBtnTxt="Reset"
                      rightBtnTxt="Search"
                      tableView={isTableView}
                      cardView={isCardView}
                      onClickCardView={handleCardTableView}
                      onClickTableView={handleCardTableView}
                      onSerchChange={(e) => setSearchValue(e.target.value)}
                      searchValue={searchValue}
                      searchTypeList={paymentSearchTypeList}
                      searchTypeValue={searchTypeValue}
                      handleChangeSearchValue={(e) =>
                        setSearchTypeValue(e.target.value)
                      }
                      onClickBlueBtn={handleSearch}
                      onClickRedBtn={handleResetBtn}
                      isCustomSty
                    />
                  </Grid>
                  <Grid
                    container
                    spacing={0}
                    direction="row"
                    alignItems="center"
                  >
                    <Grid item xs={5} sm={4} md={4} lg={4} xl={4}>
                      <div className="flex-start mar-min7">
                        <CustomSelect
                          label="Search By Date"
                          list={dateFilterTodayLastWeek}
                          value={searchDateValue}
                          handleChange={(e) =>
                            setSearchDateValue(e.target.value)
                          }
                        />
                      </div>
                    </Grid>
                    <Grid item xs={7} sm={8} md={8} lg={8} xl={8}>
                      <div className="right-txt">
                        <div
                          style={{
                            fontFamily: "Montserrat",
                            color: "#838383",
                            fontSize: 14,
                          }}
                        >
                          {`No of Appointments: ${appointments?.length}`}
                        </div>
                      </div>
                    </Grid>
                  </Grid>
                  <Table
                    columns={appointmentTableHeaders}
                    datas={tableAppintments}
                    isCustomTableSty
                    page={page}
                    rowsPerPage={rowsPerPage}
                    totalRecords={appointments?.totalRecords}
                    handleChangePage={handleChangePage}
                  />
                </>
              ) : null}
              {activeTab === "MedicalHistory" ? (
                <PetMedicalHistoryList
                  state={{ ...state, pet: pet ? pet : location?.state }}
                />
              ) : null}
            </div>
          </Grid>
        </Grid>
      </div>
      <CustomModal
        open={modalVisible}
        onClose={modelOpen}
        header={`${selectedPet?._id ? "Edit" : "Add"} Pet`}
        headerCenter
        modal
        modalWidth={50}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <CustomUpload
              uploadText={"Tab to add a pet picture"}
              onUploadFile={(e) => onUploadFile(e, "pet")}
              value={petFileUploadUrl?.imagePreviewUrl}
              center
              imageHeight={50}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <Select
              list={breedList}
              value={petValues?.breed}
              handleChange={(e) => handleSelect(e, "breed")}
              name="breed"
              label={nameExpan?.["breed"]}
              select
              error={petErrors?.breed}
              helperText={petHelpers?.breed}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <CustomTextField
              label={nameExpan?.["name"]}
              placeholder={nameExpan?.["name"]}
              name="name"
              fullWidth
              handleChange={handleChange}
              value={petValues?.name}
              helperText={petHelpers?.name}
              error={petErrors?.name}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <Select
              list={genderList}
              value={petValues?.gender}
              handleChange={(e) => handleSelect(e, "gender")}
              name="gender"
              label={nameExpan?.["gender"]}
              select
              error={petErrors?.gender}
              helperText={petHelpers?.gender}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <CustomTextField
              label={nameExpan?.["dobAndAge"]}
              placeholder={nameExpan?.["dobAndAge"]}
              name="dobAndAge"
              fullWidth
              handleChange={handleChange}
              value={petValues?.dobAndAge}
              helperText={petHelpers?.dobAndAge}
              error={petErrors?.dobAndAge}
              mobileDate
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <Select
              list={yesNoList}
              value={petValues?.isSpayed}
              handleChange={(e) => handleSelect(e, "isSpayed")}
              name="isSpayed"
              label={nameExpan?.["isSpayed"]}
              select
              error={petErrors?.isSpayed}
              helperText={petHelpers?.isSpayed}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <CustomTextField
              label={nameExpan?.["weight"]}
              placeholder={nameExpan?.["weight"]}
              name="weight"
              fullWidth
              endIcon
              inputIcon="KG"
              type="number"
              handleChange={handleChange}
              value={petValues?.weight}
              helperText={petHelpers?.weight}
              error={petErrors?.weight}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <CustomTextField
              label={nameExpan?.["petOwnerName"]}
              placeholder={nameExpan?.["petOwnerName"]}
              name="petOwnerName"
              fullWidth
              handleChange={handleChange}
              value={petValues?.petOwnerName}
              helperText={petHelpers?.petOwnerName}
              error={petErrors?.petOwnerName}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <CustomTextField
              label={nameExpan?.["contactNumber"]}
              placeholder={nameExpan?.["contactNumber"]}
              name="contactNumber"
              fullWidth
              handleChange={handleChange}
              value={petValues?.contactNumber}
              helperText={petHelpers?.contactNumber}
              error={petErrors?.contactNumber}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <CustomTextField
              label={nameExpan?.["email"]}
              placeholder={nameExpan?.["email"]}
              name="email"
              fullWidth
              handleChange={handleChange}
              value={petValues?.email}
              helperText={petHelpers?.email}
              error={petErrors?.email}
              disabled={selectedPet?._id ? true : false}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <div>
              <div className="clinic-mod-btn-pos">
                <div className="mr10">
                  <CustomButton text="Reset" onClick={handleReset} grayBtn />
                </div>
                <div className="ml10">
                  <CustomButton
                    text={selectedPet?._id ? "Update" : "Register"}
                    onClick={handleSubmit}
                  />
                </div>
              </div>
            </div>
          </Grid>
        </Grid>
      </CustomModal>
    </>
  );
};

export default PetDetails;
