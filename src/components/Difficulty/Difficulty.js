import * as React from "react";
import { Typography } from "@mui/material";
import CustomClips from "../CustomClips";
import "./Difficulty.css";

const Difficulty = ({ alt, src, width, height, variant, srcSet, bgcolor }) => {
  return (
    <div className="Add-tf-diff-lev-con">
      <Typography variant="body1" className="text">
        Difficulty Level
      </Typography>
      <div className="Add-tf-row-mt10">
        <div>
          <CustomClips
            label="Easy"
            noIcon
            onClick={() => setDifficultyLevel("Easy")}
            easyText
            filled={difficultyLevel === "Easy" ? true : false}
          />
        </div>
        <div className="Add-tf-ml10">
          <CustomClips
            label="Medium"
            noIcon
            onClick={() => setDifficultyLevel("Medium")}
            mediumText
            filled={difficultyLevel === "Medium" ? true : false}
          />
        </div>
        <div className="Add-tf-ml10">
          <CustomClips
            label="Hard"
            noIcon
            onClick={() => setDifficultyLevel("Hard")}
            hardText
            filled={difficultyLevel === "Hard" ? true : false}
          />
        </div>
      </div>
    </div>
  );
};
CustomAvatar.defaultProps = {
  alt: "",
  src: "",
  srcSet: "",
  width: "50",
  height: "50",
  variant: "",
  bgcolor: "green[500]",
};
export default CustomAvatar;
