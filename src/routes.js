import Dashboard from "layouts/dashboard";
import FundDashboard from "layouts/FundDashboard";

import Tables from "layouts/tables";
import BillingPrices from "layouts/billing copy";


import Profile from "layouts/profile";
import SignIn from "layouts/authentication/sign-in";

import Shop from "examples/Icons/Shop";
import Office from "examples/Icons/Office";
import Settings from "examples/Icons/Settings";
import Document from "examples/Icons/Document";
import SpaceShip from "examples/Icons/SpaceShip";
import CustomerSupport from "examples/Icons/CustomerSupport";
import CreditCard from "examples/Icons/CreditCard";

const routes = [
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    route: "/dashboard",
    icon: <Shop size="12px" />,
    component: <Dashboard />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Fund Dashboard",
    key: "FundDashboard",
    route: "/FundDashboard",
    icon: <Shop size="12px" />,
    component: <FundDashboard/>,
    noCollapse: true,
  },
  
  {
    type: "collapse",
    name: "Open Positions",
    key: "Open Positions",
    route: "/openPositions",
    icon: <Office size="12px" />,
    component: <Tables />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Prices",
    key: "Prices",
    route: "/Prices",
    icon: <CreditCard size="12px" />,
    component: <BillingPrices />,
    noCollapse: true,
  },
  { type: "title", title: "Account Pages", key: "account-pages" },
  {
    type: "collapse",
    name: "Profile",
    key: "profile",
    route: "/profile",
    icon: <CustomerSupport size="12px" />,
    component: <Profile />,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Sign In",
    key: "sign-in",
    route: "/authentication/sign-in",
    icon: <Document size="12px" />,
    component: <SignIn />,
    noCollapse: true,
  },
];

export default routes;