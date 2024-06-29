import { Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomButton from "../../../components/CustomButton";
import CustomModal from "../../../components/CustomModal/CustomModal";
import Table from "../../../components/CustomTable";
import CustomTextField from "../../../components/CustomTextField";
import {
  createClinicService,
  deleteClinicService,
  editClinicService,
  getServices,
} from "../../../redux/reducers/clinicSlice";
import { hideLoader, showLoader } from "../../../redux/reducers/loaderSlice";
import "./Services.css";
const tableHeaders = ["servicename", "price", "editButton", "deleteButton"];
const nameExpan = {
  servicename: "Service Name",
  price: "Price",
};
const initialValues = {
  servicename: "",
  price: "",
};

const initialError = {
  servicename: false,
  price: false,
};

const initialHelp = {
  servicename: "",
  price: "",
};

const Services = () => {
  const dispatch = useDispatch();
  const services = useSelector((state) => state?.clinic?.services);
  const [tableService, setTableService] = useState([]);
  const [serviceValue, setServiceValues] = useState(initialValues);
  const [serviceErrors, setServiceErrors] = useState(initialError);
  const [serviceHelps, setServiceHelps] = useState(initialHelp);
  const [isModal, setIsModal] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState();
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);

  useEffect(() => {
    dispatch(getServices());
  }, []);

  useEffect(() => {
    getServiceTable(services);
  }, [services]);

  const getServiceTable = (service) => {
    dispatch(showLoader());
    const requiredService = service?.map((service, i) => {
      return {
        servicename: service?.serviceName,
        price: service?.servicePrice,
        editButton: (
          <div
            onClick={() => handleModal(service?.serviceId)}
            className="edit-button"
          >
            Edit
          </div>
        ),
        deleteButton: (
          <div
            onClick={() => handleDeleteModal(service?.serviceId)}
            className="delete-button"
          >
            Delete
          </div>
        ),
      };
    });
    dispatch(hideLoader());
    setTableService(requiredService);
  };

  const handleChange = (e) => {
    setServiceValues({ ...serviceValue, [e.target.name]: e.target.value });
    if (e.target.value === "") {
      setServiceErrors({ ...serviceErrors, [e.target.name]: true });
      setServiceHelps({
        ...serviceHelps,
        [e.target.name]: `${nameExpan?.[e.target.name]} Required Field`,
      });
    }
    if (e.target.value !== "") {
      setServiceErrors({ ...serviceErrors, [e.target.name]: false });
      setServiceHelps({ ...serviceHelps, [e.target.name]: "" });
    }
  };

  const handleValidation = (values) => {
    const errorList = [];
    const woErrorList = [];
    if (values?.servicename === "") {
      errorList.push("servicename");
    } else {
      woErrorList.push("servicename");
    }

    let errorObj = {};
    let errorHelperObj = {};
    let correctObj = {};
    let helperObj = {};

    // Set error for the servicename field if it's empty
    if (errorList.length > 0) {
      errorList.forEach((key) => {
        errorObj[key] = true;
        errorHelperObj[key] = `${nameExpan?.[key]} Required Field`;
      });
    }

    // Remove error for the servicename field if it's not empty
    if (woErrorList.length > 0) {
      woErrorList.forEach((key) => {
        correctObj[key] = false;
        helperObj[key] = "";
      });
    }

    setServiceErrors({ ...serviceErrors, ...correctObj, ...errorObj });
    setServiceHelps({ ...serviceHelps, ...helperObj, ...errorHelperObj });

    return { errorList, woErrorList };
  };

  const handleValidationForEdit = (values) => {
    const errorList = [];
    const woErrorList = [];
    if (values?.servicename?.trim() === "") {
      errorList.push("servicename");
    } else {
      woErrorList.push("servicename");
    }

    let errorObj = {};
    let errorHelperObj = {};
    let correctObj = {};
    let helperObj = {};

    // Set error for the servicename field if it's empty
    if (errorList.length > 0) {
      errorList.forEach((key) => {
        errorObj[key] = true;
        errorHelperObj[key] = `${nameExpan?.[key]} Required Field`;
      });
    }

    // Remove error for the servicename field if it's not empty
    if (woErrorList.length > 0) {
      woErrorList.forEach((key) => {
        correctObj[key] = false;
        helperObj[key] = "";
      });
    }

    setServiceErrors({ ...serviceErrors, ...correctObj, ...errorObj });
    setServiceHelps({ ...serviceHelps, ...helperObj, ...errorHelperObj });

    return { errorList, woErrorList };
  };

  const handleCreateService = async () => {
    const validation = handleValidation(serviceValue);
    if (validation?.errorList?.length > 0) return;

    const data = {
      serviceName: serviceValue?.servicename,
      servicePrice: serviceValue?.price,
    };
    const apiRes = await dispatch(createClinicService(data));
    if (apiRes?.payload) {
      dispatch(getServices());
      setServiceValues(initialValues);
    }
  };

  const handleDeleteModal = async (id) => {
    setSelectedServiceId(id);
    setDeleteModalVisible(true);
  };

  const handleDelete = async () => {
    const apiRes = await dispatch(deleteClinicService(selectedServiceId));
    if (apiRes?.payload) {
      setDeleteModalVisible(false);
      dispatch(getServices());
    }
  };

  const handleModal = (id) => {
    const selectedService = services?.find((srv) => srv?.serviceId === id);

    if (selectedService) {
      setServiceValues({
        ...initialValues,
        servicename: selectedService.serviceName,
        price: selectedService.servicePrice,
      });
      setSelectedServiceId(id);
      setIsModal(!isModal);
    }
  };

  const handleEditService = async () => {
    const validation = handleValidationForEdit(serviceValue);
    if (validation?.errorList?.length > 0) return;
    const data = {
      serviceName: serviceValue?.servicename,
      servicePrice: serviceValue?.price,
    };
    const metaData = { id: selectedServiceId, data };
    const apiRes = await dispatch(editClinicService(metaData));
    if (apiRes?.payload) {
      dispatch(getServices());
      setServiceValues(initialValues);
      setIsModal(!isModal);
    }
  };

  const handleEditModalClose = () => {
    setIsModal(false);
    setServiceValues(initialValues);
  };

  return (
    <div>
      <div className="servicesbox">
        <Grid container spacing={1.5}>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <CustomTextField
              label={nameExpan?.servicename}
              placeholder={nameExpan?.servicename}
              name="servicename"
              fullWidth
              handleChange={handleChange}
              value={serviceValue?.servicename}
              helperText={serviceHelps?.servicename}
              error={serviceErrors?.servicename}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <CustomTextField
              label={nameExpan?.price}
              placeholder={nameExpan?.price}
              name="price"
              fullWidth
              handleChange={handleChange}
              value={serviceValue?.price}
            />
          </Grid>
        </Grid>
        <div className="add-button">
          <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
            <div>
              <div className="clinic-mod-btn-pos">
                <div className="ml10">
                  <CustomButton text="Save" onClick={handleCreateService} />
                </div>
              </div>
            </div>
          </Grid>
        </div>
      </div>

      <div className="servicesbox">
        <Table columns={tableHeaders} datas={tableService} />
      </div>

      <CustomModal
        open={isModal}
        onClose={handleEditModalClose}
        header="Edit Services"
        modal
        modalWidth={50}
      >
        <Grid container spacing={1.5}>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <CustomTextField
              label={nameExpan?.servicename}
              placeholder={nameExpan?.servicename}
              name="servicename"
              fullWidth
              handleChange={handleChange}
              value={serviceValue?.servicename}
              helperText={serviceHelps?.servicename}
              error={serviceErrors?.servicename}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <CustomTextField
              label={nameExpan?.price}
              placeholder={nameExpan?.price}
              name="price"
              fullWidth
              handleChange={handleChange}
              value={serviceValue?.price}
            />
          </Grid>
        </Grid>
        <div className="add-button">
          <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
            <div>
              <div className="clinic-mod-btn-pos">
                <div className="ml10">
                  <CustomButton text="Update" onClick={handleEditService} />
                </div>
              </div>
            </div>
          </Grid>
        </div>
      </CustomModal>
      <CustomModal
        open={deleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        header="Delete"
        modal
        modalWidth={50}
      >
        <div className="ml10">Are you sure want to delete the list?</div>
        <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
          <div className="clinic-mod-btn-pos mb10 mt15">
            <div className="mr10">
              <CustomButton
                text="Cancel"
                onClick={() => setDeleteModalVisible(false)}
              />
            </div>
            <div className="ml10">
              <CustomButton redBtn text="Confirm" onClick={handleDelete} />
            </div>
          </div>
        </Grid>
      </CustomModal>
    </div>
  );
};

export default Services;
