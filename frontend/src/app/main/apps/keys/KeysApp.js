import { Outlet } from "react-router-dom";

import withReducer from "app/store/withReducer";
import reducer from "./store";

function KeysApp(props) {
  return <Outlet />;
}

export default withReducer("keysApp", reducer)(KeysApp);
