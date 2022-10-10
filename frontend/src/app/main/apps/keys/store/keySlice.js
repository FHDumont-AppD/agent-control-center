import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const apiURL = "/v1/key";

export const getItem = createAsyncThunk(
  `${apiURL}/get`,
  async (id, { dispatch, getState }) => {
    try {
      const response = await axios.get(`${apiURL}/${id}`);
      let data = await response.data.payload;
      data.id = data._id;
      return data;
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
    const response = await axios.put(`${apiURL}/${item.id}`, item);
    return await response.data.payload;
  }
);

export const removeItem = createAsyncThunk(
  `${apiURL}/remove`,
  async (id, { dispatch, getState }) => {
    const response = await axios.delete(`${apiURL}/${id}`);
    return await response.data.payload;
  }
);

export const selectKey = ({ keysApp }) => keysApp.key;

const keySlice = createSlice({
  name: "keyApp/key",
  initialState: null,
  reducers: {
    resetItem: () => null,
    newItem: {
      reducer: (state, action) => action.payload,
      prepare: (event) => ({
        payload: {
          // id: FuseUtils.generateGUID(),
          name: "",
          type: "none",
          userName: "",
          password: "",
          privateKey: "",
          token: "",
        },
      }),
    },
  },
  extraReducers: {
    [getItem.pending]: (state, action) => null,
    [getItem.fulfilled]: (state, action) => action.payload,
    [updateItem.fulfilled]: (state, action) => action.payload,
    [removeItem.fulfilled]: (state, action) => null,
  },
});

export const { newItem, resetItem } = keySlice.actions;

export default keySlice.reducer;
