import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const apiURL = "/v1/task";

export const getLog = createAsyncThunk(
  `${apiURL}/getLog`,
  async (params, { dispatch, getState }) => {
    try {
      const response = await axios.get(
        `${apiURL}/log/${params.id}/${params.typeLog}`
      );
      return await response.data.payload;
    } catch (error) {
      history.push({ pathname: `${history}` });
      return null;
    }
  }
);
export const selectLog = ({ tasksApp }) => tasksApp.log;

const appdLogSlice = createSlice({
  name: "logApp/agent",
  initialState: null,
  reducers: {
    resetItem: () => null,
  },
  extraReducers: {
    [getLog.pending]: (state, action) => null,
    [getLog.fulfilled]: (state, action) => action.payload,
  },
});

export default appdLogSlice.reducer;
