import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import CircleNotificationsIcon from "@mui/icons-material/CircleNotifications";
import DescriptionIcon from "@mui/icons-material/Description";
import InfoIcon from "@mui/icons-material/Info";
import KeyIcon from "@mui/icons-material/Key";
import KeyboardArrowRightOutlinedIcon from "@mui/icons-material/KeyboardArrowRightOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import MoneyIcon from "@mui/icons-material/Money";
import NoteAltIcon from "@mui/icons-material/NoteAlt";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import {
  Avatar,
  Box,
  Divider,
  Grid,
  IconButton,
  Popover,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CustomClips from "../../components/CustomClips";
// import firebase from "./../../frebase/firebase";

const MENU_OPTIONS = [
  {
    title: "Edit Profile",
    path: "/profile",
    icon: (
      <AccountCircleIcon style={{ width: 20, height: 20, color: "#36454F" }} />
    ),
  },
  {
    title: "Change Password",
    path: "/change-password",
    icon: <KeyIcon style={{ width: 20, height: 20, color: "#36454F" }} />,
  },
  {
    title: "Notification Settings",
    path: "/notification-settings",
    icon: (
      <CircleNotificationsIcon
        style={{ width: 20, height: 20, color: "#36454F" }}
      />
    ),
  },
  {
    title: "Payment History",
    path: "/user-dashboard",
    icon: <MoneyIcon style={{ width: 20, height: 20, color: "#36454F" }} />,
  },
  {
    title: "Share Your Feedback",
    path: "/share-feedback",
    icon: <NoteAltIcon style={{ width: 20, height: 20, color: "#36454F" }} />,
  },
  {
    title: "Terms of Service",
    path: "/terms",
    icon: (
      <DescriptionIcon style={{ width: 20, height: 20, color: "#36454F" }} />
    ),
  },
  {
    title: "Privacy Policy",
    path: "/privacy-policy",
    icon: (
      <VerifiedUserIcon style={{ width: 20, height: 20, color: "#36454F" }} />
    ),
  },
  {
    title: "About Us",
    path: "/aboutUs",
    icon: <InfoIcon style={{ width: 20, height: 20, color: "#36454F" }} />,
  },
];

export default function AccountPopover() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(null);
  const user = useSelector((state) => state.Auth.user);
  // const userRole = useSelector((state) => state.Auth.userRole);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
  };

  const handleClose = () => {
    setOpen(null);
  };

  const handleLogout = () => {
    setOpen(!open);
    // firebase.auth().signOut();
    navigate("/login");
    localStorage.removeItem("accessToken");
  };

  const handleNav = (path) => {
    setOpen(!open);
    navigate(path);
  };

  const handleBecomeQuizMaster = () => {
    navigate("/become-quiz-master");
  };

  return (
    <>
      <IconButton
        onClick={handleOpen}
        sx={{
          p: 0,
          ...(open && {
            "&:before": {
              zIndex: 1,
              content: "''",
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              position: "absolute",
              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
            },
          }),
        }}
      >
        <Avatar src={user?.profileImage} alt="photoURL" />
      </IconButton>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        PaperProps={{
          sx: {
            p: 0,
            mt: 1.5,
            ml: 0.75,
            width: 230,
            "& .MuiMenuItem-root": {
              typography: "body2",
              borderRadius: 0.75,
            },
          },
        }}
      >
        <Box sx={{ margin: "10px" }}>
          <Typography variant="subtitle2" noWrap className="text">
            {`${user?.firstName} ${user?.lastName}`}
          </Typography>
          <Typography
            variant="body2"
            sx={{ color: "text.secondary" }}
            noWrap
            className="text"
          >
            {user?.email}
          </Typography>
        </Box>

        <Divider sx={{ borderStyle: "dashed" }} />

        {/* <Grid container spacing={2}>
          {user?.userRole === "Player" && userRole !== 2 ? (
            <Grid item xs={12} sm={12} md={12} lg={12}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CustomClips
                  noIcon
                  label="Become A Quiz Master"
                  onClick={handleBecomeQuizMaster}
                />
              </div>
            </Grid>
          ) : null}

          {MENU_OPTIONS?.map((option, index) => (
            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              lg={12}
              key={index}
              style={{
                marginLeft: "10px",
                marginRight: "10px",
                cursor: "pointer",
                marginTop: "2px",
                marginBottom: "2px",
              }}
              onClick={() => handleNav(option?.path)}
            >
              <div style={{ display: "flex", flexDirection: "row", flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
                  }}
                >
                  {option?.icon}
                </div>
                <div
                  style={{
                    marginLeft: "5px",
                    display: "flex",
                    alignItems: "center",
                  }}
                  className="text"
                >
                  {option?.title}
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    flex: 1,
                  }}
                >
                  <KeyboardArrowRightOutlinedIcon />
                </div>
              </div>
            </Grid>
          ))}
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={12}
            key="logout"
            style={{
              marginLeft: "10px",
              marginRight: "10px",
              marginBottom: "10px",
              cursor: "pointer",
            }}
            onClick={handleLogout}
          >
            <div style={{ display: "flex", flexDirection: "row", flex: 1 }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                }}
              >
                <LogoutIcon />
              </div>
              <div
                style={{
                  marginLeft: "5px",
                  display: "flex",
                  alignItems: "center",
                }}
                className="text"
              >
                Logout
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  flex: 1,
                }}
              >
                <KeyboardArrowRightOutlinedIcon />
              </div>
            </div>
          </Grid>
        </Grid> */}
        <Divider sx={{ borderStyle: "dashed" }} />

        {/* <MenuItem
          onClick={handleLogout}
          sx={{ margin: "10px" }}
          className="text"
        >
          <div className="text">Logout</div>
        </MenuItem> */}
      </Popover>
    </>
  );
}
