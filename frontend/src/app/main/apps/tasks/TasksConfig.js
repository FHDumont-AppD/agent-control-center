import { lazy } from "react";
import TasksApp from "./TasksApp";

const TasksHome = lazy(() => import("./TasksHome"));
const TasksLog = lazy(() => import("./TasksLog"));

const TasksConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/tasks",
      element: <TasksApp />,
      children: [
        { path: "", element: <TasksHome /> },
        { path: "log/:id", element: <TasksLog /> },
      ],
    },
  ],
};

export default TasksConfig;
