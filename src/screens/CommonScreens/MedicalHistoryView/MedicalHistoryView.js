import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { Grid } from "@mui/material";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import VetInsLogo from "../../../assets/images/png/vetinstantIcon.png";
import CustomButton from "../../../components/CustomButton";
import CustomModal from "../../../components/CustomModal/CustomModal";
import Table from "../../../components/CustomTable";
import CustomTextField from "../../../components/CustomTextField";
import CustomUpload from "../../../components/CustomUpload";
import { default as Select } from "../../../components/Select/Select";
import TopBar from "../../../components/TopBar/TopBar";
import Header from "../../../layouts/header";
import {
  getMedicalHistoryById,
  updatePet,
} from "../../../redux/reducers/petSlice";
import { AppColors } from "../../../util/AppColors";
import { breedList, genderList, yesNoList } from "../../../util/dropList";
import { getAge } from "../../../util/getAge";
import { CommonComplaintSummaryComponent } from "../../CommonComponents/CommonComplaintSummaryComponent";
import { CommonExamDSummaryComponent } from "../../CommonComponents/CommonExamDSummaryComponent";
import { CommonOtherComponent } from "../../CommonComponents/CommonOtherComponent";
import "./MedicalHistoryView.css";

const strokeObj = { stroke: AppColors.appPrimary, strokeWidth: 2 };

const presTableHeaders = ["srNo", "medicine", "dose", "duration", "from", "to"];

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

const MedicalHistoryView = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();
  const location = useLocation();
  const [selectedPet, setSelectedPet] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [petValues, setPetValues] = useState(initialValues);
  const [petErrors, setPetErrors] = useState(initialErrors);
  const [petHelpers, setPetHelpers] = useState(initialHelpers);
  const [petFileUploadUrl, setPetFileUploadUrl] = useState(initialFile);
  const [activeTab, setActiveTab] = useState(null);
  const medicalHistory = useSelector((state) => state.pet.medicalHistory);

  useEffect(() => {
    dispatch(
      getMedicalHistoryById(
        params?.medicalHistoryId ?? location?.state?.medicalHistory?._id
      )
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

  const handleBackBtn = () => {
    return navigate(-1);
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

  const CustomAccordion = ({ active = false, name = "", onClick }) => {
    return (
      <div className="flex-row mv10 mh10 cursor" onClick={onClick}>
        {active ? (
          <ArrowDropDownIcon sx={strokeObj} />
        ) : (
          <ArrowRightIcon sx={strokeObj} />
        )}
        <div className="text blue-color flex-center">{name}</div>
      </div>
    );
  };

  const handleActiveTab = (name) => {
    setActiveTab(activeTab !== name ? name : null);
  };

  const PrescriptionComponent = () => {
    const pres = medicalHistory?.prescriptions;
    const presTable = pres?.medication?.map((med, index) => {
      return {
        srNo: index + 1,
        medicine: med.medicine,
        dose: med.dose,
        duration: med.timingDuration,
        from: moment(med.dateFrom).format("DD/MM/YYYY"),
        to: moment(med.dateTo).format("DD/MM/YYYY"),
      };
    });
    return (
      <div className="flex-center mv10 mh10">
        {pres?.medication?.length > 0 ? (
          <div className="blue-box-examD mh10">
            <div className="flex-end">
              <img src={VetInsLogo} alt={VetInsLogo} className="MedHis-img" />
            </div>
            <div className="mv3 flex-row">
              <div className="text-bold">Diagnosis:</div>
              <div className="text ml3">{pres?.diagnosis}</div>
            </div>
            <div className="mv3 flex-row">
              <div className="text-bold">Pet Name:</div>
              <div className="text ml3">
                {pres?.name ?? medicalHistory?.pet?.name}
              </div>
            </div>
            <div className="mv3 flex-row">
              <div className="text-bold">Breed:</div>
              <div className="text ml3">
                {pres?.breed ?? medicalHistory?.pet?.breed}
              </div>
            </div>
            <div className="mv3 flex-row">
              <div className="text-bold">Gender:</div>
              <div className="text capitalize ml3">
                {pres?.gender ?? medicalHistory?.pet?.gender}
              </div>
            </div>
            <div className="mv3 flex-row">
              <div className="text-bold">Age:</div>
              <div className="text ml3">
                {moment(medicalHistory?.pet?.dob).fromNow(true)}
              </div>
            </div>
            <div className="mv10">
              <Table
                columns={presTableHeaders}
                datas={presTable}
                isCustomTableSty
              />
            </div>
            <div className="mv3 flex-row">
              <div className="text-bold">Advice:</div>
              <div className="text ml3">{pres?.advice}</div>
            </div>
            <div className="mv3 flex-row">
              <div className="text-bold">Diagnostic prescription: </div>
              <div className="text ml3"> {pres?.prescription}</div>
            </div>
            <div className="flex-row">
              <div className="flex-start">
                <div className="text-bold">Date: </div>
                <div className="text ml3">
                  {moment(pres?.date).format("DD/MM/YYYY")}
                </div>
              </div>
              <div className="flex1-end">
                <div className="text-bold">{`Dr. ${medicalHistory?.prescriptions?.docname}`}</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-center text">No Prescription available</div>
        )}
      </div>
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
                  <img
                    alt={medicalHistory?.pet?.photo}
                    src={medicalHistory?.pet?.photo}
                    style={{
                      width: 100,
                      height: 100,
                      objectFit: "cover",
                      borderRadius: 100,
                      border: "1px solid #F8F8FF",
                    }}
                  />
                </div>
                <div className="flex1-end">
                  <img
                    src={
                      require("../../../assets/images/svg/editIcon.svg").default
                    }
                    alt="myIcon"
                    className="cursor"
                    onClick={() => setSelectedPet(medicalHistory?.pet)}
                  />
                </div>
              </div>
              <div className="left-con-box mt20">
                <div className="flex-row">
                  <div className="flex-start-50per">
                    <div className="flex-column">
                      <div className="text600 mv2">Name</div>
                      <div className="text400 mv2">
                        {medicalHistory?.pet?.name}
                      </div>
                      <div className="text600 mv2">Gender</div>
                      <div className="text400 mv2 capitalize">
                        {medicalHistory?.pet?.gender}
                      </div>
                      <div className="text600 mv2">Neutered/Spayed</div>
                      <div className="text400 mv2">
                        {medicalHistory?.pet?.isSpayed === "true"
                          ? "Yes"
                          : "No"}
                      </div>
                    </div>
                  </div>
                  <div className="flex-start-50per">
                    <div className="flex-column">
                      <div className="text600 mv2">Date of Birth & Age</div>
                      <div className="text400 mv2">
                        {`${moment(medicalHistory?.pet?.dob).format(
                          "Do MMMM YYYY"
                        )}, ${moment(medicalHistory?.pet?.dob).fromNow(true)}`}
                      </div>
                      <div className="text600 mv2">Breed</div>
                      <div className="text400 mv2">
                        {medicalHistory?.pet?.breed}
                      </div>
                      <div className="text600 mv2">Weight</div>
                      <div className="text400 mv2">{`${medicalHistory?.pet?.weight} kg`}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="left-con-box mt20">
                <div className="text600 mv2">Pet Owner Name</div>
                <div className="text400 mv2">{medicalHistory?.user?.name}</div>
                <div className="text600 mv2">Contact Number</div>
                <div className="text400 mv2">
                  {medicalHistory?.user?.mobile}
                </div>
                <div className="text600 mv2">Email</div>
                <div className="text400 mv2">
                  {medicalHistory?.user?.emailId}
                </div>
              </div>
            </div>
          </Grid>
          <Grid item xs={12} sm={12} md={12} lg={8} xl={8}>
            <div className="right-con-white-wh">
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <div className="tab-sty">
                  <div className="tab-txt">Medical History</div>
                </div>
              </Grid>

              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <div
                  style={{
                    overflow: "scroll",
                    // , height: 300
                  }}
                >
                  <CustomAccordion
                    name="Complaints summary"
                    active={activeTab === "ComplaintsSummary"}
                    onClick={() => handleActiveTab("ComplaintsSummary")}
                  />
                  {activeTab === "ComplaintsSummary" ? (
                    <CommonComplaintSummaryComponent
                      medicalHistory={medicalHistory}
                    />
                  ) : null}
                  <CustomAccordion
                    name="Prescription"
                    active={activeTab === "Prescription"}
                    onClick={() => handleActiveTab("Prescription")}
                  />
                  {activeTab === "Prescription" ? (
                    <PrescriptionComponent />
                  ) : null}
                  <CustomAccordion
                    name="ExamD summary"
                    active={activeTab === "ExamDSummary"}
                    onClick={() => handleActiveTab("ExamDSummary")}
                  />
                  {activeTab === "ExamDSummary" ? (
                    <CommonExamDSummaryComponent
                      medicalHistory={medicalHistory}
                    />
                  ) : null}
                  <CustomAccordion
                    name="Other records"
                    active={activeTab === "OtherRecords"}
                    onClick={() => handleActiveTab("OtherRecords")}
                  />
                  {activeTab === "OtherRecords" ? (
                    <CommonOtherComponent medicalHistory={medicalHistory} />
                  ) : null}
                </div>
              </Grid>
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
                  <CustomButton text="Update" onClick={handleSubmit} />
                </div>
              </div>
            </div>
          </Grid>
        </Grid>
      </CustomModal>
    </>
  );
};

export default MedicalHistoryView;
