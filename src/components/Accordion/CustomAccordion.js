import * as React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PropTypes from "prop-types";

const CustomAccordion = ({
  disabled,
  defaultExpanded,
  square,
  expanded,
  disableGutters,
  header,
  details,
  id,
  area,
}) => {
  return (
    <div>
      <Accordion
        disabled={disabled}
        defaultExpanded={defaultExpanded}
        square={square}
        expanded={expanded}
        disableGutters={disableGutters}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls={area}
          id={id}
        >
          <Typography>{header}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>{details}</Typography>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

CustomAccordion.propTypes = {
  disabled: PropTypes.bool,
  defaultExpanded: PropTypes.bool,
  square: PropTypes.bool,
  expanded: PropTypes.bool,
  disableGutters: PropTypes.bool,
  header: PropTypes.string,
  details: PropTypes.string,
};
CustomAccordion.defaultProps = {
  disabled: false,
  defaultExpanded: false,
  square: false,
  expanded: false,
  disableGutters: false,
  header: "",
  details: "",
};

export default CustomAccordion;
