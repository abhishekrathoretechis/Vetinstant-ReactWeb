import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Table from "../../../components/CustomTable";
import SearchRow from "../../../components/SearchRow/SearchRow";
import TopBar from "../../../components/TopBar/TopBar";
import Header from "../../../layouts/header";
import { getDoctorPets } from "../../../redux/reducers/vetSlice";
import { petTypeList } from "../../../util/dropList";
// import CommonCreatePetComponent from "../../CommonComponents/CommonCreatePetComponent";

const tableHeaders = ["id", "petName", "userName", "gender", "breed", "age"];

const DoctorPets = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const pets = useSelector((state) => state.vet.doctorPets.pets);
  const [isTableView, setTableView] = useState(true);
  const [isCardView, setCardView] = useState(false);
  const [tablePets, setTablePets] = useState([]);
  // const [modalVisible, setModalVisible] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [searchTypeValue, setSearchTypeValue] = useState("dog");
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const defaultUrl = `?limit=${rowsPerPage}&skip=0&type=${searchTypeValue}`;

  useEffect(() => {
    dispatch(getDoctorPets());
  }, []);

  useEffect(() => {
    getAllPetList(pets);
  }, []);

  console.log("pets", pets);
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
        age: hos?.dob,
        userName: hos?.userName,
      };
    });
    setTablePets(reqHospitals);
  };

  // const modelOpen = () => {
  //   setModalVisible(!modalVisible);
  // };

  const handleEdit = (pet) => {
    navigate(`/pet-details/${pet?.petId}`, { state: pet });
  };

  const handleSearch = () => {
    setPage(1);
    const url = `?limit=${rowsPerPage}&skip=0${
      searchValue?.length > 0 ? `&search=${searchValue}` : ""
    }${searchTypeValue ? `&type=${searchTypeValue}` : ""}`;
    setTablePets([]);
    dispatch(getDoctorPets(url));
  };

  const handleResetBtn = () => {
    setPage(1);
    setSearchTypeValue("dog");
    setSearchValue("");
    setTablePets([]);
    dispatch(getDoctorPets(defaultUrl));
  };

  // const importPet = () => {
  //   console.log("import pet");
  // };

  // const downloadPet = () => {
  //   console.log("download pet");
  // };

  const handleChangePage = (e, selectedPage) => {
    const reqSkip = (selectedPage - 1) * rowsPerPage;
    setPage(selectedPage);
    setTablePets([]);
    dispatch(
      getDoctorPets(
        `?limit=${rowsPerPage}&skip=${reqSkip}${
          searchValue?.length > 0 ? `&search=${searchValue}` : ""
        }${searchTypeValue ? `&type=${searchTypeValue}` : ""}`
      )
    );
  };

  // const onApiDone = () => {
  //   setTablePets([]);
  //   dispatch(getDoctorPets(defaultUrl));
  // };

  return (
    <>
      <Header name="Vetinstant" />
      <TopBar
        name="Pets"
        // list={[
        //   { name: "Create Pet", onClick: modelOpen },
        //   { name: "Import Pets", onClick: importPet },
        //   { name: "Download Reports", onClick: downloadPet },
        // ]}
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
          rowsPerPage={rowsPerPage}
          totalRecords={pets?.totalRecords}
          handleChangePage={handleChangePage}
        />
      ) : null}

      {/* <CommonCreatePetComponent
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        onApiDone={onApiDone}
      /> */}
    </>
  );
};

export default DoctorPets;
