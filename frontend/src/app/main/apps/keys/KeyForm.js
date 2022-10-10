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
import _ from "lodash";
import FuseLoading from "src/@internal/core/FuseLoading";
import {
  selectKey,
  getItem,
  newItem,
  addItem,
  updateItem,
  resetItem,
} from "./store/keySlice";

import HeaderFormTemplate from "../../../shared-components/HeaderFormTemplate";

const schema = yup.object().shape({
  name: yup
    .string()
    .required("You must enter a key name")
    .min(5, "The key name must be at least 5 characters"),
  privateKey: yup.string().when(["type"], {
    is: (value) => value == "ssh-key",
    then: yup.string().required("You must enter a path for the Private Key"),
  }),
  password: yup.string().when(["type"], {
    is: (value) => value == "login-with-password",
    then: yup.string().required("You must enter a Password"),
  }),
  token: yup.string().when(["type"], {
    is: (value) => value == "personal-access-token",
    then: yup.string().required("You must enter a Personal Access Token"),
  }),
});

function KeyForm(props) {
  const dispatch = useDispatch();
  const routeParams = useParams();
  const keyItem = useSelector(selectKey);
  const [loading, setLoading] = useState(false);

  const methods = useForm({
    mode: "all",
    resolver: yupResolver(schema),
  });
  const { control, formState, watch, reset } = methods;
  const { errors } = formState;

  const form = watch();
  const typeWatch = watch("type");

  useDeepCompareEffect(() => {
    function updateItemState() {
      if (routeParams.id === "new") {
        dispatch(newItem());
      } else {
        dispatch(getItem(routeParams.id)).then((result) => {});
      }
    }
    updateItemState();
  }, [dispatch, routeParams]);

  useEffect(() => {
    reset({ ...keyItem });
  }, [keyItem, reset]);

  useEffect(() => {
    return () => {
      dispatch(resetItem());
    };
  }, [dispatch]);

  function parseFields(values) {
    if (values.type == "none") {
      values.userName = "";
      values.privateKey = "";
      values.password = "";
      values.token = "";
    } else if (values.type == "ssh-key") {
      values.password = "";
      values.token = "";
    } else if (values.type == "login-with-password") {
      values.privateKey = "";
      values.token = "";
    } else if (values.type == "personal-access-token") {
      values.userName = "";
      values.privateKey = "";
      values.password = "";
    }
    return values;
  }

  if (_.isEmpty(form) || !keyItem || loading) {
    return <FuseLoading />;
  }

  return (
    <FormProvider {...methods}>
      <FusePageCarded
        header={
          <HeaderFormTemplate
            title="Key"
            titleSaved="Key saved"
            goBackURL="/keys"
            addItem={addItem}
            updateItem={updateItem}
            parseFields={parseFields}
            setLoadingForm={setLoading}
          />
        }
        content={
          <>
            <div className="p-16 sm:p-24 max-w-3xl">
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="name"
                    label="Name"
                    placeholder="Name"
                    className="mt-8 mb-16 w-full"
                    required
                    autoFocus
                    variant="outlined"
                    error={!!errors.name}
                    helperText={errors?.name?.message}
                  />
                )}
              />

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
                      className="mt-8 mb-16 w-full"
                      required
                      variant="outlined"
                    >
                      <MenuItem value="none">
                        <em>None</em>
                      </MenuItem>
                      <MenuItem value="ssh-key">SSH Key</MenuItem>
                      <MenuItem value="login-with-password">
                        Login with Password
                      </MenuItem>
                      <MenuItem value="personal-access-token">
                        Personal Access Token
                      </MenuItem>
                    </Select>
                  </FormControl>
                )}
              />

              {typeWatch && typeWatch == "ssh-key" && (
                <FormControl fullWidth>
                  <Controller
                    name="userName"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        id="userName"
                        label="User Name (optional)"
                        placeholder="User Name (optional)"
                        className="mt-8 mb-16 w-full"
                        variant="outlined"
                        error={!!errors.userName}
                        helperText={errors?.userName?.message}
                      />
                    )}
                  />

                  <Controller
                    name="privateKey"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        id="privateKey"
                        label="Path for the Private Key"
                        placeholder="Path for the Private Key"
                        className="mt-8 mb-16 w-full"
                        variant="outlined"
                        // type="text"
                        // multiline
                        // rows={8}
                        required
                        error={!!errors.privateKey}
                        helperText={errors?.privateKey?.message}
                      />
                    )}
                  />
                </FormControl>
              )}

              {typeWatch && typeWatch == "login-with-password" && (
                <FormControl fullWidth>
                  <Controller
                    name="userName"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        id="userName"
                        label="User Name (optional)"
                        placeholder="User Name (optional)"
                        className="mt-8 mb-16 w-full"
                        variant="outlined"
                        error={!!errors.userName}
                        helperText={errors?.userName?.message}
                      />
                    )}
                  />

                  <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        id="password"
                        label="Password"
                        placeholder="Password"
                        className="mt-8 mb-16 w-full"
                        variant="outlined"
                        type="password"
                        required
                        error={!!errors.password}
                        helperText={errors?.password?.message}
                      />
                    )}
                  />
                </FormControl>
              )}

              {typeWatch && typeWatch == "personal-access-token" && (
                <Controller
                  name="token"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      id="token"
                      label="Personal Access Token"
                      placeholder="Personal Access Token"
                      className="mt-8 mb-16 w-full"
                      variant="outlined"
                      required
                      error={!!errors.token}
                      helperText={errors?.token?.message}
                    />
                  )}
                />
              )}

              {typeWatch && typeWatch == "none" && (
                <Alert severity="info">
                  <AlertTitle>INFO</AlertTitle>
                  Use this type of key if the
                  <b> access setting is in the inventory</b> OR for HTTPS
                  repositories and for playbooks which use non-SSH connections
                </Alert>
              )}
            </div>
          </>
        }
      />
    </FormProvider>
  );
}

export default KeyForm;
