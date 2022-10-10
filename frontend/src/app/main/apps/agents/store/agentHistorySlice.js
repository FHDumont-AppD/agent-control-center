import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import axios from "axios";

const apiURL = "/v1/appd/health";

export const getHealth = createAsyncThunk(
  `${apiURL}/get`,
  async (params, { dispatch, getState }) => {
    try {
      const response = await axios.get(
        `${apiURL}/${params.applicationId}/${params.nodeId}/${params.interval}`
      );
      return await response.data.payload;
    } catch (error) {
      history.push({ pathname: `${history}` });
      return null;
    }
  }
);

export const selectHealth = ({ agentsApp }) => agentsApp.agentHistory;

const agentHistorySlice = createSlice({
  name: "agentsApp/history",
  initialState: null,
  reducers: {
    resetItem: () => null,
  },
  extraReducers: {
    [getHealth.pending]: (state, action) => null,
    [getHealth.fulfilled]: (state, action) => action.payload,
  },
});

export default agentHistorySlice.reducer;
