import React from "react";
import {
  Navigate,
  useLocation,
  // useNavigate,
  useRoutes,
} from "react-router-dom";
import CustomLayout from "../layouts/CustomLayout";
import Clinic from "../screens/Admin/Clinic/Clinic";
import Home from "../screens/Admin/Home/Home";
import Pet from "../screens/Admin/Pets/Pet";
import Login from "../screens/Auth/Login/Login";

// clinic components
import ClinicDetails from "../screens/Admin/ClinicDetails/ClinicDetails";
import Payments from "../screens/Admin/Payments/Payments";
import ManageSlot from "../screens/CommonScreens/ManageSlot/ManageSlot";
import MedicalHistoryView from "../screens/CommonScreens/MedicalHistoryView/MedicalHistoryView";
import Notifications from "../screens/CommonScreens/Notifications/Notifications";
import PetDetails from "../screens/CommonScreens/PetDetails/PetDetails";
import VetDetails from "../screens/CommonScreens/VetDetails/VetDetails";
import VetAppointmentDetails from "../screens/Doctor/Appointments/VetAppointmentDetails";
import VetAppointments from "../screens/Doctor/Appointments/VetAppointments";
import VetAvailability from "../screens/Doctor/Availability/VetAvailability";
import DoctorDashboard from "../screens/Doctor/DoctorDashboard/DoctorDashboard";
import DoctorPets from "../screens/Doctor/DoctorPets/DoctorPets";
import VetPaymentHistory from "../screens/Doctor/PaymentHistory/VetPaymentHistory";
import VetProfile from "../screens/Doctor/Profile/VetProfile";
import Appointments from "../screens/Hospital/Appointments/Appointments";
import ClinicPayments from "../screens/Hospital/ClinicPayments/ClinicPayments";
import ClinicPets from "../screens/Hospital/ClinicPets/ClinicPets";
import PharmaDelivery from "../screens/Hospital/PharmaDelivery/PharmaDelivery";
import PharmaPrescription from "../screens/Hospital/PharmaPrescription/PharmaPrescription";
import Settings from "../screens/Hospital/Settings/Settings";
import Vets from "../screens/Hospital/Vets/Vets";
import Dashboard from "./../screens/Hospital/Home/Home";
import ClinicConsultation from "../screens/Hospital/clinicconsultation/ClinicConsultation";
import ClinicConsultationNew from "../screens/Hospital/BranchManagement/ClinicConsultation";
import Services from "../screens/Hospital/services/Services";
import PaymentInvoice from "../screens/Hospital/PaymentInvoice/PaymentInvoice";
import NewPaymentBillingCreate from "../screens/Hospital/newpaymentbillingcreate/NewPaymentBillingCreate";
import Inventory from "../screens/Hospital/Inventory/Inventory";
import History from "../screens/Hospital/ClinicPetDetails/History";

// Billing

import BillingHome from "../screens/Billing/BillingHome/BillingHome";

// Management
import ManagementHome from "../screens/Management/ManagementHome/ManagementHome";

// FrontDesk
import FrontDeskHome from "../screens/FrontDesk/FrontDeskHome/FrontDeskHome";

// Pharmacy
import PharmacyHome from "../screens/Pharmacy/PharmacyHome/PharmacyHome";

// Veterinary
import VeterinaryHome from "../screens/Veterinary/VeterinaryHome/VeterinaryHome";
import VetCalendar from "../screens/Hospital/VetCalendar/VetCalendar";
import ClinicPetDetails from "../screens/Hospital/ClinicPetDetails/ClinicPetDetails";
import ClinicalNotes from "../screens/Hospital/ClinicPetDetails/PatientWorkbook/ClinicalNotes";
import BranchManagement from "../screens/Hospital/BranchManagement/BranchManagement";
import CalendarComponent from "../screens/Hospital/ClinicPets/CalenderComponent";
import VetHolidayCalendar from "../screens/Hospital/VetHolidayCalendar/VetHolidayCalendar";
import ComingSoon from "../screens/Hospital/ComingSoon/ComingSoon";
import AppointmentRequest from "../screens/Hospital/Appointments/AppointmentRequest";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("accessToken");
  return token !== null ? (
    children
  ) : (
    <Navigate to={"/login"} replace></Navigate>
  );
}

export default function Router() {
  // const navigate = useNavigate();
  const location = useLocation();
  // const path = location.pathname;

  // useEffect(() => {
  //   if (!path) return;
  //   navigate(`${path}`);
  // }, [path]);

  const routes = useRoutes([
    {
      path: "/",
      element: <CustomLayout />,
      children: [
        //Admin Routes
        {
          path: "/home",
          element: (
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          ),
        },
        {
          path: "/clinic",
          element: (
            <PrivateRoute>
              <Clinic />
            </PrivateRoute>
          ),
        },
        {
          path: "/clinic-details/:clinicId",
          element: (
            <PrivateRoute>
              <ClinicDetails />
            </PrivateRoute>
          ),
        },

        {
          path: "/history",
          element: (
            <PrivateRoute>
              <History />
            </PrivateRoute>
          ),
        },
        {
          path: "/branch-management",
          element: (
            <PrivateRoute>
              <BranchManagement />
            </PrivateRoute>
          ),
        },
        {
          path: "/payment",
          element: (
            <PrivateRoute>
              <Payments />
            </PrivateRoute>
          ),
        },

        {
          path: "/invoice-bill",
          element: (
            <PrivateRoute>
              <PaymentInvoice />
            </PrivateRoute>
          ),
        },

        {
          path: "/newpaymentbilling/:id",
          element: (
            <PrivateRoute>
              <NewPaymentBillingCreate />
            </PrivateRoute>
          ),
        },
        {
          path: "/clinic-consultation",
          element: (
            <PrivateRoute>
              <ClinicConsultationNew />
            </PrivateRoute>
          ),
        },
        {
          path: "/clinicconsultation",
          element: (
            <PrivateRoute>
              <ClinicConsultation />
            </PrivateRoute>
          ),
        },
        {
          path: "/services",
          element: (
            <PrivateRoute>
              <Services />
            </PrivateRoute>
          ),
        },
        {
          path: "/coming-soon",
          element: (
            <PrivateRoute>
              <ComingSoon />
            </PrivateRoute>
          ),
        },

        //Clinic Routes
        {
          path: "/dashboard",
          element: (
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          ),
        },
        {
          path: "/vets",
          element: (
            <PrivateRoute>
              <Vets />
            </PrivateRoute>
          ),
        },
        {
          path: "/vet-calendar",
          element: (
            <PrivateRoute>
              <VetCalendar />
            </PrivateRoute>
          ),
        },
        {
          path: "/vet-holiday-calendar",
          element: (
            <PrivateRoute>
              <VetHolidayCalendar />
            </PrivateRoute>
          ),
        },
        {
          path: "/pets",
          element: (
            <PrivateRoute>
              <ClinicPets />
            </PrivateRoute>
          ),
        },
        {
          path: "/payments",
          element: (
            <PrivateRoute>
              {/* <History /> */}
              <ClinicPayments />
            </PrivateRoute>
          ),
        },
        {
          path: "/appointments",
          element: (
            <PrivateRoute>
              <Appointments />
            </PrivateRoute>
          ),
        },
        {
          path: "/appointments-request",
          element: (
            <PrivateRoute>
              <AppointmentRequest />
            </PrivateRoute>
          ),
        },
        {
          path: "/pharma-delivery",
          element: (
            <PrivateRoute>
              <PharmaDelivery />
            </PrivateRoute>
          ),
        },
        {
          path: "/pharma-prescription/:prescriptionId",
          element: (
            <PrivateRoute>
              <PharmaPrescription />
            </PrivateRoute>
          ),
        },
        {
          path: "/settings",
          element: (
            <PrivateRoute>
              <Settings />
            </PrivateRoute>
          ),
        },
        {
          path: "/inventory",
          element: (
            <PrivateRoute>
              <Inventory />
            </PrivateRoute>
          ),
        },
        //Doctor Routes
        {
          path: "/vet-dashboard",
          element: (
            <PrivateRoute>
              <DoctorDashboard />
            </PrivateRoute>
          ),
        },
        {
          path: "/vet-profile",
          element: (
            <PrivateRoute>
              <VetProfile />
            </PrivateRoute>
          ),
        },
        {
          path: "/vet-availability",
          element: (
            <PrivateRoute>
              <VetAvailability />
            </PrivateRoute>
          ),
        },
        {
          path: "/vet-payment-history",
          element: (
            <PrivateRoute>
              <VetPaymentHistory />
            </PrivateRoute>
          ),
        },
        {
          path: "/vet-appointments",
          element: (
            <PrivateRoute>
              <VetAppointments />
            </PrivateRoute>
          ),
        },
        {
          path: "/vet-appointment-details",
          element: (
            <PrivateRoute>
              <VetAppointmentDetails />
            </PrivateRoute>
          ),
        },
        {
          path: "/vet-pets",
          element: (
            <PrivateRoute>
              <DoctorPets />
            </PrivateRoute>
          ),
        },
        //Common Routes
        {
          path: "/vet-details/:vetId",
          element: (
            <PrivateRoute>
              <VetDetails />
            </PrivateRoute>
          ),
        },
        {
          path: "/CalendarComponent",
          element: (
            <PrivateRoute>
              <CalendarComponent />
            </PrivateRoute>
          ),
        },
        {
          path: "/pet-details/:petId",
          element: (
            <PrivateRoute>
              <PetDetails />
            </PrivateRoute>
          ),
        },
        {
          path: "/clinic-pet-details",
          element: (
            <PrivateRoute>
              <ClinicPetDetails />
            </PrivateRoute>
          ),
        },

        {
          path: "/clinical-notes",
          element: (
            <PrivateRoute>
              <ClinicalNotes />
            </PrivateRoute>
          ),
        },
        {
          path: "/notifications",
          element: (
            <PrivateRoute>
              <Notifications />
            </PrivateRoute>
          ),
        },
        //medicalhistory Routes
        {
          path: "/medical-history/:petId/:medicalHistoryId",
          element: (
            <PrivateRoute>
              <MedicalHistoryView />
            </PrivateRoute>
          ),
        },
        //manage slot Routes
        {
          path: "/manage-slot/:vetId/:slotId",
          element: (
            <PrivateRoute>
              <ManageSlot />
            </PrivateRoute>
          ),
        },

        //Billing Routes
        {
          path: "/billinghome",
          element: (
            <PrivateRoute>
              <BillingHome />
            </PrivateRoute>
          ),
        },
        //management routes
        {
          path: "/managementhome",
          element: (
            <PrivateRoute>
              <ManagementHome />
            </PrivateRoute>
          ),
        },

        //frontdesk routes
        {
          path: "/frontdeskhome",
          element: (
            <PrivateRoute>
              <FrontDeskHome />
            </PrivateRoute>
          ),
        },

        //Pharmacy routes
        {
          path: "/pharmacyhome",
          element: (
            <PrivateRoute>
              <PharmacyHome />
            </PrivateRoute>
          ),
        },

        //Veterinary routes
        {
          path: "/veterinaryhome",
          element: (
            <PrivateRoute>
              <VeterinaryHome />
            </PrivateRoute>
          ),
        },
      ],
    },

    //public Routes
    { path: "/login", element: <Login /> },
  ]);

  return routes;
}
