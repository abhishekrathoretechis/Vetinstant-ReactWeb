export const CommonOtherComponent = ({ medicalHistory }) => {
  return (
    <div className="mh20">
      {medicalHistory?.via === "vetinstant" ? (
        medicalHistory?.problems?.otherProblems?.images?.length > 0 ? (
          <div className="flex-row mv20">
            {medicalHistory?.problems?.otherProblems?.images?.map(
              (image, index) => (
                <div className="w25Per flex-center" key={index}>
                  <img src={image} alt={image} className="img-view" />
                </div>
              )
            )}
          </div>
        ) : (
          <div className="flex-center text">No Other records available</div>
        )
      ) : (
        <>
          <div className="text-bold">Dr. {medicalHistory?.docname}</div>
          <div className="text-bold mv10">Complaints: </div>
          <div className="flex-row-wrap">
            {medicalHistory?.problemType?.map((problem, i) => (
              <div className="text">{`${problem} ${
                medicalHistory?.problemType?.length !== i + 1 ? ", " : ""
              }`}</div>
            ))}
          </div>

          {medicalHistory?.medicalFiles?.length > 0 ? (
            <div className="flex-row mv20">
              {medicalHistory?.medicalFiles?.map((medFile, index) => {
                const reqUrl = `${medFile?.baseUrl}${medFile?.filename}`;

                return (
                  <div className="w25Per flex-center" key={index}>
                    {medFile?.mimetype?.startsWith("image") ? (
                      <img src={reqUrl} alt={reqUrl} className="img-view" />
                    ) : medFile?.mimetype?.startsWith("video") ? (
                      <video
                        src={reqUrl}
                        alt={reqUrl}
                        controls
                        className="img-view"
                      />
                    ) : medFile?.mimetype === "application/pdf" ? (
                      <a href={reqUrl} target="_blank" rel="noreferrer">
                        {medFile?.filename}
                      </a>
                    ) : null}
                  </div>
                );
              })}
            </div>
          ) : null}
        </>
      )}
    </div>
  );
};
