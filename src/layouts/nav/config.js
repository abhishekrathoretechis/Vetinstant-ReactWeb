import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import CurrencyRupeeIcon from "@mui/icons-material/CurrencyRupee";
import EventNoteIcon from "@mui/icons-material/EventNote";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PetsIcon from "@mui/icons-material/Pets";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import RoomPreferencesIcon from "@mui/icons-material/RoomPreferences";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";
import { ReactComponent as HomeIcon } from "../../assets/images/svg/home.svg";
import { ReactComponent as VetIcon } from "../../assets/images/svg/stethescope.svg";
import { ReactComponent as PetIcon } from "../../assets/images/svg/pet.svg";
import { ReactComponent as PaymentIcon } from "../../assets/images/svg/invoice.svg";
import { ReactComponent as AppointmentsIcon } from "../../assets/images/svg/calendar.svg";
import { ReactComponent as DeliveryIcon } from "../../assets/images/svg/delivery-fast.svg";
import { ReactComponent as SettingsIcon } from "../../assets/images/svg/service.svg";
import { ReactComponent as InventoryIcon } from "../../assets/images/svg/inventory-management.svg";
import { ReactComponent as HeartIcon } from "../../assets/images/svg/heart.svg";
import { ReactComponent as CircleinfoIcon } from "../../assets/images/svg/circle-information.svg";
import { ReactComponent as DialIcon } from "../../assets/images/svg/dial-max.svg";

const navAdminConfig = [
  { title: "dashboard", path: "/home", icon: <HomeOutlinedIcon /> },
  { title: "clinics", path: "/clinic", icon: <LocalHospitalIcon /> },
  { title: "pets", path: "/pet", icon: <PetsIcon /> },
  { title: "payments", path: "/payment", icon: <ReceiptLongIcon /> },
];

const navClinicConfig = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: <HomeIcon />,
  },
  {
    title: "Vets",
    path: "/vets",
    icon: <VetIcon />,
  },
  {
    title: "Pets",
    path: "/pets",
    icon: <PetIcon />,
  },
  {
    title: "Appointments",
    path: "/appointments-request",
    icon: <AppointmentsIcon />,
  },
  {
    title: "Billing",
    path: "/payments",
    icon: <PaymentIcon />,
  },
  {
    title: "Inventory",
    path: "/inventory",
    icon: <InventoryIcon />,
  },
  {
    title: "Coming soon",
    path: "/coming-soon",
    icon: <DeliveryIcon />,
  },
  {
    title: "Coming soon",
    path: "/coming-soon",
    icon: <HeartIcon />,
  },
  {
    title: "Coming soon",
    path: "/coming-soon",
    icon: <DialIcon />,
  },
  {
    title: "Coming soon",
    path: "/coming-soon",
    icon: <SettingsIcon />,
  },
  {
    title: "Coming soon",
    path: "/coming-soon",
    icon: <CircleinfoIcon />,
  },
];

const navVetConfig = [
  { title: "dashboard", path: "/vet-dashboard", icon: <HomeOutlinedIcon /> },
  { title: "pets", path: "/vet-pets", icon: <PetsIcon /> },
  { title: "appointments", path: "/vet-appointments", icon: <EventNoteIcon /> },
  {
    title: "availability",
    path: "/vet-availability",
    icon: <CalendarMonthIcon />,
  },
  {
    title: "payment history",
    path: "/vet-payment-history",
    icon: <CurrencyRupeeIcon />,
  },
  {
    title: "my profile",
    path: "/vet-profile",
    icon: <AccountCircleOutlinedIcon />,
  },
];

const navBillingConfig = [
  { title: "dashboard", path: "/home", icon: <HomeOutlinedIcon /> },
  { title: "payments", path: "/payment", icon: <ReceiptLongIcon /> },
];

const navManagementConfig = [
  { title: "dashboard", path: "/home", icon: <HomeOutlinedIcon /> },
  { title: "vets", path: "/vets", icon: <LocalHospitalIcon /> },
  { title: "pets", path: "/pets", icon: <PetsIcon /> },
  { title: "appointments", path: "/appointments", icon: <EventNoteIcon /> },
  { title: "payments", path: "/payments", icon: <ReceiptLongIcon /> },
  {
    title: "pharma delivery",
    path: "/pharma-delivery",
    icon: <LocalShippingIcon />,
  },
  { title: "settings", path: "/settings", icon: <RoomPreferencesIcon /> },
  { title: "inventory", path: "/inventory", icon: <MedicalServicesIcon /> },
];

const navFrontDeskConfig = [
  { title: "dashboard", path: "/home", icon: <HomeOutlinedIcon /> },
  { title: "vets", path: "/vets", icon: <LocalHospitalIcon /> },
  { title: "pets", path: "/pets", icon: <PetsIcon /> },
  { title: "appointments", path: "/appointments", icon: <EventNoteIcon /> },
];
const navPharmacyConfig = [
  { title: "dashboard", path: "/home", icon: <HomeOutlinedIcon /> },
  { title: "inventory", path: "/inventory", icon: <MedicalServicesIcon /> },
];
const navVeterinaryConfig = [
  { title: "dashboard", path: "/dashboard", icon: <HomeOutlinedIcon /> },
];
export {
  navAdminConfig,
  navClinicConfig,
  navVetConfig,
  navBillingConfig,
  navManagementConfig,
  navFrontDeskConfig,
  navPharmacyConfig,
  navVeterinaryConfig,
};
