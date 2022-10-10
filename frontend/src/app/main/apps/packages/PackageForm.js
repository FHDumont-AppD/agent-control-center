import _ from "@lodash";
import { styled } from "@mui/material/styles";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { FormProvider, useForm, Controller } from "react-hook-form";
import { motion } from "framer-motion";

import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";

import FuseUtils from "src/@internal/utils";
import FuseSvgIcon from "src/@internal/core/FuseSvgIcon";

import Paper from "@mui/material/Paper";

import { useDeepCompareEffect } from "src/@internal/hooks";
import { useEffect, useState } from "react";

import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import FusePageCarded from "src/@internal/core/FusePageCarded";
import {
  Alert,
  AlertTitle,
  Button,
  FormControl,
  InputLabel,
  Typography,
} from "@mui/material";
import FuseLoading from "src/@internal/core/FuseLoading";
import {
  selectPackage,
  getItem,
  newItem,
  addItem,
  updateItem,
  resetItem,
  changeItem,
  changeTier,
} from "./store/packageSlice";

import HeaderFormTemplate from "../../../shared-components/HeaderFormTemplate";
import { selectKeys, getItems as getKeys } from "../setup/keys/store/keysSlice";
// import {
//   selectControllers,
//   getItems as getControllers,
// } from "../setup/controllers/store/controllersSlice";
import {
  selectAgents,
  getItems as getAgents,
} from "../setup/agents/store/agentsSlice";
import FusePageSimple from "src/@internal/core/FusePageSimple";
import TierCard from "./TierCard";

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

const schema = yup.object().shape({
  // name: yup.string().required("You must enter a Package name"),
  // controllerId: yup
  //   .mixed()
  //   .oneOf(["none"])
  //   .required("You must choose a Controller"),
  // applicationName: yup.string().required("You must enter an Application Name"),
});

function PackageForm(props) {
  const dispatch = useDispatch();
  const routeParams = useParams();
  const packageItem = useSelector(selectPackage);
  const keys = useSelector(selectKeys);
  const controllers = undefined; // useSelector(selectControllers);
  const agents = useSelector(selectAgents);
  const [loading, setLoading] = useState(false);

  const [listMachineAgent, setListMachineAgent] = useState(agents);
  const [tiers, setTiers] = useState([]);
  const [typeWatchBefore, setTypeWatchBefore] = useState(undefined);

  const methods = useForm({
    mode: "all",
    resolver: yupResolver(schema),
  });
  const { control, formState, getValues, watch, reset } = methods;
  const { errors } = formState;

  const form = watch();
  const typeWatch = watch("type");

  useEffect(() => {
    dispatch(getKeys());
    dispatch(getControllers());
    dispatch(getAgents());
  }, []);

  useDeepCompareEffect(() => {
    function updateItemState() {
      if (routeParams.id === "new") {
        dispatch(newItem()).then((result) => {
          setTiers(_.sortBy(result.payload.tiers, "tierName"));
        });
      } else {
        dispatch(getItem(routeParams.id)).then((result) => {
          setTiers(_.sortBy(result.payload.tiers, "tierName"));
        });
      }
    }
    updateItemState();
  }, [dispatch, routeParams]);

  useEffect(() => {
    if (agents.length > 0) {
      setListMachineAgent(
        _.filter(agents, (item) =>
          item.typeCode.toLowerCase().includes("machine")
        )
      );
    } else {
      setListMachineAgent(agents);
    }
  }, [agents]);

  useEffect(() => {
    if (typeWatchBefore == undefined) {
      setTypeWatchBefore(typeWatch);
    } else {
      if (typeWatchBefore != typeWatch) {
        setTypeWatchBefore(typeWatch);
        setTiers([]);
      }
    }
  }, [typeWatch]);

  function parseFields(values) {
    values.tiers = tiers;
    return values;
  }

  useEffect(() => {
    reset({ ...packageItem });
  }, [packageItem, reset]);

  useEffect(() => {
    return () => {
      dispatch(resetItem());
    };
  }, [dispatch]);

  function changeTier(tier) {
    let tiersWithout = tiers.filter((item) => item.id !== tier.id);
    if (tier.id == "new") {
      tier.id = FuseUtils.generateGUID();
    }
    tiersWithout.push(tier);
    setTiers(_.sortBy(tiersWithout, "tierName"));
  }

  function deleteTier(tier) {
    let tiersWithout = tiers.filter((item) => item.id !== tier.id);
    setTiers(_.sortBy(tiersWithout, "tierName"));
  }

  function addTier() {
    let tier = {
      id: "new",
      tierName: "",
      restartApp: true,
      tierType: typeWatch == "APM" ? "java" : "machine",
      applicationServer: "none",
      applicationServerConfigFile: "",
      inventoryType: "file",
      inventory: "",
      inventoryKeyId: "",
      agentId: "",
    };
    let tiersWithout = tiers.filter((item) => item.id !== tier.id);
    tiersWithout.push(tier);
    setTiers(tiersWithout);
  }

  if (_.isEmpty(form) || !packageItem || loading) {
    return <FuseLoading />;
  }

  return (
    <FormProvider {...methods}>
      <Root
        header={
          <HeaderFormTemplate
            title="Package"
            titleSaved="Package saved"
            goBackURL="/packages/setup"
            addItem={addItem}
            updateItem={updateItem}
            parseFields={parseFields}
            setLoadingForm={setLoading}
          />
        }
        content={
          <>
            <div className="flex flex-col w-full max-w-full items-center min-w-400">
              <Paper className="flex flex-auto flex-col mt-24 p-32 rounded-2xl max-w-5xl w-full">
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      id="name"
                      label="Name"
                      placeholder="Name"
                      className="flex-auto"
                      required
                      autoFocus
                      variant="outlined"
                      error={!!errors.name}
                      helperText={errors?.name?.message}
                    />
                  )}
                />
                <div className="flex sm:space-x-24 mt-24 w-full">
                  <Controller
                    name="type"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth>
                        <InputLabel id="type-label">Type</InputLabel>
                        <Select
                          {...field}
                          id="type"
                          labelId="type-label"
                          label="Type"
                          className="w-full"
                          required
                          variant="outlined"
                        >
                          <MenuItem key="APM" value="APM">
                            APM - Application Performance Managemt
                          </MenuItem>
                          {/* <MenuItem key="machine" value="machine">
                            Machine Agent
                          </MenuItem> */}
                        </Select>
                      </FormControl>
                    )}
                  />

                  {typeWatch && typeWatch == "APM" && (
                    <Controller
                      name="applicationName"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          id="applicationName"
                          label="Application Name"
                          placeholder="Application Name"
                          className="w-full"
                          required
                          variant="outlined"
                          error={!!errors.applicationName}
                          helperText={errors?.applicationName?.message}
                        />
                      )}
                    />
                  )}
                </div>
                <div>
                  <i>If the Type changes, all Tiers will be cleared</i>
                </div>

                <div className="flex sm:space-x-24 mt-24 w-full">
                  <Controller
                    name="controllerId"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth>
                        <InputLabel id="controller-id-label">
                          Controller
                        </InputLabel>
                        <Select
                          {...field}
                          id="controllerId"
                          labelId="controller-id-label"
                          label="Controller"
                          className="w-full"
                          required
                          variant="outlined"
                          error={!!errors.controllerId}
                        >
                          <MenuItem value="none">
                            <em>Select a Controller</em>
                          </MenuItem>
                          {controllers &&
                            controllers.map((row) => (
                              <MenuItem key={row.id} value={row.id}>
                                {row.name} =&gt; {row.hostName}
                              </MenuItem>
                            ))}
                        </Select>
                      </FormControl>
                    )}
                  />
                  {typeWatch && typeWatch == "APM" && (
                    <Controller
                      name="machineId"
                      control={control}
                      render={({ field }) => (
                        <FormControl fullWidth>
                          <InputLabel id="machine-id-label">
                            Machine Agent
                          </InputLabel>
                          <Select
                            {...field}
                            id="machineId"
                            labelId="machine-id-label"
                            label="Machine Agent"
                            className="w-full"
                            required
                            variant="outlined"
                            error={!!errors.machineId}
                          >
                            <MenuItem value="none">
                              <em>
                                If necessary, select a Machine Agent version
                              </em>
                            </MenuItem>
                            {listMachineAgent &&
                              listMachineAgent.map((row) => (
                                <MenuItem key={row.id} value={row.id}>
                                  {row.name} =&gt; {row.version}
                                </MenuItem>
                              ))}
                          </Select>
                        </FormControl>
                      )}
                    />
                  )}
                </div>
                {/* <Button
                  className="px-16 min-w-128"
                  color="secondary"
                  variant="outlined"
                  startIcon={
                    <FuseSvgIcon className="" size={20}>
                      heroicons-solid:pencil-alt
                    </FuseSvgIcon>
                  }
                >
                  Add a Tier
                </Button> */}
                <Button
                  className="group inline-flex items-center mt-24 rounded cursor-pointer"
                  // onClick={() => onChange([...value, ContactModel().emails[0]])}
                  onClick={() => addTier()}
                >
                  <FuseSvgIcon size={20}>
                    heroicons-solid:plus-circle
                  </FuseSvgIcon>

                  <span className="ml-8 font-medium text-secondary group-hover:underline">
                    Add an tier
                  </span>
                </Button>
              </Paper>

              {tiers && (
                <div className="flex grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-32 mt-24 mb-24">
                  {tiers &&
                    tiers.map((tier) => (
                      <TierCard
                        key={tier.agentId}
                        tier={tier}
                        keys={keys}
                        agents={agents}
                        onSubmit={changeTier}
                        deleteTier={deleteTier}
                        typePackage={typeWatch}
                      />
                    ))}
                </div>
              )}

              {tiers && tiers.length == 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, transition: { delay: 0.1 } }}
                  className="flex flex-1 items-center justify-center h-full"
                >
                  <Typography color="text.secondary" variant="h5">
                    You must to setup at least one tier
                  </Typography>
                </motion.div>
              )}
            </div>
          </>
        }
      />
    </FormProvider>
  );
}

export default PackageForm;
