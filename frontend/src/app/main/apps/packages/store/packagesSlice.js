import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import axios from "axios";

import { addItem, removeItem, updateItem } from "./packageSlice";

const apiURL = "/v1/packages";

export const getItems = createAsyncThunk(
  `${apiURL}/getItems`,
  async (params, { getState }) => {
    const response = await axios.get(`${apiURL}`);
    const data = await response.data.message;
    data.forEach((item) => {
      item.id = item._id;
    });
    return data;
  }
);

const packagesAdapter = createEntityAdapter({});

export const { selectAll: selectPackages } = packagesAdapter.getSelectors(
  (state) => state.packagesApp.packages
);

const packagesSlice = createSlice({
  name: "packagesApp/packages",
  initialState: packagesAdapter.getInitialState(null),
  reducers: {
    setSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: (event != undefined && event) || "" }),
    },
  },
  extraReducers: {
    [getItems.fulfilled]: packagesAdapter.setAll,
    [addItem.fulfilled]: packagesAdapter.addOne,
    [updateItem.fulfilled]: packagesAdapter.upsertOne,
    [removeItem.fulfilled]: (state, action) =>
      packagesAdapter.removeOne(state, action.payload),
  },
});

export const { setSearchText } = packagesSlice.actions;

export const selectSearchText = ({ packagesApp }) =>
  packagesApp.packages.searchText;

export default packagesSlice.reducer;
