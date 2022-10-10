import { combineReducers } from "@reduxjs/toolkit";

import agents from "./agentsSlice";
import agent from "./agentSlice";
import agentHistory from "./agentHistorySlice";
import version from "./agentVersionSlice";

const reducer = combineReducers({
  agents,
  agent,
  agentHistory,
  version,
});

export default reducer;
