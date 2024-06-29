import { ProblemTypes, symptomsTypes } from "../../util/enum";

const getRequiredIssue = (detail, problem) => {
  const requiredArr = detail?.issue?.filter(
    (a) => a !== "male" && a !== "female"
  );
  const isFemale = detail?.issue?.find((i) => i === "female");
  const isMale = detail?.issue?.find((i) => i === "male");
  if (isFemale) {
    if (detail?.female?.dischargeVulva) requiredArr.push("dischargeVulva");
    if (detail?.female?.bleedingVulva) requiredArr.push("bleedingVulva");
    if (detail?.female?.swellingVulva) requiredArr.push("swellingVulva");
  }
  if (isMale) {
    if (detail?.male?.dischargePenis) requiredArr.push("dischargePenis");
    if (detail?.male?.bleedingPenis) requiredArr.push("bleedingPenis");
    if (detail?.male?.swellingPenis) requiredArr.push("swellingPenis");
  }
  return requiredArr;
};

export const CommonComplaintSummaryComponent = ({ medicalHistory }) => {
  const requiredProblemList = medicalHistory?.problemType?.filter(
    (problem) => problem !== "otherProblems"
  );

  return (
    <div>
      {medicalHistory?.length > 0
        ? medicalHistory?.map((problem, i) => {
            const reqDet =
              // medicalHistory?.problem?.[problem] ?? //this will work for new api
              // medicalHistory?.[problem?.problems];

            // const issues =
            problem?.problems.length > 0
                ? Array.isArray(problem?.problems)
                  ? problem?.problems === "renalUrinary"
                    ? getRequiredIssue(reqDet, problem)
                    : problem?.problems
                  : problem?.problems.split(",")
                : [];
            const locations =
              reqDet?.location?.length > 0
                ? Array.isArray(reqDet?.location)
                  ? reqDet?.location
                  : reqDet?.location?.split(",")
                : [];

            return (
              <div className="mv10 mh20" key={i}>
                <div key={i} className="text-bold">
                  Problem: {problem?.problem}
                </div>
                {problem?.problems?.length > 0 ? (
                  <div className="vetAppint-flex-con">
                    <div key={i} className="text-bold mv5">
                      Symptoms:
                    </div>

                    {problem?.problems?.map((pb, ind) => (
                      <div key={ind} className="blue-box">
                        <div className="txt-semi-bold white-color fs14">
                          {problem === "Gastrointestinal" ||
                          problem === "renalUrinary" ||
                          problem === "General"
                            ? symptomsTypes?.[pb]
                            : pb}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
                {locations?.length > 0 ? (
                  <div className="vetAppint-flex-con">
                    <div key={i} className="text-bold mv5">
                      Locations:
                    </div>

                    {locations?.map((loc, ind) => (
                      <div key={ind} className="blue-box">
                        <div className="txt-semi-bold white-color fs14">
                          {loc}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
                
                  <div className="flex-row mv20">
                   
                      <div className="flex-center w25Per">
                        <img src={problem?.image1} alt={problem?.image1} className="img-view" />
                      </div>
                    
                  </div>
              
                
                  {/* <div className="flex-row mv20">
                    {reqDet?.videos?.map((video, index) => (
                      <div className="flex-center w25Per" key={index}>
                        <video
                          src={video}
                          alt={video}
                          controls
                          className="img-view"
                        />
                      </div>
                    ))}
                  </div>
                ) : null} */}
                {reqDet?.[reqDet?.issue]?.images?.length > 0 ||
                reqDet?.[reqDet?.issue]?.videos?.length > 0 ? (
                  <>
                    {reqDet?.[reqDet?.issue]?.images ? (
                      <div className="flex-row mv20">
                        {reqDet?.[reqDet?.issue]?.images?.map(
                          (image, index) => (
                            <div className="flex-center w25Per" key={index}>
                              <img
                                src={image}
                                alt={image}
                                className="img-view"
                              />
                            </div>
                          )
                        )}
                      </div>
                    ) : (
                      <div className="flex-row mv20">
                        {reqDet?.[reqDet?.issue]?.videos?.map(
                          (video, index) => (
                            <div className="flex-center w25Per" key={index}>
                              <video
                                src={video}
                                alt={video}
                                controls
                                className="img-view"
                              />
                            </div>
                          )
                        )}
                      </div>
                    )}
                    {reqDet?.[reqDet?.issue].type?.length > 0 ? (
                      <div className="vetAppint-flex-con">
                        <div key={i} className="text-bold mv5">
                          Type:
                        </div>

                        {reqDet?.[reqDet?.issue].type?.map((typ, ind) => (
                          <div key={ind} className="blue-box">
                            <div className="txt-semi-bold white-color fs14">
                              {typ}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </>
                ) : null}
                {ProblemTypes?.[problem] === "Respiratory" ? (
                  <div className="text-bold mv5">
                    Is Nose Bleed:{" "}
                    <div className="txt-semi-bold">
                      {reqDet?.noseBleed ? "Yes" : "No"}
                    </div>
                  </div>
                ) : null}
                {ProblemTypes?.[problem] === "Skin & Coat" ? (
                  <div className="text-bold mv5">
                    Is in Paws:{" "}
                    <div className="txt-semi-bold">
                      {reqDet?.inPaws ? "Yes" : "No"}
                    </div>
                  </div>
                ) : null}

                {reqDet?.detail?.length > 0 ? (
                  <div>
                    <div className="text-bold">Details:</div>
                    <div className="text">{reqDet?.detail}</div>
                  </div>
                ) : null}

                {reqDet?.length > 0 ? (
                  <div className="text mv5">{reqDet}</div>
                ) : null}
                {reqDet?.numberOfDays || reqDet?.notEating?.numberOfDays ? (
                  <div className="text-bold">
                    How long the issue has been there:{" "}
                    {reqDet?.numberOfDays || reqDet?.notEating?.numberOfDays}{" "}
                    days
                  </div>
                ) : null}
              </div>
            );
          })
        : null}
    </div>
  );
};
