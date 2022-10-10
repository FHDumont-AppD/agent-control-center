import _ from "@lodash";

import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";

import { useEffect, useState } from "react";

import FuseLoading from "src/@internal/core/FuseLoading";

import { getHealth, selectHealth } from "./store/agentHistorySlice";
import FusePageSimple from "src/@internal/core/FusePageSimple";
import { Button, Typography } from "@mui/material";
import FuseSvgIcon from "src/@internal/core/FuseSvgIcon";
import AgentDetail from "./AgentDetail";
import AgentHealthGraphic from "./AgentHealthGraphic";

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

function AgentHealth(props) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const routeParams = useParams();
  const agentHealth = useSelector(selectHealth);
  const [loading, setLoading] = useState(false);
  const [interval, setInterval] = useState(60);

  useEffect(() => {
    refresh();
  }, [interval]);

  function refresh() {
    setLoading(true);

    dispatch(
      getHealth({
        applicationId: routeParams.applicationId,
        nodeId: routeParams.nodeId,
        interval: interval,
      })
    ).then((result) => {
      setLoading(false);
    });
  }

  function goBack() {
    navigate("/agents");
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  if (loading) {
    return <FuseLoading />;
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
                  Agent Health Check History
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
            {agentHealth != undefined && (
              <AgentDetail agentDetail={agentHealth} source="health" />
            )}
            {agentHealth && (
              <AgentHealthGraphic
                agentHealth={agentHealth}
                interval={interval}
                setInterval={setInterval}
              />
            )}
          </div>
        </>
      }
    />
  );
}

export default AgentHealth;
