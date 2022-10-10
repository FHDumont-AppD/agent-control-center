import { combineReducers } from "@reduxjs/toolkit";

import controller from "./controllerSlice";

const reducer = combineReducers({
  controller,
});

export default reducer;
