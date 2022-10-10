import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const apiURL = "/v1/controller";

export const getItem = createAsyncThunk(
  `${apiURL}/get`,
  async (controller, { dispatch, getState }) => {
    try {
      const response = await axios.post(`${apiURL}/get`, controller);
      return await response.data.payload;
    } catch (error) {
      history.push({ pathname: `${history}` });
      return null;
    }
  }
);

export const addItem = createAsyncThunk(
  `${apiURL}/add`,
  async (item, { dispatch, getState }) => {
    const response = await axios.post(`${apiURL}`, item);
    return await response.data.payload;
  }
);

export const updateItem = createAsyncThunk(
  `${apiURL}/update`,
  async (item, { dispatch, getState }) => {
    const response = await axios.put(`${apiURL}/${item._id}`, item);
    return await response.data.payload;
  }
);

export const selectController = ({ controllersApp }) =>
  controllersApp.controller;

const controllerSlice = createSlice({
  name: "controllersApp/controller",
  initialState: null,
  reducers: {
    resetItem: () => null,
    newItem: {
      reducer: (state, action) => action.payload,
      prepare: (event) => ({
        payload: {
          accountAccessKey: "",
          globalAnalyticsAccountName: "",
        },
      }),
    },
  },
  extraReducers: {
    [getItem.pending]: (state, action) => null,
    [getItem.fulfilled]: (state, action) => action.payload,
  },
});

export const { newItem, resetItem } = controllerSlice.actions;

export default controllerSlice.reducer;
