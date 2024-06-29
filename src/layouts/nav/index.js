import { Box, Drawer } from "@mui/material";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import VetInstantLogo from "../../components/VetInstantLogo";
import { navWidths } from "../../redux/reducers/loaderSlice";
import { AppColors } from "../../util/AppColors";
import useResponsive from "./../../components/hooks/useResponsive";
import NavSection from "./../../components/nav-section";
import Scrollbar from "./../../components/scrollbar";
import {
  navAdminConfig,
  navBillingConfig,
  navClinicConfig,
  navFrontDeskConfig,
  navManagementConfig,
  navPharmacyConfig,
  navVetConfig,
  navVeterinaryConfig,
} from "./config";
import Header from "../header";

const NAV_WIDTH = 0;
const NAV_WID = 0;

Nav.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
};

export default function Nav({ openNav, onCloseNav }) {
  const navigate = useNavigate();
  const isDesktop = useResponsive("up", "lg");
  const dispatch = useDispatch();
  const [open, setopen] = useState(true);
  const role = localStorage.getItem("role");

  const toggleOpen = () => {
    if (open === true) {
      setopen(false);
      dispatch(navWidths(open));
    } else {
      setopen(true);
      dispatch(navWidths(open));
    }
  };

  useEffect(() => {
    if (openNav) {
      onCloseNav();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogoClick = () => {
    navigate("/home");
    toggleOpen();
  };

  const renderContent = (
    <Scrollbar
      sx={{
        "& .simplebar-content": {
          display: "flex",
          flexDirection: "column",
          background: `${AppColors.appPrimary} !important`,
          height: window.innerHeight,
          color: "#FFFFFF",
        },
        "& .css-v475nq-MuiButtonBase-root-MuiListItemButton-root.active": {
          color: "#FFFFFF !important",
          // background: "#2596be !important",
          fontFamily: "Montserrat",
          fontWeight: "500",
          flexDirection: "row !important",
          height: "50px !important",
        },
        "& .css-v475nq-MuiButtonBase-root-MuiListItemButton-root:hover": {
          color: "#FFFFFF !important",
          background: "#518acb !important",
          fontFamily: "Montserrat",
          fontWeight: "500",
          flexDirection: "row !important",
          height: "50px !important",
        },
        "& .css-14y8sy8.active": {
          color: "#FFFFFF !important",
          // backgroundColor: "#2596be !important",
          fontFamily: "Montserrat",
          fontWeight: "500",
          flexDirection: "column !important",
          height: "80px !important",
        },
        "& .css-14y8sy8:hover": {
          color: "#FFFFFF !important",
          background: "#518acb !important",
          fontFamily: "Montserrat",
          fontWeight: "500",
          flexDirection: "column !important",
          height: "80px !important",
        },
      }}
    >
      <Header name="Vetinstant" />
      {/* <div
        onClick={handleLogoClick}
        style={{
          cursor: "pointer",
          marginTop: 7,
          marginBottom: 15,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <VetInstantLogo />
      </div> */}

      {/* <NavSection
        data={
          role === "ROLE_ADMIN"
            ? navAdminConfig
            : role === "ROLE_DOCTOR"
             ? navVetConfig
              // ? navBillingConfig
              // ? navManagementConfig
              // ? navFrontDeskConfig
              // ? navPharmacyConfig
              // ? navVeterinaryConfig
            : navClinicConfig
        }
        open={open}
      /> */}
    </Scrollbar>
  );

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: open ? NAV_WIDTH : NAV_WID },
      }}
    >
      {isDesktop ? (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          variant="permanent"
          PaperProps={{
            sx: {
              width: open ? NAV_WIDTH : NAV_WID,
              bgcolor: "background.default",
              borderRightStyle: "dashed",
            },
          }}
        >
          {renderContent}
        </Drawer>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          ModalProps={{
            keepMounted: true,
          }}
          PaperProps={{
            sx: { width: open === true && NAV_WID },
          }}
        >
          {renderContent}
        </Drawer>
      )}
    </Box>
  );
}
