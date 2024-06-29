import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { Button, Grid, Typography, styled } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import PropTypes from "prop-types";
import * as React from "react";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import CreateOutlinedIcon from "@mui/icons-material/CreateOutlined";
import "./Component.css";
import { AppColors } from "../util/AppColors";

const CustomUpload = ({
  uploadText,
  onUploadFile,
  value,
  center,
  imageHeight,
  multiple,
  values,
  multipleNew,
  profileImg,
}) => {
  const centerCon = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  if (profileImg) {
    return (
      <Grid
        container
        style={{
          height: 150,
          marginTop: value ? 10 : 0,
          marginBottom: value ? 10 : -30,
        }}
      >
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Typography className="font-medium fs14">{uploadText}</Typography>
          <div style={centerCon}>
            {value ? (
              <IconButton
                color="primary"
                aria-label="upload picture"
                component="label"
                style={{
                  width: imageHeight,
                  height: imageHeight,
                  padding: 0,
                }}
              >
                <input
                  accept="image/*"
                  hidden
                  type="file"
                  onChange={onUploadFile}
                />
                <img
                  src={value}
                  alt={value}
                  style={{
                    width: imageHeight,
                    height: imageHeight,
                    objectFit: "cover",
                    borderRadius: 6,
                  }}
                />
              </IconButton>
            ) : (
              <Grid container spacing={1} flexDirection="column">
                <Grid item xs={12} sm={12} md={12} lg={12} style={centerCon}>
                  <IconButton
                    color="primary"
                    aria-label="upload picture"
                    component="label"
                    style={{
                      background: "#E6E6E680",
                      padding: 25,
                      width: 125,
                      height: 125,
                      borderRadius: 6,
                    }}
                  >
                    <input
                      accept="image/*"
                      type="file"
                      onChange={onUploadFile}
                    />
                    <img
                      src={require("../assets/images/png/emprofile.png")}
                      alt=""
                    />
                    <CreateOutlinedIcon className="green-pen upload-pen" />
                  </IconButton>
                </Grid>
              </Grid>
            )}
          </div>
        </Grid>
      </Grid>
    );
  }

  if (multipleNew) {
    return (
      <Grid
        container
        style={{
          height: 150,
          marginTop: 10,
          marginBottom: 20,
        }}
      >
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <div className="flex-center">
            <CloudUploadOutlinedIcon
              sx={{ height: 40, width: 40, color: AppColors.gray4 }}
            />
          </div>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <div className="flex-center">
            <Typography className="txt-regular black fs14 mt10">
              Select a file or drag and drop here
            </Typography>
          </div>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <div className="flex-center">
            <Typography className="txt-regular gray9 fs12 mt5">
              JPG, PNG or PDF, file size no more than 10MB
            </Typography>
          </div>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <div className="flex-center mt20">
            <div>
              {/* <div className="w30Per"> */}
              <Button
                component="label"
                role={undefined}
                variant="outlined"
              // tabIndex={-1}
              >
                Select file
                <VisuallyHiddenInput type="file" onChange={onUploadFile} />
              </Button>
            </div>
          </div>
        </Grid>
      </Grid>
    );
  }

  if (multiple) {
    return (
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <div className="upload-pic-row">
            {values?.length > 0
              ? values?.map((value, index) => (
                <IconButton
                  key={index}
                  color="primary"
                  aria-label="upload picture"
                  component="label"
                  style={{
                    background: "fff",
                    padding: 0,
                    width: 84,
                    height: 84,
                    marginLeft: 10,
                    marginRight: 10,
                  }}
                >
                  <img
                    src={value?.imagePreviewUrl}
                    alt={value?.imagePreviewUrl}
                    style={{
                      objectFit: "fill",
                      borderRadius: "50%",
                      width: 80,
                      height: 80,
                    }}
                  />
                </IconButton>
              ))
              : null}
            {values?.length < 5 ? (
              <div style={{ marginLeft: 10 }}>
                <IconButton
                  color="primary"
                  aria-label="upload picture"
                  component="label"
                  style={{
                    background: "#E5E4E2",
                    padding: 30,
                    width: 84,
                    height: 84,
                  }}
                >
                  <input accept="image/*" type="file" onChange={onUploadFile} />
                  <PhotoCamera
                    style={{
                      color: "#fff",
                      borderRadius: "50%",
                    }}
                  />
                </IconButton>
              </div>
            ) : null}
          </div>
        </Grid>
      </Grid>
    );
  }

  if (center) {
    return (
      <Grid
        container
        style={{
          height: value ? imageHeight : 120,
          marginTop: value ? 10 : 0,
          marginBottom: value ? 10 : -30,
        }}
      >
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <div style={centerCon}>
            {value ? (
              <IconButton
                color="primary"
                aria-label="upload picture"
                component="label"
                style={{
                  width: imageHeight,
                  height: imageHeight,
                  padding: 0,
                }}
              >
                <input
                  accept="image/*"
                  hidden
                  type="file"
                  onChange={onUploadFile}
                />
                <img
                  src={value}
                  alt={value}
                  style={{
                    width: imageHeight,
                    height: imageHeight,
                    objectFit: "cover",
                    borderRadius: imageHeight ? imageHeight / 2 : 60,
                  }}
                />
              </IconButton>
            ) : (
              <Grid container spacing={1} flexDirection="column">
                <Grid item xs={12} sm={12} md={12} lg={12} style={centerCon}>
                  <IconButton
                    color="primary"
                    aria-label="upload picture"
                    component="label"
                    style={{
                      background: value ? "fff" : "#E5E4E2",
                      padding: value ? 0 : 15,
                      width: 50,
                      height: 50,
                    }}
                  >
                    <input
                      accept="image/*"
                      type="file"
                      onChange={onUploadFile}
                    />
                    <PhotoCamera
                      style={{
                        color: "#fff",
                        borderRadius: "50%",
                      }}
                    />
                  </IconButton>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} style={centerCon}>
                  <Typography variant="body1" className="text blue-color">
                    {uploadText}
                  </Typography>
                </Grid>
              </Grid>
            )}
          </div>
        </Grid>
      </Grid>
    );
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={12} md={12} lg={12}>
        <div className="upload-row">
          <div className="upload-image-div">
            {value ? (
              <IconButton
                color="primary"
                aria-label="upload picture"
                component="label"
                style={{
                  background: value ? "fff" : "#E5E4E2",
                  padding: value ? 0 : 30,
                  width: 84,
                  height: 84,
                }}
              >
                <input
                  accept="image/*"
                  hidden
                  type="file"
                  onChange={onUploadFile}
                />
                <img
                  src={value}
                  alt={value}
                  style={{
                    objectFit: "fill",
                    borderRadius: "50%",
                    width: 80,
                    height: 80,
                  }}
                />
              </IconButton>
            ) : (
              <IconButton
                color="primary"
                aria-label="upload picture"
                component="label"
                style={{
                  background: value ? "fff" : "#E5E4E2",
                  padding: value ? 0 : 30,
                  width: 84,
                  height: 84,
                }}
              >
                <input accept="image/*" type="file" onChange={onUploadFile} />
                <PhotoCamera
                  style={{
                    color: "#fff",
                    borderRadius: "50%",
                  }}
                />
              </IconButton>
            )}
          </div>
          <div style={{ display: "block" }}>
            <div className="upload-text-position upload-text Roboto-Regular-Text">
              {uploadText}
            </div>
          </div>
        </div>
      </Grid>
    </Grid>
  );
};

CustomUpload.propTypes = {
  uploadText: PropTypes.string,
  onUploadFile: PropTypes.func,
  value: PropTypes.string,
  center: PropTypes.bool,
  createQuiz: PropTypes.bool,
  imageHeight: PropTypes.number,
  multiple: PropTypes.bool,
  values: PropTypes.array,
  multipleNew: PropTypes.bool,
  profileImg: PropTypes.bool,
};

CustomUpload.defaultProps = {
  uploadText: "",
  onUploadFile: () => { },
  value: "",
  center: false,
  createQuiz: false,
  imageHeight: 75,
  multiple: false,
  values: [],
  multipleNew: false,
  profileImg: false,
};

export default CustomUpload;
