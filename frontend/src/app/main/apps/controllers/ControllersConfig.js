import { lazy } from "react";
import ControllersApp from "./ControllersApp";

const ControllerForm = lazy(() => import("./ControllerForm"));

const ControllersConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/controller",
      element: <ControllersApp />,
      children: [{ path: "", element: <ControllerForm /> }],
    },
  ],
};

export default ControllersConfig;
