import React, { useEffect, useState } from "react";
import CustomButton from "../../components/CustomButton";
import { FormHelperText, Grid, IconButton } from "@mui/material";
import Table from "../../components/CustomTable";
import { ToggleOff, ToggleOn } from "@mui/icons-material";
import CustomModal from "../../components/CustomModal/CustomModal";
import CustomTextField from "../../components/CustomTextField";
import Checkbox from "../../components/CustomCheckbox";
import { roleList } from "../../util/arrayList";
import Select from "../../components/Select/Select";
import CustomUpload from "../../components/CustomUpload";
import { useDispatch, useSelector } from "react-redux";
import {
  createRoleAndAccess,
  editRoleAndAccess,
  getRolesAndAccess,
} from "../../redux/reducers/clinicSlice";
import { hideLoader, showLoader } from "../../redux/reducers/loaderSlice";
import generatePass from "../../util/randomPassword";
import { ErrorStrings } from "../../util/ErrorString";
import { EmailRegex } from "../../util/Validations";

const tableHeaders = ["name", "emailId", "role", "accessStatus", "editButton"];
const nameExpan = {
  editName: "Name",
  name: "Name",
  emailId: "Email Id",
  role: "Role",
  password: "Password",
};
const initialValues = {
  editName: "",
  name: "",
  emailId: "",
  role: [],
  password: "",
};

const initialError = {
  editName: false,
  name: false,
  emailId: false,
  role: false,
  password: false,
};
const initialFile = { file: null, imagePreviewUrl: "" };

const initialHelp = {
  editName: "",
  name: "",
  emailId: "",
  role: "",
  password: "",
};
const CommonAccessAndRolesComponent = () => {
  const dispatch = useDispatch();
  const getRolesData = useSelector((state) => state?.clinic?.roles);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAutoGenPass, setAutoGenPass] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [tableRole, setTableRole] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [list, setList] = useState(roleList);
  const [rolesValue, setRolesValues] = useState(initialValues);
  const [rolesErrors, setRolesErrors] = useState(initialError);
  const [rolesHelps, setRolesHelps] = useState(initialHelp);
  const [roleNotSelected, setRoleNotSelected] = useState(false);
  const [selectedRoleNames, setSelectedRoleNames] = useState([]);
  const [roleFileUploadUrl, setRoleFileUploadUrl] = useState(initialFile);
  const [id, setId] = useState();
  const [editEmail, setEditEmail] = useState();
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;
  const defaultUrl = `?limit=${rowsPerPage}&skip=0`;
  useEffect(() => {
    dispatch(getRolesAndAccess(defaultUrl));
  }, []);

  const onUploadFile = (e, type) => {
    const reader = new FileReader();
    const file = e.target.files[0];
    reader.onloadend = () => {
      if (type === "role") {
        setRoleFileUploadUrl({
          file: e.target.files[0],
          imagePreviewUrl: reader.result,
        });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCheckboxChange = (selectedRole) => {
    const updatedList = list.map((role) =>
      role.id === selectedRole.id
        ? { ...role, isSelected: !role.isSelected }
        : role
    );
    setList(updatedList);

    // Update selected role names
    const updatedSelectedRoleNames = updatedList
      .filter((role) => role.isSelected)
      .map((role) => role.name);
    setSelectedRoleNames(updatedSelectedRoleNames);
  };

  

  const getRolesAndAccessTable = (roles) => {
    dispatch(showLoader());
    const requiredRoles = roles?.map((roles, i) => {
      return {
        name: roles?.name,
        emailId: roles?.emailID,
        role: roles?.typeOfRoles && ( // Fix here
        <ul>
          {roles?.typeOfRoles?.map((roleItem, index) => ( // Fix here
            <li key={index}>{roleItem}</li> // Fix here
          ))}
        </ul>
      ),
        accessStatus: (
          <IconButton
            style={{ color: roles?.block === true ? "green" : "inherit" }}
          >
            {roles?.block ? <ToggleOn /> : <ToggleOff />}
          </IconButton>
        ),
        editButton: (
          <div
            onClick={() => handleEditModal(roles?._id, roles)}
            className="access-edit-text"
          >
            Edit
          </div>
        ),
      };
    });
    dispatch(hideLoader());
    setTableRole(requiredRoles);
  };
  useEffect(() => {
    if (getRolesData?.length > 0) getRolesAndAccessTable(getRolesData);
  }, [getRolesData]);

  const handleModalVisible = () => {
    handleReset();
    setIsModalVisible(!isModalVisible);
  };

  const handleChange = (e) => {
    setRolesValues({ ...rolesValue, [e.target.name]: e.target.value });
    if (e.target.value === "") {
      setRolesErrors({ ...rolesErrors, [e.target.name]: true });
      setRolesHelps({
        ...rolesHelps,
        [e.target.name]: `${nameExpan?.[e.target.name]} Required Field`,
      });
    }
    if (e.target.value !== "") {
      setRolesErrors({ ...rolesErrors, [e.target.name]: false });
      setRolesHelps({ ...rolesHelps, [e.target.name]: "" });
    }
  };

  const handleValidation = () => {
    const errorList = [];
    const woErrorList = [];
    Object.keys(rolesValue).forEach(function (key, index) {
      if (key === "email") {
        if (rolesValue?.[key] === "") return errorList?.push(key);
 
        if (!EmailRegex.test(rolesValue?.[key])) {
          return errorList?.push(key);
        } else woErrorList.push(key);
      } else if (key === "password") {
        if (rolesValue?.[key] === "") return errorList?.push(key);
        if (rolesValue?.[key]?.length < 6) {
          return errorList?.push(key);
        } else woErrorList.push(key);
      } else if (key === "editName") {
        if (rolesValue?.[key]?.length === 0 || rolesValue?.[key] === "") {
          woErrorList.push(key);
        } else {
          woErrorList.push(key);
        }
      } else {
        if (rolesValue?.[key]?.length === 0 || rolesValue?.[key] === "") {
          return errorList?.push(key);
        }
        woErrorList.push(key);
      }
    });
    let errorObj = {};
    let errHelperObj = {};
    let correctObj = {};
    let helperObj = {};
    //set Error
    if (errorList?.length > 0) {
      errorList?.forEach((key) => {
        errorObj = { ...errorObj, [key]: true };
        const value = rolesValue?.[key];
        if (key === "email") {
          if (value === "") {
            return (errHelperObj = {
              ...errHelperObj,
              [key]: ErrorStrings.emptyEmail,
            });
          }
          if (!EmailRegex.test(value)) {
            errHelperObj = {
              ...errHelperObj,
              [key]: ErrorStrings.inValidEmail,
            };
            return;
          }
        }
        if (key === "password") {
          if (value === "") {
            errHelperObj = { ...errHelperObj, [key]: ErrorStrings.emptyPass };
            return;
          }
          if (value < 6) {
            errHelperObj = { ...errHelperObj, [key]: ErrorStrings.inValidPass };
          }
        }
        errHelperObj = {
          ...errHelperObj,
          [key]: `${nameExpan?.[key]} Required Field`,
        };
      });
    }
    //Remove Error
    if (woErrorList?.length > 0) {
      woErrorList?.forEach((key) => {
        correctObj = { ...correctObj, [key]: false };
        helperObj = { ...helperObj, [key]: "" };
      });
    }
    setRolesErrors({ ...rolesErrors, ...correctObj, ...errorObj });
    setRolesHelps({ ...rolesHelps, ...helperObj, ...errHelperObj });
    return { errorList, woErrorList };
  };

  const handleValidationForEdit = (values) => {
    const errorList = [];
    const woErrorList = [];
    if (values?.editName?.trim() === "") {
      errorList.push("editName");
    } else {
      woErrorList.push("editName");
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

    setRolesErrors({ ...rolesErrors, ...correctObj, ...errorObj });
    setRolesHelps({ ...rolesHelps, ...helperObj, ...errorHelperObj });

    return { errorList, woErrorList };
  };

  const handleEditModal = (id, roles) => {
    const selectedRoles = getRolesData?.find((roles) => roles._id === id);
    if (selectedRoles) {
      // Map through roleList and mark the roles that match typeOfRoles as selected
      const updatedList = roleList.map((role) => ({
        ...role,
        isSelected: selectedRoles.typeOfRoles.includes(role.value),
      }));
      setList(updatedList);
  
      setRolesValues({
        ...initialValues,
        editName: selectedRoles.name,
        // role: selectedRoles.typeOfRoles,
      });
      setId(id);
      setEditEmail(roles?.emailID);
      setIsModalOpen(!isModalOpen);
    }
  };
  
  const checkDaysSelected = (list) => {
    const checkedList = list?.filter((li) => li?.isSelected);
    return checkedList?.length > 0 ? false : true;
  };
  const getSeletedRoles = (dayList) => {
    const requiredDays = [];
    dayList?.forEach((day) => {
      if (day?.isSelected) {
        requiredDays.push(day?.value);
      }
    });
    return requiredDays;
  };
  const handleEditButton = () => {
    const validation = handleValidationForEdit(rolesValue);
    if (validation?.errorList?.length > 0) return;
    const daysSelected = checkDaysSelected(list);
    if (daysSelected) return setRoleNotSelected(true); 
    const data = {
      name: rolesValue?.editName,
      // typeOfRoles: selectedRoleNames,
      typeOfRoles:getSeletedRoles(list)
    };
    const metaData = { id, data };
    dispatch(editRoleAndAccess(metaData));
    setIsModalOpen(!isModalOpen);
  };
  const handleSelect = (e, key) => {
    setRolesValues({ ...rolesValue, [key]: e.target.value });
  };
  const handleAutoGenPassword = () => {
    setAutoGenPass(!isAutoGenPass);
    if (!isAutoGenPass) {
      const pass = generatePass();
      setRolesValues({ ...rolesValue, password: pass });
    } else {
      setRolesValues({ ...rolesValue, password: "" });
    }
  };

  const handleReset = () => {
    setRolesValues(initialValues);
    setRolesErrors(initialError);
    setRolesHelps(initialHelp);
    setAutoGenPass(false);
    setRoleFileUploadUrl(initialFile);
  };

  const handleSubmit = async () => {
    const validation = handleValidation();
    if (validation?.errorList?.length > 0) return;
   
    const form = new FormData();
    form.append("typeOfRoles", rolesValue?.role);
    form.append("role", "doctor");
    form.append("name", rolesValue?.name);
    form.append("emailID", rolesValue?.emailId);
    form.append("password", rolesValue?.password);
    if (roleFileUploadUrl?.file) {
      form.append("image", roleFileUploadUrl?.file);
    }
    const apiSuccess = await dispatch(createRoleAndAccess(form));
    if (apiSuccess?.payload) {
      setIsModalVisible(false);
      handleReset();
    }
  };

  const handleChangePage = (e, selectedPage) => {
    const reqSkip = (selectedPage - 1) * rowsPerPage;
    setPage(selectedPage);
    setTableRole([]);
    dispatch(getRolesAndAccess(`?limit=${rowsPerPage}&skip=${reqSkip}`));
  };
  const handleSelectedRoles = (selectedRole) => {
    const requiredRoles = list?.map((role) => {
      if (selectedRole?.id === role?.id) {
        return { ...role, isSelected: !role?.isSelected };
      }
      return role;
    });
    setList(requiredRoles);
    if (requiredRoles?.length > 0) setRoleNotSelected(false);
    if (requiredRoles?.length === 0) setRoleNotSelected(true);
  };
  console.log("list------>>",list)
  return (
    <div className="access-main">
      <div className="access-left-main">
        <Table
          columns={tableHeaders}
          datas={tableRole}
          page={page}
          rowsPerPage={rowsPerPage}
          totalRecords={getRolesData?.totalRecords}
          handleChangePage={handleChangePage}
        />
      </div>
      <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
        <div className="mt20">
          <CustomButton text="Create" onClick={handleModalVisible} />
        </div>
      </Grid>

      <CustomModal
        open={isModalVisible}
        onClose={handleModalVisible}
        header="Create User"
        modal
        modalWidth={50}
      >
        <Grid container spacing={1.5}>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <CustomUpload
              onUploadFile={(e) => onUploadFile(e, "role")}
              value={roleFileUploadUrl?.imagePreviewUrl}
              center
              imageHeight={70}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <CustomTextField
              label={nameExpan?.["name"]}
              placeholder={nameExpan?.["name"]}
              name="name"
              fullWidth
              handleChange={handleChange}
              value={rolesValue?.name}
              helperText={rolesHelps?.name}
              error={rolesErrors?.name}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <Select
              list={roleList}
              value={rolesValue?.role}
              handleChange={(e) => handleSelect(e, "role")}
              name="role"
              label={nameExpan?.["role"]}
              select
              multiSelectTag
              error={rolesErrors?.role}
              helperText={rolesHelps?.role}
            />
          </Grid>
         
          <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
            <CustomTextField
              label={nameExpan?.["emailId"]}
              placeholder={nameExpan?.["emailId"]}
              name="emailId"
              fullWidth
              handleChange={handleChange}
              value={rolesValue?.emailId}
              helperText={rolesHelps?.emailId}
              error={rolesErrors?.emailId}
            />
          </Grid>
          <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
            <CustomTextField
              label={nameExpan?.["password"]}
              placeholder={nameExpan?.["password"]}
              name="password"
              password
              fullWidth
              value={rolesValue?.password}
              handleChange={handleChange}
              showPassword={showPassword}
              handleClickShowPassword={() => setShowPassword(!showPassword)}
              helperText={rolesHelps?.password}
              error={rolesErrors?.password}
            />
          </Grid>
        </Grid>
        <div className="bottom-row">
          <Grid item xs={12} sm={12} md={5} lg={5} xl={5}>
            <Checkbox
              label="Auto-Generate Password"
              checked={isAutoGenPass}
              onChange={handleAutoGenPassword}
            />
          </Grid>

          <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
            <div className="access-button-main">
              <div className="mr10">
                <CustomButton text="Reset" grayBtn onClick={handleReset} />
              </div>
              <div className="ml10">
                <CustomButton text="Register" onClick={handleSubmit} />
              </div>
            </div>
          </Grid>
        </div>
      </CustomModal>

      <CustomModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        header="Edit"
        modal
        modalWidth={40}
      >
        <Grid container spacing={2}>
          <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
            <CustomTextField
              label={nameExpan?.["editName"]}
              placeholder={nameExpan?.["editName"]}
              name="editName"
              fullWidth
              handleChange={handleChange}
              value={rolesValue?.editName}
              helperText={rolesHelps?.editName}
              error={rolesErrors?.editName}
            />
          </Grid>
          <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
            <CustomTextField
              label={"Email Id"}
              placeholder={"Email Id"}
              name={"Email Id"}
              fullWidth
              value={editEmail}
            />
          </Grid>
        </Grid>
        <div className="roles-column">
          <div className="roles-text">Roles</div>
          {list?.map((role, i) => (
            <Grid container key={i}>
              <Grid item xs={4} sm={4} md={4} lg={4} xl={4}>
                <Checkbox
                  label={role?.name}
                  checked={role?.isSelected}
                  name="isSelected"
                  // onChange={() => handleCheckboxChange(role)}
                  onChange={(e) => handleSelectedRoles(role)}

                />
              </Grid>
              {roleNotSelected ? (
                <FormHelperText error>
                  Please Select at least one day
                </FormHelperText>
              ) : null}
            </Grid>
          ))}
        </div>

        <div className="access-button-main">
          <div className="access-button">
            <CustomButton
              text="cancel"
              redBtn
              onClick={() => setIsModalOpen(false)}
            />
          </div>
          <div className="access-button">
            <CustomButton text="Update" onClick={handleEditButton} />
          </div>
        </div>
      </CustomModal>
    </div>
  );
};

export default CommonAccessAndRolesComponent;
