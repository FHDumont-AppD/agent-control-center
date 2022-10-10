import _ from "@lodash";
import { styled } from "@mui/material/styles";
import FusePageSimple from "src/@internal/core/FusePageSimple";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getLog, selectLog } from "./store/logSlice";
import TextareaAutosize from "@mui/base/TextareaAutosize";
import FuseSvgIcon from "src/@internal/core/FuseSvgIcon";
import Button from "@mui/material/Button";

import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";

import { Typography } from "@mui/material";

import FuseLoading from "src/@internal/core/FuseLoading";

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

function TasksLog(props) {
  const dispatch = useDispatch();
  const routeParams = useParams();
  const navigate = useNavigate();
  const logFile = useSelector(selectLog);
  const [loading, setLoading] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  function refresh(force) {
    setLoading(true);

    let filterLog = "undefined";

    if (tabValue == 0) {
      filterLog = "run";
    } else if (tabValue == 1) {
      filterLog = "error";
    }

    if (force == undefined) {
      force = true;
    }
    dispatch(
      getLog({
        id: routeParams.id,
        typeLog: filterLog,
      })
    ).then(() => {
      setLoading(false);
    });
  }

  useEffect(() => {
    refresh(false);
  }, [tabValue]);

  function handleTabChange(event, value) {
    setTabValue(value);
  }

  function goBack() {
    navigate("/tasks/");
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
        <div className="flex flex-col sm:flex-row flex-1 w-full items-center justify-between space-y-8 sm:space-y-0 py-24 px-24 md:px-32">
          <div className="flex flex-col sm:items-start space-y-8 sm:space-y-0 w-full sm:max-w-3xl min-w-0">
            <div className="flex items-center max-w-full">
              <motion.div
                className="flex flex-col items-center sm:items-start min-w-0"
                initial={{ x: -20 }}
                animate={{ x: 0, transition: { delay: 0.3 } }}
              >
                <Typography className="text-16 sm:text-20 truncate font-semibold">
                  Log File
                </Typography>
                <Typography variant="caption" className="font-medium">
                  Detail
                </Typography>
              </motion.div>
            </div>
          </div>
          <div>
            <motion.div
              className="flex"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0, transition: { delay: 0.3 } }}
            >
              <Button
                className="px-16 min-w-200 mx-4"
                variant="contained"
                color="primary"
                onClick={goBack}
                startIcon={
                  <FuseSvgIcon className="hidden sm:flex">
                    heroicons-outline:arrow-sm-left
                  </FuseSvgIcon>
                }
              >
                Back
              </Button>
              <Button
                className="px-16 min-w-200 mx-4"
                variant="contained"
                color="secondary"
                startIcon={
                  <FuseSvgIcon className="hidden sm:flex">
                    material-solid:refresh
                  </FuseSvgIcon>
                }
                onClick={refresh}
              >
                Refresh
              </Button>
            </motion.div>
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
              <Tab className="h-64" label="PROCESS" />
              <Tab className="h-64" label="ERROR" />
            </Tabs>

            {logFile == undefined && (
              <div className="flex-auto p-24 sm:p-40">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { delay: 0.1 } }}
                  className="flex flex-1 items-center justify-center h-full"
                >
                  <Typography color="text.secondary" variant="h5">
                    There are no Log File!
                  </Typography>
                </motion.div>
              </div>
            )}
            {logFile && (
              <div className="flex-auto p-24 sm:p-40">
                {/* <Typography
                  color="text.secondary"
                  variant="h5"
                  className="w-full"
                > */}
                {/* {logFile} */}
                {/* </Typography> */}
                <TextareaAutosize
                  aria-label="minimum height"
                  minRows={10}
                  defaultValue={logFile}
                  className="w-full"
                />
              </div>
            )}
          </div>
        </>
      }
      scroll="content"
    />
  );
}

export default TasksLog;
