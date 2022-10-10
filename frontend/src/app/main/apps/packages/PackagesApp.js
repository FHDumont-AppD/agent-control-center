import { Outlet } from "react-router-dom";

import withReducer from "app/store/withReducer";
import reducer from "./store";

function PackagesApp(props) {
  return <Outlet />;
}

export default withReducer("packagesApp", reducer)(PackagesApp);
