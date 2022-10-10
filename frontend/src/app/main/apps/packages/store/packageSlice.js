import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import FuseUtils from "src/@internal/utils";
import axios from "axios";

const apiURL = "/v1/package";

export const getItem = createAsyncThunk(
  `${apiURL}/get`,
  async (id, { dispatch, getState }) => {
    try {
      const response = await axios.get(`${apiURL}/${id}`);
      const data = await response.data.message;
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
    return await response.data;
  }
);

export const updateItem = createAsyncThunk(
  `${apiURL}/update`,
  async (item, { dispatch, getState }) => {
    const response = await axios.put(`${apiURL}/${item.id}`, item);
    return await response.data;
  }
);

export const removeItem = createAsyncThunk(
  `${apiURL}/remove`,
  async (id, { dispatch, getState }) => {
    const response = await axios.delete(`${apiURL}/${id}`);
    return await response.data;
  }
);

export const newItem = createAsyncThunk(`${apiURL}/newItem`, async () => {
  return {
    name: "",
    controllerId: "none",
    type: "APM",
    machineId: "none",
    applicationName: "",
    tiers: [
      // {
      //   id: "1",
      //   tierName: "Principal Services",
      //   restartApp: true,
      //   tierType: "java",
      //   applicationServer: "tomcat",
      //   applicationServerConfigFile: "/opt/apache-tomcat-8.5.79/bin/setenv.sh",
      //   inventoryType: "file",
      //   inventory: "invs/dev/host",
      //   inventoryKeyId: "1",
      //   agentId: "1",
      // },
      // {
      //   id: "2",
      //   tierName: "A1",
      //   restartApp: true,
      //   tierType: "java",
      //   applicationServer: "tomcat",
      //   applicationServerConfigFile: "/opt/apache-tomcat-8.5.79/bin/setenv.sh",
      //   inventoryType: "file",
      //   inventory: "invs/dev/host",
      //   inventoryKeyId: "1",
      //   agentId: "1",
      // },
    ],
  };
});

export const selectPackage = ({ packagesApp }) => packagesApp.packageItem;

const packageSlice = createSlice({
  name: "packagesApp/package",
  initialState: null,
  reducers: {
    changeTier: {
      reducer: (state, action) => {
        state.packageItem = action.payload;
      },
    },
    resetItem: () => null,
  },
  extraReducers: {
    [getItem.pending]: (state, action) => null,
    [getItem.fulfilled]: (state, action) => action.payload,
    [newItem.pending]: (state, action) => null,
    [newItem.fulfilled]: (state, action) => action.payload,
    [updateItem.fulfilled]: (state, action) => action.payload,
    [removeItem.fulfilled]: (state, action) => null,
  },
});

export const { resetItem, changeTier } = packageSlice.actions;

export default packageSlice.reducer;
