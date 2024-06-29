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
import { createPet, getPets } from "../../../redux/reducers/petSlice";
import { ErrorStrings } from "../../../util/ErrorString";
import { EmailRegex } from "../../../util/Validations";
import {
  breedList,
  genderList,
  petTypeList,
  yesNoList,
} from "../../../util/dropList";
import generatePass from "../../../util/randomPassword";

const tableHeaders = ["id", "petName", "userName", "gender", "breed", "age"];
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
  password: "Password",
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
  password: "",
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
  password: false,
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
  password: "",
};
const initialFile = { file: null, imagePreviewUrl: "" };

const Pet = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const pets = useSelector((state) => state.pet.pets);
  const [isTableView, setTableView] = useState(true);
  const [isCardView, setCardView] = useState(false);
  const [tablePets, setTablePets] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [petValues, setPetValues] = useState(initialValues);
  const [petErrors, setPetErrors] = useState(initialErrors);
  const [petHelpers, setPetHelpers] = useState(initialHelpers);
  const [showPassword, setShowPassword] = useState(false);
  const [isAutoGenPass, setAutoGenPass] = useState(false);
  const [petFileUploadUrl, setPetFileUploadUrl] = useState(initialFile);
  const [searchValue, setSearchValue] = useState("");
  const [searchTypeValue, setSearchTypeValue] = useState("dog");
  const [page, setPage] = useState(1);
  const rowsPerPage = 2;
  const defaultUrl = `?page=${page}&itemSize=${rowsPerPage}`;

  useEffect(() => {
    dispatch(getPets(defaultUrl));
  }, []);

  useEffect(() => {
    getAllPetList(pets?.pets);
  }, [pets]);

  const handleCardTableView = () => {
    setTableView(!isTableView);
    setCardView(!isCardView);
  };

  const getAllPetList = (petList) => {
    const reqHospitals = petList?.map((hos, i) => {
      return {
        ...hos,
        id:
          pets?.totalRecords > rowsPerPage
            ? (page - 1) * rowsPerPage + (i + 1)
            : i + 1,
        petName: hos?.petName,
        gender: hos?.gender,
        breed: hos?.breed,
        age: hos?.dob ?? new Date(),
        userName: hos?.owner?.name,
      };
    });
    setTablePets(reqHospitals);
  };

  const modelOpen = () => {
    handleReset();
    setModalVisible(!modalVisible);
  };

  const handleSelect = (e, key) => {
    setPetValues({ ...petValues, [key]: e.target.value });
  };

  const emailValidation = (value) => {
    if (value === "") {
      setPetErrors({ ...petErrors, email: true });
      setPetHelpers({ ...petHelpers, email: ErrorStrings.emptyEmail });
    }
    if (value !== "") {
      if (!EmailRegex.test(value)) {
        setPetErrors({ ...petErrors, email: true });
        setPetHelpers({ ...petHelpers, email: ErrorStrings.inValidEmail });
      } else {
        setPetErrors({ ...petErrors, email: false });
        setPetHelpers({ ...petHelpers, email: "" });
      }
    }
  };

  const passValidation = (value) => {
    if (value === "") {
      setPetErrors({ ...petErrors, password: true });
      setPetHelpers({ ...petHelpers, password: ErrorStrings.emptyPass });
      return;
    }
    if (value.length < 6) {
      setPetErrors({ ...petErrors, password: true });
      setPetHelpers({ ...petHelpers, password: ErrorStrings.inValidPass });
      return;
    }
    setPetErrors({ ...petErrors, password: false });
    setPetHelpers({ ...petHelpers, password: "" });
  };

  const handleChange = (e) => {
    setPetValues({ ...petValues, [e.target.name]: e.target.value });
    if (e.target.name === "email") return emailValidation(e.target.value);
    if (e.target.name === "password") return passValidation(e.target.value);

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

  const handleReset = () => {
    setPetValues(initialValues);
    setPetErrors(initialErrors);
    setPetHelpers(initialHelpers);
    setAutoGenPass(false);
    setPetFileUploadUrl(initialFile);
    // setPetOwnerFileUploadUrl(initialFile);
  };

  const handleValidation = () => {
    const errorList = [];
    const woErrorList = [];
    Object.keys(petValues).forEach(function (key, index) {
      if (key === "email") {
        if (petValues?.[key] === "") return errorList?.push(key);
        if (!EmailRegex.test(petValues?.[key])) {
          return errorList?.push(key);
        } else woErrorList.push(key);
      } else if (key === "password") {
        if (petValues?.[key] === "") return errorList?.push(key);
        if (petValues?.[key]?.length < 6) {
          return errorList?.push(key);
        } else woErrorList.push(key);
      } else {
        if (petValues?.[key]?.length === 0 || petValues?.[key] === "") {
          return errorList?.push(key);
        }
        woErrorList.push(key);
      }
    });
    let errorObj = {};
    let errHelperObj = {};
    let correctObj = {};
    let helperObj = {};
    //set Error
    if (errorList?.length > 0) {
      errorList?.forEach((key) => {
        errorObj = { ...errorObj, [key]: true };
        const value = petValues?.[key];
        if (key === "email") {
          if (value === "") {
            errHelperObj = {
              ...errHelperObj,
              [key]: ErrorStrings.emptyEmail,
            };
            return;
          }
          if (!EmailRegex.test(value)) {
            errHelperObj = {
              ...errHelperObj,
              [key]: ErrorStrings.inValidEmail,
            };
            return;
          }
        }
        if (key === "password") {
          if (value === "") {
            errHelperObj = {
              ...errHelperObj,
              [key]: ErrorStrings.emptyPass,
            };
            return;
          }
          if (value < 6) {
            errHelperObj = { ...errHelperObj, [key]: ErrorStrings.inValidPass };
          }
        }
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
    form.append("password", petValues?.password);
    if (petFileUploadUrl?.file) {
      form.append("photo", petFileUploadUrl?.file);
    }

    const apiSuccess = await dispatch(createPet(form));

    if (apiSuccess?.payload) {
      setTablePets([]);
      setPage(1);
      dispatch(getPets(defaultUrl));
      setModalVisible(false);
      handleReset();
    }
  };

  const handleEdit = (pet) => {
    navigate(`/pet-details/${pet?._id}`, { state: pet });
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
      // else {
      //   setPetOwnerFileUploadUrl({
      //     file: e.target.files[0],
      //     imagePreviewUrl: reader.result,
      //   });
      // }
    };
    reader.readAsDataURL(file);
  };

  const handleSearch = () => {
    setPage(1);
    const url = `?itemSize=${rowsPerPage}&page=${page}${searchValue?.length > 0 ? `&search=${searchValue}` : ""
      }${searchTypeValue ? `&type=${searchTypeValue}` : ""}`;
    setTablePets([]);
    dispatch(getPets(url));
  };

  const handleResetBtn = () => {
    setSearchTypeValue("dog");
    setPage(1);
    setSearchValue("");
    setTablePets([]);
    dispatch(getPets(defaultUrl));
  };

  const importPet = () => {
    console.log("import pet");
  };

  const downloadPet = () => {
    console.log("download pet");
  };

  const handleChangePage = (e, selectedPage) => {
    const reqSkip = (selectedPage - 1) * rowsPerPage;
    setPage(selectedPage);
    const url = `?page=${selectedPage}&itemSize=${rowsPerPage}${searchValue?.length > 0 ? `&search=${searchValue}` : ""
      }${searchTypeValue ? `&type=${searchTypeValue}` : ""}`;

    dispatch(getPets(url));
  };

  const handleAutoGenPassword = () => {
    setAutoGenPass(!isAutoGenPass);
    if (!isAutoGenPass) {
      const pass = generatePass();
      setPetValues({ ...petValues, password: pass });
    } else {
      setPetValues({ ...petValues, password: "" });
    }
  };

  return (
    <>
      <Header name="Vetinstant" />
      <TopBar
        name="Pets"
        list={[
          { name: "Create Pet", onClick: modelOpen },
          { name: "Import Pets", onClick: importPet },
          { name: "Download Reports", onClick: downloadPet },
        ]}
      />
      <SearchRow
        leftBtnTxt="Reset"
        rightBtnTxt="Search"
        // tableView={isTableView}
        cardView={isCardView}
        onClickCardView={handleCardTableView}
        onClickTableView={handleCardTableView}
        onSerchChange={(e) => setSearchValue(e.target.value)}
        searchValue={searchValue}
        searchTypeList={petTypeList}
        searchTypeValue={searchTypeValue}
        handleChangeSearchValue={(e) => setSearchTypeValue(e.target.value)}
        onClickBlueBtn={handleSearch}
        onClickRedBtn={handleResetBtn}
      />
      {isTableView ? (
        <Table
          columns={tableHeaders}
          datas={tablePets}
          onClickEditBtn={handleEdit}
          page={page}
          rowsPerPage={1}
          totalRecords={pets?.totalRecords}
          handleChangePage={handleChangePage}
        />
      ) : null}

      <CustomModal
        open={modalVisible}
        onClose={modelOpen}
        header="Add Pet"
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
            />
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <CustomTextField
              label={nameExpan?.["password"]}
              placeholder={nameExpan?.["password"]}
              name="password"
              password
              fullWidth
              value={petValues?.password}
              handleChange={handleChange}
              showPassword={showPassword}
              handleClickShowPassword={() => setShowPassword(!showPassword)}
              helperText={petHelpers?.password}
              error={petErrors?.password}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <Checkbox
              label="Auto-Generate Password"
              checked={isAutoGenPass}
              onChange={handleAutoGenPassword}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <div>
              <div className="clinic-mod-btn-pos">
                <div className="mr10">
                  <CustomButton text="Reset" onClick={handleReset} grayBtn />
                </div>
                <div className="ml10">
                  <CustomButton text="Register" onClick={handleSubmit} />
                </div>
              </div>
            </div>
          </Grid>
        </Grid>
      </CustomModal>
    </>
  );
};

export default Pet;
