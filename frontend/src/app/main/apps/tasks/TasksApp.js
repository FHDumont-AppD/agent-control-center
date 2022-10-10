import { Outlet } from "react-router-dom";

import withReducer from "app/store/withReducer";
import reducer from "./store";

function TasksApp(props) {
  return <Outlet />;
}

export default withReducer("tasksApp", reducer)(TasksApp);
