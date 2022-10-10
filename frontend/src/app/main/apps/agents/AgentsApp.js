import { Outlet } from "react-router-dom";

import withReducer from "app/store/withReducer";
import reducer from "./store";

function AgentsApp(props) {
  return <Outlet />;
}

export default withReducer("agentsApp", reducer)(AgentsApp);
