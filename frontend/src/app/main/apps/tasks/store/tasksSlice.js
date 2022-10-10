import {
  createAsyncThunk,
  createEntityAdapter,
  createSlice,
} from "@reduxjs/toolkit";
import axios from "axios";
import _ from "@lodash";

const apiURL = "/v1/tasks";

export const getItems = createAsyncThunk(
  `${apiURL}/getItems`,
  async (params, { getState }) => {
    const response = await axios.get(`${apiURL}/${params}`);
    const data = await response.data.payload;

    if (params != undefined && data != undefined) {
      let newArray = [];
      for (let index = 0; index < data.length; index++) {
        const element = data[index];
        element.id = element._id;
        newArray.push(element);
      }

      newArray = _.orderBy(newArray, ["startedAt"], ["desc"]);

      return newArray;
    } else {
      return data == undefined ? {} : data;
    }
  }
);

const tasksAdapter = createEntityAdapter({});

export const { selectAll: selectTasks } = tasksAdapter.getSelectors(
  (state) => state.tasksApp.tasks
);

const tasksSlice = createSlice({
  name: "tasksApp/tasks",
  initialState: tasksAdapter.getInitialState(null),
  reducers: {
    setSearchText: {
      reducer: (state, action) => {
        state.searchText = action.payload;
      },
      prepare: (event) => ({ payload: (event != undefined && event) || "" }),
    },
  },
  extraReducers: {
    [getItems.fulfilled]: tasksAdapter.setAll,
  },
});

export const { setSearchText } = tasksSlice.actions;

export const selectSearchText = ({ tasksApp }) => tasksApp.tasks.searchText;

export default tasksSlice.reducer;
