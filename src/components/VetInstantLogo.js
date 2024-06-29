import VetLogo from "../assets/images/png/VetInstantWhite.png";
import PropTypes from "prop-types";
import useResponsive from "./hooks/useResponsive";
import VetLogoSml from "../assets/images/png/VetInstantLogo.png";

const VetInstantLogo = ({ alignment }) => {
  const isDesktop = useResponsive("up", "lg");
  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: alignment,
        marginTop: 6,
      }}
    >
      {isDesktop ? (
        <img src={VetLogo} alt={VetLogo} style={{ width: "60%" }} />
      ) : (
        <img src={VetLogoSml} alt={VetLogoSml} style={{ width: "30%" }} />
      )}
    </div>
  );
};

VetInstantLogo.propTypes = {
  alignment: PropTypes.string,
};

VetInstantLogo.defaultProps = {
  alignment: "center",
};

export default VetInstantLogo;
