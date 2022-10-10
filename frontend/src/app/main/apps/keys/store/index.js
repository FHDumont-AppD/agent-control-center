import { combineReducers } from "@reduxjs/toolkit";

import keys from "./keysSlice";
import key from "./keySlice";

const reducer = combineReducers({
  keys,
  key,
});

export default reducer;
