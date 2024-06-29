import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ClearIcon from "@mui/icons-material/Clear";
import { Divider, Grid } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import PropTypes from "prop-types";
import * as React from "react";
import "./Component.css";
import CustomClips from "./CustomClips";

const centerHeaderTextStyle = {
  flex: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  color: "#36454F",
  fontSize: 20,
};

const headerTextStyle = {
  color: "#36454F",
  fontSize: 20,
  marginLeft: 80,
};

const headerWOBackCanText = {
  color: "#36454F",
  fontSize: 20,
  marginLeft: 25,
};

const CustomCommonHeader = ({
  headerCenter,
  isCancelBtnVisible,
  headerText,
  onHandleBackClick,
  onHandleCancelClick,
  onClick,
  isRightButton,
  rightButtonName,
  fullWidth,
  disabled,
  isBackBtnVisible,
  outlined,
  isAddQuestiontButton,
  onClickOnAdd,
}) => {
  return (
    <>
      <Divider />
      <Grid
        container
        className={
          fullWidth ? "custom-header-width-wo-right" : "custum-header-width"
        }
      >
        <Grid
          item
          xs={12}
          sm={12}
          md={12}
          lg={12}
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
          }}
        >
          {isCancelBtnVisible || isBackBtnVisible ? (
            <div
              style={{
                position: "absolute",
                marginLeft: 20,
                alignItems: "center",
              }}
            >
              <IconButton
                style={{
                  height: 40,
                  width: 40,
                  background: "#E5E4E2",
                  borderRadius: "50%",
                }}
                onClick={
                  isCancelBtnVisible ? onHandleCancelClick : onHandleBackClick
                }
              >
                {isCancelBtnVisible ? (
                  <ClearIcon sx={{ color: "#36454F" }} />
                ) : (
                  <ChevronLeftIcon sx={{ color: "#36454F" }} />
                )}
              </IconButton>
            </div>
          ) : null}
          <div
            style={
              headerCenter
                ? centerHeaderTextStyle
                : isCancelBtnVisible || isBackBtnVisible
                ? headerTextStyle
                : headerWOBackCanText
            }
            className="text"
          >
            {headerText}
          </div>
          {isAddQuestiontButton ? (
            <div
              style={{
                position: "absolute",
                alignItems: "center",
                right: 120,
              }}
            >
              <CustomClips
                label={"Add Question"}
                noIcon
                onClick={onClickOnAdd}
                outlined={outlined}
                gradiantButton
              />
            </div>
          ) : null}
          {isRightButton ? (
            <div
              style={{
                position: "absolute",
                alignItems: "center",
                right: 20,
              }}
            >
              <CustomClips
                disabled={disabled}
                label={rightButtonName}
                noIcon
                onClick={onClick}
                outlined={outlined}
                gradiantButton
              />
            </div>
          ) : null}
        </Grid>
      </Grid>
    </>
  );
};

CustomCommonHeader.propTypes = {
  headerCenter: PropTypes.bool,
  isCancelBtnVisible: PropTypes.bool,
  headerText: PropTypes.string,
  onHandleBackClick: PropTypes.func,
  onHandleCancelClick: PropTypes.func,
  onClick: PropTypes.func,
  isRightButton: PropTypes.bool,
  rightButtonName: PropTypes.string,
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
  isBackBtnVisible: PropTypes.bool,
  outlined: PropTypes.bool,
};

CustomCommonHeader.defaultProps = {
  headerCenter: false,
  isCancelBtnVisible: false,
  headerText: "",
  onHandleBackClick: () => {},
  onHandleCancelClick: () => {},
  onClick: () => {},
  isRightButton: false,
  rightButtonName: "",
  fullWidth: false,
  disabled: false,
  isBackBtnVisible: false,
  outlined: false,
};

export default CustomCommonHeader;
