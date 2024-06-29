import { styled } from "@mui/material/styles";

const MainWithoutPadding = styled("main", {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme }) => ({
  flexGrow: 1,
  // background: "#ededed",
  background: '#fafafa',
  // overflow: "auto",
  height: '100vh',
  // minHeight: "100%",
  // paddingTop: 60,
  // paddingBottom: theme.spacing(4),
  // [theme.breakpoints.up("lg")]: {
  //   paddingTop: APP_BAR_DESKTOP + 24,
  //   paddingLeft: theme.spacing(2),
  //   paddingRight: theme.spacing(2),
  // },
}));
export default MainWithoutPadding;
