import { combineReducers } from "@reduxjs/toolkit";

import tasks from "./tasksSlice";
import log from "./logSlice";

const reducer = combineReducers({
  tasks,
  log,
});

export default reducer;
