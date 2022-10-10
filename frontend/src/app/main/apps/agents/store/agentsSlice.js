import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import axios from "axios";
import _ from "@lodash";

const apiURL = "/v1/appd";

export const getItems = createAsyncThunk(
  `${apiURL}/agents`,
  async (params, { getState }) => {
    const response = await axios.get(
      `${apiURL}/agents${params == undefined ? "" : params}`
    );
    const responseAPI = await response.data.payload;
    const data =
      params.indexOf("?typeAgent=analytics&") != -1
        ? responseAPI
        : responseAPI.data;

    if (
      params != undefined &&
      data != undefined &&
      params.indexOf("?typeAgent=analytics&") == -1
    ) {
      let newArray = [];
      for (let index = 0; index < data.length; index++) {
        const element = data[index];
        if (params.indexOf("?typeAgent=app&") != -1) {
          element.id = element.agentId;
        } else if (params.indexOf("?typeAgent=machine&") != -1) {
          element.id = element.machineId;
        }
        newArray.push(element);
      }

      newArray = _.orderBy(
        newArray,
        ["applicationName", "componentName", "nodeName", "hostName"],
        ["asc"]
      );

      return newArray;
    } else {
      return data == undefined ? {} : data;
    }
  }
);

export const login = createAsyncThunk(
  `${apiURL}/login`,
  async (params, { getState }) => {
    const response = await axios.post(`${apiURL}/login`, params);
    const data = await response.data;
    localStorage.setItem("access_token", data.payload);
    localStorage.setItem("signIn", data.payload);
    return data;
  }
);

const agentsAdapter = createEntityAdapter({});

export const { selectAll: selectAgents } = agentsAdapter.getSelectors(
  (state) => state.agentsApp.agents
);

const agentsSlice = createSlice({
  name: "agentsApp/agents",
  initialState: agentsAdapter.getInitialState(null),
  reducers: {
    setSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: (event != undefined && event) || "" }),
    },
  },
  extraReducers: {
    [getItems.fulfilled]: agentsAdapter.setAll,
  },
});

export const { setSearchText } = agentsSlice.actions;

export const selectSearchText = ({ agentsApp }) => agentsApp.agents.searchText;

export default agentsSlice.reducer;
