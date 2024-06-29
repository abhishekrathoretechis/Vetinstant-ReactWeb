import React from "react";
import "./TopBar.css";
import { Grid } from "@mui/material";

const TopBar = ({ children }) => {
  return (
    <Grid
      container
      className="topBar-main"
      sx={{ padding: 2, alignItems: 'center' }}
    >
      <Grid
        item
        xs={12}
        sm={12}
        md={12}
        lg={12}
        xl={12}
      >
        {children}
      </Grid>
    </Grid>
  );
};

export default TopBar;