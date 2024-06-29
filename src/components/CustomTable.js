import {
  Box,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  Container,
  TableFooter,
  TableHead,
  TableRow,
  TableSortLabel,
} from "@mui/material";
import { visuallyHidden } from "@mui/utils";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { getAge } from "../util/getAge";
import CustomSwitch from "./CustomSwitch";
import CustomTextField from "./CustomTextField";
import { AppColors } from "../util/AppColors";

const displayName = {
  id: "Id",
  orderId: "Order Id",
  clinicName: "Clinic Name",
  location: "Location",
  consultationType: "Consultation Type",
  noOfVets: "No. of vets",
  petName: "Pet Name",
  gender: "Gender",
  breed: "Breed",
  age: "Age",
  status: "Status",
  orderStatus: "Order Status",
  invoiceNo: "Invoice No",
  pets: "Pets",
  vets: "Vets",
  date: "Date",
  amount: "Amount",
  paymentStatus: "Payment Status",
  appointmentId: "Appointment Id",
  dateAndTime: "Date & Time",
  condition: "Condition",
  userName: "User Name",
  srNo: "Sr.No.",
  medicine: "Medicine",
  dose: "Dose",
  duration: "Duration",
  from: "From",
  to: "To",
  days: "Days",
  clinic: "Clinic",
  slot: "Slot",
  action: "Action",
  transactionFrom: "Transaction From",
  transactionId: "Transaction ID",
  appointmentStatus: "Status",
  name: "Name",
  emailId: "Email ID",
  role: "Role",
  accessStatus: "Status",
  suppliername: "Supplier Name",
  phone: "Phone",
  address: "Address",
  productCode: "Product Code",
  productName: "Product Name",
  unitType: "Unit Type",
  unitPrice: "Unit Price",
  sellingPrice: "Selling Price",
  recorderLevel: "Recorder Level",
  servicename: "Service Name",
  category: "Category",
  description: "Description",

  price: "Price",
  quantity: "Quantity",
  remarks: "Remarks",
  qty: "Qty",
  discount: "Discount",
  tax: "Tax(%)",
  total: "Total",
  serviceitemname: "Service/Item Name",
  amt: "Amount",
  email: "Email Id",
  parentname: "Parents Name",
  trDate: "Tr. Date",
  balanceDue: "Balance Due",
  vetName: "Vet Name",
  branchLocation: "Branch Location",
  authorisedPerson: "Authorised Person",
  dueDate: "Due Date",
  attachment: "Attachment",
  remark: "Remarks",
  type: "Type",
  file: "Attachment",
  statusDig: "Status",
  serviceName: "Service Name",
  username:"User Name",
  vetname:"Vet Name",
  appointmentdatetime:"Appointment Date & Time",
  petname:"Pet Name"
};

const CustomTable = ({
  columns,
  datas,
  onClickEditBtn,
  isCustomTableSty,
  tableStyle,
  rowsPerPage,
  page,
  handleChangePage,
  totalRecords,
  onClickViewBtn,
  isFromManageSlot,
  onChangeSwitch,
  rowPick,
  onSelectedRow,
  onClickAction,
  isFromPharmaDelivery,
  onChangeAmount,
  isFromPharmaDeliveryDetails,
  isInputDiabled,
  amountBold,
  grey,
  onClickPay,
  preventive,
  onEdit,
  product,
  onClickFile,
}) => {
  const [sortingType, setSortingType] = useState("asc");
  const [sortBy, setSortBy] = useState("calories");
  const [selected, setSelected] = useState([]);

  function stableSort(array, comparator) {
    const stabilizedThis = array?.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const sortingType = comparator(a[0], b[0]);
      if (sortingType !== 0) {
        return sortingType;
      }
      return a[1] - b[1];
    });
    return stabilizedThis?.map((el) => el[0]);
  }

  function descendingComparator(a, b, sortBy) {
    if (b[sortBy] < a[sortBy]) {
      return -1;
    }
    if (b[sortBy] > a[sortBy]) {
      return 1;
    }
    return 0;
  }

  function getComparator(sortingType, sortBy) {
    return sortingType === "desc"
      ? (a, b) => descendingComparator(a, b, sortBy)
      : (a, b) => -descendingComparator(a, b, sortBy);
  }

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const handleRequestSort = (sortingBy) => {
    const isAsc = sortBy === sortingBy && sortingType === "asc";
    setSortingType(isAsc ? "desc" : "asc");
    setSortBy(sortingBy);
  };

  const createSortHandler = (sortingBy) => {
    handleRequestSort(sortingBy);
  };

  const totalPage = Math.ceil(totalRecords / rowsPerPage);

  return (
    <Container maxWidth="xl">
      <Box
        className={isCustomTableSty ? "" : "pb-40"}
        style={isCustomTableSty ? { ...tableStyle, borderRadius: 10 } : {}}
      >
        <TableContainer>
          <Table
            sx={{ minWidth: 200 }}
            aria-labelledby="tableTitle"
            // size={ 'small' : 'medium'}
          >
            <TableHead>
              <TableRow>
                {columns?.map((column, i) => (
                  <TableCell
                    key={i}
                    //   align={headCell.numeric ? "right" : "left"}
                    //   padding={headCell.disablePadding ? "none" : "normal"}
                    style={{
                      backgroundColor: grey
                        ? "rgba(96, 110, 128, 0.7)"
                        : "white",
                      color: grey ? AppColors.white : AppColors.appPrimary,
                      textAlign: "left",
                    }}
                    sortDirection={sortBy === column ? sortingType : false}
                    className="table-header-text"
                  >
                    <TableSortLabel
                      active={sortBy === column}
                      direction={sortBy === column ? sortingType : "asc"}
                      onClick={() => createSortHandler(column)}
                    >
                      {displayName[column]}
                      {sortBy === column ? (
                        <Box component="span" sx={visuallyHidden}>
                          {sortingType === "desc"
                            ? "sorted descending"
                            : "sorted ascending"}
                        </Box>
                      ) : null}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            {datas?.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={12}
                  style={{ textAlign: "center", height: 100 }}
                >
                  <div className="no-rec">No records available</div>
                </TableCell>
              </TableRow>
            )}

            <TableBody>
              {stableSort(datas, getComparator(sortingType, sortBy))?.map(
                (data, index) => {
                  const isItemSelected = isSelected(data?.name);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => {
                        handleClick(event, data.name);
                        if (rowPick) onSelectedRow(data);
                      }}
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={index}
                      selected={isItemSelected}
                      // style={{ borderBottom: '1px solid #ccc' }}
                    >
                      {columns?.map((label, i) => {
                        // label === "consultationType" ? (
                        //   <TableCell key={label + i} component="th" id={labelId}>
                        //     <div className="upload-row">
                        //       {typeList?.map((type) => (
                        //         <div
                        //           className={
                        //             data[label]?.find((ty) => ty === type?.value)
                        //               ? "consultation-type-active"
                        //               : "consultation-type"
                        //           }
                        //           key={type?.value}
                        //         >
                        //           {type?.name}
                        //         </div>
                        //       ))}
                        //     </div>
                        //   </TableCell>
                        // ) : label === "View" ? (
                        //   <TableCell
                        //     key={label + i}
                        //     component="th"
                        //     id={labelId}
                        //     sx={{
                        //       color: AppColors.appPrimary,
                        //       cursor: "pointer",
                        //     }}
                        //     onClick={() => onClickViewBtn(data)}
                        //   >
                        //     View
                        //   </TableCell>
                        // ) : label === "Edit" ? (
                        //   <TableCell
                        //     key={label + i}
                        //     component="th"
                        //     id={labelId}
                        //     sx={{
                        //       color: AppColors.appPrimary,
                        //       cursor: "pointer",
                        //     }}
                        //     onClick={() => onClickEditBtn(data)}
                        //   >
                        //     Edit
                        //   </TableCell>
                        // ) :
                        return label === "View" ? (
                          <TableCell
                            key={label + i}
                            component="th"
                            id={labelId}
                            className="table-text-blue cursor"
                            onClick={() => onClickViewBtn(data)}
                            // style={{ borderBottom: "1px solid #ccc" }}
                          >
                            View
                          </TableCell>
                        ) : label === "petName" ? (
                          <TableCell
                            key={label + i}
                            component="th"
                            id={labelId}
                            className="table-text-black capitalize"
                          >
                            {/* Add Pet Image */}
                            {label === "petName" && (
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                {/* Assuming data has a petImage property containing the URL */}
                                <img
                                  src={data.petImage}
                                  alt={data.petName}
                                  style={{
                                    width: 35,
                                    height: 35,
                                    marginRight: 10,
                                    borderRadius: 5,
                                  }}
                                />
                                <div
                                  style={{
                                    fontFamily: "Montserrat",
                                    fontWeight: "600",
                                    fontSize: "14px",
                                  }}
                                >
                                  {data[label]}
                                </div>
                              </div>
                            )}
                            {/* Other Cell Content */}
                            {label !== "petName" && data[label]}
                          </TableCell>
                        ) : label === "petname" ? (
                          <TableCell
                            key={label + i}
                            component="th"
                            id={labelId}
                            className="table-text-black capitalize"
                          >
                            {/* Add Pet Image */}
                            {label === "petname" && (
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap:"10px"
                                }}
                              >
                                {/* Assuming data has a petImage property containing the URL */}
                             
                                <div
                                  style={{
                                    fontFamily: "Montserrat",
                                    fontWeight: "600",
                                    fontSize: "14px",
                                  }}
                                >
                                  {data[label]}
                                </div>
                                <img
                                  src={data.petImage}
                                  alt={data.petname}
                                  style={{
                                    width: 35,
                                    height: 35,
                                    marginRight: 10,
                                    borderRadius: 5,
                                  }}
                                />
                              </div>
                            )}
                            {/* Other Cell Content */}
                            {label !== "petname" && data[label]}
                          </TableCell>
                        )
                        : label === "clinicName" ||
                          label === "invoiceNo" ||
                          label === "appointmentId" ||
                          label === "condition" ? (
                          <TableCell
                            key={label + i}
                            component="th"
                            id={labelId}
                            className="table-text-blue cursor capitalize"
                            onClick={() => onClickEditBtn(data)}
                            // style={{ borderBottom: "1px solid #ccc" }}
                          >
                            {data[label]}
                          </TableCell>
                        ) : label === "breed" ? (
                          <TableCell
                            key={label + i}
                            component="th"
                            id={labelId}
                            style={{ textAlign: "center" }}
                          >
                            <div className="upload-row">
                              <div
                                className="breed text400"
                                style={{
                                  // backgroundColor: "white",
                                  fontFamily: "Montserrat",
                                  fontWeight: "600",
                                  fontSize: "14px",
                                  color: "#464E5F",
                                }}
                              >
                                {data[label]}
                              </div>
                            </div>
                          </TableCell>
                        ) : label === "parentname" ? (
                          <TableCell
                            key={label + i}
                            component="th"
                            id={labelId}
                          >
                            <div className="upload-row">
                              <div
                                className="breed text400"
                                style={{
                                  // backgroundColor: "white",
                                  fontFamily: "Montserrat",
                                  fontWeight: "600",
                                  fontSize: "14px",
                                  color: "#464E5F",
                                }}
                              >
                                {data[label]}
                              </div>
                            </div>
                          </TableCell>
                        ) : label === "pay" ? (
                          <TableCell
                            key={label + i}
                            component="th"
                            id={labelId}
                            className="cursor"
                            onClick={() => onClickPay(data)}
                          >
                            <div className="upload-row">
                              <div>{data[label]}</div>
                            </div>
                          </TableCell>
                        ) : label === "logo" ? (
                          <TableCell
                            key={label + i}
                            component="th"
                            id={labelId}
                            // onClick={() => onClickPay(data)}
                          >
                            <div className="upload-row">
                              <div>{data[label]}</div>
                            </div>
                          </TableCell>
                        ) : label === "gender" ? (
                          <TableCell
                            key={label + i}
                            component="th"
                            id={labelId}
                            style={{ textAlign: "left" }}
                          >
                            <div className="upload-row">
                              <div
                                className="breed text400 capitalize"
                                style={{
                                  // backgroundColor: "white",
                                  fontFamily: "Montserrat",
                                  fontWeight: "600",
                                  fontSize: "14px",
                                  color:
                                    data[label] === "male"
                                      ? "#6C84FB"
                                      : "#FF71CF",
                                }}
                              >
                                {/* {data[label] ==='male' ? data[label].charAt(0).toUpperCase() +
                                  data[label].slice(1) : (data[label].charAt(0).toUpperCase() +
                                  data[label].slice(1)) } */}
                                {data[label]?.charAt(0)?.toUpperCase() +
                                  data[label]?.slice(1)}
                                {/* {data[label].toLowerCase() === "female"
                                  ? " (Female)"
                                  : null} */}
                              </div>
                            </div>
                          </TableCell>
                        ) : label === "status" ? (
                          isFromManageSlot ? (
                            <TableCell
                              key={label + i}
                              component="th"
                              id={labelId}
                            >
                              <CustomSwitch
                                value={data[label]}
                                onChange={() => onChangeSwitch(data)}
                                greenToRed
                              />
                            </TableCell>
                          ) : preventive ? (
                            <TableCell
                              key={label + i}
                              component="th"
                              id={labelId}
                            >
                              <div
                                style={{
                                  color:
                                    data[label] === "Pending"
                                      ? "#FF8A00"
                                      : data[label] === "Completed"
                                      ? "#339903"
                                      : data[label] === "Overdue"
                                      ? "#FF0000"
                                      : "inherit",
                                  backgroundColor:
                                    data[label] === "Pending"
                                      ? "#FFF3D6"
                                      : data[label] === "Completed"
                                      ? "lightgreen"
                                      : data[label] === "Overdue"
                                      ? "lightcoral"
                                      : "inherit",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  borderRadius: "5px",
                                  padding: "5px",
                                }}
                              >
                                {data[label]}
                              </div>
                            </TableCell>
                          ) : (
                            <TableCell
                              key={label + i}
                              component="th"
                              id={labelId}
                            >
                              <div className="table-status-row">
                                <div
                                  className={
                                    data[label] === "Active"
                                      ? "table-status-active-dot"
                                      : "table-status-inactive-dot"
                                  }
                                />
                                <div className="table-text-black capitalize">
                                  {/* {data[label]} */}
                                </div>
                              </div>
                            </TableCell>
                          )
                        ) : label === "action" ? (
                          isFromManageSlot ? (
                            <TableCell
                              key={label + i}
                              component="th"
                              id={labelId}
                            >
                              {/* <CloseIcon
                                sx={{
                                  stroke: AppColors.redBtn,
                                  strokeWidth: 2,
                                }}
                                className="cursor"
                                onClick={() => onClickAction(data)}
                              /> */}
                            </TableCell>
                          ) : isFromPharmaDelivery ? (
                            <TableCell
                              key={label + i}
                              component="th"
                              id={labelId}
                              className="table-order-txt cursor capitalize"
                              onClick={() => onClickAction(data)}
                            >
                              {data[label] === "Create"
                                ? "Create Order"
                                : "View Order"}
                            </TableCell>
                          ) : null
                        ) : label === "orderStatus" ? (
                          <TableCell
                            key={label + i}
                            component="th"
                            id={labelId}
                          >
                            <div className="table-status-row">
                              <div
                                className={
                                  data[label] === "Pending"
                                    ? "table-red-txta"
                                    : data[label] === "Ordered" ||
                                      data[label] === "Delivered"
                                    ? "table-green-txt"
                                    : data[label] === "Transit" ||
                                      data[label] === "Submitted"
                                    ? "table-yellow-txt"
                                    : ""
                                }
                              >
                                {data[label]}
                              </div>
                            </div>
                          </TableCell>
                        ) : label === "paymentStatus" ? (
                          <TableCell
                            key={label + i}
                            component="th"
                            id={labelId}
                          >
                            <div className="table-status-row">
                              <div
                                className={`capitalize ${
                                  data[label] === "Paid"
                                    ? "table-text-green"
                                    : data[label] === "Unpaid"
                                    ? "table-text-red"
                                    : "table-org-txt"
                                }`}
                              >
                                {data[label]}
                              </div>
                            </div>
                          </TableCell>
                        ) : label === "amount" ? (
                          <TableCell
                            key={label + i}
                            component="th"
                            id={labelId}
                            className={`capitalize ${
                              amountBold
                                ? "table-order-txt"
                                : "table-text-black"
                            }`}
                          >
                            {isFromPharmaDeliveryDetails ? (
                              <CustomTextField
                                value={data[label]}
                                handleChange={(e) =>
                                  onChangeAmount({
                                    obj: data,
                                    value: e.target.value,
                                  })
                                }
                                fullWidth
                                startIcon
                                inputIcon="₹"
                                disabled={isInputDiabled}
                              />
                            ) : (
                              `₹ ${data[label]}`
                            )}
                          </TableCell>
                        ) : label === "type" ? (
                          <TableCell
                            key={label + i}
                            component="th"
                            id={labelId}
                            className="table-text-black-semibold capitalize"
                          >
                            {data[label]}
                          </TableCell>
                        ) : label === "file" ? (
                          <TableCell
                            key={label + i}
                            component="th"
                            id={labelId}
                            className={
                              data[label]?.length > 0 && "blue2 cursor"
                            }
                            onClick={() => onClickFile(data)}
                          >
                            {preventive && data[label]?.length > 0
                              ? `${
                                  data[label]?.length > 0
                                    ? `${data[label]?.length} Attachment`
                                    : "Nil"
                                }`
                              : "Nil"}
                          </TableCell>
                        ) : label === "preventiveImage" ? (
                          <TableCell
                            key={label + i}
                            component="th"
                            id={labelId}
                            className="cursor"
                          >
                            {data["status"] === "Pending" ? (
                              <div onClick={() => onEdit(data)}>
                                <img
                                  src={require("../assets/images/png/edit.png")}
                                  alt=""
                                />
                              </div>
                            ) : !product ? (
                              <div>
                                <img
                                  src={require("../assets/images/png/eye.png")}
                                />
                              </div>
                            ) : (
                              <div>
                                <img
                                  src={require("../assets/images/png/edit.png")}
                                />
                              </div>
                            )}
                          </TableCell>
                        ) : label === "srNo" ? (
                          <TableCell
                            key={label + i}
                            component="th"
                            id={labelId}
                            className="table-text-blue capitalize"
                          >
                            {data[label]}
                          </TableCell>
                        ) : (
                          <TableCell
                            key={label + i}
                            component="th"
                            id={labelId}
                            className="table-text-black capitalize"
                          >
                            {label === "age"
                              ? getAge(data[label], true)
                              : data[label]}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                }
              )}
            </TableBody>
            {totalPage > 1 ? (
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={12}>
                    <div className="flex-end">
                      <Pagination
                        count={totalPage}
                        variant="outlined"
                        color="primary"
                        page={page}
                        onChange={handleChangePage}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              </TableFooter>
            ) : null}
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
};

CustomTable.propTypes = {
  columns: PropTypes.array,
  datas: PropTypes.array,
  onClickEditBtn: PropTypes.func,
  onEdit: PropTypes.func,
  isCustomTableSty: PropTypes.bool,
  tableStyle: PropTypes.object,
  rowsPerPage: PropTypes.number,
  page: PropTypes.number,
  handleChangePage: PropTypes.func,
  totalRecords: PropTypes.number,
  onClickViewBtn: PropTypes.func,
  isFromManageSlot: PropTypes.bool,
  onChangeSwitch: PropTypes.func,
  rowPick: PropTypes.bool,
  onSelectedRow: PropTypes.object,
  onClickAction: PropTypes.func,
  onClickPay: PropTypes.func,
  isFromPharmaDelivery: PropTypes.bool,
  isFromPharmaDeliveryDetails: PropTypes.bool,
  isInputDiabled: PropTypes.bool,
  amountBold: PropTypes.bool,
  onClickFile: PropTypes.func,
};

CustomTable.defaultProps = {
  columns: [],
  datas: [],
  onClickEditBtn: () => {},
  isCustomTableSty: false,
  tableStyle: {},
  rowsPerPage: 5,
  page: 0,
  handleChangePage: () => {},
  totalRecords: 0,
  onClickViewBtn: () => {},
  isFromManageSlot: false,
  onChangeSwitch: () => {},
  rowPick: false,
  onSelectedRow: {},
  onClickAction: () => {},
  isFromPharmaDelivery: false,
  isFromPharmaDeliveryDetails: false,
  isInputDiabled: false,
  amountBold: false,
  onClickFile: () => {},
};

export default CustomTable;
