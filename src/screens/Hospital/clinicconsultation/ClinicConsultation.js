import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Checkbox from "../../../components/CustomCheckbox";
import CustomSelect from "../../../components/Select/Select";
import {
  getClinicTerms,
  updateStatusConsultation,
} from "../../../redux/reducers/clinicSlice";
import {
  NewRefundList,
  Percentage50and100List,
  PercentageZeroList,
  PrepaidPostpaidList,
} from "../../../util/arrayList";
import "./ClinicConsultation.css";

const ClinicConsultation = () => {
  const dispatch = useDispatch();
  const termsAndConditions = useSelector(
    (state) => state?.clinic?.termsAndConditions
  );
  const [selectedConsultations, setSelectedConsultations] = useState([]);
  const [prepaidVirtual, setPrepaidVirtual] = useState("postpaid");
  const [termsVirtual, setTermsVirtual] = useState("0");
  const [refundVirtual, setRefundVirtual] = useState("N");
  const [refundPercVirtual, setRefundPercVirtual] = useState("0");

  const [prepaidPhysical, setPrepaidPhysical] = useState("postpaid");
  const [termsPhysical, setTermsPhysical] = useState("0");
  const [refundPhysical, setRefundPhysical] = useState("N");
  const [refundPercPhysical, setRefundPercPhysical] = useState("0");

  const [prepaidHomeVisit, setPrepaidHomeVisit] = useState("postpaid");
  const [termsHomeVisit, setTermsHomeVisit] = useState("0");
  const [refundHomeVisit, setRefundHomeVisit] = useState("N");
  const [refundPercHomeVisit, setRefundPercHomeVisit] = useState("0");

  useEffect(() => {
    dispatch(getClinicTerms());
  }, []);

  useEffect(() => {
    const data = [];
    termsAndConditions?.filter((trm) => {
      if (trm?.status === "Y") data?.push(trm?.consultationType);
    });
    setSelectedConsultations(data);

    if (termsAndConditions?.length > 0) {
      const virtualConsultation = termsAndConditions?.find(
        (trm) => trm?.consultationType === "Virtual"
      );

      if (virtualConsultation) {
        setPrepaidVirtual(virtualConsultation?.paymentType); // Set prepaid based on type
        setTermsVirtual(virtualConsultation?.termsfront);
        setRefundVirtual(virtualConsultation?.refundType); // Convert to boolean
        setRefundPercVirtual(virtualConsultation?.refund);
      }

      const physicalConsultation = termsAndConditions?.find(
        (trm) => trm?.consultationType === "Physical"
      );
      if (physicalConsultation) {
        setPrepaidPhysical(physicalConsultation?.paymentType); // Set prepaid based on type
        // Assuming you want to set terms, refund, and refund percentage for Physical consultation as well
        setTermsPhysical(physicalConsultation?.termsfront);
        setRefundPhysical(physicalConsultation?.refundType); // Convert to boolean
        setRefundPercPhysical(physicalConsultation?.refund);
      }

      const homeVisitConsultation = termsAndConditions?.find(
        (trm) => trm?.consultationType === "HomeVisit"
      );
      if (homeVisitConsultation) {
        setPrepaidHomeVisit(homeVisitConsultation?.paymentType); // Set prepaid based on type
        // Assuming you want to set terms, refund, and refund percentage for HomeVisit consultation as well
        setTermsHomeVisit(homeVisitConsultation?.termsfront);
        setRefundHomeVisit(homeVisitConsultation?.refundType); // Convert to boolean
        setRefundPercHomeVisit(homeVisitConsultation?.refund);
      }
    }
  }, [termsAndConditions]);

  const handleChangeCheckbox = async (name) => {
    const isPrev = selectedConsultations?.find((con) => con === name);
    const reqCons = isPrev
      ? selectedConsultations?.filter((con) => con !== name)
      : [...selectedConsultations, name];

    await setSelectedConsultations(reqCons);
    const selectedTerm = termsAndConditions?.find(
      (trm) => trm?.consultationType === name
    );

    const reqTermsAndConditions = [
      { ...selectedTerm, status: isPrev ? "N" : "Y" },
    ];
    updateTermsAndConditions(reqTermsAndConditions);
  };

  const updateTermsAndConditions = async (termsAndConditions) => {
    // Create an array to store the terms and conditions for selected consultations

    const apiRes = await dispatch(updateStatusConsultation(termsAndConditions));
    if (apiRes?.payload) dispatch(getClinicTerms());
  };

  const checkCondition = (name, value, consultation, con) => {
    return name === value && consultation === con;
  };

  const handleChange = async (value, name, type) => {
    if (name === "paymentType") {
      switch (type) {
        case "Virtual":
          setPrepaidVirtual(value);
          break;
        case "Physical":
          setPrepaidPhysical(value);
          break;
        case "HomeVisit":
          setPrepaidHomeVisit(value);
          break;
        default:
          break;
      }
    }
    if (name === "termsfront") {
      switch (type) {
        case "Virtual":
          setTermsVirtual(value);
          break;
        case "Physical":
          setTermsPhysical(value);
          break;
        case "HomeVisit":
          setTermsHomeVisit(value);
          break;
        default:
          break;
      }
    }
    if (name === "refundType") {
      switch (type) {
        case "Virtual":
          setRefundVirtual(value);
          break;
        case "Physical":
          setRefundPhysical(value);
          break;
        case "HomeVisit":
          setRefundHomeVisit(value);
          break;
        default:
          break;
      }
    }
    if (name === "refund") {
      switch (type) {
        case "Virtual":
          setRefundPercVirtual(value);
          break;
        case "Physical":
          setRefundPercPhysical(value);
          break;
        case "HomeVisit":
          setRefundPercHomeVisit(value);
          break;
        default:
          break;
      }
    }

    const reqTermsAndConditions = selectedConsultations?.map((con) => {
      let paymentType, termsfront, refundType, refund;
      const termId =
        termsAndConditions?.find((trm) => trm?.consultationType === con)
          ?.termId ?? null;

      // Set payment terms based on the consultation type
      switch (con) {
        case "Virtual":
          paymentType = checkCondition(name, "paymentType", type, con)
            ? value
            : prepaidVirtual || "prepaid";
          termsfront =
            paymentType === "postpaid"
              ? "0"
              : checkCondition(name, "termsfront", type, con)
              ? value
              : termsVirtual !== "0"
              ? termsVirtual
              : "50";
          refundType = checkCondition(name, "refundType", type, con)
            ? value
            : refundVirtual || false;
          refund =
            refundType !== "Y"
              ? "0"
              : checkCondition(name, "refund", type, con)
              ? value
              : refundPercVirtual !== "0"
              ? refundPercVirtual
              : "50";
          break;
        case "HomeVisit":
          paymentType = checkCondition(name, "paymentType", type, con)
            ? value
            : prepaidHomeVisit || "prepaid";
          termsfront =
            paymentType === "postpaid"
              ? "0"
              : checkCondition(name, "termsfront", type, con)
              ? value
              : termsHomeVisit !== "0"
              ? termsHomeVisit
              : "50";
          refundType = checkCondition(name, "refundType", type, con)
            ? value
            : refundHomeVisit || false;
          refund =
            refundType !== "Y"
              ? "0"
              : checkCondition(name, "refund", type, con)
              ? value
              : refundPercHomeVisit !== "0"
              ? refundPercHomeVisit
              : "50";
          break;
        case "Physical":
          paymentType = checkCondition(name, "paymentType", type, con)
            ? value
            : prepaidPhysical || "prepaid";
          termsfront =
            paymentType === "postpaid"
              ? "0"
              : checkCondition(name, "termsfront", type, con)
              ? value
              : termsPhysical !== "0"
              ? termsPhysical
              : "50";
          refundType = checkCondition(name, "refundType", type, con)
            ? value
            : refundPhysical || false;
          refund =
            refundType !== "Y"
              ? "0"
              : checkCondition(name, "refund", type, con)
              ? value
              : refundPercPhysical !== "0"
              ? refundPercPhysical
              : "50";
          break;
        default:
          // Handle other cases if needed
          break;
      }

      const data = {
        consultationType: con,
        paymentType,
        termsfront,
        refundType,
        refund,
        status: "Y",
      };
      if (termId) data.termId = termId;
      return data;
    });

    updateTermsAndConditions(reqTermsAndConditions);
  };

  return (
    <div className="consultation-white-con">
      <div className="flex-start">
        <div className="mr20">
          <p className="font-bold fs14 blue-color">
            Select the type of consultation:
          </p>
        </div>
        <Checkbox
          label="Virtual"
          checked={selectedConsultations?.includes("Virtual")}
          onChange={() => handleChangeCheckbox("Virtual")}
        />

        <Checkbox
          label="Physical"
          checked={selectedConsultations?.includes("Physical")}
          onChange={() => handleChangeCheckbox("Physical")}
        />

        <Checkbox
          label="HomeVisit"
          checked={selectedConsultations?.includes("HomeVisit")}
          onChange={() => handleChangeCheckbox("HomeVisit")}
        />
      </div>
      <div className="tablecontainer">
        <p className="font-bold fs14 blue-color">Terms & Conditions:</p>
        <div className="tablesubcontainer">
          <table className="mybox">
            <thead>
              <tr>
                <th className="font-bold fs14" rowSpan="2">
                  Consultation
                </th>
                <th className="font-bold fs14" colSpan="2">
                  Payment Terms
                </th>
                <th className="font-bold fs14" colSpan="2">
                  Cancellation Terms
                </th>
              </tr>
              <tr>
                <th className="subheading">Payment Type</th>
                <th className="subheading">Terms</th>
                <th className="subheading">Refund</th>
                <th className="subheading">Refund %</th>
              </tr>
            </thead>
            <tbody>
              {termsAndConditions
                ?.filter((trm) => trm?.status === "Y") //filter active type only
                ?.map((trm, index) => {
                  const paymentType =
                    trm?.consultationType === "Virtual"
                      ? prepaidVirtual
                      : trm?.consultationType === "Physical"
                      ? prepaidPhysical
                      : prepaidHomeVisit;
                  const isPrePaidAmount = paymentType === "prepaid" ?? false;

                  const refundable =
                    trm?.consultationType === "Virtual"
                      ? refundVirtual
                      : trm?.consultationType === "Physical"
                      ? refundPhysical
                      : refundHomeVisit;

                  const isRefundable = refundable === "Y";

                  return (
                    <tr key={index}>
                      <td className="txt-regular fs14 black">
                        {trm?.consultationType}
                      </td>
                      <td>
                        <div className="flex-center">
                          <CustomSelect
                            list={PrepaidPostpaidList}
                            handleChange={(e) => {
                              handleChange(
                                e.target.value,
                                "paymentType",
                                trm?.consultationType
                              );
                            }}
                            fullWidth
                            value={
                              trm?.consultationType === "Virtual"
                                ? prepaidVirtual
                                : trm?.consultationType === "Physical"
                                ? prepaidPhysical
                                : prepaidHomeVisit
                            }
                          />
                        </div>
                      </td>
                      <td>
                        <div className="flex-center">
                          <CustomSelect
                            list={
                              isPrePaidAmount
                                ? Percentage50and100List
                                : PercentageZeroList
                            }
                            handleChange={(e) => {
                              handleChange(
                                e.target.value,
                                "termsfront",
                                trm?.consultationType
                              );
                            }}
                            fullWidth
                            value={
                              trm?.consultationType === "Virtual"
                                ? termsVirtual
                                : trm?.consultationType === "Physical"
                                ? termsPhysical
                                : termsHomeVisit
                            }
                          />
                        </div>
                      </td>
                      <td>
                        <div className="flex-center">
                          <CustomSelect
                            list={NewRefundList}
                            handleChange={(e) => {
                              handleChange(
                                e.target.value,
                                "refundType",
                                trm?.consultationType
                              );
                            }}
                            fullWidth
                            value={
                              trm?.consultationType === "Virtual"
                                ? refundVirtual
                                : trm?.consultationType === "Physical"
                                ? refundPhysical
                                : refundHomeVisit
                            }
                          />
                        </div>
                      </td>
                      <td>
                        <div className="flex-center">
                          <CustomSelect
                            list={
                              isRefundable
                                ? Percentage50and100List
                                : PercentageZeroList
                            }
                            handleChange={(e) => {
                              handleChange(
                                e.target.value,
                                "refund",
                                trm?.consultationType
                              );
                            }}
                            fullWidth
                            value={
                              trm?.consultationType === "Virtual"
                                ? refundPercVirtual
                                : trm?.consultationType === "Physical"
                                ? refundPercPhysical
                                : refundPercHomeVisit
                            }
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ClinicConsultation;
