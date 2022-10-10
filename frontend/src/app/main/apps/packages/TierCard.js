import _ from "@lodash";
import FuseUtils from "src/@internal/utils";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import FuseSvgIcon from "src/@internal/core/FuseSvgIcon";
import { lighten } from "@mui/material/styles";
import TierInfo from "./TierInfo";
import {
  Alert,
  AlertTitle,
  AppBar,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Switch,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { changeTier } from "./store/packageSlice";

const schema = yup.object().shape({
  tierName: yup.string().required("You must enter a Tier name"),
  inventoryKeyId: yup.string().required("You must choose a User Credentials"),
  inventory: yup.string().required("You must enter an Inventory"),
  agentId: yup.string().required("You must choose an Agent"),
});

function TierCard({ typePackage, tier, keys, agents, onSubmit, deleteTier }) {
  const dispatch = useDispatch();

  const [openDialog, setOpenDialog] = useState(false);
  const { handleSubmit, formState, control, getValues, setValue, watch } =
    useForm({
      mode: "all",
      defaultValues: tier,
      resolver: yupResolver(schema),
    });
  const { isValid, errors } = formState;

  const [listAgentFiltered, setListAgentFiltered] = useState(agents);
  const [firstTime, setFirstTime] = useState(true);

  const applicationServerWatch = watch("applicationServer");
  const tierTypeWatch = watch("tierType");
  const inventoryTypeWatch = watch("inventoryType");
  const tierNameWatch = watch("tierName");

  useEffect(() => {
    if (agents && agents.length > 0 && tierTypeWatch != undefined) {
      setListAgentFiltered(
        _.filter(agents, (item) =>
          item.typeCode.toLowerCase().includes(tierTypeWatch.toLowerCase())
        )
      );
      if (firstTime) {
        setFirstTime(false);
        if (tier.id == "new") {
          setOpenDialog(true);
        }
      } else {
        setValue("agentId", "none");
      }
    } else {
      setListAgentFiltered(agents);
    }
  }, [tierTypeWatch]);

  function handleOpenDialog() {
    setOpenDialog(true);
  }

  function handleCloseDialog() {
    if (tier.id == "new") {
      deleteTier(tier);
    }
    setOpenDialog(false);
  }

  function handleDiscard() {
    if (tier.id == "new") {
      deleteTier(tier);
    }
    setOpenDialog(false);
  }

  function onSubmitCard(data) {
    onSubmit(data);
    setOpenDialog(false);
  }

  // function onSubmit(data) {
  //   console.log(packageItem);
  //   // _.remove(packageItem.tiers, )
  //   // FuseUtils.toggleInArray(data, packageItem.tiers);
  //   const idxTier = _.findIndex(packageItem.tiers, { id: data.id });
  //   console.log(idxTier);
  //   packageItem.tiers = { ...packageItem.tiers, [idxTier]: data };
  //   console.log(packageItem);
  //   // prepare: (tier) => {
  //   //   console.log(`prepare [${JSON.stringify(tier)}]`);
  //   //   // let userProfile = { ...state.userProfile };
  //   //   // let company = userProfile.company;
  //   //   // let companyAddress = company.companyAddress[0];
  //   //   // companyAddress = {
  //   //   //   ...companyAddress,
  //   //   //   [action.key]: action.value,
  //   //   // };
  //   //   return tier;
  //   // },
  //   dispatch(changeTier(packageItem));
  //   setOpenDialog(false);
  // }

  return (
    <Card className="flex flex-col">
      <CardContent className="flex flex-col flex-auto p-24">
        <TierInfo tier={tier} className="" />
      </CardContent>
      <CardActions
        className="items-center justify-end py-16 px-24"
        sx={{
          backgroundColor: (theme) =>
            theme.palette.mode === "light"
              ? lighten(theme.palette.background.default, 0.4)
              : lighten(theme.palette.background.default, 0.03),
        }}
      >
        <Button
          className="px-16 min-w-128"
          color="secondary"
          variant="outlined"
          startIcon={
            <FuseSvgIcon className="" size={20}>
              heroicons-solid:pencil-alt
            </FuseSvgIcon>
          }
          onClick={() => deleteTier && deleteTier(tier)}
        >
          Remove
        </Button>
        <Button
          className="px-16 min-w-128"
          color="secondary"
          variant="outlined"
          startIcon={
            <FuseSvgIcon className="" size={20}>
              heroicons-solid:pencil-alt
            </FuseSvgIcon>
          }
          onClick={handleOpenDialog}
        >
          Edit
        </Button>
      </CardActions>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="form-dialog-title"
        scroll="body"
        classes={{
          paper: "w-3xl max-w-3xl",
        }}
      >
        <AppBar position="static" color="secondary" elevation={0}>
          <Toolbar className="flex w-full">
            <Typography variant="subtitle1" color="inherit">
              Tier: {tierNameWatch}
            </Typography>
          </Toolbar>
        </AppBar>

        <form
          noValidate
          onSubmit={handleSubmit(onSubmitCard)}
          className="flex flex-col"
        >
          <DialogContent classes={{ root: "p-32" }}>
            <Controller
              name="tierName"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Tier Name"
                  id="tierName"
                  variant="outlined"
                  fullWidth
                  required
                  autoFocus
                  error={!!errors.tierName}
                  helperText={errors?.tierName?.message}
                />
              )}
            />
            <div className="flex sm:space-x-24 mt-24 w-full">
              <Controller
                name="inventoryKeyId"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel id="inventory-key-id-label">
                      User Credentials
                    </InputLabel>
                    <Select
                      {...field}
                      id="inventoryKeyId"
                      labelId="inventory-key-id-label"
                      label="User Credentials"
                      required
                      className="w-full"
                      variant="outlined"
                      error={!!errors.inventoryKeyId}
                    >
                      <MenuItem value="none">
                        <em>Select one User Credential</em>
                      </MenuItem>
                      {keys &&
                        keys.map((row) => (
                          <MenuItem key={row.id} value={row.id}>
                            {row.name}
                          </MenuItem>
                        ))}
                    </Select>
                  </FormControl>
                )}
              />

              <Controller
                name="inventoryType"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth>
                    <InputLabel id="inventory-type-label">
                      Inventory Type
                    </InputLabel>
                    <Select
                      {...field}
                      id="inventoryType"
                      labelId="inventory-type-label"
                      label="Inventory Type"
                      required
                      className="w-full"
                      variant="outlined"
                    >
                      <MenuItem key="file" value="file">
                        File
                      </MenuItem>
                      <MenuItem key="static" value="static">
                        Static
                      </MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </div>

            <Controller
              name="inventory"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  id="inventory"
                  label={
                    inventoryTypeWatch == "file" ? "Path to Inventory File" : ""
                  }
                  placeholder={
                    inventoryTypeWatch == "file" ? "Path to Inventory File" : ""
                  }
                  variant="outlined"
                  className="mt-24 w-full"
                  required
                  multiline={inventoryTypeWatch == "file" ? false : true}
                  rows={inventoryTypeWatch == "file" ? 1 : 5}
                  margin={inventoryTypeWatch == "file" ? "normal" : "none"}
                  error={!!errors.inventory}
                  helperText={errors?.inventory?.message}
                />
              )}
            />

            {inventoryTypeWatch && inventoryTypeWatch == "static" && (
              <Alert severity="info" className="mt-24 w-full">
                <AlertTitle>Static inventory example:</AlertTitle>
                [website]
                <br />
                172.18.8.40
                <br />
                172.18.8.41
              </Alert>
            )}

            {typePackage && typePackage == "APM" && (
              <div className="flex sm:space-x-24">
                <Controller
                  name="tierType"
                  control={control}
                  render={({ field }) => (
                    <FormControl className="mt-24 w-full">
                      <InputLabel id="tier-type-label">Type</InputLabel>
                      <Select
                        {...field}
                        id="tierType"
                        labelId="tier-type-label"
                        label="Type"
                        required
                        variant="outlined"
                      >
                        <MenuItem value="java">Java</MenuItem>
                        <MenuItem value="dotnet">.NET</MenuItem>
                        <MenuItem value="dotnetcore">.NET Core</MenuItem>
                      </Select>
                    </FormControl>
                  )}
                />
                {tierTypeWatch && tierTypeWatch == "java" && (
                  <Controller
                    name="applicationServer"
                    control={control}
                    render={({ field }) => (
                      <FormControl className="mt-24 w-full">
                        <InputLabel id="application-server-label">
                          Application Server
                        </InputLabel>
                        <Select
                          {...field}
                          id="applicationServer"
                          labelId="application-server-label"
                          label="Application Server"
                          required
                          variant="outlined"
                        >
                          <MenuItem value="none">
                            <em>None</em>
                          </MenuItem>
                          <MenuItem value="tomcat">TOMCAT</MenuItem>
                          <MenuItem value="jboss">JBoss</MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  />
                )}
              </div>
            )}

            {tierTypeWatch &&
              tierTypeWatch == "java" &&
              applicationServerWatch != "none" && (
                <Controller
                  name="applicationServerConfigFile"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Application Server Config File"
                      id="applicationServerConfigFile"
                      variant="outlined"
                      className="mt-24 w-full"
                    />
                  )}
                />
              )}

            <Controller
              name="agentId"
              control={control}
              render={({ field }) => (
                <FormControl className="mt-24 w-full">
                  <InputLabel id="agent-id-label">Agent Version</InputLabel>
                  <Select
                    {...field}
                    id="agentId"
                    labelId="agent-id-label"
                    label="Agent Version"
                    required
                    variant="outlined"
                    error={!!errors.agentId}
                  >
                    <MenuItem value="none">
                      <em>Select an agent</em>
                    </MenuItem>
                    {listAgentFiltered &&
                      listAgentFiltered.map((row) => (
                        <MenuItem key={row.id} value={row.id}>
                          {row.name} =&gt; {row.version}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              )}
            />
            {typePackage && typePackage == "apm" && (
              <Controller
                name="restartApp"
                control={control}
                render={({ field: { onChange, value } }) => (
                  <FormControlLabel
                    className="mt-16 w-full"
                    label="Restart Application"
                    control={
                      <Switch
                        onChange={(ev) => {
                          onChange(ev.target.checked);
                        }}
                        checked={value}
                        name="restartApp"
                      />
                    }
                  />
                )}
              />
            )}
          </DialogContent>

          <DialogActions className="flex flex-col w-full mb-24">
            <div className="flex">
              <Button
                className="px-16 min-w-128 mx-4"
                variant="outlined"
                color="secondary"
                onClick={handleDiscard}
              >
                Cancel
              </Button>

              <Button
                className="px-16 min-w-128 mx-4"
                variant="contained"
                color="secondary"
                type="submit"
              >
                Save
              </Button>
            </div>
          </DialogActions>
        </form>
      </Dialog>
    </Card>
  );
}

export default TierCard;
