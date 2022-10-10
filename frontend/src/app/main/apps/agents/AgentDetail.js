import _ from "@lodash";

import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import { Typography } from "@mui/material";
import Moment from "react-moment";

const Root = styled(Paper)(({ theme }) => ({
  background: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
}));

function AgentDetail(props) {
  const { agentDetail, canUpgrade, findIp, source } = props;

  function _findIp(values) {
    if (findIp) {
      return findIp(values);
    }

    let detail = getSource();

    let ip = _.filter(values, (item) =>
      item.name.toLowerCase().includes("appdynamics.ip.addresses")
    );

    if (ip != undefined && ip.length > 0) {
      ip = ip[0];

      if (ip.value.indexOf(",") != -1) {
        return ip.value.substring(ip.value.indexOf(",") + 1, ip.value.length);
      } else {
        return ip.value;
      }
    } else {
      return "not found";
    }
  }

  function _canUpgrade() {
    if (canUpgrade) {
      return canUpgrade();
    }

    return true;
  }

  function getSource() {
    let detail = {};
    if (source == "health") {
      detail = agentDetail.agentDetail;
    } else if (source == "update") {
      detail = agentDetail;
    }
    return detail;
  }

  function checkValue(key) {
    try {
      let detail = getSource();

      if (key == "applicationName") {
        return detail.application.name;
      } else if (key == "nodeName") {
        return detail.applicationComponent.name;
      } else if (key == "tierName") {
        return detail.applicationComponentNode.name;
      } else if (key == "machineName") {
        return detail.applicationComponentNode.machineName;
      } else if (key == "machineOSType") {
        return detail.applicationComponentNode.machineOSType.name;
      } else if (key == "ipAddress") {
        return detail.applicationComponentNode.metaInfo;
      } else if (key == "agentVersion") {
        return detail.applicationComponentNode.appAgent.agentVersion;
      } else if (key == "latestAgentRuntime") {
        return detail.applicationComponentNode.appAgent.latestAgentRuntime;
      } else if (key == "installDir") {
        return detail.applicationComponentNode.appAgent.installDir;
      } else if (key == "lastStartTime") {
        return detail.applicationComponentNode.appAgent.lastStartTime;
      }
    } catch (error) {
      return "N/A";
    }
  }

  return (
    <Root>
      <div className="p-16 sm:p-24 mt-24">
        <Typography className="flex items-center mt-8 ">
          <span className="whitespace-nowrap leading-none w-200">
            <i>Application</i>
          </span>
          <span className="whitespace-nowrap leading-none">
            {checkValue("applicationName")}
          </span>
        </Typography>
        <Typography className="flex items-center mt-12">
          <span className="whitespace-nowrap leading-none w-200">
            <i>Tier</i>
          </span>
          <span className="whitespace-nowrap leading-none">
            {checkValue("tierName")}
          </span>
        </Typography>
        <Typography className="flex items-center mt-12">
          <span className="whitespace-nowrap leading-none w-200">
            <i>Node</i>
          </span>
          <span className="whitespace-nowrap leading-none">
            {checkValue("nodeName")}
          </span>
        </Typography>
        <Typography className="flex items-center mt-12">
          <span className="whitespace-nowrap leading-none w-200">
            <i>Machine Name</i>
          </span>
          <span className="whitespace-nowrap leading-none">
            {checkValue("machineName")} [ {checkValue("machineOSType")} ]
          </span>
        </Typography>
        {_canUpgrade() && [
          <Typography key="ty1" className="flex items-center mt-12">
            <span className="whitespace-nowrap leading-none w-200">
              <i>AppDynamics IP Address</i>
            </span>
            <span className="whitespace-nowrap leading-none">
              {_findIp(checkValue("ipAddress"))}
            </span>
          </Typography>,
          <Typography key="ty2" className="flex items-center mt-12">
            <span className="whitespace-nowrap leading-none w-200">
              <i>Current Version</i>
            </span>
            <span className="leading-none">{checkValue("agentVersion")}</span>
          </Typography>,
          <Typography key="ty3" className="flex items-center mt-12">
            <span className="whitespace-nowrap leading-none w-200">
              <i>Latest Agent Runtime</i>
            </span>
            <span className="whitespace-nowrap leading-none">
              {checkValue("latestAgentRuntime")}
            </span>
          </Typography>,
          <Typography key="ty4" className="flex items-center mt-12">
            <span className="whitespace-nowrap leading-none w-200">
              <i>Install Directory</i>
            </span>
            <span className="whitespace-nowrap leading-none">
              {checkValue("installDir")}
            </span>
          </Typography>,
          <Typography key="ty5" className="flex items-center mt-12">
            <span className="whitespace-nowrap leading-none w-200">
              <i>Last Start Time</i>
            </span>
            <span className="whitespace-nowrap leading-none">
              <Moment>{checkValue("lastStartTime")}</Moment>
            </span>
          </Typography>,
        ]}
      </div>
    </Root>
  );
}

export default AgentDetail;
