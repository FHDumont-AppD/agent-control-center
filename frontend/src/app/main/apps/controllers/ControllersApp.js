import { Outlet } from "react-router-dom";

import withReducer from "app/store/withReducer";
import reducer from "./store";

function ControllersApp(props) {
  return <Outlet />;
}

export default withReducer("controllersApp", reducer)(ControllersApp);
