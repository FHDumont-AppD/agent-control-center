import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import axios from "axios";

const apiURL = "/v1/appd/download";

export const getAgentVersions = createAsyncThunk(
  `${apiURL}/getAgentVersions`,
  async (params, { dispatch, getState }) => {
    const response = await axios.get(
      `${apiURL}/getAgentVersions/${params.latest}`
    );
    return await response.data.payload;
  }
);

export const selectAgentVersions = ({ agentsApp }) => agentsApp.version;

const agentVersionSlice = createSlice({
  name: "agentVersion",
  initialState: null,
  reducers: {
    resetItem: () => null,
  },
  extraReducers: {
    [getAgentVersions.pending]: (state, action) => null,
    [getAgentVersions.fulfilled]: (state, action) => action.payload,
  },
});

export default agentVersionSlice.reducer;
