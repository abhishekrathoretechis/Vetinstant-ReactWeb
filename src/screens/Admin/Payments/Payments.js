import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Table from "../../../components/CustomTable";
import SearchRow from "../../../components/SearchRow/SearchRow";
import TopBar from "../../../components/TopBar/TopBar";
import Header from "../../../layouts/header";
import { getAdminPayments } from "../../../redux/reducers/paymentSlice";
import { paymentSearchTypeList } from "../../../util/dropList";
import { hideLoader, showLoader } from "../../../redux/reducers/loaderSlice";

const tableHeaders = [
  "invoiceNo",
  "pets",
  "date",
  "vets",
  "consultationType",
  "amount",
  "paymentStatus",
];

const Payments = () => {
  const dispatch = useDispatch();
  const [isTableView, setTableView] = useState(true);
  const [isCardView, setCardView] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [searchTypeValue, setSearchTypeValue] = useState("vet-name");
  const payments = useSelector((state) => state.payment.adminPayments);
  const [tablePayments, setTablePayments] = useState([]);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const defaultUrl = `?limit=${rowsPerPage}&skip=0&type=${searchTypeValue}`;

  useEffect(() => {
    dispatch(getAdminPayments(defaultUrl));
  }, []);

  const getTablePayments = () => {
    dispatch(showLoader());
    const requiredPayments = payments?.payments?.map((pay, i) => {
      return {
        invoiceNo: pay?.orderId,
        pets: pay?.pet?.name,
        date: moment(pay?.createdAt).format("MMM DD, YYYY"),
        vets: pay?.doctor?.name,
        consultationType: "Virtual",
        amount: pay?.totalAmt,
        paymentStatus: pay?.status === "success" ? "Paid" : "UnPaid",
      };
    });
    setTablePayments(requiredPayments);
    dispatch(hideLoader());
  };

  useEffect(() => {
    getTablePayments();
  }, [payments]);

  const handleCardTableView = () => {
    setTableView(!isTableView);
    setCardView(!isCardView);
  };

  const handleSearch = () => {
    setPage(1);
    const url = `?limit=${rowsPerPage}&skip=0${searchValue?.length > 0 ? `&search=${searchValue}` : ""
      }${searchTypeValue ? `&type=${searchTypeValue}` : ""}`;
    setTablePayments([]);
    dispatch(getAdminPayments(url));
  };

  const handleResetBtn = () => {
    setPage(1);
    setSearchTypeValue("vet-name");
    setSearchValue("");
    setTablePayments([]);
    dispatch(getAdminPayments(defaultUrl));
  };

  const handleChangePage = (e, selectedPage) => {
    const reqSkip = (selectedPage - 1) * rowsPerPage;
    setPage(selectedPage);
    setTablePayments([]);
    dispatch(
      getAdminPayments(
        `?limit=${rowsPerPage}&skip=${reqSkip}${searchValue?.length > 0 ? `&search=${searchValue}` : ""
        }${searchTypeValue ? `&type=${searchTypeValue}` : ""}`
      )
    );
  };

  return (
    <>
      <Header name="Vetinstant" />
      <TopBar name="Payments" rightVerBtnShow={false} />
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
        handleChangeSearchValue={(e) => setSearchTypeValue(e.target.value)}
        onClickBlueBtn={handleSearch}
        onClickRedBtn={handleResetBtn}
      />
      {isTableView ? (
        <Table
          columns={tableHeaders}
          datas={tablePayments}
          page={page}
          rowsPerPage={rowsPerPage}
          totalRecords={payments?.totalRecords}
          handleChangePage={handleChangePage}
        //   onClickEditBtn={handleEdit}
        />
      ) : null}
    </>
  );
};

export default Payments;
