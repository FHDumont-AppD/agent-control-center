import { lazy } from "react";
import AgentsApp from "./AgentsApp";

const AgentsHome = lazy(() => import("./AgentsHome"));
const AgentUpdate = lazy(() => import("./AgentUpdate"));
const AgentHealth = lazy(() => import("./AgentHealth"));

const AgentsConfig = {
  settings: {
    layout: {
      config: {},
    },
  },
  routes: [
    {
      path: "/agents",
      element: <AgentsApp />,
      children: [
        { path: "", element: <AgentsHome /> },
        {
          path: ":applicationId/:applicationComponentNodeId",
          element: <AgentUpdate />,
        },
        {
          path: "health/:applicationId/:nodeId",
          element: <AgentHealth />,
        },
      ],
    },
  ],
};

export default AgentsConfig;
