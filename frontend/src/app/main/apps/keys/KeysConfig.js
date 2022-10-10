import { lazy } from "react";
import KeysApp from "./KeysApp";

const KeysHome = lazy(() => import("./KeysHome"));
const KeyForm = lazy(() => import("./KeyForm"));

const KeysConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/keys",
      element: <KeysApp />,
      children: [
        { path: "", element: <KeysHome /> },
        { path: ":id", element: <KeyForm /> },
      ],
    },
  ],
};

export default KeysConfig;
