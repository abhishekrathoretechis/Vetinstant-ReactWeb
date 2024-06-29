import React from "react";
import { useSelector } from "react-redux";
import "./Component.css";

const FullPageLoader = () => {
  const { loader, loadingText } = useSelector((state) => state.loader);
  if (!loader) return null;

  return (
    <div className="loader-container">
      <div className="loader">
        <div className="flex1-center">
          {/* <img
              src={LoaderGif}
              alt={LoaderGif}
              style={{ width: 100, height: 100 }}
            /> */}
          <div className="loading" />

          <div>
            <p>{loadingText}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullPageLoader;
