import { Grid } from "@mui/material";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Table from "../../../components/CustomTable";
import CustomTextField from "../../../components/CustomTextField";
import SearchRow from "../../../components/SearchRow/SearchRow";
import { hideLoader, showLoader } from "../../../redux/reducers/loaderSlice";
import { getMedicalHistoryByPetId } from "../../../redux/reducers/petSlice";
import { medicalHistoryTableHeaders } from "../../../util/CommonArrays";
import { conditionList } from "../../../util/arrayList";
import { medicalHistorySearchTypelist } from "../../../util/dropList";

const PetMedicalHistoryList = ({ state }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isTableView, setTableView] = useState(true);
  const [isCardView, setCardView] = useState(false);
  const [searchTypeValue, setSearchTypeValue] = useState(null);
  const [tableMedicalHistory, setTableMedicalHistory] = useState([]);
  const rowsPerPage = 10;
  const defaultUrl = `?limit=${rowsPerPage}&skip=0`;
  const [medHisPage, setMedHisPage] = useState(1);
  const medicalHistorys = useSelector((state) => state.pet.medicalHistorys);
  const [dateFrom, setDateFrom] = useState(new Date());
  const [dateTo, setDateTo] = useState(new Date());
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [searchByConditionValue, setSearchByConditionValue] = useState(null);

  useEffect(() => {
    dispatch(
      getMedicalHistoryByPetId({
        petId: state?.petId ?? state?.pet?._id,
        url: `${defaultUrl}&type=all`,
      })
    );
  }, []);

  useEffect(() => {
    if (searchTypeValue === "date_range") setDatePickerVisible(true);
    if (searchTypeValue === "condition") setDatePickerVisible(false);
    setMedHisPage(1);
  }, [searchTypeValue]);

  const getTableMedicalHistorys = (medicalHistoryList) => {
    dispatch(showLoader());
    const reqMedicalHistorys = medicalHistoryList?.map((med) => {
      return {
        ...med,
        date: moment(med?.visitDate).format("MMM DD, YYYY"),
        condition: med?.problemType?.[0],
        consultationType: med?.appointmentType ?? "Virtual",
      };
    });
    setTableMedicalHistory(reqMedicalHistorys);
    dispatch(hideLoader());
  };

  useEffect(() => {
    getTableMedicalHistorys(medicalHistorys?.medicalHistorys);
  }, [medicalHistorys]);

  const handleChangeAppointmentsPage = (e, selectedPage) => {
    const reqSkip = (selectedPage - 1) * rowsPerPage;
    setMedHisPage(selectedPage);
    const url = `?limit=${rowsPerPage}&skip=${reqSkip}&type=${
      searchTypeValue ? searchTypeValue : "all"
    }${
      searchTypeValue
        ? searchTypeValue === "condition"
          ? `&value=${searchByConditionValue}`
          : `&from_date=${moment(new Date(dateFrom)).format(
              "YYYY-MM-DD"
            )}&end_date=${moment(new Date(dateTo)).format("YYYY-MM-DD")}`
        : ""
    }`;
    dispatch(
      getMedicalHistoryByPetId({
        petId: state?.petId,
        url,
      })
    );
  };

  const handleViewBtn = (medHis) => {
    const petId = medHis?.petId ?? state?.petId;
    navigate(`/medical-history/${petId}/${medHis?._id}`, {
      state: {
        pet: state?.pet,
        medicalHistory: medHis,
        // activeTab
      },
    });
  };

  const handleCardTableView = () => {
    setTableView(!isTableView);
    setCardView(!isCardView);
  };

  const handleSearch = () => {
    if (!setSearchTypeValue) return;
    const url = `?limit=${rowsPerPage}&skip=0&type=${searchTypeValue}${
      searchTypeValue === "condition"
        ? `&value=${searchByConditionValue}`
        : `&from_date=${moment(new Date(dateFrom)).format(
            "YYYY-MM-DD"
          )}&end_date=${moment(new Date(dateTo)).format("YYYY-MM-DD")}`
    }`;
    dispatch(
      getMedicalHistoryByPetId({
        petId: state?.petId,
        url,
      })
    );
  };

  const handleResetBtn = () => {
    setSearchTypeValue(null);
    setSearchByConditionValue(null);
    setDatePickerVisible(false);
    setMedHisPage(1);
    dispatch(
      getMedicalHistoryByPetId({
        petId: state?.petId,
        url: `${defaultUrl}&type=all`,
      })
    );
  };

  return (
    <>
      <div className="mhMin20">
        <SearchRow
          leftBtnTxt="Reset"
          rightBtnTxt="Search"
          tableView={isTableView}
          cardView={isCardView}
          onClickCardView={handleCardTableView}
          onClickTableView={handleCardTableView}
          searchTypeList={medicalHistorySearchTypelist}
          searchTypeValue={searchTypeValue}
          handleChangeSearchValue={(e) => setSearchTypeValue(e.target.value)}
          onClickBlueBtn={handleSearch}
          onClickRedBtn={handleResetBtn}
          searchByCondition
          searchByConditionSelected={
            searchTypeValue === "condition" ? true : false
          }
          searchByConditionList={conditionList}
          searchByConditionValue={searchByConditionValue}
          handleChangeSearchConditionValue={(e) =>
            setSearchByConditionValue(e.target.value)
          }
        />
      </div>
      {datePickerVisible ? (
        <Grid
          container
          spacing={0}
          direction="row"
          alignItems="center"
          className="mv5 mh10"
        >
          <Grid item xs={6} sm={4} md={4} lg={4} xl={4}>
            <div className="">
              <CustomTextField
                label="From Date"
                name="fromDate"
                fullWidth
                handleChange={(e) => setDateFrom(e?.target?.value)}
                value={dateFrom}
                mobileDate
              />
            </div>
          </Grid>
          <Grid item xs={6} sm={4} md={4} lg={4} xl={4}>
            <div className="ml10 w100Per">
              <CustomTextField
                label="To Date"
                name="toDate"
                fullWidth
                handleChange={(e) => setDateTo(e?.target?.value)}
                value={dateTo}
                mobileDate
              />
            </div>
          </Grid>
        </Grid>
      ) : null}
      <Table
        columns={medicalHistoryTableHeaders}
        datas={tableMedicalHistory}
        isCustomTableSty
        onClickViewBtn={handleViewBtn}
        page={medHisPage}
        rowsPerPage={rowsPerPage}
        totalRecords={medicalHistorys?.totalRecords}
        handleChangePage={handleChangeAppointmentsPage}
      />
    </>
  );
};

export default PetMedicalHistoryList;
