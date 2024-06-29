import { styled } from "@mui/material/styles";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import MainWithoutPadding from "../components/MainWithoutPadding";
import { sideNavVisibles } from "../redux/reducers/loaderSlice";
import Header from "./header";

const StyledRoot = styled("div")({
  display: "flex",
  minHeight: "100%",
  overflow: "hidden",
});

const CustomLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sideNavVisible = useSelector((state) => state.loader.sideNavVisible);
  const accessToken = localStorage.getItem("accessToken");
  const role = localStorage.getItem("role");

  useEffect(() => {
    checkUserStatus();
  }, []);

  const checkUserStatus = () => {
    if (accessToken !== null) {
      if (role === "ROLE_ADMIN") {
        return navigate("/home");
      }
      if (role === "ROLE_DOCTOR") {
        return navigate("/vet-dashboard");
        // return navigate("/billinghome")
        // return navigate("/managementhome")
        // return navigate("/frontdeskhome")
        // return navigate("/pharmacyhome")
        // return navigate("/veterinaryhome")
      } else {
        return navigate("/dashboard");
      }
    } else {
      return navigate("/login");
    }
  };

  const handleSideNav = () => {
    dispatch(sideNavVisibles(false));
  };

  return (
    <StyledRoot>
      <MainWithoutPadding>
        <Header name="VetInstant" />
        <Outlet />
      </MainWithoutPadding>
    </StyledRoot>
  );
};

export default CustomLayout;
