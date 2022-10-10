import { combineReducers } from "@reduxjs/toolkit";

import packages from "./packagesSlice";
import packageItem from "./packageSlice";

const reducer = combineReducers({
  packages,
  packageItem,
});

export default reducer;
