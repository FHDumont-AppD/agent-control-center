import _ from "@lodash";
import { styled } from "@mui/material/styles";
import FusePageSimple from "src/@internal/core/FusePageSimple";
import { motion } from "framer-motion";
import Moment from "react-moment";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getItems,
  selectTasks,
  selectSearchText,
  setSearchText,
} from "./store/tasksSlice";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";

import { TablePagination, Typography } from "@mui/material";

import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";

import FuseLoading from "src/@internal/core/FuseLoading";
import { Link } from "react-router-dom";

import HeaderListTemplate from "../../../shared-components/HeaderListTemplate";

const Root = styled(FusePageSimple)(({ theme }) => ({
  "& .FusePageSimple-header": {
    backgroundColor: theme.palette.background.paper,
    borderBottomWidth: 1,
    borderStyle: "solid",
    borderColor: theme.palette.divider,
  },
  "& .FusePageSimple-toolbar": {},
  "& .FusePageSimple-content": {},
  "& .FusePageSimple-sidebarHeader": {},
  "& .FusePageSimple-sidebarContent": {},
}));

function TasksHome(props) {
  const dispatch = useDispatch();
  const searchText = useSelector(selectSearchText);
  const listAppdTasks = useSelector(selectTasks);
  const [listTasksFiltered, setListTasksFiltered] = useState(listAppdTasks);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  function refresh(force) {
    setLoading(true);
    dispatch(setSearchText(searchText));

    let filterTask = "undefined";

    if (tabValue == 0) {
      filterTask = "running";
    } else if (tabValue == 1) {
      filterTask = "pending";
    } else if (tabValue == 2) {
      filterTask = "error";
    } else if (tabValue == 3) {
      filterTask = "completed";
    } else if (tabValue == 4) {
      filterTask = "all";
    }

    if (force == undefined) {
      force = true;
    }

    dispatch(getItems(`${filterTask}`)).then(() => {
      setLoading(false);
    });
  }

  useEffect(() => {
    refresh(false);
    setRowsPerPage(5);
    setPage(0);
  }, [tabValue]);

  useEffect(() => {
    setPage(0);
    if (searchText != undefined && searchText.length !== 0) {
      setListTasksFiltered(
        _.filter(
          listAppdTasks,
          (item) =>
            item.application.applicationName
              .toLowerCase()
              .includes(searchText.toLowerCase()) ||
            item.application.tierName
              .toLowerCase()
              .includes(searchText.toLowerCase())
        )
      );
    } else {
      setListTasksFiltered(listAppdTasks);
    }
  }, [listAppdTasks, searchText]);

  function handleTabChange(event, value) {
    setTabValue(value);
  }

  function handleChangePage(event, value) {
    setPage(value);
  }

  function handleChangeRowsPerPage(event) {
    setRowsPerPage(event.target.value);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <FuseLoading />
      </div>
    );
  }

  return (
    <Root
      header={
        <HeaderListTemplate
          getItems={refresh}
          overrideRefresh={true}
          title="Tasks"
          setLoading={setLoading}
          searchText={searchText}
          setSearchText={setSearchText}
        />
      }
      content={
        <>
          <div className="flex-auto h-full w-full">
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              indicatorColor="secondary"
              textColor="secondary"
              variant="scrollable"
              scrollButtons="auto"
              classes={{ root: "w-full h-64 border-b-1" }}
            >
              <Tab className="h-64" label="RUNNING" />
              <Tab className="h-64" label="PENDING" />
              <Tab className="h-64" label="ERROR" />
              <Tab className="h-64" label="COMPLETED" />
              <Tab className="h-64" label="ALL" />
            </Tabs>

            {listTasksFiltered.length == 0 && (
              <div className="flex-auto p-24 sm:p-40">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { delay: 0.1 } }}
                  className="flex flex-1 items-center justify-center h-full"
                >
                  <Typography color="text.secondary" variant="h5">
                    There are no tasks!
                  </Typography>
                </motion.div>
              </div>
            )}
            <div className="flex-auto p-24 sm:p-40">
              {listTasksFiltered.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { delay: 0.1 } }}
                  className="flex-auto flex-1 items-center justify-center h-full w-full"
                >
                  <TableContainer component={Paper}>
                    <Table
                      sx={{ minWidth: 650 }}
                      stickyHeader
                      aria-label="sticky table"
                    >
                      <TableHead>
                        <TableRow>
                          <TableCell align="left">Application</TableCell>
                          <TableCell align="left">Started</TableCell>
                          <TableCell align="left">Tier</TableCell>
                          <TableCell align="left">Status</TableCell>
                          <TableCell align="center">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {listTasksFiltered &&
                          listTasksFiltered
                            .slice(
                              page * rowsPerPage,
                              page * rowsPerPage + rowsPerPage
                            )
                            .map((row) => (
                              <TableRow
                                hover
                                key={row.id}
                                sx={{
                                  "&:last-child td, &:last-child th": {
                                    border: 0,
                                  },
                                }}
                              >
                                <TableCell component="th" scope="row">
                                  {row.application.applicationName}
                                </TableCell>
                                <TableCell align="left">
                                  <Moment>
                                    {row.startedAt ? row.startedAt : ""}
                                  </Moment>
                                </TableCell>
                                <TableCell align="left">
                                  {row.application.tierName}
                                </TableCell>
                                <TableCell align="left">{row.status}</TableCell>
                                <TableCell align="center">
                                  <IconButton
                                    aria-label="edit"
                                    color="secondary"
                                    to={`/tasks/log/${row._id}`}
                                    component={Link}
                                  >
                                    <EditIcon />
                                  </IconButton>
                                </TableCell>
                              </TableRow>
                            ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <TablePagination
                    className="shrink-0 border-t-1"
                    component="div"
                    count={listTasksFiltered.length}
                    rowsPerPage={rowsPerPage}
                    rowsPerPageOptions={[5, 10, 25, 50, 100]}
                    page={page}
                    backIconButtonProps={{
                      "aria-label": "Previous Page",
                    }}
                    nextIconButtonProps={{
                      "aria-label": "Next Page",
                    }}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                  />
                </motion.div>
              )}
            </div>
          </div>
        </>
      }
      scroll="content"
    />
  );
}

export default TasksHome;
