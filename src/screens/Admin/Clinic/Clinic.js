import { Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CustomButton from "../../../components/CustomButton";
import Checkbox from "../../../components/CustomCheckbox";
import CustomModal from "../../../components/CustomModal/CustomModal";
import Table from "../../../components/CustomTable";
import CustomTextField from "../../../components/CustomTextField";
import CustomUpload from "../../../components/CustomUpload";
import SearchRow from "../../../components/SearchRow/SearchRow";
import Select from "../../../components/Select/Select";
import TopBar from "../../../components/TopBar/TopBar";
import Header from "../../../layouts/header";
import {
  addClinic,
  getClinicLocations,
  getClinics,
  updateClinic,
} from "../../../redux/reducers/clinicSlice";
import { ErrorStrings } from "../../../util/ErrorString";
import { EmailRegex } from "../../../util/Validations";
import { clinicFilterList } from "../../../util/arrayList";
import generatePass from "../../../util/randomPassword";
import "./Clinic.css";
import { locationDropList } from "../../../util/dropList";

const tableHeaders = ["id", "clinicName", "location", "noOfVets", "status"];

const nameExpan = {
  hospitalname: "Clinic Name",
  location: "Location",
  administartorContact: "Administartor Contact",
  contactNumber: "Contact Number",
  email: "Email",
  password: "Password",
  // conType: "Consultation Type",
};

const initialValues = {
  hospitalname: "",
  location: "",
  administartorContact: "",
  contactNumber: "",
  email: "",
  password: "",
  // conType: [],
};

const initialError = {
  hospitalname: false,
  location: false,
  administartorContact: false,
  contactNumber: false,
  email: false,
  password: false,
  // conType: false,
};

const initialHelp = {
  hospitalname: "",
  location: "",
  administartorContact: "",
  contactNumber: "",
  email: "",
  password: "",
  // conType: "",
};

const initialFile = { file: null, imagePreviewUrl: "" };

const Clinic = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const hospitals = useSelector((state) => state?.clinic?.hospitals);
  // console.log("hospital------>>",hospitals)
//   const hospitals = 
//   {
//     "totalRecords": 2,
//     "hospitals": [
//         {
//             "id": 3,
//             "name": "cmc",
//             "location": "chennai",
//             "vets": 0,
//             "status": "Y",
//             "role": "ROLE_CLINIC"
//         },
//         {
//             "id": 5,
//             "name": "cmc",
//             "location": "chennai",
//             "vets": 0,
//             "status": "Y",
//             "role": "ROLE_CLINIC"
//         }
//     ]
// }
  const locations = useSelector((state) => state.clinic.locations);
  const [isTableView, setTableView] = useState(true);
  const [isCardView, setCardView] = useState(false);
  const [tableHospitals, setTableHospitals] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [clinicValues, setClinicValues] = useState(initialValues);
  const [clinicErrors, setClinicErrors] = useState(initialError);
  const [clinicHelps, setClinicHelps] = useState(initialHelp);
  const [showPassword, setShowPassword] = useState(false);
  const [isAutoGenPass, setAutoGenPass] = useState(false);
  const [fileUploadUrl, setFileUploadUrl] = useState(initialFile);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [dropLocations, setDropLocations] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [searchTypeValue, setSearchTypeValue] = useState("name");
  const [page, setPage] = useState(1);
  const rowsPerPage = 4;
  // const defaultUrl = `?limit=${rowsPerPage}&skip=0&type=${searchTypeValue}`;
  const defaultUrl = `?page=${page}&itemSize=${rowsPerPage}`;
  useEffect(() => {
    dispatch(getClinics(defaultUrl));
    //  dispatch(getClinicLocations());
  }, []);

  useEffect(() => {
    if (hospitals?.hospitals?.length > 0) {
      getAllHospitalList(hospitals?.hospitals);
    }
    if (locations?.length > 0) getAllLocationList(locations);
  }, [hospitals, locations]);

  // useEffect(() => {
  //   if (!selectedHospital) return;
  //   setClinicValues({
  //     ...clinicValues,
  //     hospitalname: selectedHospital?.clinicName,
  //     location: selectedHospital?.location_det?.[0]?._id,
  //     administartorContact: selectedHospital?.user_det?.[0]?.name,
  //     contactNumber: selectedHospital?.contact,
  //     email: selectedHospital?.user_det?.[0]?.emailID,
  //     // conType: selectedHospital?.appointmentType,
  //   });
  //   setFileUploadUrl({
  //     ...initialFile,
  //     imagePreviewUrl: selectedHospital?.image,
  //   });
  //   setModalVisible(true);
  // }, [selectedHospital]);

  const getAllLocationList = (locationList) => {
    const reqLocations = locationList?.map((location) => {
      return { ...location, value: location?._id };
    });
    setDropLocations(reqLocations);
  };

  const getAllHospitalList = (hospitalList) => {
    const reqHospitals = hospitalList?.map((hos, i) => {
      return {
        ...hos,
        id:hos?.id,
        // id:
        //   hospitals?.totalRecords > rowsPerPage
        //     ? (page - 1) * rowsPerPage + (i + 1)
        //     : i + 1,
        clinicName: hos?.name,
        location: hos?.location,
        noOfVets: hos?.vets,
        status: hos?.block ? "Inactive" : "Active",
      };
    });
    setTableHospitals(reqHospitals);
  };

  const modelOpen = () => {
    handleReset();
    setModalVisible(!modalVisible);
  };

  const handleCardTableView = () => {
    setTableView(!isTableView);
    setCardView(!isCardView);
  };

  const emailValidation = (value) => {
    if (value === "") {
      setClinicErrors({ ...clinicErrors, email: true });
      setClinicHelps({ ...clinicHelps, email: ErrorStrings.emptyEmail });
    }
    if (value !== "") {
      if (!EmailRegex.test(value)) {
        setClinicErrors({ ...clinicErrors, email: true });
        setClinicHelps({ ...clinicHelps, email: ErrorStrings.inValidEmail });
      } else {
        setClinicErrors({ ...clinicErrors, email: false });
        setClinicHelps({ ...clinicHelps, email: "" });
      }
    }
  };

  const passValidation = (value) => {
    if (value === "") {
      setClinicErrors({ ...clinicErrors, password: true });
      setClinicHelps({ ...clinicHelps, password: ErrorStrings.emptyPass });
      return;
    }
    if (value.length < 6) {
      setClinicErrors({ ...clinicErrors, password: true });
      setClinicHelps({ ...clinicHelps, password: ErrorStrings.inValidPass });
      return;
    }
    setClinicErrors({ ...clinicErrors, password: false });
    setClinicHelps({ ...clinicHelps, password: "" });
  };

  const handleChange = (e) => {
    setClinicValues({ ...clinicValues, [e.target.name]: e.target.value });
    if (e.target.name === "email") return emailValidation(e.target.value);
    if (e.target.name === "password") return passValidation(e.target.value);

    if (e.target.value === "") {
      setClinicErrors({ ...clinicErrors, [e.target.name]: true });
      setClinicHelps({
        ...clinicHelps,
        [e.target.name]: `${nameExpan?.[e.target.name]} Required Field`,
      });
    }
    if (e.target.value !== "") {
      setClinicErrors({ ...clinicErrors, [e.target.name]: false });
      setClinicHelps({ ...clinicHelps, [e.target.name]: "" });
    }
  };

  const onUploadFile = (e) => {
    const reader = new FileReader();
    const file = e.target.files[0];
    reader.onloadend = () => {
      setFileUploadUrl({
        file: e.target.files[0],
        imagePreviewUrl: reader.result,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleValidation = () => {
    const errorList = [];
    const woErrorList = [];
    Object.keys(clinicValues).forEach(function (key, index) {
      if (key === "email") {
        if (clinicValues?.[key] === "") return errorList?.push(key);
        if (!EmailRegex.test(clinicValues?.[key])) {
          return errorList?.push(key);
        } else woErrorList.push(key);
      } else if (key === "password") {
        if (selectedHospital?._id) return;
        if (clinicValues?.[key] === "") return errorList?.push(key);
        if (clinicValues?.[key]?.length < 6) {
          return errorList?.push(key);
        } else woErrorList.push(key);
      } else {
        if (clinicValues?.[key]?.length === 0 || clinicValues?.[key] === "") {
          return errorList?.push(key);
        }
        woErrorList.push(key);
      }
    });
    let errorObj = {};
    let errorHelperObj = {};
    let correctObj = {};
    let helperObj = {};
    //set Error
    if (errorList?.length > 0) {
      errorList?.forEach((key) => {
        errorObj = { ...errorObj, [key]: true };
        const value = clinicValues?.[key];
        if (key === "email") {
          if (value === "") {
            errorHelperObj = {
              ...errorHelperObj,
              [key]: ErrorStrings.emptyEmail,
            };
            return;
          }
          if (!EmailRegex.test(value)) {
            errorHelperObj = {
              ...errorHelperObj,
              [key]: ErrorStrings.inValidEmail,
            };
            return;
          }
        }
        if (key === "password") {
          if (value === "") {
            errorHelperObj = {
              ...errorHelperObj,
              [key]: ErrorStrings.emptyPass,
            };
            return;
          }
          if (value < 6) {
            errorHelperObj = {
              ...errorHelperObj,
              [key]: ErrorStrings.inValidPass,
            };
          }
        }
        errorHelperObj = {
          ...errorHelperObj,
          [key]: `${nameExpan?.[key]} Required Field`,
        };
      });
    }
    //remove Error
    if (woErrorList?.length > 0) {
      woErrorList?.forEach((key) => {
        correctObj = { ...correctObj, [key]: false };
        helperObj = { ...helperObj, [key]: "" };
      });
    }
    setClinicErrors({ ...clinicErrors, ...correctObj, ...errorObj });
    setClinicHelps({ ...clinicHelps, ...helperObj, ...errorHelperObj });
    return { errorList, woErrorList };
  };

  const handleSubmit = async () => {
    // const validation = handleValidation();
    // if (validation?.errorList?.length > 0) return;
    const form = new FormData();
    form.append("name", clinicValues?.hospitalname);
    form.append("location", clinicValues?.location);
    // form.append("location", "Pune");
    form.append("adminContact", clinicValues?.administartorContact);
    form.append("contactNumber", clinicValues?.contactNumber);
    form.append("email", clinicValues?.email);
    // form.append("appointmentType", clinicValues?.conType);
    if (fileUploadUrl?.file) form.append("hosImage", fileUploadUrl?.file);
    if (!selectedHospital?._id) form.append("password", clinicValues?.password);
    let apiSuccess;
    if (selectedHospital?._id) {
      apiSuccess = await dispatch(
        updateClinic({ form, clinicId: selectedHospital?._id })
      );
    } else {
      apiSuccess = await dispatch(addClinic(form));
    }
    if (apiSuccess?.payload) {
      setTableHospitals([]);
      setPage(1);
      dispatch(getClinics(defaultUrl));
      setModalVisible(false);
      handleReset();
    }
  };

  const handleReset = () => {
    setPage(1);
    setSearchTypeValue("name");
    setClinicValues(initialValues);
    setClinicErrors(initialError);
    setClinicHelps(initialHelp);
    setFileUploadUrl(initialFile);
    setAutoGenPass(false);
    setSelectedHospital(null);
  };

  const handleEdit = (hospital) => {
    navigate(`/clinic-details/${hospital?._id}`);
    // setSelectedHospital(hospital);
  };

  // const handleMultiSelect = (event) => {
  //   const {
  //     target: { value },
  //   } = event;
  //   setClinicValues({
  //     ...clinicValues,
  //     conType: typeof value === "string" ? value.split(",") : value,
  //   });
  //   setClinicErrors({
  //     ...clinicErrors,
  //     conType: value?.length > 0 ? false : true,
  //   });
  //   setClinicHelps({
  //     ...clinicHelps,
  //     conType:
  //       value?.length > 0 ? "" : `${nameExpan?.["conType"]} Required Field`,
  //   });
  // };

  const handleSelect = (e, key) => {
    setClinicValues({ ...clinicValues, [key]: e.target.value });
  };

  const handleSearch = () => {
    setPage(1);
    const url = `?limit=${rowsPerPage}&skip=0${
      searchValue?.length > 0 ? `&search=${searchValue}` : ""
    }${searchTypeValue ? `&type=${searchTypeValue}` : ""}`;
    setTableHospitals([]);
    dispatch(getClinics(url));
  };

  const handleResetBtn = () => {
    setPage(1);
    setSearchTypeValue("name");
    setSearchValue("");
    setTableHospitals([]);
    dispatch(getClinics(defaultUrl));
  };

  const importClinic = () => {
    console.log("import clinic");
  };

  const downloadClinic = () => {
    console.log("download clinic");
  };

  const handleChangePage = (e, selectedPage) => {
    const reqSkip = (selectedPage - 1) * rowsPerPage;
    setPage(selectedPage);

    const url = `?page=${selectedPage}&itemSize=${rowsPerPage}`;
    dispatch(getClinics(url));
  };

  const handleAutoGenPassword = () => {
    setAutoGenPass(!isAutoGenPass);
    if (!isAutoGenPass) {
      const pass = generatePass();
      setClinicValues({ ...clinicValues, password: pass });
    } else {
      setClinicValues({ ...clinicValues, password: "" });
    }
  };

  return (
    <>
      <Header name="Vetinstant" />
      <TopBar
        name="Clinics"
        list={[
          { name: "Create Clinic", onClick: modelOpen },
          { name: "Import Clinics", onClick: importClinic },
          { name: "Download Reports", onClick: downloadClinic },
        ]}
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
        searchTypeList={clinicFilterList}
        searchTypeValue={searchTypeValue}
        handleChangeSearchValue={(e) => setSearchTypeValue(e.target.value)}
        onClickBlueBtn={handleSearch}
        onClickRedBtn={handleResetBtn}
      />
      {isTableView ? (
        <Table
          columns={tableHeaders}
          datas={tableHospitals}
          onClickEditBtn={handleEdit}
          page={page}
          rowsPerPage={2}
          totalRecords={hospitals?.totalRecords}
          handleChangePage={handleChangePage}
        />
      ) : null}
      <CustomModal
        open={modalVisible}
        onClose={modelOpen}
        header={`${selectedHospital?._id ? "Edit" : "Add"} Clinic`}
        headerCenter
        modal
        modalWidth={50}
      >
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <CustomUpload
              uploadText={"Tab to add a profile picture"}
              onUploadFile={onUploadFile}
              value={fileUploadUrl?.imagePreviewUrl}
              center
              imageHeight={75}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <CustomTextField
              label={nameExpan?.["hospitalname"]}
              placeholder={nameExpan?.["hospitalname"]}
              name="hospitalname"
              fullWidth
              handleChange={handleChange}
              value={clinicValues?.hospitalname}
              helperText={clinicHelps?.hospitalname}
              error={clinicErrors?.hospitalname}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <Select
              // list={dropLocations}
              list={locationDropList}
              value={clinicValues?.location}
              handleChange={(e) => handleSelect(e, "location")}
              name="location"
              label={nameExpan?.["location"]}
              select
              error={clinicErrors.location}
              helperText={clinicHelps?.location}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <CustomTextField
              label={nameExpan?.["administartorContact"]}
              placeholder={nameExpan?.["administartorContact"]}
              name="administartorContact"
              fullWidth
              handleChange={handleChange}
              value={clinicValues?.administartorContact}
              helperText={clinicHelps?.administartorContact}
              error={clinicErrors?.administartorContact}
              // disabled={selectedHospital?._id ? true : false}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <CustomTextField
              label={nameExpan?.["contactNumber"]}
              placeholder={nameExpan?.["contactNumber"]}
              name="contactNumber"
              fullWidth
              handleChange={handleChange}
              value={clinicValues?.contactNumber}
              helperText={clinicHelps?.contactNumber}
              error={clinicErrors?.contactNumber}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <CustomTextField
              label={nameExpan?.["email"]}
              placeholder={nameExpan?.["email"]}
              name="email"
              fullWidth
              handleChange={handleChange}
              value={clinicValues?.email}
              helperText={clinicHelps?.email}
              error={clinicErrors?.email}
              disabled={selectedHospital?._id ? true : false}
            />
          </Grid>
          {!selectedHospital?._id ? (
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <CustomTextField
                label={nameExpan?.["password"]}
                placeholder={nameExpan?.["password"]}
                name="password"
                password
                fullWidth
                value={clinicValues?.password}
                handleChange={handleChange}
                showPassword={showPassword}
                handleClickShowPassword={() => setShowPassword(!showPassword)}
                helperText={clinicHelps?.password}
                error={clinicErrors?.password}
              />
            </Grid>
          ) : null}
          {/* <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <Select
              list={typeList}
              value={clinicValues?.conType}
              handleChange={handleMultiSelect}
              multiSelectTag
              label={nameExpan?.["conType"]}
              error={clinicErrors?.conType}
              helperText={clinicHelps?.conType}
            />
          </Grid> */}
          {!selectedHospital?._id ? (
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <Checkbox
                label="Auto-Generate Password"
                checked={isAutoGenPass}
                onChange={handleAutoGenPassword}
              />
            </Grid>
          ) : null}
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <div className="clinic-mod-btn-pos">
              <div className="mr10">
                <CustomButton text="Reset" onClick={handleReset} grayBtn />
              </div>
              <div className="ml10">
                <CustomButton
                  text={selectedHospital?._id ? "Update" : "Register"}
                  onClick={handleSubmit}
                />
              </div>
            </div>
          </Grid>
        </Grid>
      </CustomModal>
    </>
  );
};

export default Clinic;
