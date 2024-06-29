import MenuIcon from "@mui/icons-material/Menu";
import MuiAppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import MuiDrawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { styled, useTheme } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import * as React from "react";
import CustomTextField from "./CustomTextField";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PropTypes from "prop-types";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const logoStyle = { color: "#36454F", height: 25, width: 25 };
const iconPosition = { height: 35, width: 35, marginLeft: 2 };

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const CustomLayout = ({
  children,
  menuList,
  showProfile,
  showNotification,
  showHelp,
  image,
  search,
}) => {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      <div className="row">
        <div style={{ display: "flex", flexDirection: "row" }}>
          <AppBar position="fixed" open={open}>
            <Toolbar sx={{ background: "#fff", height: 60 }}>
              <Box
                sx={{
                  flexGrow: 1,
                  display: { xs: "flex", sm: "flex", md: "flex", lg: "flex" },
                }}
              >
                <Box
                  sx={{
                    flexGrow: 0.1,
                    display: { xs: "none", sm: "none", md: "flex", lg: "flex" },
                  }}
                >
                  <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={handleDrawerOpen}
                    edge="start"
                    sx={{
                      background: "#E5E4E2",
                      marginRight: 5,
                      ...(open && { display: "none" }),
                      height: 50,
                      width: 50,
                    }}
                  >
                    <MenuIcon sx={{ color: "#808080" }} />
                  </IconButton>
                </Box>

                <Box
                  sx={{
                    flexGrow: 0.1,
                    display: { xs: "none", sm: "none", md: "flex", lg: "flex" },
                  }}
                >
                  {image ? (
                    <div
                      style={{
                        fontSize: 24,
                        color: "white",
                        backgroundImage: "linear-gradient(180deg, red, orange)",
                        borderRadius: 30,
                        paddingLeft: 10,
                        paddingRight: 10,
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      Wissen
                    </div>
                  ) : // <img src={image} style={{ borderRadius: 10 }} />
                  null}
                </Box>

                <Box
                  sx={{
                    flexGrow: 0.7,
                    display: { xs: "flex", sm: "flex", md: "flex", lg: "flex" },
                    float: "right",
                  }}
                >
                  {search ? (
                    <div
                      style={{
                        flex: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <CustomTextField
                        label="search input"
                        placeholder="Search"
                        search
                      />
                    </div>
                  ) : null}
                </Box>

                <Box
                  sx={{
                    flexGrow: 0.1,
                    display: { xs: "flex", sm: "flex", md: "flex", lg: "flex" },
                  }}
                >
                  <div
                    style={{
                      flex: 1,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "flex-end",
                    }}
                  >
                    {showHelp ? (
                      <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        //   onClick={handleDrawerOpen}
                        edge="end"
                        sx={iconPosition}
                      >
                        <HelpOutlineIcon sx={logoStyle} />
                      </IconButton>
                    ) : null}

                    {showNotification ? (
                      <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        //   onClick={handleDrawerOpen}
                        edge="end"
                        sx={iconPosition}
                      >
                        <NotificationsIcon sx={logoStyle} />
                      </IconButton>
                    ) : null}

                    {showProfile ? (
                      <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        //   onClick={handleDrawerOpen}
                        edge="end"
                        sx={[iconPosition, { background: "#D22B2B" }]}
                      >
                        J
                      </IconButton>
                    ) : null}
                  </div>
                </Box>
              </Box>
            </Toolbar>
          </AppBar>
        </div>
      </div>

      <Drawer variant="permanent" open={open}>
        <DrawerHeader sx={{ height: 60 }}>
          {/* <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton> */}
          <IconButton
            color="inherit"
            aria-label="close drawer"
            onClick={handleDrawerClose}
            sx={{
              background: "#E5E4E2",
              height: 50,
              width: 50,
              right: "75%",
            }}
          >
            <ChevronLeftIcon sx={{ color: "#808080" }} />
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {menuList?.map((menu, index) => (
            <ListItem
              key={menu?.name + index}
              disablePadding
              sx={{ display: "block" }}
            >
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  {menu?.icon}
                  {/* {index % 2 === 0 ? <InboxIcon /> : <MailIcon />} */}
                </ListItemIcon>
                <ListItemText
                  primary={menu?.name}
                  sx={{ opacity: open ? 1 : 0 }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        {/* <Divider /> */}
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1 }}>
        <DrawerHeader />
        {children}
      </Box>
    </Box>
  );
};

CustomLayout.propTypes = {
  menuList: PropTypes.array,
  showProfile: PropTypes.bool,
  showNotification: PropTypes.bool,
  showHelp: PropTypes.bool,
  image: PropTypes.bool,
  search: PropTypes.bool,
};

CustomLayout.defaultProps = {
  menuList: [],
  showProfile: false,
  showNotification: false,
  showHelp: false,
  image: false,
  search: false,
};

export default CustomLayout;
