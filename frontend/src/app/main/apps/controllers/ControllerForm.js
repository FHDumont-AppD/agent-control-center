import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { FormProvider, useForm, Controller } from "react-hook-form";
import { motion } from "framer-motion";
import TextField from "@mui/material/TextField";
import Swal from "sweetalert2";

import FuseSvgIcon from "src/@internal/core/FuseSvgIcon";

import { useDeepCompareEffect } from "src/@internal/hooks";
import { useEffect, useState } from "react";

import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import FusePageCarded from "src/@internal/core/FusePageCarded";
import { Button, Typography } from "@mui/material";
import _ from "lodash";
import FuseLoading from "src/@internal/core/FuseLoading";
import {
  selectController,
  getItem,
  newItem,
  addItem,
  updateItem,
  resetItem,
} from "./store/controllerSlice";

const schema = yup.object().shape({
  accountAccessKey: yup
    .string()
    .required("You must enter an Account Access Key")
    .min(5, "It must be at least 5 characters"),
});

function ControllerForm(props) {
  const dispatch = useDispatch();
  const routeParams = useParams();

  const controllerItem = useSelector(selectController);
  const [isNew, setIsNew] = useState(false);
  const [loading, setLoading] = useState(false);

  const methods = useForm({
    mode: "all",
    resolver: yupResolver(schema),
  });
  const { control, formState, watch, reset, getValues } = methods;
  const { errors, isValid } = formState;

  const form = watch();

  useDeepCompareEffect(() => {
    refresh();
  }, [dispatch, routeParams]);

  function refresh() {
    dispatch(getItem({ controller: localStorage.getItem("controller") })).then(
      (result) => {
        if (result.payload.accountAccessKey == "") {
          setIsNew(true);
          dispatch(newItem());
        } else {
          setIsNew(false);
        }
      }
    );
  }

  function handleSave() {
    if (isValid) {
      let controllerHostName = localStorage.getItem("controllerUrl");
      let indexSlash = controllerHostName.indexOf("//");
      if (indexSlash != -1) {
        controllerHostName = controllerHostName.substring(indexSlash + 2);
      }

      let item = getValues();
      item = {
        ...item,
        controller: localStorage.getItem("controller"),
        hostName: controllerHostName,
        port: localStorage.getItem("controllerPort"),
        enableSSL: localStorage.getItem("controllerSsl"),
        customerId: localStorage.getItem("customerId"),
      };
      setLoading(true);
      if (isNew) {
        dispatch(addItem(item)).then((result) => {
          saved();
          setLoading(false);
        });
      } else {
        dispatch(updateItem(item)).then((result) => {
          saved();
          setLoading(false);
        });
      }
    } else {
      Swal.fire({
        title: "Check all fields requireds (*)",
        showConfirmButton: true,
        timer: 2000,
        icon: "error",
        timerProgressBar: true,
      });
    }
  }

  function saved() {
    refresh();
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "Information recorded",
      showConfirmButton: false,
      timer: 2000,
      timerProgressBar: true,
    });
  }

  useEffect(() => {
    reset({ ...controllerItem });
  }, [controllerItem, reset]);

  useEffect(() => {
    return () => {
      dispatch(resetItem());
    };
  }, [dispatch]);

  if (_.isEmpty(form) || !controllerItem || loading) {
    return <FuseLoading />;
  }

  return (
    <FormProvider {...methods}>
      <FusePageCarded
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
                    Controller Update
                  </Typography>
                  <Typography variant="caption" className="font-medium">
                    Controller detail
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
                  color="secondary"
                  startIcon={
                    <FuseSvgIcon className="hidden sm:flex">
                      material-solid:save
                    </FuseSvgIcon>
                  }
                  onClick={handleSave}
                >
                  Save
                </Button>
              </motion.div>
            </div>
          </div>
        }
        content={
          <>
            <div className="p-16 sm:p-24 max-w-3xl">
              <Typography className="flex items-center mt-8 mb-24 ">
                <span className="whitespace-nowrap leading-none w-200">
                  <i>Controller at Login</i>
                </span>
                <span className="whitespace-nowrap leading-none">
                  {localStorage.getItem("controller") ||
                    "Error to find Controller"}
                </span>
              </Typography>

              <Controller
                name="accountAccessKey"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="accountAccessKey"
                    label="Account Access Key"
                    placeholder="Account Access Key"
                    className="mt-8 mb-16 w-full"
                    variant="outlined"
                    required
                    error={!!errors.accountAccessKey}
                    helperText={errors?.accountAccessKey?.message}
                  />
                )}
              />

              <Controller
                name="globalAnalyticsAccountName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="globalAnalyticsAccountName"
                    label="Global Analytics Account Name"
                    placeholder="Global Analytics Account Name"
                    className="mt-8 mb-16 w-full"
                    variant="outlined"
                    error={!!errors.globalAnalyticsAccountName}
                    helperText={errors?.globalAnalyticsAccountName?.message}
                  />
                )}
              />
            </div>
          </>
        }
      />
    </FormProvider>
  );
}

export default ControllerForm;
