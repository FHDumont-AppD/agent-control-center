import { lazy } from "react";
import PackageApp from "./PackagesApp";

const PackagesHome = lazy(() => import("./PackagesHome"));
const PackageForm = lazy(() => import("./PackageForm"));

const PackagesConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/packages/setup",
      element: <PackageApp />,
      children: [
        { path: "", element: <PackagesHome /> },
        { path: ":id", element: <PackageForm /> },
      ],
    },
    {
      path: "/packages/run",
      element: <PackageApp />,
      children: [
        { path: "", element: <PackagesHome /> },
        { path: ":id", element: <PackageForm /> },
      ],
    },
  ],
};

export default PackagesConfig;
