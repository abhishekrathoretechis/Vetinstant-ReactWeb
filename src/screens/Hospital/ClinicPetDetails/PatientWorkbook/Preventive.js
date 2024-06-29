import { Grid } from "@mui/material";
import moment from "moment/moment";
import { useEffect, useState } from "react";
import Carousel from "react-material-ui-carousel";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import CustomButton from "../../../../components/CustomButton";
import CustomModal from "../../../../components/CustomModal/CustomModal";
import Table from "../../../../components/CustomTable";
import CustomTextField from "../../../../components/CustomTextField";
import CustomUpload from "../../../../components/CustomUpload";
import {
  default as CustomSelect,
  default as Select,
} from "../../../../components/Select/Select";
import {
  createPreventive,
  getPetPreventives,
  updatePreventive,
} from "../../../../redux/reducers/petSlice";
import {
  DewormingList,
  FleaBiteList,
  VaccineNames,
  statusList,
} from "../../../../util/arrayList";
import FilesWithCloseButton from "./FilesWithCloseButton";

const nameExpan = {
  type: "Select Type",
  name: "Vaccine Name",
  dueDate: "Due Date",
  remarks: "Remarks",
};

const initialValues = {
  type: "vaccination",
  name: "",
  dueDate: new Date(),
  remarks: "",
  files: [],
};

const tableHeaders = [
  "type",
  "name",
  "date",
  "remark",
  "file",
  "status",
  "preventiveImage",
];

const initialErrors = {
  type: false,
  name: false,
  dueDate: false,
  remarks: false,
};

const initialHelpers = {
  type: "",
  name: "",
  dueDate: "",
  remarks: "",
};

const Preventive = ({ setModVisible, modVisible }) => {
  const location = useLocation();
  const { appointment } = location.state || {};
  const dispatch = useDispatch();
  const [isEditModal, setEditModal] = useState(false);
  const [preventId, setPreventId] = useState("");
  const [preventiveErrors, setPreventiveErrors] = useState(initialErrors);
  const [preventiveHelpers, setPreventiveHelpers] = useState(initialHelpers);
  const [preventiveValues, setPreventiveValues] = useState(initialValues);
  const [selectedTypeList, setSelectedTypeList] = useState(VaccineNames);
  const [searchText, setSearchText] = useState("");
  const preventives = useSelector((state) => state?.pet?.preventives);
  const [type, setType] = useState("All");
  const [attachModVisible, setAttachModVisible] = useState(false);
  const [attachments, setAttachments] = useState(null);
  const [page, setPage] = useState(1);
  const itemsPerLoad = 10;
  const defaultUrl = `?page=1&itemSize=${itemsPerLoad}`;

  useEffect(() => {
    dispatch(
      getPetPreventives({
        petId: appointment?.appoinment?.petId,
        url: defaultUrl,
      })
    );
  }, []);

  const handleModClose = () => {
    setModVisible(!modVisible);
    setEditModal(false);
    setPreventiveValues(initialValues);
    setPreventiveErrors(initialErrors);
    setPreventiveHelpers(initialHelpers);
  };

  const handleEditModal = (prevent) => {
    setPreventId(prevent?.preventiveId);
    setPreventiveValues({
      type: prevent?.type,
      name: prevent?.name,
      dueDate: new Date(prevent?.date),
      remarks: prevent?.remark,
      files: prevent?.file?.map((fle) => ({ file: null, previewUrl: fle })),
    });
    setModVisible(true);
    setEditModal(true);
  };

  const handleChangeValues = (name, value) => {
    if (name === "type") {
      setSelectedTypeList(
        value === "vaccination"
          ? VaccineNames
          : value === "deworming"
            ? DewormingList
            : FleaBiteList
      );
    }
    setPreventiveValues({ ...preventiveValues, [name]: value });
    setPreventiveErrors({
      ...preventiveErrors,
      [name]: value?.length > 0 ? false : true,
    });
    setPreventiveHelpers({
      ...preventiveHelpers,
      [name]:
        value?.length > 0
          ? ""
          : name === "name"
            ? `${preventiveValues?.type === "vaccination"
              ? "Vaccination"
              : preventiveValues?.type === "deworming"
                ? " Deworming"
                : "Flea"
            } name is required`
            : `${nameExpan?.[name]} is required`,
    });
  };

  const onUploadFile = (e) => {
    const reader = new FileReader();
    const file = e.target.files[0];
    reader.onloadend = () => {
      setPreventiveValues({
        ...preventiveValues,
        files: [
          ...preventiveValues?.files,
          {
            file: e.target.files[0],
            previewUrl: reader.result,
          },
        ],
      });
    };
    reader.readAsDataURL(file);
  };

  const handleImageRemove = (ind) => {
    const reqFiles = preventiveValues?.files?.filter((fl, i) => i !== ind);
    setPreventiveValues({ ...preventiveValues, files: reqFiles });
  };

  const handleSave = (status) => {
    const err = {};
    const hlp = {};
    if (!preventiveValues?.type) {
      err.type = true;
      hlp.type = "Type is required";
    }
    if (preventiveValues?.name === "") {
      err.name = true;
      hlp.name = `${preventiveValues?.type === "vaccination"
        ? "Vaccination"
        : preventiveValues?.type === "deworming"
          ? " Deworming"
          : "Flea"
        } name is required`;
    }
    if (!preventiveValues?.dueDate) {
      err.dueDate = true;
      hlp.dueDate = "Due Date is required";
    }

    if (Object.keys(err).length > 0) {
      setPreventiveErrors({ ...preventiveErrors, ...err });
      setPreventiveHelpers({ ...preventiveHelpers, ...hlp });
      return;
    }

    const appointmentId = appointment?.appoinment?.appoimentId;
    const form = new FormData();
    form.append("type", preventiveValues?.type);
    form.append("name", preventiveValues?.name);
    form.append(
      "date",
      moment(new Date(preventiveValues?.dueDate)).format("YYYY-MM-DD")
    );
    form.append("remark", preventiveValues?.remarks);
    form.append("status", status);
    if (preventiveValues?.files?.length > 0) {
      preventiveValues?.files?.forEach((fle) => {
        form.append("files", fle?.file ?? fle?.previewUrl);
      });
    }
    if (!isEditModal) {
      dispatch(createPreventive({ appointmentId, form })).then((res) => {
        if (res?.payload?.status === 200) {
          dispatch(
            getPetPreventives({
              petId: appointment?.appoinment?.petId,
              url: defaultUrl,
            })
          );
          setPage(1);
          handleModClose();
          setPreventiveValues(initialValues);
        }
      });
    } else {
      const metaData = { preventId, form };
      dispatch(updatePreventive(metaData)).then((res) => {
        if (res?.payload?.status === 200) {
          dispatch(
            getPetPreventives({
              petId: appointment?.appoinment?.petId,
              url: defaultUrl,
            })
          );
          setPage(1);
          handleModClose();
          setPreventiveValues(null);
        }
      });
    }
  };

  const handleChangePage = (e, selectedPage) => {
    dispatch(
      getPetPreventives({
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
          <Table
            columns={tableHeaders}
            datas={preventives?.data
              ?.map((item) => {
                return item?.preventiveDetails?.map((detail) => ({
                  preventiveId: item?.preventiveId,
                  petId: item?.petId,
                  remark: item?.remark,
                  status: item?.status,
                  id: detail?.id,
                  type: detail?.type,
                  name: detail?.name,
                  date: detail?.date,
                  file: detail?.file,
                }));
              })
              .flat()
              ?.filter((pre) =>
                type === "All" ? pre?.status : pre?.status === type
              )
              ?.filter(
                (pre) =>
                  pre?.type
                    ?.toLowerCase()
                    .includes(searchText?.toLowerCase()) ||
                  pre?.name?.toLowerCase().includes(searchText?.toLowerCase())
              )}
            grey
            preventive
            onEdit={(e) => handleEditModal(e)}
            onClickFile={(e) => {
              if (e?.file?.length > 0) {
                setAttachments(e?.file ?? []);
                setAttachModVisible(true);
              }
            }}
            page={page}
            rowsPerPage={itemsPerLoad}
            totalRecords={preventives?.totalRecords ?? 0}
            handleChangePage={handleChangePage}
          />
        </div>
      </Grid >

      <CustomModal
        open={modVisible}
        onClose={handleModClose}
        header={isEditModal ? "Edit" : "Add"}
        rightModal
        modalWidth={30}
      >
        <div className="scroll-80vh">
          <Grid container spacing={2} className="ph20 mt10">
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <Select
                list={[
                  { name: "Vaccination", value: "vaccination" },
                  { name: "Deworming", value: "deworming" },
                  { name: "Flea/Tick Treatment", value: "fleaTreatment" },
                ]}
                value={preventiveValues?.type}
                name="type"
                label={nameExpan?.["type"]}
                select
                handleChange={(e) =>
                  handleChangeValues("type", e?.target?.value)
                }
                error={preventiveErrors?.type}
                helperText={preventiveHelpers?.type}
                disabled={isEditModal}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <Select
                list={selectedTypeList}
                value={preventiveValues?.name}
                name="name"
                label={
                  preventiveValues?.type === "vaccination"
                    ? "Vaccine Name"
                    : preventiveValues?.type === "deworming"
                      ? "Deworming Name"
                      : "Treatment Name"
                }
                newSelect
                handleChange={(e) => handleChangeValues("name", e)}
                error={preventiveErrors?.name}
                helperText={preventiveHelpers?.name}
                disabled={isEditModal}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              <CustomTextField
                name="dueDate"
                label={nameExpan?.["dueDate"]}
                fullWidth
                handleChange={(e) =>
                  handleChangeValues("dueDate", e?.target?.value)
                }
                value={preventiveValues?.dueDate}
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
                value={preventiveValues?.remarks}
                multiline
                error={preventiveErrors?.remarks}
                helperText={preventiveHelpers?.remarks}
              />
            </Grid>

            {preventiveValues?.files?.length > 0 ? (
              <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <FilesWithCloseButton
                  files={preventiveValues?.files}
                  onClickFile={(i, file) => handleImageRemove(i)}
                />
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
                    text="Mark as complete"
                    onClick={() => handleSave("Completed")}
                    tabSelectdBtn
                    noBgbtn
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

export default Preventive;
