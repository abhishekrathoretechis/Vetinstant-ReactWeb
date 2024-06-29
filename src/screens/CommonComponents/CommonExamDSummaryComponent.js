import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import {
  Box,
  Grid,
  IconButton,
  LinearProgress,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import VetInsLogo from "../../assets/images/png/vetinstantIcon.png";
import CustomModal from "../../components/CustomModal/CustomModal";
import { AppColors } from "../../util/AppColors";
import ReactAudioPlayer from "react-audio-player";

const strokeObj = { stroke: AppColors.appPrimary, strokeWidth: 2 };

export const CommonExamDSummaryComponent = ({ medicalHistory }) => {
  const [ref, setRef] = useState(null);
  const [audValue, setAudValue] = useState(null);
  const [audDuration, setAudDuration] = useState(0);
  const [audCurrDuration, setAudCurrDuration] = useState(0);
  const [progressValue, setProgressValue] = useState(0);
  const [isAudPlaying, setAudPlaying] = useState(false);
  const [audModalVisible, setAudModalVisible] = useState(false);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const summaryData = medicalHistory?.bleData;

  useEffect(() => {
    const durationInPer = Math.round((audCurrDuration / audDuration) * 100);
    setProgressValue(durationInPer);
  }, [audCurrDuration, audDuration]);

  const modelClose = () => {
    ref?.current?.pause();
    setAudValue(null);
    setAudPlaying(false);
    setAudCurrDuration(0);
    setAudDuration(0);
    setSelectedPoint(null);
    setAudModalVisible(!audModalVisible);
  };

  const handleAudPlay = () => {
    ref?.current?.play();
    setAudPlaying(true);
  };

  const handleAudPause = () => {
    ref?.current?.pause();
    setAudPlaying(false);
  };

  const handleLoadMetadata = (meta) => {
    const { duration } = meta.target;
    setAudDuration(duration);
  };

  const PlayBtn = ({ disabled, value, point }) => {
    return (
      <IconButton
        disabled={disabled}
        color="primary"
        className={disabled ? "" : "cursor"}
        onClick={() => {
          setAudValue(value);
          setSelectedPoint(point);
          setAudModalVisible(!audModalVisible);
        }}
      >
        <PlayArrowIcon sx={strokeObj} />
      </IconButton>
    );
  };

  function LinearProgressWithLabel(props) {
    return (
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box sx={{ width: "100%", mr: 1 }}>
          <LinearProgress variant="determinate" {...props} />
        </Box>
        <Box sx={{ minWidth: 35 }}>
          <Typography variant="body2" color="text.secondary">{`${Math.round(
            audCurrDuration
          )}/${Math.round(audDuration)}`}</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <>
      <div className="mh10 mv10 flex-center">
        {summaryData ? (
          <div className="blue-box-examD mh10">
            <div className="flex-end">
              <img src={VetInsLogo} alt={VetInsLogo} className="MedHis-img" />
            </div>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12} mg={6} lg={6} xl={6}>
                <div className="mt10">
                  <div className="text blue-color">Temperature:</div>
                  <div className="text">
                    {summaryData?.temperature
                      ? `${summaryData?.temperature}°F`
                      : ""}
                  </div>
                </div>
                <div className="yellow-bar mt10" />
                <div className="mt10">
                  <div className="text blue-color">SPO2:</div>
                  <div className="text">{summaryData?.spo2?.spo2 ?? ""}</div>
                </div>
                <div className="yellow-bar mt10" />
                <div className="mt10">
                  <div className="text blue-color">Heart Rate:</div>
                  <div className="text">{summaryData?.spo2?.heart ?? ""}</div>
                </div>
                <div className="yellow-bar mt10" />
              </Grid>
              <Grid item xs={12} sm={12} mg={6} lg={6} xl={6}>
                <div className="mt10">
                  <div className="text blue-color flex-center">
                    Lung Auscultation
                  </div>
                  <div className="flex-row">
                    <div className="flex1-start" style={{ height: 50 }}>
                      <div className="flex1-center flex-column">
                        <div className="text-bold blue-color mt10">L1</div>
                        <PlayBtn
                          disabled={!summaryData?.lung?.left}
                          value={summaryData?.lung?.left}
                          point="L1"
                        />
                      </div>
                    </div>
                    <div className="flex1-end" style={{ height: 50 }}>
                      <div className="flex1-center flex-column">
                        <div className="text-bold blue-color mt10">L2</div>
                        <PlayBtn
                          disabled={!summaryData?.lung?.right}
                          value={summaryData?.lung?.right}
                          point="L2"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt20">
                  <div className="text blue-color flex-center">
                    Heart Auscultation
                  </div>
                  <div className="flex-row">
                    <div className="flex1-start" style={{ height: 50 }}>
                      <div className="flex1-center flex-column">
                        <div className="text-bold blue-color mt10">P</div>
                        <PlayBtn
                          disabled={!summaryData?.heart?.P}
                          value={summaryData?.heart?.P}
                          point="P"
                        />
                      </div>
                    </div>
                    <div className="flex1-end" style={{ height: 50 }}>
                      <div className="flex1-center flex-column">
                        <div className="text-bold blue-color mt10">A</div>
                        <PlayBtn
                          disabled={!summaryData?.heart?.A}
                          value={summaryData?.heart?.A}
                          point="A"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex-row mt10">
                    <div className="flex1-start" style={{ height: 50 }}>
                      <div className="flex1-center flex-column">
                        <div className="text-bold blue-color mt10">M</div>
                        <PlayBtn
                          disabled={!summaryData?.heart?.M}
                          value={summaryData?.heart?.M}
                          point="M"
                        />
                      </div>
                    </div>
                    <div className="flex1-end" style={{ height: 50 }}>
                      <div className="flex1-center flex-column">
                        <div className="text-bold blue-color mt10">T</div>
                        <PlayBtn
                          disabled={!summaryData?.heart?.T}
                          value={summaryData?.heart?.T}
                          point="T"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Grid>
            </Grid>
          </div>
        ) : (
          <div className="text flex-center">No ExamD summary available</div>
        )}
      </div>
      <ReactAudioPlayer
        src={audValue}
        // autoPlay
        controls
        onLoadedMetadata={handleLoadMetadata}
        listenInterval={1000}
        onListen={(currTime) => setAudCurrDuration(currTime)}
        ref={(e) => {
          if (e) setRef(e?.audioEl);
        }}
      />
      <CustomModal
        open={audModalVisible}
        onClose={modelClose}
        header={selectedPoint}
        headerCenter
        modal
        modalWidth={20}
      >
        <Grid container spacing={2}>
          <div className="flex1-center">
            {isAudPlaying ? (
              <IconButton color="primary" onClick={handleAudPause}>
                <PauseIcon sx={strokeObj} />
              </IconButton>
            ) : (
              <IconButton color="primary" onClick={handleAudPlay}>
                <ArrowRightIcon sx={strokeObj} />
              </IconButton>
            )}
          </div>
          <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
            <LinearProgressWithLabel value={progressValue} />
          </Grid>
        </Grid>
      </CustomModal>
    </>
  );
};
