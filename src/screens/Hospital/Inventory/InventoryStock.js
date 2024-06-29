import { Grid, Container } from "@mui/material";
import React, { useEffect, useState } from "react";
import CustomButton from "../../../components/CustomButton";
import CustomModal from "../../../components/CustomModal/CustomModal";
import Table from "../../../components/CustomTable";
import CustomTextField from "../../../components/CustomTextField";
import {
  default as CustomSelect,
  default as Select,
} from "../../../components/Select/Select";
import { InventoryList, ServiceList } from "../../../util/arrayList";

import moment from "moment/moment";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  createClinicService,
  createNewStock,
  editClinicService,
  getProductsByClinic,
  getServices,
  getStocksByClinic,
  getSupplier,
  getUnitType,
} from "../../../redux/reducers/clinicSlice";
import { hideLoader, showLoader } from "../../../redux/reducers/loaderSlice";

const tableHeaders = [
  "serviceName",
  "description",
  "tax",
  "sellingPrice",
  "editButton",
];

const initialValues = {
  serviceName: "",
  description: "",
  tax: "",
  sellingPrice: "",
};
const initialError = {
  serviceName: false,
  description: false,
  tax: false,
  sellingPrice: false,
};

const initialHelp = {
  serviceName: "",
  description: "",
  tax: "",
  sellingPrice: "",
};

const InventoryStock = () => {
  const dispatch = useDispatch();
  const services = useSelector((state) => state.clinic.services);
  const [serviceValues, setServiceValues] = useState(initialValues);
  const [serviceErrors, setServiceErrors] = useState(initialError);
  const [serviceHelps, setServiceHelps] = useState(initialHelp);
  const [serviceId, setServiceId] = useState(null);
  const [modVisible, setModVisible] = useState(false);
  const [tableStock, setTableStock] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);
  const [stockValues, setStockValues] = useState(initialValues);
  const rowsPerPage = 10;
  const defaultUrl = `?page=1&itemSize=${rowsPerPage}`;

  const suppliers = useSelector((state) =>
    state?.clinic?.suppliers?.data?.map((sup) => {
      return { ...sup, value: sup?.name };
    })
  );
  const products = useSelector((state) =>
    state.clinic.products?.data?.map((prd) => {
      return {
        ...prd,
        value: prd?.name,
      };
    })
  );
  const unitTypes = useSelector((state) =>
    state.clinic?.unittype?.map((ut) => {
      return { ...ut, value: ut?.name };
    })
  );

  useEffect(() => {
    dispatch(getServices(defaultUrl));
  }, [searchValue]);

  useEffect(() => {
    if (services?.length > 0) getSupplierTable(services);
  }, [services]);

  const getSupplierTable = (stock) => {
    console.log("stock", stock);
    dispatch(showLoader());
    const requiredStock = stock?.map((stock, i) => {
      return {
        serviceName: stock?.serviceName,
        sellingPrice: stock?.servicePrice,
        description: stock?.description,
        tax: stock?.tax,
        editButton: (
          <div
            onClick={() => handleEditModal(stock?.serviceId)}
            className="blue-color txt-semi-bold cursor "
          >
            <img
              src={require("../../../assets/images/png/edit.png")}
              alt=""
              className="h30"
            />
          </div>
        ),
      };
    });
    dispatch(hideLoader());
    setTableStock(requiredStock);
  };

  console.log("tableStock", tableStock);
  const validateField = (value) => {
    if (Array?.isArray(value)) {
      return value?.length > 0;
    } else {
      return typeof value === "string" && value.trim() !== "";
    }
  };

  const handleOpen = () => {
    setModVisible(true);
  };

  const handleClose = () => {
    setStockValues(initialValues);
    setModVisible(false);
  };

  // const handleCreateNewStock = async () => {
  //   const parsedQuantity = parseFloat(stockValues?.quantity);
  //   if (isNaN(parsedQuantity)) {
  //     console.error("Invalid quantity. Must be a number.");
  //     return;
  //   }
  //   const stockData = {
  //     date: moment(new Date(stockValues?.date)).format("YYYY-MM-DD"),
  //     supplierName: stockValues?.supplierName,
  //     productName: stockValues?.productName,
  //     unitType: stockValues?.unitType,
  //     quantity: parsedQuantity,
  //     type: stockValues?.type,
  //     remark: stockValues?.remarks,
  //   };

  //   try {
  //     const apiRes = await dispatch(createNewStock(stockData));
  //     if (apiRes?.payload) {
  //       dispatch(getStocksByClinic());
  //       handleClose();
  //     }
  //   } catch (error) {
  //     console.error("Error:", error);
  //   }
  // };

  const handleSubmit = async () => {
    const nameValid = validateField(serviceValues?.serviceName);
    const sellingPriceValid = validateField(serviceValues?.sellingPrice);
    const descriptionValid = validateField(serviceValues?.description);
    const taxValid = validateField(serviceValues?.tax);

    // If any validation fails, update the state to show errors
    if (!nameValid || !sellingPriceValid || !descriptionValid || !taxValid) {
      setServiceErrors({
        serviceName: !nameValid,
        sellingPrice: !sellingPriceValid,
        description: !descriptionValid,
        tax: !taxValid,
      });
      setServiceHelps({
        serviceName: nameValid ? "" : "This Field is required",
        sellingPrice: sellingPriceValid ? "" : "This Field is required",
        description: descriptionValid ? "" : "This Field is required",
        tax: taxValid ? "" : "Invalid email format",
      });
      return;
    }

    // const parsedSellingPrice = parseFloat(serviceValues?.sellingPrice);
    const parsedTax = parseFloat(serviceValues?.tax);

    // if (isNaN(parsedSellingPrice) || isNaN(parsedTax)) {
    //   console.error("Invalid selling price or tax. Must be numbers.");
    //   return;
    // }

    const serviceData = {
      serviceName: serviceValues.serviceName,
      servicePrice: serviceValues.sellingPrice,
      description: serviceValues.description,
      tax: parsedTax,
    };
    try {
      let apiRes = null;
      let reqUrl = defaultUrl;
      if (serviceId) {
        apiRes = await dispatch(
          editClinicService({ id: serviceId, data: serviceData })
        );
        console.log("EditAPiRes----->", apiRes);
        // reqUrl = `?page=${page}&itemSize=${rowsPerPage}`;
        reqUrl = `?page=${page}&itemSize=${rowsPerPage}`;
      } else {
        apiRes = await dispatch(createClinicService(serviceData));
      }
      if (apiRes.payload) {
        dispatch(getServices());
        setModVisible(!modVisible);
        setServiceId(null);
        setServiceValues(initialValues);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleChangePage = (e, selectedPage) => {
    setPage(selectedPage);
    setTableStock([]);
    dispatch(
      getServices(
        `?page=${selectedPage}&itemSize=${rowsPerPage}${searchValue?.length > 0 ? `&search=${searchValue}` : ""
        }`
      )
    );
  };

  const handleSearch = (e) => {
    setSearchValue(e.target.value);
    setPage(1);
    // const url = `?page=1&itemSize=${rowsPerPage}`;
    setTableStock([]);
    dispatch(getStocksByClinic(`?search=${searchValue}&page=1`));
  };

  const handleChange = (name, value) => {
    setServiceValues({ ...serviceValues, [name]: value });
  };

  const handleEditModal = (id) => {
    const selectedProduct = services?.find(
      (product) => product?.serviceId === id
    );

    if (selectedProduct) {
      setServiceValues({
        ...serviceValues,

        serviceName: selectedProduct?.serviceName,

        sellingPrice: selectedProduct?.servicePrice,

        tax: selectedProduct?.tax,

        description: selectedProduct?.description,
      });
      setServiceId(id);
      setModVisible(!modVisible);
    }
  };

  return (
    <Container maxWidth="xl">
      <div className="com-mar back-white pv10">
        {/* <div className="flex-row flex-center">
          <div className="w30Per">
            <CustomTextField
              label="Search"
              search
              fullWidth
              value={searchValue}
              handleChange={(e) => setSearchValue(e.target.value)}
            />
          </div>
          <div className="ml20 w10Per">
            <CustomButton text="Create" onClick={() => setModVisible(true)} />
          </div>
          <div className="ml20 w15Per">
            <CustomButton text="Check Balance" />
          </div>
          <div className="ml20 w15Per">
            <CustomSelect
              name="Stock Transaction"
              label={"Stock Transaction"}
              fullWidth
              list={InventoryList}
            />
          </div>
        </div> */}
        {/* <div className="container">
          <div className="left-row">
            <div className="select-width mr10 ml10 ">
              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <CustomTextField
                  label={"Search"}
                  placeholder={"Search"}
                  search
                  fullWidth
                  value={searchValue}
                  handleChange={(e) => setSearchValue(e.target.value)}
                />
              </Grid>
            </div>
            <div className="search-button">
              <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                <div className="ml10">
                  <CustomButton text={"Search"} onClick={handleSearch} />
                </div>
              </Grid>
            </div>
            <div className="select-width ml10 mr10">
              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <CustomSelect
                  name="Stock Transaction"
                  label={"Stock Transaction"}
                  fullWidth
                  list={InventoryList}
                />
              </Grid>
            </div>
          </div>
          <div className="btn">
            <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
              <div>
                <div className="clinic-mod-btn-pos">
                  <div className="ml15">
                    <CustomButton text={"Create"} onClick={handleOpen} />
                  </div>
                  <div className="ml15 mr15">
                    <CustomButton text={"Check Balance"} />
                  </div>
                </div>
              </div>
            </Grid>
          </div>
        </div> */}
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          lg={12}
          xl={12}
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
          }}
        >
          <div className="flex-row">
            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              lg={12}
              xl={12}
              style={{ width: "600px" }}
            >
              <CustomTextField
                search
                placeholder={"Search"}
                fullWidth
                backgroundColor="#E3CECE52"
                value={searchValue}
                // handleChange={(e) => setSearchValue(e.target.value)}
                handleChange={handleSearch}
              />
            </Grid>
          </div>
          <div className="w5Per ml20">
            <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
              <div className="">
                <CustomButton text={"Create"} smallBtn onClick={handleOpen} />
              </div>
            </Grid>
          </div>
          {/* <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
                <CustomSelect select />
              </Grid> */}
        </Grid>

        <Table
          columns={tableHeaders}
          datas={tableStock}
          page={page}
          rowsPerPage={rowsPerPage}
          totalRecords={services?.totalRecords}
          handleChangePage={handleChangePage}
          grey
          product={true}
        />

        <CustomModal
          open={modVisible}
          onClose={handleClose}
          header={serviceId ? "Edit" : "Create"}
          rightModal
          modalWidth={40}
        >
          {/* <div className="scroll-80vh">
            <Grid container spacing={1.5} className="mt10">
              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <div className="txt-mont fs14">Date</div>
                <CustomTextField
                  // label="Date"
                  name="date"
                  fullWidth
                  value={stockValues?.date}
                  handleChange={(e) => handleChange("date", e?.target?.value)}
                  mobileDate
                />
              </Grid>

              {stockValues?.type ? (
                <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                  <Select
                    list={suppliers ?? []}
                    value={stockValues?.supplierName}
                    handleChange={(e) =>
                      handleChange("supplierName", e?.target?.value)
                    }
                    fullWidth
                    select
                    label="Supplier Name"
                  />
                </Grid>
              ) : null}

              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <Select
                  list={products ?? []}
                  value={stockValues?.productName}
                  handleChange={(e) =>
                    handleChange("productName", e?.target?.value)
                  }
                  fullWidth
                  select
                  label="Product Name"
                />
              </Grid>

              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <Select
                  label="Unit Type"
                  list={unitTypes ?? []}
                  fullWidth
                  select
                  value={stockValues?.unitType}
                  handleChange={(e) => {
                    handleChange("unitType", e?.target?.value);
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <div className="txt-mont fs14">Quantity</div>
                <CustomTextField
                  // label="Quantity"
                  placeholder="Quantity"
                  name="quantity"
                  search
                  fullWidth
                  value={stockValues?.quantity}
                  handleChange={(e) => handleChange("quantity", e?.target?.value)}
                />
              </Grid>

            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <CustomSelect
                name="Type"
                label="Type"
                select
                list={InventoryList ?? []}
                value={stockValues?.type}
                handleChange={(e) => {
                  handleChange("type", e?.target?.value);
                }}
              />
            </Grid>
          </Grid>
          <div className="mt10 mb10">
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <CustomTextField
                label="Remarks"
                placeholder="Remarks"
                name="remarks"
                fullWidth
                multiline
                value={stockValues?.remarks}
                handleChange={(e) => handleChange("remarks", e?.target?.value)}
              />
            </Grid>
          </div>
          <div className="mt30 mb20">
            <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
              <div>
                <div className="clinic-mod-btn-pos">
                  <div className="mr10">
                    <CustomButton text="Cancel" grayBtn onClick={handleClose} />
                  </div>
                  <div className="ml10">
                    <CustomButton text="Save" onClick={handleCreateNewStock} />
                  </div>
                </div>
              </div>
            </Grid>
          </div>
        </div> */}
          <Grid container spacing={2} className="ph20">
            {/* <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <CustomTextField
              label="Product Code"
              placeholder="Product Code"
              fullWidth
              value={productValues?.productCode}
              handleChange={(e) =>
                handleChange("productCode", e?.target?.value)
              }
            />
          </Grid> */}
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <div className="txt-semi-bold fs14 light-grey">Service Name</div>
              <CustomTextField
                // label="Product Name"
                // placeholder="Product Name"
                // list={ServiceList}
                fullWidth
                // select
                labelTop
                value={serviceValues?.serviceName}
                helperText={serviceHelps?.serviceName}
                error={serviceErrors?.serviceName}
                handleChange={(e) =>
                  handleChange("serviceName", e?.target?.value)
                }
              />
            </Grid>

            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <div className="txt-semi-bold fs14 light-grey">Description</div>
              <CustomTextField
                name="Description"
                fullWidth
                // handleChange={handleChange}
                // value={petValues?.reason}
                helperText={serviceHelps?.description}
                error={serviceErrors?.description}
                multiline
                value={serviceValues?.description}
                handleChange={(e) =>
                  handleChange("description", e?.target?.value)
                }
              />
            </Grid>

            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <div className="txt-semi-bold fs14 light-grey">Selling Price</div>
              {/* <CustomTextField
              label="Recorder Level"
              placeholder="Recorder Level"
              fullWidth
              value={productValues?.recordLevel}
              handleChange={(e) =>
                handleChange("recordLevel", e?.target?.value)
              }
            /> */}
              <CustomTextField
                // label="Selling Price (Rs)"
                // placeholder="Selling Price (Rs)"
                fullWidth
                value={serviceValues?.sellingPrice}
                helperText={serviceHelps?.sellingPrice}
                error={serviceErrors?.sellingPrice}
                handleChange={(e) =>
                  handleChange("sellingPrice", e?.target?.value)
                }
                labelTop
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <div className="txt-semi-bold fs14 light-grey">Tax(%)</div>
              <CustomTextField
                // label="Tax"
                // placeholder="Tax"
                fullWidth
                value={serviceValues?.tax}
                helperText={serviceHelps?.tax}
                error={serviceErrors?.tax}
                handleChange={(e) => handleChange("tax", e?.target?.value)}
                labelTop
              />
            </Grid>
          </Grid>

          <div className="mt30 mb20">
            <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
              <div>
                <div className="clinic-mod-btn-pos">
                  {/* <div className="mr10">
                    <CustomButton
                      text="Cancel"
                      grayBtn
                      onClick={handleModalClose}
                    />
                  </div> */}
                  <div className="ml10">
                    <CustomButton text="Submit" onClick={handleSubmit} />
                  </div>
                </div>
              </div>
            </Grid>
          </div>
        </CustomModal>
      </div>
    </Container>
  );
};

export default InventoryStock;
