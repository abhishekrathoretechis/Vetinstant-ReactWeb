import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Table from "../../../components/CustomTable";
import { Grid, Container, Toolbar } from "@mui/material";

import Select from "../../../components/Select/Select";
import { createUserPet } from "../../../redux/reducers/clinicSlice";
import {
  NeuteredList,
  breedList,
  genderList,
  petColorList,
  petType,
  petTypeDropDownList,
  petTypeList,
} from "../../../util/dropList";

import TopBar from "../../../components/TopBar/TopBar";

import { getClinicPets } from "../../../redux/reducers/petSlice";
import CommonCreatePetComponent from "../../CommonComponents/CommonCreatePetComponent";
import CommonAppointmentPetComponent from "../../CommonComponents/CommonAppointmentPetComponent";
import "./ClinicPet.css";
import CustomButton from "../../../components/CustomButton";
import CustomTextField from "../../../components/CustomTextField";
import Checkbox from "../../../components/CustomCheckbox";

import CustomModal from "../../../components/CustomModal/CustomModal";
import CustomCard from "../../../components/CustomCard/CustomCard";

import GridViewIcon from "@mui/icons-material/GridView";
import SortIcon from "@mui/icons-material/Sort";
import { AppColors } from "../../../util/AppColors";
import CustomCheckbox from "../../../components/CustomCheckbox";
import ClinicPetBookAppointment from "./ClinicPetBookAppointment";
import { showSnackBar } from "../../../redux/reducers/snackSlice";
const nameExpan = {
  salutation: "Salutation",
  name: "Name",
  speciality: "Speciality",
  conType: "Consultation Type",
  contactNumber: "Contact Number",
  email: "Email",
  password: "Password",
};

const tableHeaders = [
  "petName",
  "gender",
  "breed",
  "parentname",
  "bookAppointment",
];

const ClinicPets = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const pets = useSelector((state) => state.pet.clinicPets);

  const [isTableView, setTableView] = useState(false);
  const [isCardView, setCardView] = useState(false);
  const [tablePets, setTablePets] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalAppointmentVisible, setModalAppointmentVisible] = useState(false);
  const [modalBookVisible, setModalBookVisible] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [searchTypeValue, setSearchTypeValue] = useState("");
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const [storePetId, setStorePetId] = useState("");
  const [storePetUserName, setStorePetUserName] = useState("");
  const [storePetOwnerName, setStorePetOwnerName] = useState("");
  const [petName, setPetName] = useState("");
  const [parentName, setParentName] = useState("");
  const [userMobile, setUserMobile] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [breed, setBreed] = useState(null);
  const [petType, setPetType] = useState(null);
  const [color, setColor] = useState(null);

  const [gender, setGender] = useState(null);
  const [neutered, setNeutered] = useState(null);
  const [selectPet, setSelectPet] = useState(null);

  const [dob, setDob] = useState(null);
  const [weight, setWeight] = useState(null);

  const [createModVisible, setCreateModalVisible] = useState(false);
  const [createUserType, setCreateUserType] = useState("Vet");
  const [errors, setErrors] = useState({
    petName: "",
    dob: "",
    breed: "",
    gender: "",
    neutered: "",
    weight: "",
    parentName: "",
    userMobile: "",
    email: "",
    password: "",
    color: "",
    petType: "",
  });

  const defaultUrl = `?type=all&search=${searchTypeValue}`;

  useEffect(() => {
    getClinicPetsData();
  }, []);

  useEffect(() => {
    dispatch(getClinicPets());
    getClinicPetsData();
  }, [searchTypeValue]);

  useEffect(() => {
    if (storePetId && storePetUserName) {
      setModalAppointmentVisible(true);
    }
  }, [storePetId, storePetUserName]);

  // useEffect(() => {
  //   getAllPetList(pets?.pets);
  // }, [pets?.pets]);

  const bookAppointment = (li) => {
    setSelectPet(li);
    setModalBookVisible(true);
  };

  const handleCreate = () => {
    setCreateModalVisible(true);
  };

  const getClinicPetsData = () => {
    dispatch(getClinicPets(defaultUrl)).then((res) => {
      if (res?.meta?.requestStatus === "fulfilled") {
        setTablePets(res?.payload?.data);
      }
    });
  };

  const validateFields = () => {
    const newErrors = {};
    if (!petName) newErrors.petName = "This field is required";
    if (!dob) newErrors.dob = "This field is required";
    if (!breed) newErrors.breed = "This field is required";
    if (!gender) newErrors.gender = "This field is required";
    if (!neutered) newErrors.neutered = "This field is required";
    if (!weight) newErrors.weight = "This field is required";
    if (!parentName) newErrors.parentName = "This field is required";
    if (!userMobile) newErrors.userMobile = "This field is required";
    if (!color) newErrors.color = "This field is required";
    if (!petType) newErrors.petType = "This field is required";
    if (!email) {
      newErrors.email = "This field is required";
    } else if (!email.includes("@")) {
      newErrors.email = "Invalid email format";
    }
    if (!password) newErrors.password = "This field is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createModalOpen = () => {
    setCreateUserType("Vet");
    setCreateModalVisible(!createModVisible);
  };

  const handleChangeUserType = (e) => {
    setCreateUserType(e.target.value);
  };

  const handleBookAppointment = (data) => {
    setStorePetId(data?.pet?._id);
    setStorePetUserName(data?.pet?.name);
    setStorePetOwnerName(data?.user?.name);
  };

  const handleCardTableView = () => {
    setTableView(!isTableView);
    setCardView(!isCardView);
  };

  // const getAllPetList = (petList) => {
  //   const reqHospitals = petList?.map((li, i) => {
  //     return {
  //       ...li,
  //       id:
  //         pets?.totalRecords > rowsPerPage
  //           ? (page - 1) * rowsPerPage + (i + 1)
  //           : i + 1,
  //       petName: li?.petName,
  //       gender: li?.gender,
  //       breed: li?.breed,
  //       age: li?.dob,
  //       userName: li?.userName,
  //       bookAppointment: (
  //         <div
  //           onClick={() => handleBookAppointment(li)}
  //           className="blue-color txt-semi-bold fs12 flex-row cursor bookbutton"
  //         >
  //           <div
  //             style={{
  //               color: "white",
  //               backgroundColor: "#0054A6",
  //               padding: "10px 15px",
  //               border: "none",
  //               borderRadius: 5,
  //               cursor: "pointer",
  //               fontFamily: "Montserrat-Bold",
  //               fontSize: "14px",
  //             }}
  //           >
  //             Book
  //           </div>
  //           <img
  //             className="mr10"
  //             src={require("../../../assets/images/png/bookvector.png")}
  //           />
  //         </div>
  //       ),
  //     };
  //   });
  //   setTablePets(reqHospitals);
  // };

  const modelOpen = () => {
    setModalVisible(!modalVisible);
  };

  const handleEdit = (data) => {
    const pet = data?.pet;
    navigate(`/pet-details/${data?.pet?._id}`, { state: pet });
  };

  const handleSearch = () => {
    setPage(1);
    const url = setTablePets([]);
    dispatch(getClinicPets(url));
  };

  const handleResetBtn = () => {
    setPage(1);
    setSearchTypeValue("dog");
    setSearchValue("");
    setTablePets([]);
    dispatch(getClinicPets(defaultUrl));
  };

  const importPet = () => {
    console.log("import pet");
  };

  const downloadPet = () => {
    console.log("download pet");
  };

  const handleChangePage = (e, selectedPage) => {
    setPage(selectedPage);
    dispatch(
      getClinicPets(
        `?itemSize=${rowsPerPage}&page=${selectedPage}${
          searchValue?.length > 0 ? `&search=${searchValue}` : ""
        }${searchTypeValue ? `&type=${searchTypeValue}` : ""}`
      )
    );
  };

  const onApiDone = () => {
    setTablePets([]);
    setPage(1);
    dispatch(getClinicPets(defaultUrl));
  };

  function formatDate(inputDate) {
    const dateObject = new Date(inputDate);
    const year = dateObject.getFullYear();
    const month = String(dateObject.getMonth() + 1).padStart(2, "0");
    const day = String(dateObject.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const handleInputChange = (e, field) => {
    const value = e.target.value;
    setErrors((prevErrors) => ({ ...prevErrors, [field]: "" }));
    switch (field) {
      case "petName":
        setPetName(value);
        break;
      case "dob":
        setDob(value);
        break;
      case "userMobile":
        setUserMobile(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "password":
        setPassword(value);
        break;
      case "weight":
        setWeight(value);
        break;
      case "parentName":
        setParentName(value);
        break;
      default:
        break;
    }
  };

  const handleSelectChange = (e, field) => {
    const value = e.target.value;
    setErrors((prevErrors) => ({ ...prevErrors, [field]: "" }));
    switch (field) {
      case "breed":
        setBreed(value);
        break;
      case "gender":
        setGender(value);
        break;
      case "neutered":
        setNeutered(value);
        break;
      case "petType":
        setPetType(value);
        break;
      case "color":
        setColor(value);
        break;
      default:
        break;
    }
  };

  const createPet = async () => {
    if (!validateFields()) return;

    const data = new FormData();
    data.append("petName", petName);
    data.append("petType", petType);
    data.append("breed", breed);
    data.append("weight", weight);
    data.append("isSpayed", neutered);
    data.append("gender", gender);
    data.append("dob", formatDate(dob));
    data.append("userName", parentName);
    data.append("userMobile", userMobile);
    data.append("color", color);
    data.append("email", email);
    data.append("password", password);

    // console.log("data------->>",data)
    await dispatch(createUserPet(data)).then((res) => {
      // console.log("res------->>",res.payload)
      if (res.payload?.status === 200) {
        if (
          res?.payload?.data.message ===
          `User with email id (${email}) is already registered!`
        ) {
          dispatch(
            showSnackBar({
              message: `User with email id (${email}) is already registered!`,
              type: "error",
            })
          );
        }
        if (
          res?.payload?.data.message ===
          `User with mobile number (${userMobile}) is already registered!`
        ) {
          dispatch(
            showSnackBar({
              message: `User with mobile number (${userMobile}) is already registered!`,
              type: "error",
            })
          );
        }
        if (res?.payload?.data?.message === "User pet added") {
          dispatch(
            showSnackBar({
              message: `Pet created successfully!`,
              type: "success",
            })
          );
          setCreateModalVisible(false);
          // Clear the form fields and errors
          setPetName("");
          setDob(null);
          setBreed(null);
          setGender(null);
          setNeutered(null);
          setWeight("");
          setParentName("");
          setUserMobile("");
          setEmail("");
          setPassword("");
          setErrors({});
          getClinicPetsData();
        }
      }
    });
  };

  const handleClickPet = (pet) => {
    navigate("/clinic-pet-details", { state: { pet } });
  };

  return (
    <>
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
                <Grid item xs={4} sm={2} md={2} lg={1} xl={1} className="ml20">
                  <CustomButton text="Create" onClick={handleCreate} />
                </Grid>
                {/* <Grid item xs={2} sm={2} md={2} lg={1} xl={1} className="ml20">
                  <div className="flex-center">
                    <div
                      onClick={() => {
                        setTableView(!isTableView);
                      }}
                      className={`p10 cursor ${!isTableView ? "selected-tab" : "un-selected-tab"
                        }`}
                    >
                      <GridViewIcon sx={{ color: AppColors.appPrimary }} />
                    </div>
                    <div
                      onClick={() => {
                        setTableView(!isTableView);
                      }}
                      className={`p10 ml10 cursor ${isTableView ? "selected-tab" : "un-selected-tab"
                        }`}
                    >
                      <SortIcon sx={{ color: AppColors.appPrimary }} />
                    </div>
                  </div>
                </Grid> */}

                <div className="top-row-right-con w15Per topBar-select">
                  <Select
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
      <Container maxWidth="xl" className="scroll-70vh">
        {isTableView ? (
          <Table
            columns={tableHeaders}
            datas={tablePets}
            onClickEditBtn={handleEdit}
            page={page}
            rowsPerPage={rowsPerPage}
            totalRecords={pets?.totalRecords}
            grey={true}
            // handleChangePage={handleChangePage}
          />
        ) : (
          <CustomCard
            list={tablePets}
            pets
            onBookClick={bookAppointment}
            // onCardClick={handleClickPet}
          />
        )}
      </Container>
      <CommonCreatePetComponent
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        onApiDone={onApiDone}
      />
      <ClinicPetBookAppointment
        modalVisible={modalBookVisible}
        setModalBookVisible={setModalBookVisible}
        selectPet={selectPet}
      />

      {/* <CommonAppointmentPetComponent
        modalVisible={modalAppointmentVisible}
        setModalVisible={setModalAppointmentVisible}
        storePetId={storePetId ?? ""}
        storePetUserName={storePetUserName ?? ""}
        storePetOwnerName={storePetOwnerName ?? ""}
      /> */}
      <CustomModal
        open={createModVisible}
        onClose={createModalOpen}
        header="Create"
        rightModal
        modalWidth={30}
      >
        <Grid container spacing={2} className="ph20 scroll-80vh">
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <div className="txt-mont fs14">Name</div>
            <CustomTextField
              // label={"Name"}
              // placeholder={'Name'}
              name="Name"
              fullWidth
              handleChange={(e) => handleInputChange(e, "petName")}
              value={petName}
              error={!!errors.petName}
              helperText={errors.petName}
              labelTop
            />
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <div className="txt-mont fs14">Date of Birth & Age</div>
            <CustomTextField
              // label={"Date of Birth & Age"}
              // placeholder={nameExpan?.["password"]}
              name="Date of Birth & Age"
              fullWidth
              handleChange={(e) => handleInputChange(e, "dob")}
              value={dob}
              error={!!errors.dob}
              helperText={errors.dob}
              labelTop
              mobileDate
            />
          </Grid>
          <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
            <div className="txt-mont fs14">Pet Type</div>
            <Select
              list={petTypeDropDownList}
              value={petType}
              handleChange={(e) => handleSelectChange(e, "petType")}
              name="petType"
              // label={"Breed"}
              select
              error={!!errors.petType}
              helperText={errors.petType}
              labelTop
            />
          </Grid>

          <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
            <div className="txt-mont fs14">Breed</div>
            <Select
              // list={specialtyList}
              list={breedList}
              value={breed}
              handleChange={(e) => handleSelectChange(e, "breed")}
              name="Breed"
              // label={"Breed"}
              select
              error={!!errors.breed}
              helperText={errors.breed}
              labelTop
            />
          </Grid>

          <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
            <div className="txt-mont fs14">Color</div>
            <Select
              list={petColorList}
              value={color}
              handleChange={(e) => handleSelectChange(e, "color")}
              name="color"
              error={!!errors.breed}
              helperText={errors.breed}
              // label={"Breed"}
              select
              // error={!!errors.breed}
              // helperText={errors.breed}
              labelTop
            />
          </Grid>

          <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
            <div className="txt-mont fs14">Gender</div>
            <Select
              list={genderList}
              value={gender}
              handleChange={(e) => handleSelectChange(e, "gender")}
              // label={"Gender"}
              select
              error={!!errors.gender}
              helperText={errors.gender}
              labelTop
            />
          </Grid>
          <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
            <div className="txt-mont fs14">Neutered/Spayed</div>
            <Select
              list={NeuteredList}
              value={neutered}
              handleChange={(e) => handleSelectChange(e, "neutered")}
              // multiSelectTagCheck
              // label={"Neutered/Spayed"}
              error={!!errors.neutered}
              helperText={errors.neutered}
              select
              labelTop
            />
          </Grid>
          <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
            <CustomTextField
              // list={typeList}
              name={"Weight"}
              value={weight}
              fullWidth
              handleChange={(e) => handleInputChange(e, "weight")}
              label={"Weight"}
              error={!!errors.weight}
              helperText={errors.weight}
              suffix={weight !== "" ? "Kg" : ""}
              labelTop
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <CustomTextField
              label={"Parent Name"}
              // placeholder={'Name'}
              name="Parent Name"
              fullWidth
              handleChange={(e) => handleInputChange(e, "parentName")}
              value={parentName}
              error={!!errors.parentName}
              helperText={errors.parentName}
              labelTop
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <CustomTextField
              label={"Contact Number"}
              // placeholder={nameExpan?.["password"]}
              name="Contact Number"
              fullWidth
              handleChange={(e) => handleInputChange(e, "userMobile")}
              value={userMobile}
              error={!!errors.userMobile}
              helperText={errors.userMobile}
              labelTop
            />
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <CustomTextField
              label={"Email"}
              // placeholderEmail'}
              name="Email"
              fullWidth
              handleChange={(e) => handleInputChange(e, "email")}
              value={email}
              error={!!errors.email}
              helperText={errors.email}
              labelTop
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <CustomTextField
              label={"Password"}
              // placeholder={nameExpan?.["password"]}
              name="Password"
              fullWidth
              handleChange={(e) => handleInputChange(e, "password")}
              value={password}
              error={!!errors.password}
              helperText={errors.password}
              labelTop
            />
          </Grid>
          {/* <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <Typography className="font-medium fs14">User Type</Typography>
          </Grid> */}
          {/* <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <Checkbox
              radio
              onChange={handleChangeUserType}
              radios={[
                { label: "Vet", value: "Vet" },
                { label: "Other", value: "Other" },
              ]}
              defaultValue={createUserType}
            />
          </Grid> */}
          {/* {createUserType === "Vet" ? (
            <Grid item xs={4} sm={4} md={3} lg={3} xl={3}>
              <Select
                list={salutationList}
                value={vetValues?.salutation}
                handleChange={(e) => handleSelect(e, "salutation")}
                name="salutation"
                label={nameExpan?.["salutation"]}
                select
                // error={vetErrors?.salutation}
                // helperText={vetHelps?.salutation}
                labelTop
              />
            </Grid>
          ) : null}
          <Grid
            item
            xs={createUserType === "Vet" ? 8 : 6}
            sm={createUserType === "Vet" ? 8 : 6}
            md={createUserType === "Vet" ? 9 : 6}
            lg={createUserType === "Vet" ? 9 : 6}
            xl={createUserType === "Vet" ? 9 : 6}
          >
            <CustomTextField
              label={nameExpan?.["name"]}
              placeholder={nameExpan?.["name"]}
              name="name"
              fullWidth
              // handleChange={handleChange}
              value={vetValues?.name}
              // helperText={vetHelps?.name}
              // error={vetErrors?.name}
              labelTop
            />
          </Grid>
          {createUserType === "Other" ? (
            <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
              <Select
                // list={typeList}
                value={vetValues?.conType}
                // handleChange={handleMultiSelect}
                multiSelectTagCheck
                label="Role"
                // error={vetErrors?.conType}
                // helperText={vetHelps?.conType}
                labelTop
              />
            </Grid>
          ) : null} */}

          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <Checkbox
              label="Auto-Generate Password"
              // checked={isAutoGenPass}
              // onChange={handleAutoGenPassword}
            />
          </Grid>
          <div className="flex1-end">
            <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
              <CustomButton text="Register" onClick={createPet} />
            </Grid>
          </div>
        </Grid>
      </CustomModal>
    </>
  );
};

export default ClinicPets;
