import CloseIcon from "@mui/icons-material/Close";
import { FormHelperText, Grid } from "@mui/material";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import edit from "../../../../assets/images/png/edit.png";
import CustomButton from "../../../../components/CustomButton";
import CustomModal from "../../../../components/CustomModal/CustomModal";
import CustomTable from "../../../../components/CustomTable";
import CustomTextField from "../../../../components/CustomTextField";
import CustomUpload from "../../../../components/CustomUpload";
import {
  default as CustomSelect,
  default as Select,
} from "../../../../components/Select/Select";
import {
  createDiagnostics,
  getPetDiagnostics,
  updateDiagnostics,
} from "../../../../redux/reducers/petSlice";
import { AppColors } from "../../../../util/AppColors";
import { diagnosticList, statusList } from "../../../../util/arrayList";
const tableHeaders = ["type", "dueDate", "remarks", "attachement", "statusDig"];

const nameExpan = {
  type: "Select Type",
  dueDate: "Due Date",
  remarks: "Remarks",
};

const initialValues = {
  type: "Complete Blood Count (CBC)",
  dueDate: new Date(),
  remarks: "",
  file: {},
};

const initialErrors = {
  type: false,
  dueDate: false,
  remarks: false,
};

const initialHelpers = {
  type: "",
  dueDate: "",
  remarks: "",
};

const initialFile = { file: null, previewUrl: "" };

const Diagnostics = ({ modVisible, setModVisible }) => {
  const location = useLocation();
  const { appointment } = location.state || {};
  const dispatch = useDispatch();
  const [isEditModal, setEditModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [diagnosticsId, setDiagnosticsId] = useState("");
  const [diagnosticsValues, setDiagnosticsValues] = useState(initialValues);
  const [diagnosticsHelpers, setDiagnosticsHelpers] = useState(initialHelpers);
  const [diagnosticsErrors, setDiagnosticsErrors] = useState(initialErrors);
  const [fileError, setFileError] = useState(false);
  const diagnostics = useSelector((state) => state?.pet?.diagnostics);
  const [type, setType] = useState("All");
  const [attachModVisible, setAttachModVisible] = useState(false);
  const [attachment, setAttachment] = useState(null);
  const [page, setPage] = useState(1);
  const itemsPerLoad = 10;
  const defaultUrl = `?page=1&itemSize=${itemsPerLoad}`;

  useEffect(() => {
    dispatch(
      getPetDiagnostics({
        petId: appointment?.appoinment?.petId,
        url: defaultUrl,
      })
    );
  }, []);

  const handleModClose = () => {
    setModVisible(!modVisible);
    setDiagnosticsValues(initialValues);
    setDiagnosticsErrors(initialErrors);
    setDiagnosticsHelpers(initialHelpers);
    setEditModal(false);
  };

  const handleChangeValues = (name, value) => {
    setDiagnosticsValues({ ...diagnosticsValues, [name]: value });
    setDiagnosticsErrors({
      ...diagnosticsErrors,
      [name]: value?.length > 0 ? false : name === "dueDate" ? false : true,
    });
    setDiagnosticsHelpers({
      ...diagnosticsHelpers,
      [name]:
        value?.length > 0
          ? ""
          : name === "dueDate"
            ? ""
            : `${name === "type" ? "Type" : nameExpan?.[name]} is required`,
    });
  };

  const onUploadFile = (e, type) => {
    const reader = new FileReader();
    const file = e.target.files[0];
    reader.onloadend = () => {
      setDiagnosticsValues({
        ...diagnosticsValues,
        file: {
          file: e.target.files[0],
          previewUrl: reader.result,
        },
      });
    };
    reader.readAsDataURL(file);
  };

  const handleImageRemove = () => {
    setDiagnosticsValues({ ...diagnosticsValues, file: {} });
  };

  const handleEditModal = (diagnostics) => {
    setDiagnosticsId(diagnostics?.diagonosticId);
    setDiagnosticsValues({
      type: diagnostics?.type,
      remarks: diagnostics?.remark,
      dueDate: diagnostics?.dueDate,
      file: { ...initialFile, previewUrl: diagnostics?.file },
    });
    setModVisible(true);
    setEditModal(true);
  };

  const handleSave = (status) => {
    //handle validation
    const err = {};
    const hlp = {};
    if (!diagnosticsValues?.type) {
      err.type = true;
      hlp.type = "Type is required";
    }
    if (!diagnosticsValues?.dueDate) {
      err.dueDate = true;
      hlp.dueDate = "Due Date is required";
    }
    if (Object.keys(err).length > 0) {
      setDiagnosticsErrors({ ...diagnosticsErrors, ...err });
      setDiagnosticsHelpers({ ...diagnosticsHelpers, ...hlp });
      return;
    }

    // if (!petFileUploadUrl?.file && !petFileUploadUrl?.previewUrl) {
    //   return setFileError(true);
    // }
    const form = new FormData();
    form.append("type", diagnosticsValues?.type);
    form.append(
      "dueDate",
      moment(new Date(diagnosticsValues?.dueDate)).format("YYYY-MM-DD")
    );
    form.append("remark", diagnosticsValues?.remarks);
    form.append(
      "file",
      diagnosticsValues?.file?.file ?? diagnosticsValues?.file?.previewUrl
    );
    form.append("status", status);

    if (!isEditModal) {
      const appointmentId = appointment?.appoinment?.appoimentId;
      dispatch(createDiagnostics({ appointmentId, form, formData: true })).then(
        (res) => {
          if (res?.payload?.status === 200) {
            dispatch(
              getPetDiagnostics({
                petId: appointment?.appoinment?.petId,
                url: defaultUrl,
              })
            );
            setPage(1);
            handleModClose();
            setFileError(false);
          }
        }
      );
    } else {
      const metaUpdate = { diagnosticsId, form, formData: true };
      dispatch(updateDiagnostics(metaUpdate)).then((res) => {
        if (res?.payload?.status === 200) {
          dispatch(
            getPetDiagnostics({
              petId: appointment?.appoinment?.petId,
              url: defaultUrl,
            })
          );
          setPage(1);
          handleModClose();
          setFileError(false);
        }
      });
    }
  };

  const handleChangePage = (e, selectedPage) => {
    dispatch(
      getPetDiagnostics({
        petId: appointment?.appoinment?.petId,
        url: `?page=${selectedPage}&itemSize=${itemsPerLoad}`,
      })
    );
    setPage(selectedPage);
  };

  return (
    <>
      <Grid container>
        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
          <div className="flex-row ml20 mt20">
            <Grid item xs={12} sm={12} md={6} lg={6} xl={6} className="ml70">
              <CustomTextField
                search
                placeholder="Search"
                fullWidth
                backgroundColor="#E3CECE52"
                value={searchText}
                handleChange={(e) => setSearchText(e.target.value)}
              />
            </Grid>
            <div className="w20Per ml20">
              <Grid item xs={12} sm={12} md={3} lg={3} xl={3}>
                <div className="normal-height">
                  <CustomButton
                    text="Add"
                    smallBtn
                    onClick={() => setModVisible(true)}
                  />
                </div>
              </Grid>
            </div>
            <Grid item xs={12} sm={12} md={2} lg={2} xl={2}>
              <CustomSelect
                select
                list={statusList}
                value={type}
                handleChange={(e) => setType(e?.target?.value)}
              />
            </Grid>
          </div>
        </Grid>
        <div className="pb100 w100Per">
          <CustomTable
            grey={true}
            columns={tableHeaders}
            datas={diagnostics?.data
              ?.map((diag, i) => {
                return {
                  ...diag,
                  remarks: diag?.remark,
                  type: <strong>{diag?.type}</strong>,
                  dueDate: moment(diag?.dueDate).format("DD-MM-YYYY"),
                  attachment: (
                    <span
                      className={
                        diag?.file?.length > 0 ? "blue2 cursor" : "gray7"
                      }
                      onClick={() => {
                        if (diag?.file?.length > 0) {
                          setAttachment(diag?.file);
                          setAttachModVisible(true);
                        }
                      }}
                    >
                      {diag?.file?.length > 0 ? "1 Attachment" : "Nil"}
                    </span>
                  ),
                  statusDig: (
                    <div className="flex-row">
                      <div
                        className={
                          diag?.status === "Completed"
                            ? "completed"
                            : diag?.status === "Pending"
                              ? "pending"
                              : "overdue"
                        }
                      >
                        {diag?.status}
                      </div>
                      <img
                        src={edit}
                        alt=""
                        className="ml20 cursor"
                        onClick={() => handleEditModal(diag)}
                      />
                    </div>
                  ),
                };
              })
              ?.filter((pre) =>
                type === "All" ? pre?.status : pre?.status === type
              )
              ?.filter((dia) =>
                dia?.type?.props?.children
                  ?.toLowerCase()
                  .includes(searchText.toLowerCase())
              )}
            // onClickEditBtn={handleEdit}
            page={page}
            rowsPerPage={itemsPerLoad}
            totalRecords={diagnostics?.totalRecords}
            handleChangePage={handleChangePage}
          />
        </div>
      </Grid>
      <CustomModal
        open={modVisible}
        onClose={handleModClose}
        header={isEditModal ? "Edit" : "Add"}
        rightModal
        modalWidth={30}
      >
        <div className="scroll-80vh">
          <Grid container spacing={2} className="ph20">
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} className="mt10">
              <Select
                list={diagnosticList}
                value={diagnosticsValues?.type}
                name="type"
                label={nameExpan?.["type"]}
                select
                handleChange={(e) =>
                  handleChangeValues("type", e?.target?.value)
                }
                error={diagnosticsErrors?.type}
                helperText={diagnosticsHelpers?.type}
                disabled={isEditModal}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <div className="font-medium fs14 gray7">Due Date</div>
              <CustomTextField
                name="dueDate"
                fullWidth
                handleChange={(e) =>
                  handleChangeValues("dueDate", e?.target?.value)
                }
                value={diagnosticsValues?.dueDate}
                error={diagnosticsErrors?.dueDate}
                helperText={diagnosticsHelpers?.dueDate}
                mobileDate
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <CustomTextField
                label={nameExpan?.["remarks"]}
                placeholder="Remarks"
                name="remarks"
                fullWidth
                handleChange={(e) =>
                  handleChangeValues("remarks", e?.target?.value)
                }
                value={diagnosticsValues?.remarks}
                error={diagnosticsErrors?.remarks}
                helperText={diagnosticsHelpers?.remarks}
                multiline
              />
            </Grid>

            {diagnosticsValues?.file?.previewUrl ? (
              <div className="flex-row">
                <div
                  style={{
                    display: "inline-block",
                    position: "relative",
                    marginLeft: 15,
                    marginTop: 20,
                  }}
                >
                  <img
                    className="upload-img"
                    alt=""
                    src={diagnosticsValues?.file?.previewUrl}
                  />

                  <CloseIcon
                    sx={{ width: 20, height: 20, color: AppColors.white }}
                    className="img-close cursor"
                    onClick={handleImageRemove}
                  />
                </div>
              </div>
            ) : null}
            {fileError ? (
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <FormHelperText error>File is required</FormHelperText>
              </Grid>
            ) : null}

            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <CustomUpload onUploadFile={onUploadFile} multipleNew />
            </Grid>

            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <div className="flex1-center">
                <div>
                  <CustomButton
                    text="Schedule"
                    smallBtn
                    onClick={() => handleSave("Pending")}
                  />
                </div>
                <div className="ml10">
                  <CustomButton
                    noBgbtn
                    text="Mark as complete"
                    onClick={() => handleSave("Completed")}
                    tabSelectdBtn
                  />
                </div>
              </div>
            </Grid>
          </Grid>
        </div>
      </CustomModal>
    </>
  );
};

export default Diagnostics;
