import CloseIcon from "@mui/icons-material/Close";
import { AppColors } from "../../../../util/AppColors";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";

const FilesWithCloseButton = ({ files, onClickFile }) => {
  return (
    <div className="flex-row">
      {files?.map((fle, i) => {
        const mimeType = fle?.file?.type?.split("/")?.[0];

        return (
          <div
            style={{
              display: "inline-block",
              position: "relative",
              marginLeft: i !== 0 ? 15 : 0,
            }}
          >
            {mimeType === "application" ? (
              <PictureAsPdfIcon
                className="upload-pdf"
                sx={{ color: AppColors.redBtn }}
              />
            ) : mimeType === "image" || !mimeType ? (
              <img className="upload-img" alt="" src={fle?.previewUrl} />
            ) : mimeType === "video" ? (
              <video className="upload-img" alt="" src={fle?.previewUrl} />
            ) : null}
            <CloseIcon
              sx={{ width: 20, height: 20, color: AppColors.white }}
              className="img-close cursor"
              onClick={() => onClickFile(i, fle)}
            />
          </div>
        );
      })}
    </div>
  );
};

export default FilesWithCloseButton;
