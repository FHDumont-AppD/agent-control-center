import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import axios from "axios";

import { addItem, removeItem, updateItem } from "./keySlice";

const apiURL = "/v1/keys";

export const getItems = createAsyncThunk(
  `${apiURL}/getItems`,
  async (params, { getState }) => {
    const response = await axios.get(`${apiURL}`);
    const data = await response.data.payload;
    data.forEach((item) => {
      item.id = item._id;
    });
    return data;
  }
);

const keysAdapter = createEntityAdapter({});

export const { selectAll: selectKeys } = keysAdapter.getSelectors(
  (state) => state.keysApp.keys
);

const keysSlice = createSlice({
  name: "keysApp/keys",
  initialState: keysAdapter.getInitialState(null),
  reducers: {
    setSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: (event != undefined && event) || "" }),
    },
  },
  extraReducers: {
    [getItems.fulfilled]: keysAdapter.setAll,
    [addItem.fulfilled]: keysAdapter.addOne,
    [updateItem.fulfilled]: keysAdapter.upsertOne,
    [removeItem.fulfilled]: (state, action) =>
      keysAdapter.removeOne(state, action.payload),
  },
});

export const { setSearchText } = keysSlice.actions;

export const selectSearchText = ({ keysApp: keysApp }) =>
  keysApp.keys.searchText;

export default keysSlice.reducer;
