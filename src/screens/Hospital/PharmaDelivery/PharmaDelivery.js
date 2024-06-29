import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Table from "../../../components/CustomTable";
import SearchRow from "../../../components/SearchRow/SearchRow";
import TopBar from "../../../components/TopBar/TopBar";
import Header from "../../../layouts/header";
import { getMedicalOrdersByClinic } from "../../../redux/reducers/clinicSlice";
import { appointDropList } from "../../../util/dropList";

const tableHeaders = [
  "orderId",
  "pets",
  "date",
  "vets",
  "orderStatus",
  "amount",
  "action",
];

const PharmaDelivery = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const medicalOrders = useSelector((state) => state?.clinic?.medicalOrders);
  const [tableMedicalOrders, setTableMedicalOrders] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [searchTypeValue, setSearchTypeValue] = useState("pet-name");
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const defaultUrl = `?limit=${rowsPerPage}&skip=0&type=${searchTypeValue}`;

  useEffect(() => {
    dispatch(getMedicalOrdersByClinic(defaultUrl));
  }, []);

  const getTableMedicalOrders = () => {
    const tableOrders = medicalOrders?.orders?.map((ord) => {
      return {
        ...ord,
        orderId: ord?._id,
        pets: ord?.pet?.name,
        date: moment(ord?.filtered?.date).format("MMM DD, YYYY"),
        vets: ord?.doctor?.name,
        orderStatus: ord?.orderStatus,
        amount: ord?.medicalFee ?? 0,
        action: ord?.medicalFee === 0 ? "Create" : "View",
      };
    });
    setTableMedicalOrders(tableOrders);
  };

  useEffect(() => {
    getTableMedicalOrders();
  }, [medicalOrders]);

  const handleSearch = () => {
    setPage(1);
    const url = `?limit=${rowsPerPage}&skip=0${
      searchValue?.length > 0 ? `&search=${searchValue}` : ""
    }${searchTypeValue ? `&type=${searchTypeValue}` : ""}`;
    setTableMedicalOrders([]);
    dispatch(getMedicalOrdersByClinic(url));
  };

  const handleResetBtn = () => {
    setPage(1);
    setSearchTypeValue("pet-name");
    setSearchValue("");
    setTableMedicalOrders([]);
    dispatch(getMedicalOrdersByClinic(defaultUrl));
  };

  const handleChangePage = (e, selectedPage) => {
    const reqSkip = (selectedPage - 1) * rowsPerPage;
    setPage(selectedPage);
    setTableMedicalOrders([]);
    dispatch(
      getMedicalOrdersByClinic(
        `?limit=${rowsPerPage}&skip=${reqSkip}${
          searchValue?.length > 0 ? `&search=${searchValue}` : ""
        }${searchTypeValue ? `&type=${searchTypeValue}` : ""}`
      )
    );
  };

  return (
    <>
     
      {/* <TopBar name="Pharma Delivery" rightVerBtnShow={false} /> */}
      <SearchRow
        leftBtnTxt="Reset"
        rightBtnTxt="Search"
        searchValue={searchValue}
        searchTypeList={appointDropList}
        searchTypeValue={searchTypeValue}
        onSerchChange={(e) => setSearchValue(e.target.value)}
        handleChangeSearchValue={(e) => setSearchTypeValue(e.target.value)}
        onClickBlueBtn={handleSearch}
        onClickRedBtn={handleResetBtn}
      />
      <Table
        columns={tableHeaders}
        datas={tableMedicalOrders}
        page={page}
        rowsPerPage={rowsPerPage}
        totalRecords={medicalOrders?.totalRecords}
        handleChangePage={handleChangePage}
        isFromPharmaDelivery
        onClickAction={(e) => {
          navigate(`/pharma-prescription/${e?.orderId}`, { state: e });
        }}
      />
    </>
  );
};

export default PharmaDelivery;
