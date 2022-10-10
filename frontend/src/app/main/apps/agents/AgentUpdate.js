import _ from "@lodash";

import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { FormProvider, useForm, Controller } from "react-hook-form";

import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";

import { useDeepCompareEffect } from "src/@internal/hooks";
import { useEffect, useState } from "react";

import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import FusePageCarded from "src/@internal/core/FusePageCarded";
import { Alert, AlertTitle, FormControl, InputLabel } from "@mui/material";
import FuseLoading from "src/@internal/core/FuseLoading";
import {
  selectAgent,
  getItem,
  resetItem,
  createTask,
} from "./store/agentSlice";

import { selectKeys, getItems as getKeys } from "../keys/store/keysSlice";

import HeaderFormTemplate from "../../../shared-components/HeaderFormTemplate";
import AgentDetail from "./AgentDetail";
import {
  getAgentVersions,
  selectAgentVersions,
} from "./store/agentVersionSlice";

const schema = yup.object().shape({});

function AgentUpdate(props) {
  const dispatch = useDispatch();
  const routeParams = useParams();
  const agentItem = useSelector(selectAgent);
  const agentVersions = useSelector(selectAgentVersions);
  const keys = useSelector(selectKeys);
  const [loading, setLoading] = useState(false);
  const [componentType, setComponentType] = useState("");
  const [listAgentFiltered, setListAgentFiltered] = useState(agentVersions);

  const methods = useForm({
    mode: "onChange",
    resolver: yupResolver(schema),
  });
  const { control, formState, watch, reset } = methods;
  const { errors } = formState;

  const form = watch();

  useEffect(() => {
    dispatch(getKeys());
  }, []);

  useDeepCompareEffect(() => {
    function updateItemState() {
      dispatch(getAgentVersions({ latest: false })).then((resultAgent) => {
        dispatch(
          getItem({
            applicationId: routeParams.applicationId,
            applicationComponentNodeId: routeParams.applicationComponentNodeId,
          })
        ).then((result) => {
          let componentType =
            result.payload.applicationComponentNode.componentType.productType;
          let agentType = result.payload.applicationComponentNode.appAgent.type;
          let agentRuntime =
            result.payload.applicationComponentNode.appAgent.latestAgentRuntime;

          setComponentType(componentType);

          if (agentType == "APP_AGENT") {
            if (
              agentRuntime.toUpperCase().indexOf("JDK") != -1 ||
              agentRuntime.toUpperCase().indexOf("JRE") != -1 ||
              agentRuntime.toUpperCase().indexOf("JAVA") != -1
            ) {
              setListAgentFiltered(
                _.filter(resultAgent.payload[0].agents, (item) =>
                  item.agentType.toLowerCase().includes("jdk8_plus")
                )[0]
              );
            }
          } else {
            setListAgentFiltered([]);
          }
        });
      });
    }
    updateItemState();
  }, [dispatch, routeParams]);

  useEffect(() => {
    reset({ ...agentItem });
  }, [agentItem, reset]);

  useEffect(() => {
    return () => {
      dispatch(resetItem());
    };
  }, [dispatch]);

  function parseFields(values) {
    let key = _.filter(keys, (item) => item.id == values.keyId)[0];
    if (!key) {
      key = { type: "", userName: "", password: "", privateKey: "" };
    }

    let agent = _.filter(
      listAgentFiltered.descriptions,
      (item) => item.version == values.agentVersion
    )[0];

    let serverAddress = values.newServerAddress;
    if (values.newServerAddress && values.newServerAddress != "") {
      serverAddress = values.newServerAddress;
    } else {
      serverAddress = findIp(values.applicationComponentNode.metaInfo);
    }

    let task = {
      application: {
        applicationId: values.application.id,
        tierId: values.applicationComponent.id,
        nodeId: values.applicationComponentNode.id,
        agentId: values.applicationComponentNode.appAgent.id,
        applicationName: values.application.name,
        tierName: values.applicationComponent.name,
        nodeName: values.applicationComponentNode.name,
      },
      environment: {
        hostName: values.applicationComponentNode.machineName,
        ipAddress: serverAddress,
        machineOSType: values.applicationComponentNode.machineOSType.name,
      },
      controller: {
        controller: localStorage.getItem("controller"),
      },
      agent: {
        type: isAgentIntalller() ? "zfi" : "legacy",
        subType: "jdk8_plus",
        version: agent.version,
        s3Path: agent.s3Path,
      },
      key: {
        type: key.type,
        userName: key.userName,
        password: key.password,
        privateKey: key.privateKey,
      },
    };

    return task;
  }

  function findIp(values) {
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

  function isAgentIntalller() {
    try {
      return (
        agentItem.applicationComponentNode.appAgent.installDir.indexOf(
          "zeroagent"
        ) != -1
      );
    } catch (error) {
      return false;
    }
  }

  function canUpgrade() {
    if (componentType && componentType != "open-telemetry") {
      return true;
    } else {
      return false;
    }
  }

  if (_.isEmpty(form) || !agentItem || loading) {
    return <FuseLoading />;
  }

  return (
    <FormProvider {...methods}>
      <FusePageCarded
        header={
          <HeaderFormTemplate
            title="Update Agent"
            titleSaved="Process to update the Agent started!"
            goBackURL="/agents"
            updateItem={createTask}
            parseFields={parseFields}
            setLoadingForm={setLoading}
            titleBTSave="Create Task"
          />
        }
        content={
          <>
            <div className="p-16 sm:p-24 ">
              {agentItem && (
                <AgentDetail
                  agentDetail={agentItem}
                  canUpgrade={canUpgrade}
                  findIp={findIp}
                  source="update"
                />
              )}

              {!canUpgrade() && (
                <Alert severity="info" className="mt-24">
                  <AlertTitle>INFO</AlertTitle>
                  OTEL-type agents cannot be updated remotely.
                </Alert>
              )}

              {/* {isAgentIntalller() && (
                <Alert severity="info" className="mt-24">
                  <AlertTitle>INFO</AlertTitle>
                  The Agent Install is not supported yet, in progress.
                </Alert>
              )} */}

              {canUpgrade() && (
                <FormControl fullWidth>
                  <Controller
                    name="agentVersion"
                    control={control}
                    render={({ field }) => (
                      <FormControl className="mt-24 w-full">
                        <InputLabel id="agent-id-label">
                          New Agent Version
                        </InputLabel>
                        {listAgentFiltered && (
                          <Select
                            {...field}
                            id="agentVersion"
                            labelId="agent-id-label"
                            label="New Agent Version"
                            required
                            variant="outlined"
                          >
                            <MenuItem key="none" value="none">
                              <em>Select an agent</em>
                            </MenuItem>
                            {listAgentFiltered &&
                              listAgentFiltered.descriptions &&
                              listAgentFiltered.descriptions.map((row) => (
                                <MenuItem key={row.version} value={row.version}>
                                  {row.version}
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                      </FormControl>
                    )}
                  />
                </FormControl>
              )}

              {canUpgrade() && !isAgentIntalller() && (
                <FormControl fullWidth>
                  <Controller
                    name="keyId"
                    control={control}
                    render={({ field }) => (
                      <FormControl className="mt-24 w-full">
                        <InputLabel id="agent-id-label">
                          Server Access
                        </InputLabel>
                        {keys && (
                          <Select
                            {...field}
                            id="keyId"
                            labelId="agent-id-label"
                            label="New Agent Version"
                            required
                            variant="outlined"
                            // error={!!errors.agentId}
                          >
                            <MenuItem key="none" value="none">
                              <em>Select an key</em>
                            </MenuItem>
                            {keys &&
                              keys.map((row) => (
                                <MenuItem key={row.id} value={row.id}>
                                  {row.name} [ {row.type} ]
                                </MenuItem>
                              ))}
                          </Select>
                        )}
                      </FormControl>
                    )}
                  />

                  <Controller
                    name="newServerAddress"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        id="newServerAddress"
                        label="New Host Address (optional)"
                        placeholder="New Host Address (optional)"
                        className="mt-8 mb-16 w-full"
                        variant="outlined"
                        error={!!errors.userName}
                        helperText={errors?.userName?.message}
                      />
                    )}
                  />
                </FormControl>
              )}
            </div>
          </>
        }
      />
    </FormProvider>
  );
}

export default AgentUpdate;
