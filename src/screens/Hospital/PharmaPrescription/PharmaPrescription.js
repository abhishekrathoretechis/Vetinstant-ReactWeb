import moment from "moment";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import CustomButton from "../../../components/CustomButton";
import Table from "../../../components/CustomTable";
import SearchRow from "../../../components/SearchRow/SearchRow";
import TopBar from "../../../components/TopBar/TopBar";
import Header from "../../../layouts/header";
import "./PharmaPrescription.css";
import { useDispatch } from "react-redux";
import { updateMedicineFeesByMedicationId } from "../../../redux/reducers/clinicSlice";

const tableHeaders = [
  "srNo",
  "medicine",
  "dose",
  "duration",
  "from",
  "to",
  "amount",
];

const PharmaPrescription = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();
  const location = useLocation();
  const state = location?.state;
  const medicationList = state?.filtered?.medication;
  const [tableData, setTableData] = useState([]);

  const getTableMedicationList = (list) => {
    const reqList = list?.map((li, i) => {
      return {
        ...li,
        from: moment(li?.dateFrom).format("MMM DD, YYYY"),
        to: moment(li?.dateTo).format("MMM DD, YYYY"),
        duration: li?.timingDuration,
        amount: li?.price,
        srNo: i + 1,
      };
    });
    setTableData(reqList);
  };

  useEffect(() => {
    if (medicationList?.length > 0) {
      return getTableMedicationList(medicationList);
    }
    setTableData([]);
  }, [medicationList]);

  const handleBackBtn = () => {
    navigate(-1);
  };

  const handleChangeTableAmount = (object, value) => {
    const reqArr = tableData?.map((data) => {
      if (data?.srNo === object?.srNo) return { ...data, amount: value };
      return data;
    });
    setTableData(reqArr);
  };

  const handleSubmit = async () => {
    let medicalFee = 0;
    const reqArr = tableData?.map((li) => {
      medicalFee = medicalFee + Number(li?.amount);
      return {
        medicine: li?.medicine,
        dose: li?.dose,
        dateFrom: li?.dateFrom,
        dateTo: li?.dateTo,
        timingDuration: li?.duration,
        price: li?.amount,
      };
    });
    const data = { medicalFee, medication: reqArr };
    const apiRes = await dispatch(
      updateMedicineFeesByMedicationId({
        medicationId: state?.orderId ?? params?.prescriptionId,
        data,
      })
    );
    if (apiRes?.payload) {
      navigate(-1);
    }
  };

  return (
    <>
      <Header name="Vetinstant" />
      <TopBar
        name="Pharma Delivery"
        orderId={state?.orderId ?? params?.prescriptionId}
        backBtn
        onClickBackBtn={handleBackBtn}
        rightVerBtnShow={false}
      />
      <SearchRow
        leftBtnTxt="Reset"
        rightBtnTxt="Search"
        // onSerchChange={(e) => setSearchValue(e.target.value)}
        // searchValue={searchValue}
        // searchTypeList={petTypeList}
        // searchTypeValue={searchTypeValue}
        // handleChangeSearchValue={(e) => setSearchTypeValue(e.target.value)}
        // onClickBlueBtn={handleSearch}
        // onClickRedBtn={handleResetBtn}
      />
      <Table
        columns={tableHeaders}
        datas={tableData}
        isFromPharmaDeliveryDetails
        onClickAction={(e) => console.log("VGVGV", e)}
        onChangeAmount={(e) => handleChangeTableAmount(e?.obj, e?.value)}
        isInputDiabled={state?.totalAmt > 0 ? true : false}
      />
      {state?.totalAmt === 0 ? (
        <div className="Phar-Pres-btn">
          <CustomButton text="Submit" onClick={handleSubmit} />
        </div>
      ) : null}
    </>
  );
};

export default PharmaPrescription;
