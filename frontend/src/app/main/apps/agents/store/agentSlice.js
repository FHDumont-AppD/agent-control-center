import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import FuseUtils from "src/@internal/utils";
import axios from "axios";

const apiURL = "/v1/appd/agent";

export const getItem = createAsyncThunk(
  `${apiURL}/get`,
  async (params, { dispatch, getState }) => {
    try {
      const response = await axios.get(
        `${apiURL}/${params.applicationId}/${params.applicationComponentNodeId}`
      );
      let payload = await response.data.payload;
      payload.agentVersion = "none";
      payload.keyId = "none";
      payload.newServerAddress = "";
      return payload;
    } catch (error) {
      history.push({ pathname: `${history}` });
      return null;
    }
  }
);

export const createTask = createAsyncThunk(
  `${apiURL}/add`,
  async (item, { dispatch, getState }) => {
    const response = await axios.post(`/v1/task/createTask`, item);
    return await response.data.payload;
  }
);

export const selectAgent = ({ agentsApp }) => agentsApp.agent;

const agentSlice = createSlice({
  name: "agentApp/agent",
  initialState: null,
  reducers: {
    resetItem: () => null,
  },
  extraReducers: {
    [getItem.pending]: (state, action) => null,
    [getItem.fulfilled]: (state, action) => action.payload,
  },
});

export const { resetItem, changeTier } = agentSlice.actions;

export default agentSlice.reducer;
