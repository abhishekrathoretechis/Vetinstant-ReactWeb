import React, { useState } from "react";
import CustomModal from "../../../../components/CustomModal/CustomModal";
import { Grid, Typography } from "@mui/material";
import CustomTextField from "../../../../components/CustomTextField";
import CustomButton from "../../../../components/CustomButton";
import CustomSelect from "../../../../components/Select/Select";

const InternalNotes = ({ modalVisible, setModalBookVisible }) => {
  const [selectedColor, setSelectedColor] = useState("red");
  const [searchTypeValue, setSearchTypeValue] = useState("");
  const [upperData, setUpperData] = useState( [
    { name: "DESTROYER OF TOYS", color: "red" },
    { name: "loves chicken", color: "blue" },
    { name: "Not Insured", color: "blue" },
    { name: "Doesn't like Nail Clip", color: "green" },
  ]);

  const searchList = [
    { name: "She is fluffy", color: "red" },
    { name: "she is a SOAB", color: "blue" },
    { name: "Sleepy head", color: "red" },
    { name: "sada", color: "green" },
    { name: "Split Deposit", color: "blue" },
  ];

  const handleSelect = (e) => {
    setSelectedColor(e.target.value);
  };
  const handleModClose = () => {
    setModalBookVisible(false);
  };
  const handleRemoveItem = (index) => {
    const newData = upperData.filter((_, i) => i !== index);
    setUpperData(newData);
  };
  return (
    <div>
      <CustomModal
        open={modalVisible}
        onClose={handleModClose}
        header="Internal notes"
        rightModal
        modalWidth={30}
      >
        <div className=" ph20">
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12} className="mt10">
            <div className="flex-row-wrap1  mv10 gap10">
              {upperData.map((item, index) => {
                return (
                  <>
                    <Grid
                      item
                      xs={5}
                      sm={5}
                      md={5}
                      lg={5}
                      xl={5}
                      className="flex-row"
                    >
                      <Typography
                        className={`font-medium fs10 card-time card-bot-${item?.color}-back white-color flex-center`}
                      >
                        {item?.name}
                        <img
                          src={require("../../../../assets/images/png/cross.png")}
                          className="ml5 cursor "
                          alt="Remove"
                          onClick={() => handleRemoveItem(index)}
                        />
                      </Typography>
                    </Grid>
                  </>
                );
              })}
            </div>
          </Grid>
          <Typography className="text-bold mb10 fs14 mt20">Add New</Typography>
          <Grid
            item
            xs={12}
            sm={12}
            md={12}
            lg={12}
            xl={12}
            className="flex-row-between mt20"
          >
            <Grid item xs={2.5} sm={2.5} md={2.5} lg={2.5} xl={2.5}>
              <CustomSelect
                list={[
                  { name: "Red", value: "red" },
                  { name: "Orange", value: "orange" },
                  { name: "Yellow", value: "yellow" },
                  { name: "Orange", value: "orange" },
                ]}
                value={selectedColor}
                handleChange={handleSelect}
                name="color"
                color
              />
            </Grid>
            <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
              <CustomTextField
                placeholder="name"
                name="name"
                fullWidth
                labelTop
              />
            </Grid>

            <Grid item xs={2.5} sm={2.5} md={2.5} lg={2.5} xl={2.5}>
              <CustomButton text="Add" />
            </Grid>
          </Grid>

          <Grid item xs={12} sm={12} md={12} lg={12} xl={12} className="mt10">
            <CustomTextField
              placeholder="Search for tags"
              name="name"
              fullWidth
              handleChange={(e) => setSearchTypeValue(e.target.value)}
              value={searchTypeValue}
              search
            />
          </Grid>
          {searchTypeValue && (
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} className="mt10">
              <div className="flex-row-wrap1  mv10 gap10">
                {searchList.map((item, index) => {
                  return (
                    <>
                      <Grid item xs={3.5} sm={3.5} md={3.5} lg={3.5} xl={3.5}>
                        <Typography
                          className={`font-medium fs10 card-time card-bot-${item?.color}-back white-color flex-center`}
                        >
                          {item?.name}
                        </Typography>
                      </Grid>
                    </>
                  );
                })}
              </div>
            </Grid>
          )}

          <div className="flex1-end mt20">
            <Grid item xs={6} sm={6} md={3} lg={3} xl={3}>
              <CustomButton text="Save" />
            </Grid>
          </div>
        </div>
      </CustomModal>
    </div>
  );
};

export default InternalNotes;
