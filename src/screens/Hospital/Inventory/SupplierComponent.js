import { Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomButton from "../../../components/CustomButton";
import CustomModal from "../../../components/CustomModal/CustomModal";
import Table from "../../../components/CustomTable";
import CustomTextField from "../../../components/CustomTextField";
import {
  createSupplier,
  deleteSupplier,
  editSupplier,
  getSupplier,
} from "../../../redux/reducers/clinicSlice";
import { hideLoader, showLoader } from "../../../redux/reducers/loaderSlice";

const tableHeaders = [
  "suppliername",
  "email",
  "phone",
  "address",
  "deleteButton",
  "editButton",
];
const nameExpan = {
  name: "Supplier Name",
  email: "Email Id",
  phone: "Phone",
  address: "Address",
  street: "Street",
  city: "City",
  state: "State",
  country: "Country",
  pincode: "Pincode",
};
const initialValues = {
  name: "",
  email: "",
  phone: "",
  address: "",
  street: "",
  city: "",
  state: "",
  country: "",
  pincode: "",
};

const initialError = {
  name: false,
  email: false,
  phone: false,
  address: false,
  street: false,
  city: false,
  state: false,
  country: false,
  pincode: false,
};

const initialHelp = {
  name: "",
  email: "",
  phone: "",
  address: "",
  street: "",
  city: "",
  state: "",
  country: "",
  pincode: "",
};

const SupplierComponent = () => {
  const dispatch = useDispatch();
  const suppliers = useSelector((state) => state?.clinic?.suppliers);
  const [modVisible, setModVisible] = useState(false);
  const [tableSupplier, setTableSupplier] = useState([]);
  const [supplierValues, setSupplierValues] = useState(initialValues);
  const [supplierErrors, setSupplierErrors] = useState(initialError);
  const [supplierHelps, setSupplierHelps] = useState(initialHelp);
  const [supplierId, setSupplierId] = useState(null);
  const [delModVisible, setDelModVisible] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);
  const itemSize = 10;
  const dfultUrl = `?search=${searchValue}&page=${page}&itemSize=${itemSize}`;


  // useEffect(() => {
  //   dispatch(getSupplier(dfultUrl));
  // }, [searchValue]);

  // useEffect(() => {
  //   getSupplierTable(suppliers?.data);
  // }, [suppliers?.data]);

  const getSupplierTable = (suplier) => {
    if (suplier?.length === 0 || !suplier) return setTableSupplier([]);
    dispatch(showLoader());
    const requiredSupplier = suplier?.map((suplier, i) => {
      return {
        suppliername: suplier?.name,
        email: suplier?.email,
        phone: suplier?.phone,
        address: suplier?.address,

        deleteButton: (
          <div
            onClick={() => handleDeleteModal(suplier?.supplierId)}
            className="red-color txt-semi-bold cursor "
          >
            <img
              src={require("../../../assets/images/png/del.png")}
              alt=""
              className="h20"
            />
          </div>
        ),
        editButton: (
          <div
            onClick={() => {
              handleEditModal(suplier);
            }}
            className="blue-color txt-semi-bold cursor "
          >
            <img
              src={require("../../../assets/images/png/editYellow.png")}
              alt=""
              className="h20"
            />
          </div>
        ),
      };
    });
    dispatch(hideLoader());
    setTableSupplier(requiredSupplier);
  };

  const handleCreateModalVisible = () => {
    setModVisible(!modVisible);
  };

  const handleEditModal = (suplier) => {
    const selectedSupplier = suppliers?.data?.find(
      (sup) => sup?.supplierId === suplier?.supplierId
    );

    if (selectedSupplier) {
      setSupplierId(suplier?.supplierId);
      setSupplierValues({
        ...initialValues,
        name: suplier?.name,
        email: suplier?.email,
        phone: suplier?.phone,
        address: suplier?.address,
        street: suplier?.street,
        city: suplier?.city,
        state: suplier?.state,
        country: suplier?.country,
        pincode: suplier?.pincode,
      });

      setModVisible(true);
      dispatch(getSupplier(dfultUrl));
    }
  };

  const handleDeleteModal = (id) => {
    setSupplierId(id);
    setDelModVisible(true);
  };

  const handleChange = (e) => {
    setSupplierValues({ ...supplierValues, [e.target.name]: e.target.value });
    if (e.target.value === "") {
      setSupplierErrors({ ...supplierErrors, [e.target.name]: true });
      setSupplierHelps({
        ...supplierHelps,
        [e.target.name]: `${nameExpan?.[e.target.name]} Required Field`,
      });
    }
    if (e.target.value !== "") {
      setSupplierErrors({ ...supplierErrors, [e.target.name]: false });
      setSupplierHelps({ ...supplierHelps, [e.target.name]: "" });
    }
  };

  const handleValidation = (values) => {
    const errorList = [];
    const woErrorList = [];
    Object.keys(values).forEach(function (key, index) {
      if (values?.[key]?.length === 0 || values?.[key] === "") {
        return errorList?.push(key);
      }
      woErrorList.push(key);
    });
    let errorObj = {};
    let errorHelperObj = {};
    let correctObj = {};
    let helperObj = {};
    //set Error
    if (errorList?.length > 0) {
      errorList?.forEach((key) => {
        errorObj = { ...errorObj, [key]: true };
        errorHelperObj = {
          ...errorHelperObj,
          [key]: `${nameExpan?.[key]} Required Field`,
        };
      });
    }
    //remove Error
    if (woErrorList?.length > 0) {
      woErrorList?.forEach((key) => {
        correctObj = { ...correctObj, [key]: false };
        helperObj = { ...helperObj, [key]: "" };
      });
    }
    setSupplierErrors({ ...supplierErrors, ...correctObj, ...errorObj });
    setSupplierHelps({ ...supplierHelps, ...helperObj, ...errorHelperObj });
    return { errorList, woErrorList };
  };

  const handleSubmit = async () => {
    const validation = handleValidation(supplierValues);
    if (validation?.errorList?.length > 0) return;
    const data = {
      name: supplierValues?.name,
      email: supplierValues?.email,
      phone: supplierValues?.phone,
      address: supplierValues?.address,
      street: supplierValues?.street,
      city: supplierValues?.city,
      state: supplierValues?.state,
      country: supplierValues?.country,
      pincode: supplierValues?.pincode.toString(),
    };
    let apiRes = null;
    if (supplierId) {
      const metaData = { id: supplierId, data };
      apiRes = await dispatch(editSupplier(metaData));
    } else {
      apiRes = await dispatch(createSupplier(data));
    }
    if (apiRes?.payload) {
      handleCreateModalVisible();
      handleReset();
      dispatch(getSupplier(dfultUrl));
    }
  };

  const handleSearch = () => {
    setPage(1);
    setTableSupplier([]);
    dispatch(getSupplier(`?search=${searchValue}&page=1`));
  };

  const handleReset = () => {
    setSupplierId(null);
    setSupplierValues(initialValues);
    setSupplierErrors(initialError);
    setSupplierHelps(initialHelp);
  };

  const handleDelete = async () => {
    const apiRes = await dispatch(deleteSupplier(supplierId));
    if (apiRes?.payload) {
      setDelModVisible(!delModVisible);
      dispatch(getSupplier(`?page=1&itemSize=${itemSize}`));
    }
  };

  const handleChangePage = (e, selectedPage) => {
    setPage(selectedPage);
    dispatch(
      getSupplier(
        `?page=${selectedPage}&itemSize=${itemSize}${
          searchValue?.length > 0 ? `&search=${searchValue}` : ""
        }`
      )
    );
  };

  const handleDelModClose = () => {
    setDelModVisible(false);
    setSupplierId(null);
  };

  return (
    <div className="com-mar back-white pv10">
      <div className="flex-row flex-center">
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
      </div>
      <Table
        columns={tableHeaders}
        datas={tableSupplier}
        page={page}
        rowsPerPage={itemSize}
        totalRecords={suppliers?.totalRecords}
        handleChangePage={handleChangePage}
        grey
      />

      <CustomModal
        open={modVisible}
        onClose={() => {
          handleCreateModalVisible();
          handleReset();
        }}
        header={supplierId ? "Edit" : "Create"}
        rightModal
        modalWidth={40}
      >
        <div className="scroll-80vh">
          <Grid container spacing={1.5} className="mt10">
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <CustomTextField
                label={nameExpan?.["name"]}
                placeholder={nameExpan?.["name"]}
                name="name"
                fullWidth
                handleChange={handleChange}
                value={supplierValues?.name}
                helperText={supplierHelps?.name}
                error={supplierErrors?.name}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <CustomTextField
                label={nameExpan?.["email"]}
                placeholder={nameExpan?.["email"]}
                name="email"
                fullWidth
                handleChange={handleChange}
                value={supplierValues?.email}
                helperText={supplierHelps?.email}
                error={supplierErrors?.email}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <CustomTextField
                label={nameExpan?.["phone"]}
                placeholder={nameExpan?.["phone"]}
                name="phone"
                fullWidth
                handleChange={handleChange}
                value={supplierValues?.phone}
                helperText={supplierHelps?.phone}
                error={supplierErrors?.phone}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <CustomTextField
                label={nameExpan?.["address"]}
                placeholder={nameExpan?.["address"]}
                name="address"
                fullWidth
                handleChange={handleChange}
                value={supplierValues?.address}
                helperText={supplierHelps?.address}
                error={supplierErrors?.address}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <CustomTextField
                label={nameExpan?.["street"]}
                placeholder={nameExpan?.["street"]}
                name="street"
                fullWidth
                handleChange={handleChange}
                value={supplierValues?.street}
                helperText={supplierHelps?.street}
                error={supplierErrors?.street}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <CustomTextField
                label={nameExpan?.["city"]}
                placeholder={nameExpan?.["city"]}
                name="city"
                fullWidth
                handleChange={handleChange}
                value={supplierValues?.city}
                helperText={supplierHelps?.city}
                error={supplierErrors?.city}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <CustomTextField
                label={nameExpan?.["state"]}
                placeholder={nameExpan?.["state"]}
                name="state"
                fullWidth
                handleChange={handleChange}
                value={supplierValues?.state}
                helperText={supplierHelps?.state}
                error={supplierErrors?.state}
              />
            </Grid>

            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <CustomTextField
                label={nameExpan?.["country"]}
                placeholder={nameExpan?.["country"]}
                name="country"
                fullWidth
                handleChange={handleChange}
                value={supplierValues?.country}
                helperText={supplierHelps?.country}
                error={supplierErrors?.country}
              />
            </Grid>

            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <CustomTextField
                label={nameExpan?.["pincode"]}
                placeholder={nameExpan?.["pincode"]}
                name="pincode"
                fullWidth
                handleChange={handleChange}
                value={supplierValues?.pincode}
                helperText={supplierHelps?.pincode}
                error={supplierErrors?.pincode}
              />
            </Grid>
          </Grid>
          <div className="mt30 mb20">
            <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
              <div>
                <div className="clinic-mod-btn-pos">
                  <div className="mr10">
                    <CustomButton
                      text="Cancel"
                      grayBtn
                      onClick={() => {
                        handleCreateModalVisible();
                        handleReset();
                      }}
                    />
                  </div>
                  <div className="ml10">
                    <CustomButton text="Save" onClick={handleSubmit} />
                  </div>
                </div>
              </div>
            </Grid>
          </div>
        </div>
      </CustomModal>

      <CustomModal
        open={delModVisible}
        onClose={handleDelModClose}
        header="Delete"
        modal
        modalWidth={40}
      >
        <Typography className="txt-regular fs16 ml10">
          Are you sure want to delete this from list?
        </Typography>
        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
          <div className="clinic-mod-btn-pos mb10 mt15">
            <div className="mr10">
              <CustomButton text="Cancel" onClick={handleDelModClose} />
            </div>
            <div className="ml10">
              <CustomButton redBtn text={"Confirm"} onClick={handleDelete} />
            </div>
          </div>
        </Grid>
      </CustomModal>
    </div>
  );
};

export default SupplierComponent;
