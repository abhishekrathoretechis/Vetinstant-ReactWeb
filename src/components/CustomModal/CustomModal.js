import CloseIcon from "@mui/icons-material/Close";
import { Box, DialogContent, Modal, Typography } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";
import PropTypes from "prop-types";
import { AppColors } from "../../util/AppColors";

const headerCenterText = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  fontFamily: "Montserrat",
  fontWeigh: "500",
  color: AppColors.appPrimary,
};

const hederStartText = {
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-start",
  width: "95%",
  fontFamily: "Montserrat",
  fontWeigh: "500",
  color: AppColors.appPrimary,
};

const rightDiv = {
  display: "flex",
  float: "right",
  flex: 1,
  alignItems: "center",
  justifyContent: "flex-end",
};

const CustomModal = ({
  header,
  onClose,
  open,
  headerCenter,
  children,
  modal,
  modalWidth,
  rightModal,
  headerBold
}) => {
  const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
      padding: theme.spacing(2),
      minWidth: 200,
    },
    "& .MuiDialogActions-root": {
      padding: theme.spacing(1),
      minWidth: 200,
    },
  }));

  let requiredWidth = modalWidth;
  const screenWidth = window.screen.width;
  //modal width updated based on screen width
  if (screenWidth < 1200 && screenWidth >= 900) requiredWidth = 60;
  if (screenWidth < 900 && screenWidth >= 600) requiredWidth = 70;
  if (screenWidth < 600 && screenWidth >= 400) requiredWidth = 80;
  if (screenWidth < 400) requiredWidth = 90;

  const modalSty = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: `${requiredWidth}%`,
    bgcolor: "background.paper",
    border: "1px solid gray",
    boxShadow: 24,
    borderRadius: 1,
  };

  const rightModalSty = {
    position: "absolute",
    top: 0,
    right: 0,
    width: `${requiredWidth}%`,
    // width: "40%",
    bgcolor: "background.paper",
    border: "1px solid gray",
    boxShadow: 24,
    borderRadius: 1,
    minHeight: "100%",
  };

  if (rightModal) {
    return (
      <Modal open={open} onClose={onClose} className="modal-right-form">
        <Box sx={rightModalSty}>
          <DialogTitle>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <div style={headerCenter ? headerCenterText : hederStartText}>
                {!headerBold ? (
                  <Typography
                    className="header fs16 fw-700"
                    sx={headerCenter ? headerCenterText : { fontWeight: "bold" }}
                  >
                    {header}
                  </Typography>
                ) : (
                  <div
                    className="textSemiBold black"
                    style={{ color: '#0054A6' }}
                    sx={headerCenter ? headerCenterText : { fontWeight: "bold" }}
                  >
                    {header}
                  </div>
                )}
              </div>
              <div style={rightDiv}>
                {onClose ? (
                  <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                      color: (theme) => theme.palette.grey[500],
                      fontWeight: 900,
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                ) : null}
              </div>
            </div>
          </DialogTitle>
          <DialogContent>
            <div className="mt10"> {children}</div>
          </DialogContent>
        </Box>
      </Modal>
    );
  }

  if (modal) {
    return (
      <Modal open={open} onClose={onClose}>
        <Box sx={modalSty}>
          <DialogTitle>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <div style={headerCenter ? headerCenterText : hederStartText}>
                <Typography
                  className="header"
                  sx={headerCenter ? headerCenterText : { fontWeight: "bold" }}
                >
                  {header}
                </Typography>
              </div>
              <div style={rightDiv}>
                {onClose ? (
                  <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{ color: (theme) => theme.palette.grey[500] }}
                  >
                    <CloseIcon />
                  </IconButton>
                ) : null}
              </div>
            </div>
          </DialogTitle>
          <DialogContent>
            <div className="mt10"> {children}</div>
          </DialogContent>
        </Box>
      </Modal>
    );
  }

  return (
    <BootstrapDialog onClose={onClose} open={open}>
      <DialogTitle sx={{ m: 0, p: 2 }}>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <div style={headerCenter ? headerCenterText : hederStartText}>
            <Typography
              className="header"
              sx={headerCenter ? headerCenterText : { fontWeight: "bold" }}
            >
              {header}
            </Typography>
          </div>
          <div style={rightDiv}>
            {onClose ? (
              <IconButton
                aria-label="close"
                onClick={onClose}
                sx={{ color: (theme) => theme.palette.grey[500] }}
              >
                <CloseIcon />
              </IconButton>
            ) : null}
          </div>
        </div>
      </DialogTitle>
      <DialogContent dividers>{children}</DialogContent>
    </BootstrapDialog>
  );
};

CustomModal.prototype = {
  header: PropTypes.string,
  onClose: PropTypes.func,
  open: PropTypes.bool,
  children: PropTypes.any,
  headerCenter: PropTypes.bool,
  modal: PropTypes.bool,
  modalWidth: PropTypes.string,
  rightModal: PropTypes.bool,
};

CustomModal.defaultProps = {
  header: "",
  onClose: () => { },
  open: false,
  children: null,
  headerCenter: false,
  modal: false,
  modalWidth: "60",
  rightModal: false,
};

export default CustomModal;
