import { useEffect, useState } from "react";
import TopBar from "../../../components/TopBar/TopBar";
import Header from "../../../layouts/header";
import { useDispatch, useSelector } from "react-redux";
import { getAllVetTransaction } from "../../../redux/reducers/doctorSlice";
import { Grid } from "@mui/material";
import Table from "../../../components/CustomTable";
import moment from "moment";

const tableHeaders = [
  "transactionFrom",
  "transactionId",
  "dateAndTime",
  "amount",
];

const VetPaymentHistory = () => {
  const dispatch = useDispatch();
  const transactions = useSelector((state) => state.doctor.transactions);
  const [tableData, setTableDate] = useState([]);

  useEffect(() => {
    dispatch(getAllVetTransaction("?limit=10"));
  }, []);

  useEffect(() => {
    getTableData(transactions?.data);
  }, [transactions]);

  const getTableData = (data) => {
    const reqData = data?.map((tran) => {
      return {
        transactionFrom: tran?.user?.name,
        transactionId: tran?._id,
        dateAndTime: moment(tran?.createdAt).format("DD-MM-YYYY HH:mm"),
        amount: tran?.totalAmt,
      };
    });
    setTableDate(reqData ?? []);
  };

  return (
    <>
      <Header name="Vetinstant" />
      <TopBar name="Payment History" rightVerBtnShow={false} />
      <div className="com-mar">
        <Grid container spacing={1}>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <div className="left-con-white-wh">
              <div className="flex-center">
                <div>
                  <div className="flex-center blue-color med-font16">
                    You’ve earned
                  </div>
                  <div className="flex-center blue-color bold-font30">
                    ₹ {transactions?.total ?? 0}
                  </div>
                  <div className="flex-center blue-color med-font16">
                    via Vetinstant
                  </div>
                </div>
              </div>
              <div className="mt20">
                <Table columns={tableHeaders} datas={tableData} amountBold />
              </div>
            </div>
          </Grid>
        </Grid>
      </div>
    </>
  );
};

export default VetPaymentHistory;
