import React, { useState } from "react";
import InventoryStock from "./InventoryStock";
import ProductComponent from "./ProductComponent";
import SupplierComponent from "./SupplierComponent";
import TopBar from "../../../components/TopBar/TopBar";
import { Container, Grid } from "@mui/material";
import { AppColors } from "../../../util/AppColors";
import Button from "../../../components/CustomButton";

const Inventory = () => {
  const [activeTab, setActiveTab] = useState("Product");

  return (
    <>
      <TopBar>
        <Container maxWidth="xl">
          <Grid container spacing={2}>
            {/* <Grid item xs={4} sm={4} md={2} lg={1.5} xl={1}>
                <Button
                  text="Supplier"
                  tabSelectdBtn={activeTab === "Supplier"}
                  textBtn={activeTab !== "Supplier"}
                  onClick={() => setActiveTab("Supplier")}
                  color={AppColors.grayBtn2}
                />
              </Grid> */}
            <Grid item xs={4} sm={4} md={2} lg={1.5} xl={1}>
              <Button
                text="Product"
                tabSelectdBtn={activeTab === "Product"}
                textBtn={activeTab !== "Product"}
                onClick={() => setActiveTab("Product")}
                color={AppColors.grayBtn2}
              />
            </Grid>
            <Grid item xs={4} sm={4} md={2} lg={1.5} xl={1}>
              <Button
                text="Service"
                tabSelectdBtn={activeTab === "Service"}
                textBtn={activeTab !== "Service"}
                onClick={() => setActiveTab("Service")}
                color={AppColors.grayBtn2}
              />
            </Grid>
          </Grid>
        </Container>
      </TopBar>
      <div className="mt20">
        {/* {activeTab === "Supplier" ? <SupplierComponent /> : null} */}
        {activeTab === "Product" ? <ProductComponent /> : null}
        {activeTab === "Service" ? <InventoryStock /> : null}
      </div>
    </>
  );
};

export default Inventory;
