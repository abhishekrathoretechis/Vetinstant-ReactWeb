import { capitalize } from "lodash";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Table from "../../../components/CustomTable";
import SearchRow from "../../../components/SearchRow/SearchRow";
import TopBar from "../../../components/TopBar/TopBar";
import Header from "../../../layouts/header";
import { hideLoader, showLoader } from "../../../redux/reducers/loaderSlice";
import { getAppointsmentsVetId } from "../../../redux/reducers/vetSlice";
import {
  appointmentSearchTypeList,
  dateFilterList,
} from "../../../util/dropList";
import "./VetAppointment.css";

const tableHeaders = [
  "petName",
  "userName",
  "dateAndTime",
  "consultationType",
  "appointmentStatus",
  "View",
];

const VetAppointments = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isTableView, setTableView] = useState(true);
  const [isCardView, setCardView] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [searchTypeValue, setSearchTypeValue] = useState("pet-name");
  const [tableAppointments, setTableAppointments] = useState([]);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const vetId = localStorage.getItem("userId");
  const appointments = useSelector((state) => state?.vet?.appointments?.list);
  const [dateFilterValue, setDateFilterValue] = useState("this");
  const defaultUrl = `?limit=${rowsPerPage}&skip=0&filter=${dateFilterValue}`;

  useEffect(() => {
    dispatch(getAppointsmentsVetId(dateFilterValue));
    setSearchValue("");
  }, [dateFilterValue]);

  const getTableAppointments = () => {
    dispatch(showLoader());
    const requiredAppointments = appointments?.map((app) => {
      return {
        ...app,
        petName: app?.petName,
        dateAndTime:
          moment(app?.appoinmentDate).format("MMM DD") +
          " " +
          app?.appoimentTime,
        consultationType: app?.appoinmentType,
        userName: app?.userName,
        appointmentStatus: capitalize(app?.appoinmentStatus),
      };
    });
    setTableAppointments(requiredAppointments);
    dispatch(hideLoader());
  };

  useEffect(() => {
    getTableAppointments();
  }, [appointments]);

  const handleCardTableView = () => {
    setTableView(!isTableView);
    setCardView(!isCardView);
  };

  const handleSearch = () => {
    setPage(1);
    const url = `?limit=${rowsPerPage}&skip=0&filter=${dateFilterValue}${
      searchValue?.length > 0 ? `&search=${searchValue}` : ""
    }${searchTypeValue ? `&type=${searchTypeValue}` : ""}`;
    setTableAppointments([]);
    dispatch(getAppointsmentsVetId({ vetId, url }));
  };

  const handleResetBtn = () => {
    setPage(1);
    setSearchTypeValue("pet-name");
    setSearchValue("");
    setTableAppointments([]);
    dispatch(
      getAppointsmentsVetId({
        vetId,
        url: `?limit=${rowsPerPage}&skip=0&filter=${dateFilterValue}`,
      })
    );
  };

  const handleChangePage = (e, selectedPage) => {
    const reqSkip = (selectedPage - 1) * rowsPerPage;
    setPage(selectedPage);
    setTableAppointments([]);
    dispatch(
      getAppointsmentsVetId({
        vetId,
        url: `?filter=${dateFilterValue}&limit=${rowsPerPage}&skip=${reqSkip}${
          searchValue?.length > 0 ? `&search=${searchValue}` : ""
        }${searchTypeValue ? `&type=${searchTypeValue}` : ""}`,
      })
    );
  };

  const handleView = (detail) => {
    console.log("detail", detail);
    navigate("/vet-appointment-details", {
      state: {
        checkIn: detail?.checkIn,
        callIn: detail?.callIn,
        date: detail?.extraInfo,
        appoimentId: detail?.appoimentId,
        consultationType:
          detail?.appoinmentType === "V" ? "Virtual" : "Physical",
        pet: detail?.petId,
        userName: detail?.userName,
        deleteAfter: detail?.expaire,
        docId: detail?.docId,
        userId: detail?.userId,
        userToken: detail?.userId?.token,
        isPrescriptionGiven: detail?.prescriptionStatus,
        petName: detail?.petName,
        petImage: detail?.petImage,
      },
    });
  };

  return (
    <>
      <Header name="Vetinstant" />
      <TopBar name="Appointments" rightVerBtnShow={false} />
      <SearchRow
        leftBtnTxt="Reset"
        rightBtnTxt="Search"
        tableView={isTableView}
        cardView={isCardView}
        onClickCardView={handleCardTableView}
        onClickTableView={handleCardTableView}
        onSerchChange={(e) => setSearchValue(e.target.value)}
        searchValue={searchValue}
        searchTypeList={appointmentSearchTypeList}
        searchTypeValue={searchTypeValue}
        handleChangeSearchValue={(e) => setSearchTypeValue(e.target.value)}
        onClickBlueBtn={handleSearch}
        onClickRedBtn={handleResetBtn}
        dateFilterTypeList={dateFilterList}
        dateFilterValue={dateFilterValue}
        onChangeDateFilterValue={(e) => setDateFilterValue(e.target.value)}
        dateFilter
      />
      {isTableView ? (
        <Table
          columns={tableHeaders}
          datas={tableAppointments}
          page={page}
          rowsPerPage={rowsPerPage}
          totalRecords={appointments?.totalRecords}
          handleChangePage={handleChangePage}
          onClickViewBtn={handleView}
        />
      ) : null}
    </>
  );
};

export default VetAppointments;
