import {
  AppBar,
  Avatar,
  Box,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import PropTypes from "prop-types";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { sideNavVisibles } from "../../redux/reducers/loaderSlice";
import { updateUserFcmToken } from "../../redux/reducers/mixedSlice";
import { navAdminConfig, navClinicConfig, navVetConfig } from "../nav/config";
import "./Header.css";

const NAV_WIDTH = 0;

const NAV_WID = 0;

const HEADER_MOBILE = 60;

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  minHeight: HEADER_MOBILE,
}));

const Header = ({ name }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const navWidth = useSelector((state) => state.loader.navWidth);
  const sideNavVisible = useSelector((state) => state.loader.sideNavVisible);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const role = localStorage.getItem("role");
  const userName = localStorage.getItem("name");

  const user = localStorage.getItem("user");
  const profile = JSON.parse(user);
  const [selectedTab, setSelectedTab] = useState(
    (role === "ROLE_ADMIN"
      ? navAdminConfig
      : role === "ROLE_CLINIC"
        ? navClinicConfig
        : navVetConfig)?.[0]?.path
  );
  // console.log("user", JSON.parse(user));

  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const StyledRoot = styled(AppBar)(({ theme }) => ({
    background: "#fff",
    boxShadow: "none",
    [theme.breakpoints.up("lg")]: {
      width: `calc(100% - ${navWidth === true ? NAV_WID : NAV_WIDTH + 1}px)`,
    },
  }));

  const handleNavVisible = () => {
    dispatch(sideNavVisibles(!sideNavVisible));
  };

  const handleLogout = () => {
    dispatch(updateUserFcmToken(""));
    localStorage.removeItem("accessToken");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    localStorage.removeItem("hospitalId");
    localStorage.removeItem("fcmToken");
    navigate("/login");
    setAnchorElUser(false);
  };

  const handleNotifications = () => {
    navigate("/notifications");
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogoClick = () => {
    setSelectedTab("/dashboard");
    navigate("/dashboard");
  };

  const pages = ["Products", "Pricing", "Blog"];

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar sx={{ minHeight: "auto" }} className="topBar-minh">
          <Box sx={{ flexGrow: 1, display: { xs: "flex" } }}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleLogoClick}
              sx={{ mr: 2 }}
            >
              <img
                src={require("../../assets/images/png/VetInstantLogo.png")}
                alt="../../assets/images/png/VetInstantLogo.png"
                style={{ objectFit: "contain", height: 30 }}
              />
            </IconButton>
            <Box
              sx={{
                flexGrow: 1,
                display: {
                  xs: "flex",
                  sm: "flex",
                  md: "flex",
                  lg: "flex",
                  xl: "flex",
                },
              }}
              className="nav-flex-end w100Per"
            >
              {(role === "ROLE_ADMIN"
                ? navAdminConfig
                : role === "ROLE_CLINIC"
                  ? navClinicConfig
                  : navVetConfig
              ).map((nav) => (
                <Tooltip title={nav.title} style={{ textTransform: "capitalize" }}>
                  <IconButton
                    key={nav.path}
                    onClick={() => {
                      setSelectedTab(nav.path);
                      navigate(nav.path);
                    }}
                    className={
                      selectedTab === nav.path
                        ? "tab-selected"
                        : "tab-un-selected"
                    }
                    sx={{
                      display: "block",
                      ml: 1,
                      mr: 1,
                      "& svg": {
                        transition: "fill 0.3s ease",
                        width: 20,
                        height: 20,
                        fill: "white", // Default fill color
                      },
                      "&:hover svg": {
                        fill: "#0054A6", // Hover color
                        width: 20,
                        height: 20,
                      },
                      ...(selectedTab === nav.path && {
                        "& svg": {
                          fill: "#0054A6", // Selected color
                          width: 20,
                          height: 20,
                        },
                      }),
                    }}
                  >
                    {nav?.image ? (
                      <div className="flex-center">
                        <img
                          src={nav?.image}
                          style={{ height: 20, width: 20, objectFit: "contain" }}
                          alt=""
                        />
                      </div>
                    ) : (
                      nav.icon
                    )}
                  </IconButton>
                </Tooltip>
              ))}
            </Box>
            <Box sx={{ flexGrow: 0 }} className="flex1-end">
              <div className="flex-column">
                <Typography
                  variant="subtitle1"
                  noWrap
                  component="a"
                  sx={{
                    mr: 2,
                    fontSize: "12px",
                    display: { xs: "none", md: "flex" },
                    fontFamily: "Montserrat",
                    fontWeight: "500",
                    color: "#fff",
                    textDecoration: "none",
                  }}
                >
                  {profile?.name}
                </Typography>
                <Typography
                  variant="caption"
                  noWrap
                  component="b"
                  sx={{
                    mr: 2,
                    display: { xs: "none", md: "flex" },
                    fontFamily: "Montserrat",
                    fontWeight: "400",
                    color: "#fff",
                    textDecoration: "none",
                  }}
                >
                  {role === "ROLE_CLINIC"
                    ? "Clinic"
                    : role === "ROLE_DOCTOR"
                      ? "Doctor"
                      : "Admin"}
                </Typography>
              </div>
              <Tooltip title="My Profile">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt={profile?.image} src={profile?.image} />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem
                  onClick={() => {
                    navigate("/branch-management");
                    setAnchorElUser(false);
                  }}
                >
                  <Typography textAlign="center" className="txt-regular">
                    Profile Settings
                  </Typography>
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <Typography textAlign="center" className="txt-regular">
                    Logout
                  </Typography>
                </MenuItem>
              </Menu>
            </Box>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
    // <div
    //   style={{
    //     display: "flex",
    //     flexDirection: "row",
    //     flex: 1,
    //     background: "gray",
    //   }}
    // >
    //   <StyledRoot>
    //     <StyledToolbar>
    //       <div className="header-main">
    //         <div className="header-start">
    //           <IconButton
    //             onClick={handleNavVisible}
    //             sx={{
    //               mr: 1,
    //               color: AppColors.gray,
    //               display: { lg: "none" },
    //             }}
    //           >
    //             <MenuIcon />
    //           </IconButton>

    //           <div className="header-text">{name}</div>
    //         </div>
    //         <div className="header-end">
    //           <div className="header-mar">
    //             <IconButton
    //               color="inherit"
    //               aria-label="open drawer"
    //               edge="end"
    //               onClick={handleNotifications}
    //             >
    //               <NotificationsNoneIcon sx={{ color: AppColors.black }} />
    //             </IconButton>
    //           </div>
    //           <div className="header-mar">
    //             <IconButton color="inherit" aria-label="open drawer" edge="end">
    //               <HelpOutlineIcon sx={{ color: AppColors.black }} />
    //             </IconButton>
    //           </div>
    //           <div className="header-mar">
    //             <div
    //               className="cursor"
    //               onClick={() => setPopoverOpen(!popoverOpen)}
    //             >
    //               <div className="header-row">
    //                 {/* <IconButton
    //                   onClick={() => setPopoverOpen(!popoverOpen)}
    //                   color="inherit"
    //                   aria-label="open drawer"
    //                   edge="end"
    //                 > */}
    //                 <Avatar src={profile?.image} alt="photoURL" />
    //                 {/* </IconButton> */}
    //                 <div className="header-drop">
    //                   <Typography className="header-right-text">
    //                     {profile?.name}
    //                   </Typography>
    //                   <ArrowDropDownIcon sx={{ color: AppColors.appPrimary }} />
    //                 </div>
    //               </div>
    //               {popoverOpen ? (
    //                 <List className="header-popover">
    //                   <ListItem
    //                     className="header-list-text cursor"
    //                     sx={{ color: AppColors.black }}
    //                     onClick={() => {
    //                       if (role === "doctor") {
    //                         navigate("/vet-profile");
    //                       }
    //                     }}
    //                   >
    //                     Profile Settings
    //                   </ListItem>
    //                   <Divider />
    //                   <ListItem
    //                     sx={{ color: AppColors.black }}
    //                     onClick={handleLogout}
    //                     className="header-list-text cursor"
    //                   >
    //                     Logout
    //                   </ListItem>
    //                 </List>
    //               ) : null}
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     </StyledToolbar>
    //   </StyledRoot>
    // </div>
  );
};

Header.propTypes = {
  onOpenNav: PropTypes.func,
  search: PropTypes.bool,
  headerText: PropTypes.string,
  headerTextVisible: PropTypes.bool,
  isSwichProfileVisible: PropTypes.bool,
};

Header.defaultProps = {
  onOpenNav: () => { },
  search: false,
  headerText: "",
  headerTextVisible: false,
  isSwichProfileVisible: false,
};

export default Header;
