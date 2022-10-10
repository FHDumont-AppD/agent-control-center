import _ from "@lodash";
import { styled } from "@mui/material/styles";
import FusePageSimple from "src/@internal/core/FusePageSimple";
import { motion } from "framer-motion";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getItems,
  selectAgents,
  selectSearchText,
  setSearchText,
} from "./store/agentsSlice";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import FuseSvgIcon from "src/@internal/core/FuseSvgIcon";
import Input from "@mui/material/Input";
import { FormControlLabel, Switch } from "@mui/material";
import { TablePagination, Typography } from "@mui/material";

import IconButton from "@mui/material/IconButton";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import UpdateIcon from "@mui/icons-material/Update";

import FuseLoading from "src/@internal/core/FuseLoading";
import { Link } from "react-router-dom";

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

function AgentsHome(props) {
  const dispatch = useDispatch();
  const searchText = useSelector(selectSearchText);
  const listAgents = useSelector(selectAgents);
  const [listAgentsFiltered, setListAgentsFiltered] = useState(listAgents);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(false);
  const [justUpgraded, setJustUpgraded] = useState(true);
  const [tabValue, setTabValue] = useState(0);

  function refresh(force, _justUpgraded) {
    setLoading(true);
    dispatch(setSearchText(searchText));

    let typeAgent = "app";
    if (tabValue == 1) {
      typeAgent = "machine";
    } else if (tabValue == 2) {
      typeAgent = "database";
    } else if (tabValue == 3) {
      typeAgent = "analytics";
    }

    if (force == undefined) {
      force = true;
    }

    dispatch(
      getItems(
        `?typeAgent=${typeAgent}&force=${force}&justUpgraded=${_justUpgraded}`
      )
    ).then(() => {
      setLoading(false);
    });
  }

  useEffect(() => {
    refresh(false, justUpgraded);
    setRowsPerPage(5);
    setPage(0);
  }, [tabValue]);

  useEffect(() => {
    setPage(0);
    if (searchText != undefined && searchText.length !== 0) {
      if (tabValue == 0) {
        setListAgentsFiltered(
          _.filter(
            listAgents,
            (item) =>
              item.applicationName
                .toLowerCase()
                .includes(searchText.toLowerCase()) ||
              item.componentName
                .toLowerCase()
                .includes(searchText.toLowerCase()) ||
              item.hostName.toLowerCase().includes(searchText.toLowerCase()) ||
              item.nodeName.toLowerCase().includes(searchText.toLowerCase()) ||
              item.agentVersion.toLowerCase().includes(searchText.toLowerCase())
          )
        );
      } else if (tabValue == 1) {
        setListAgentsFiltered(
          _.filter(
            listAgents,
            (item) =>
              (item.applicationNames != undefined &&
                item.applicationNames.some((value) =>
                  value.toLowerCase().includes(searchText.toLowerCase())
                )) ||
              item.hostName.toLowerCase().includes(searchText.toLowerCase()) ||
              item.agentVersion.toLowerCase().includes(searchText.toLowerCase())
          )
        );
      } else if (tabValue == 3) {
        setListAgentsFiltered(
          _.filter(
            listAgents,
            (item) =>
              item.name.toLowerCase().includes(searchText.toLowerCase()) ||
              item.hostName.toLowerCase().includes(searchText.toLowerCase()) ||
              `${item.majorVersion}.${item.minorVersion}.${item.pointRelease}`
                .toLowerCase()
                .includes(searchText.toLowerCase())
          )
        );
      } else {
        setListAgentsFiltered(listAgents);
      }
    } else {
      setListAgentsFiltered(listAgents);
    }
  }, [listAgents, searchText]);

  function handleTabChange(event, value) {
    setTabValue(value);
  }

  function handleChangePage(event, value) {
    setPage(value);
  }

  function handleChangeRowsPerPage(event) {
    setRowsPerPage(event.target.value);
  }

  function convertVersion(fullVersion) {
    // Examples
    // 4.5.0.0 compatible with 4.4.1.0
    // Server Agent #22.8.0.34104 v22.8.0 GA
    // Machine Agent v22.6.0-3386 GA compatible with 4.4.1.0 Build Date 2022-06-28 16:18:53

    if (fullVersion == undefined) return "";

    let shortVersion = fullVersion;
    let index = fullVersion.indexOf("compatible");
    if (index != -1) {
      shortVersion = fullVersion.substring(0, index - 1);
    }

    if (fullVersion.indexOf("Server Agent #") != -1) {
      shortVersion = fullVersion.substring(
        fullVersion.indexOf(" v") + 1,
        fullVersion.indexOf(" GA")
      );
    }

    if (fullVersion.indexOf("Machine Agent v") != -1) {
      shortVersion = fullVersion.substring(
        "Machine Agent v".length,
        fullVersion.indexOf(" GA")
      );
    }
    return shortVersion;
  }

  function shortName(fullName) {
    if (fullName != undefined && fullName.length > 20) {
      return fullName.substring(0, 20) + "...";
    } else {
      return fullName;
    }
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
        <div className="flex flex-col sm:flex-row flex-1 w-full items-center justify-between space-y-8 sm:space-y-0 py-28 px-28 md:px-32">
          <div className="flex flex-col sm:items-start space-y-8 sm:space-y-0 w-full sm:max-w-3xl min-w-0">
            <motion.div
              className="flex flex-col items-center sm:items-start min-w-0"
              initial={{ x: -20 }}
              animate={{ x: 0, transition: { delay: 0.3 } }}
            >
              <Typography
                component="h2"
                className="flex-1 text-3xl md:text-4xl font-extrabold tracking-tight leading-7 sm:leading-10 truncate mx-10"
              >
                Agents from AppDynamics
              </Typography>
            </motion.div>
          </div>
          <div className="flex">
            <Paper
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
              className="flex items-center w-full sm:max-w-300 space-x-8 px-16 rounded-full border-1 shadow-0"
            >
              <FuseSvgIcon color="disabled">heroicons-solid:search</FuseSvgIcon>
              <Input
                placeholder={"Search Agents"}
                className="flex flex-1 w-256"
                disableUnderline
                fullWidth
                inputProps={{
                  "aria-label": "Search",
                }}
                defaultValue={searchText}
                onChange={(ev) => dispatch(setSearchText(ev.target.value))}
              />
            </Paper>
            <FormControlLabel
              className="mx-4 mt-8 mb-16 w-full"
              label="Just upgraded"
              control={
                <Switch
                  onChange={(ev) => {
                    setJustUpgraded(!justUpgraded);
                    refresh(false, !justUpgraded);
                  }}
                  checked={justUpgraded}
                  name="justUpgraded"
                />
              }
            />
            <Button
              className="px-16 min-w-128 mx-4"
              variant="contained"
              color="secondary"
              startIcon={
                <FuseSvgIcon className="hidden sm:flex">
                  material-solid:refresh
                </FuseSvgIcon>
              }
              onClick={() => refresh(true, justUpgraded)}
            >
              Refresh
            </Button>
          </div>
        </div>
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
              <Tab className="h-64" label="App Server Agents" />
              {/* <Tab className="h-64" label="Machine Agents" />
              <Tab className="h-64" label="Database Agents" />
              <Tab className="h-64" label="Analytics Agents" /> */}
            </Tabs>

            {listAgentsFiltered.length == 0 && (
              <div className="flex-auto p-24 sm:p-40">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { delay: 0.1 } }}
                  className="flex flex-1 items-center justify-center h-full"
                >
                  <Typography color="text.secondary" variant="h5">
                    There are no agents!
                  </Typography>
                </motion.div>
              </div>
            )}

            <div
              className={tabValue !== 0 ? "hidden" : "flex-auto p-24 sm:p-40"}
            >
              {listAgentsFiltered.length > 0 && (
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
                          <TableCell align="left">Unique Host ID</TableCell>
                          <TableCell align="left">Version</TableCell>
                          <TableCell align="left">Application</TableCell>
                          <TableCell align="left">Tier</TableCell>
                          <TableCell align="left">Node</TableCell>
                          <TableCell align="left">Disabled</TableCell>
                          <TableCell align="center">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {listAgentsFiltered &&
                          listAgentsFiltered
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
                                  {shortName(row.hostName)}
                                </TableCell>
                                <TableCell align="left">
                                  {convertVersion(row.agentVersion)}
                                </TableCell>
                                <TableCell align="left">
                                  {row.applicationName}
                                </TableCell>
                                <TableCell align="left">
                                  {row.componentName}
                                </TableCell>
                                <TableCell align="left">
                                  {row.nodeName}
                                </TableCell>
                                <TableCell align="left">
                                  {row.disabled ? "TRUE" : "FALSE"}
                                </TableCell>
                                <TableCell align="center">
                                  <IconButton
                                    aria-label="history"
                                    color="secondary"
                                    to={`/agents/health/${row.applicationId}/${row.applicationComponentNodeId}`}
                                    component={Link}
                                  >
                                    <UpdateIcon />
                                  </IconButton>
                                  <IconButton
                                    aria-label="playbook"
                                    color="secondary"
                                    to={`/agents/${row.applicationId}/${row.applicationComponentNodeId}`}
                                    component={Link}
                                  >
                                    <PlayArrowIcon />
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
                    count={listAgentsFiltered.length}
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

            <div
              className={tabValue !== 1 ? "hidden" : "flex-auto p-24 sm:p-40"}
            >
              {listAgentsFiltered.length > 0 && (
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
                          <TableCell align="left">Unique Host ID</TableCell>
                          <TableCell align="left">Version</TableCell>
                          <TableCell align="left">Applications</TableCell>
                          <TableCell align="left">Enabled</TableCell>
                          <TableCell align="center">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {listAgentsFiltered &&
                          listAgentsFiltered
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
                                  {row.hostName}
                                </TableCell>
                                <TableCell align="left">
                                  {convertVersion(row.agentVersion)}
                                </TableCell>
                                <TableCell align="left">
                                  {row.applicationNames == ""
                                    ? "(no associated with any applications)"
                                    : row.applicationNames}
                                </TableCell>
                                <TableCell align="left">
                                  {row.enabled ? "TRUE" : "FALSE"}
                                </TableCell>
                                <TableCell align="center">
                                  <IconButton
                                    aria-label="history"
                                    color="secondary"
                                    to={`/agents/health/${row.applicationId}/${row.applicationComponentNodeId}`}
                                    component={Link}
                                  >
                                    <UpdateIcon />
                                  </IconButton>
                                  <IconButton
                                    aria-label="playbook"
                                    color="secondary"
                                    to={`/agents/${row.applicationId}/${row.applicationComponentNodeId}`}
                                    component={Link}
                                  >
                                    <PlayArrowIcon />
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
                    count={listAgentsFiltered.length}
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

            <div
              className={tabValue !== 2 ? "hidden" : "flex-auto p-24 sm:p-40"}
            >
              {listAgentsFiltered.length > 0 && (
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
                          <TableCell align="left">Unique Host ID</TableCell>
                          <TableCell align="left">Version</TableCell>
                          <TableCell align="left">Applications</TableCell>
                          <TableCell align="left">Enabled</TableCell>
                          <TableCell align="center">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {listAgentsFiltered &&
                          listAgentsFiltered
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
                                  {row.hostName}
                                </TableCell>
                                <TableCell align="left">
                                  {row.agentVersion}
                                </TableCell>
                                <TableCell align="left">
                                  {row.applicationNames == ""
                                    ? "(no associated with any applications)"
                                    : row.applicationNames}
                                </TableCell>
                                <TableCell align="left">
                                  {row.enabled ? "TRUE" : "FALSE"}
                                </TableCell>
                                <TableCell align="center">
                                  <IconButton
                                    aria-label="history"
                                    color="secondary"
                                    to={`/agents/health/${row.applicationId}/${row.applicationComponentNodeId}`}
                                    component={Link}
                                  >
                                    <UpdateIcon />
                                  </IconButton>
                                  <IconButton
                                    aria-label="playbook"
                                    color="secondary"
                                    to={`/agents/${row.applicationId}/${row.applicationComponentNodeId}`}
                                    component={Link}
                                  >
                                    <PlayArrowIcon />
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
                    count={listAgentsFiltered.length}
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

            <div
              className={tabValue !== 3 ? "hidden" : "flex-auto p-24 sm:p-40"}
            >
              {listAgentsFiltered.length > 0 && (
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
                          <TableCell align="left">Name</TableCell>
                          <TableCell align="left">Unique Host ID</TableCell>
                          <TableCell align="left">Version</TableCell>
                          <TableCell align="left">Last Connected</TableCell>
                          <TableCell align="left">
                            Log Pipeline Health
                          </TableCell>
                          <TableCell align="left">
                            Transaction Pipeline Health
                          </TableCell>
                          <TableCell align="center">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {listAgentsFiltered &&
                          listAgentsFiltered
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
                                  {row.name}
                                </TableCell>
                                <TableCell align="left">
                                  {row.hostName}
                                </TableCell>
                                <TableCell align="left">
                                  {row.majorVersion +
                                    "." +
                                    row.minorVersion +
                                    "." +
                                    row.pointRelease}
                                </TableCell>
                                <TableCell align="left">
                                  {row.lastConnectionTimestamp}
                                </TableCell>
                                <TableCell align="left">
                                  {row.logsHealthy == "true" ? "TRUE" : "FALSE"}
                                </TableCell>
                                <TableCell align="left">
                                  {row.bizTxnsHealthy == "true"
                                    ? "TRUE"
                                    : "FALSE"}
                                </TableCell>
                                <TableCell align="center">
                                  <IconButton
                                    aria-label="history"
                                    color="secondary"
                                    to={`/agents/health/${row.applicationId}/${row.applicationComponentNodeId}`}
                                    component={Link}
                                  >
                                    <UpdateIcon />
                                  </IconButton>
                                  <IconButton
                                    aria-label="playbook"
                                    color="secondary"
                                    to={`/agents/${row.applicationId}/${row.applicationComponentNodeId}`}
                                    component={Link}
                                  >
                                    <PlayArrowIcon />
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
                    count={listAgentsFiltered.length}
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

export default AgentsHome;
