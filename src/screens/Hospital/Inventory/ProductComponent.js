import { Grid, Typography, Container } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomButton from "../../../components/CustomButton";
import CustomModal from "../../../components/CustomModal/CustomModal";
import Table from "../../../components/CustomTable";
import CustomTextField from "../../../components/CustomTextField";
import Select from "../../../components/Select/Select";
import {
  createNewProduct,
  deleteProducts,
  editClinicProduct,
  getProductsByClinic,
  getUnitType,
} from "../../../redux/reducers/clinicSlice";
import { hideLoader, showLoader } from "../../../redux/reducers/loaderSlice";
import { CategoryList } from "../../../util/arrayList";

const tableHeaders = [
  "productName",
  "category",
  "description",
  "tax",
  "sellingPrice",
  "editButton",
];

const initialValues = {
  productName: "",
  activeIngredient: "",
  sellingPrice: "",
  description: "",
  category: "",
  tax: "",
};

const initialError = {
  productName: false,
  activeIngredient: false,
  sellingPrice: false,
  description: false,
  category: false,
  tax: false,
};

const initialHelp = {
  productName: "",
  activeIngredient: "",
  sellingPrice: "",
  description: "",
  category: "",
  tax: "",
};

const ProductComponent = () => {
  const dispatch = useDispatch();
  const productsData = useSelector((state) => state?.clinic?.products);

  const unitTypes = useSelector((state) =>
    state?.clinic?.unittype?.map((ut) => {
      return { ...ut, value: ut?.name };
    })
  );
  const [modVisible, setModVisible] = useState(false);
  const [productValues, setProductValues] = useState(initialValues);
  const [productErrors, setProductErrors] = useState(initialError);
  const [productHelps, setProductHelps] = useState(initialHelp);
  const [delModVisible, setDelModVisible] = useState(false);
  const [tableSupplier, setTableSupplier] = useState([]);
  console.log("productsData", productsData);
  const [categoryValue, setCategoryValue] = useState(null);

  const [productId, setProductId] = useState(null);

  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const defaultUrl = `?page=1&itemSize=${rowsPerPage}`;
  // console.log('productValues?.description---->',productValues?.description)

  useEffect(() => {
    dispatch(getProductsByClinic(defaultUrl));
    // dispatch(getUnitType());
  }, []);

  useEffect(() => {
    if (productsData?.data?.length > 0) getSupplierTable(productsData?.data);
  }, [productsData?.data]);

  const validateField = (value) => {
    if (Array?.isArray(value)) {
      return value?.length > 0;
    } else {
      return typeof value === "string" && value.trim() !== "";
    }
  };

  const getSupplierTable = (product) => {
    dispatch(showLoader());
    const requiredSupplier = product?.map((products, i) => {
      return {
        productCode: products?.code,
        productName: products?.name,
        unitType: products?.unitType,
        sellingPrice: products?.sellPrice,
        recorderLevel: products?.reoder,
        category: products?.category,
        description: products?.description,
        tax: products?.tax,

        deleteButton: (
          <div
            onClick={() => handleDeleteModal(products?.productId)}
            className="red-color txt-semi-bold cursor "
          >
            <img
              src={require("../../../assets/images/png/del.png")}
              alt=""
              className="h30"
            />
          </div>
        ),
        editButton: (
          <div
            onClick={() => handleEditModal(products?.productId)}
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
    setTableSupplier(requiredSupplier);
  };

  const handleModalClose = () => {
    setProductId(null);
    setProductValues(initialValues);
    setModVisible(false);
  };

  const handleSubmit = async () => {
    const nameValid = validateField(productValues?.productName);
    const sellingPriceValid = validateField(productValues?.sellingPrice);
    const descriptionValid = validateField(productValues?.description);
    const taxValid = validateField(productValues?.tax);
    const categoryValid = validateField(productValues?.category);
    const activeIngredientValid = validateField(productValues?.activeIngredient);

    // If any validation fails, update the state to show errors
    if (
      !nameValid ||
      !sellingPriceValid ||
      !descriptionValid ||
      !taxValid ||
      !categoryValid ||  // Corrected condition
      !activeIngredientValid  // Corrected condition
    ) {
      setProductErrors({
        productName: !nameValid,
        sellingPrice: !sellingPriceValid,
        description: !descriptionValid,
        tax: !taxValid,
        category: !categoryValid,
        activeIngredient: !activeIngredientValid,
      });
      setProductHelps({
        productName: nameValid ? "" : "This Field is required",
        sellingPrice: sellingPriceValid ? "" : "This Field is required",
        description: descriptionValid ? "" : "This Field is required",
        tax: taxValid ? "" : "Invalid tax format",
        category: categoryValid ? "" : "This Field is required",
        activeIngredient: activeIngredientValid ? "" : "This Field is required",
      });
      return;
    }

    const parsedSellingPrice = parseFloat(productValues?.sellingPrice);
    const parsedTax = parseFloat(productValues?.tax);

    if (isNaN(parsedSellingPrice) || isNaN(parsedTax)) {
      console.error("Invalid selling price or tax. Must be numbers.");
      return;
    }

    const productData = {
      name: productValues?.productName,
      sellPrice: parsedSellingPrice,
      tax: parsedTax,
      category: productValues?.category,
      ingredient: productValues?.activeIngredient,
      description: productValues?.description,
    };

    try {
      let apiRes = null;
      let reqUrl = defaultUrl;
      if (productId) {
        apiRes = await dispatch(
          editClinicProduct({ id: productId, data: productData })
        );
        console.log("EditAPiRes----->", apiRes);
        reqUrl = `?page=${page}&itemSize=${rowsPerPage}`;
      } else {
        apiRes = await dispatch(createNewProduct(productData));
        console.log("CreateApiRes----->", apiRes);
      }
      if (apiRes.payload) {
        dispatch(getProductsByClinic(reqUrl));
        setModVisible(!modVisible);
        setProductId(null);
        setProductValues(initialValues);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };


  const handleDeleteModal = async (id) => {
    setProductId(id);
    setDelModVisible(true);
  };

  const handleDelete = async () => {
    const apiRes = await dispatch(deleteProducts(productId));
    if (apiRes?.payload) {
      dispatch(getProductsByClinic(defaultUrl));
      setDelModVisible(false);
      setProductId(null);
    }
  };

  const handleEditModal = (id) => {
    const selectedProduct = productsData?.data?.find(
      (product) => product.productId === id
    );
    console.log("selectedProduct", selectedProduct);
    if (selectedProduct) {
      setProductValues({
        ...productValues,
        // productCode: selectedProduct?.code,
        productName: selectedProduct?.name,
        // unitType: selectedProduct?.unitType,
        sellingPrice: selectedProduct?.sellPrice,
        // recordLevel: selectedProduct?.reoder,
        tax: selectedProduct?.tax,
        category: selectedProduct?.category,
        activeIngredient: selectedProduct?.ingredient,
        description: selectedProduct?.description,
      });
      setProductId(id);
      setModVisible(!modVisible);
    }
  };

  const handleSearch = (e) => {
    setSearchValue(e.target.value);
    setPage(1);
    setTableSupplier([]);
    dispatch(getProductsByClinic(`?search=${searchValue}&page=1`));
  };

  const handleChangePage = (e, selectedPage) => {
    setPage(selectedPage);
    setTableSupplier([]);
    dispatch(
      getProductsByClinic(
        `?page=${selectedPage}&itemSize=${rowsPerPage}${searchValue?.length > 0 ? `&search=${searchValue}` : ""
        }`
      )
    );
  };

  const handleChange = (name, value) => {
    setProductValues({ ...productValues, [name]: value });
  };

  const handleDelModClose = () => {
    setDelModVisible(false);
    setProductId(null);
  };

  return (
    <Container maxWidth="xl">
      <div className="com-mar back-white pv10">
        <div className="flex-row flex-center">
          {/* <div className="w30Per">
          <CustomTextField
            label="Search"
            search
            fullWidth
            value={searchValue}
            handleChange={(e) => setSearchValue(e.target.value)}
          />
        </div>

        <div className="ml20 w10Per">
          <CustomButton text="Search" onClick={handleSearch} />
        </div>
        <div className="ml20 w10Per">
          <CustomButton text="Create" onClick={() => setModVisible(true)} />
        </div> */}
        </div>
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
                handleChange={handleSearch}
              />
            </Grid>
          </div>
          <div className="w5Per ml20">
            <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
              <div className="">
                <CustomButton
                  text={"Create"}
                  smallBtn
                  onClick={() => setModVisible(true)}
                />
              </div>
            </Grid>
          </div>
          {/* <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
              <CustomSelect select />
            </Grid> */}
        </Grid>

        <Table
          columns={tableHeaders}
          datas={tableSupplier}
          page={page}
          rowsPerPage={rowsPerPage}
          handleChangePage={handleChangePage}
          totalRecords={productsData?.totalRecords}
          grey
          product={true}
          onEdit={() => handleEditModal(productId)}
        />

        <CustomModal
          open={modVisible}
          onClose={handleModalClose}
          header={productId ? "Edit" : "Create"}
          modalWidth={40}
          rightModal
        >
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
            {/* <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <div className="txt-semi-bold fs14 light-grey">Product Name</div>
            <Select
              // label="Product Name"
              // placeholder="Product Name"
              fullWidth
              select
              labelTop
              value={productValues?.productName}
              handleChange={(e) =>
                handleChange("productName", e?.target?.value)
              }
            />
          </Grid> */}
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <div className="txt-semi-bold fs14 light-grey">Product Name</div>
              <CustomTextField
                // label="Product Name"
                // placeholder="Product Name"
                fullWidth
                // select
                labelTop
                value={productValues?.productName}
                error={productErrors?.productName}
                helperText={productHelps?.productName}
                handleChange={(e) =>
                  handleChange("productName", e?.target?.value)
                }
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <div className="txt-semi-bold fs14 light-grey">
                Active Ingredient
              </div>
              <CustomTextField
                name="Active Ingredient"
                // list={unitTypes ?? []}
                // fullWidth
                fullWidth
                labelTop
                value={productValues?.activeIngredient}
                error={productErrors?.activeIngredient}
                helperText={productHelps?.activeIngredient}
                handleChange={(e) =>
                  handleChange("activeIngredient", e?.target?.value)
                }
              />
            </Grid>

            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <div className="txt-semi-bold fs14 light-grey">Category</div>
              {/* <CustomTextField
              label="Selling Price (Rs)"
              placeholder="Selling Price (Rs)"
              fullWidth
              value={productValues?.sellingPrice}
              handleChange={(e) =>
                handleChange("sellingPrice", e?.target?.value)
              }
            /> */}
              <Select
                // label="Selling Price (Rs)"
                // placeholder="Category"
                // fullWidth
                select
                labelTop
                list={CategoryList}
                value={productValues?.category}
                handleChange={(e) => handleChange("category", e?.target?.value)}
                error={productErrors?.category}
                helperText={productHelps?.category}
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
                labelTop
                value={productValues?.sellingPrice}
                error={productErrors?.sellingPrice}
                helperText={productHelps?.sellingPrice}
                handleChange={(e) =>
                  handleChange("sellingPrice", e?.target?.value)
                }
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
              <div className="txt-semi-bold fs14 light-grey">Tax(%)</div>
              <CustomTextField
                // label="Tax"
                // placeholder="Tax"
                fullWidth
                labelTop
                value={productValues?.tax}
                error={productErrors?.tax}
                helperText={productHelps?.tax}
                handleChange={(e) => handleChange("tax", e?.target?.value)}
              />
            </Grid>

            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <div className="txt-semi-bold fs14 light-grey">Description</div>
              <CustomTextField
                name="Description"
                fullWidth
                value={productValues?.description}
                error={productErrors?.description}
                helperText={productHelps?.description}
                handleChange={(e) =>
                  handleChange("description", e?.target?.value)
                }
                // helperText={petHelpers?.reason}
                // error={petErrors?.reason}
                multiline
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
    </Container>
  );
};

export default ProductComponent;
