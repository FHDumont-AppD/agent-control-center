import { yupResolver } from "@hookform/resolvers/yup";
import { Controller, useForm } from "react-hook-form";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import * as yup from "yup";
import _ from "@lodash";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { useEffect } from "react";
import jwtService from "../../auth/services/jwtService";
import { FormControlLabel, Switch } from "@mui/material";

/**
 * Form Validation Schema
 */
const schema = yup.object().shape({
  controllerUrl: yup.string().required("Please enter your Controller."),
  controllerPort: yup.string().required("Please enter your Controller Port."),
  customerId: yup.string().required("Please enter your Customer ID."),
  clientName: yup.string().required("You must enter a Client Name"),
  clientSecret: yup.string().required("Please enter your Client Secret."),
});

const defaultValues = {
  controllerUrl: "your-controller.saas.appdynamics.com",
  controllerPort: "443",
  controllerSsl: true,
  customerId: "",
  clientName: "",
  clientSecret: "",
};

function SignInPage() {
  const { control, formState, handleSubmit, setError, setValue } = useForm({
    mode: "onChange",
    defaultValues,
    resolver: yupResolver(schema),
  });

  const { isValid, dirtyFields, errors } = formState;

  useEffect(() => {
    let controllerUrl =
      localStorage.getItem("controllerUrl") ||
      "your-controller.saas.appdynamics.com";
    let controllerPort = localStorage.getItem("controllerPort") || "443";
    let controllerSsl = localStorage.getItem("controllerSsl") || true;
    let customerId = localStorage.getItem("customerId") || "";
    let clientName = localStorage.getItem("clientName") || "";
    let clientSecret = localStorage.getItem("clientSecret") || "";

    setValue("controllerUrl", controllerUrl, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue("controllerPort", controllerPort, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue("controllerSso", controllerSsl, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue("customerId", customerId, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue("clientName", clientName, {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue("clientSecret", clientSecret, {
      shouldDirty: true,
      shouldValidate: true,
    });
  }, [setValue]);

  function onSubmit({
    controllerUrl,
    controllerPort,
    controllerSsl,
    customerId,
    clientName,
    clientSecret,
  }) {
    let indexSlash = controllerUrl.indexOf("//");
    if (indexSlash == -1) {
      controllerUrl = (controllerSsl ? "https://" : "http://") + controllerUrl;
    }

    localStorage.setItem("controllerUrl", controllerUrl);
    localStorage.setItem("controllerPort", controllerPort);
    localStorage.setItem("controllerSsl", controllerSsl);
    localStorage.setItem("customerId", customerId);
    localStorage.setItem("clientName", clientName);
    localStorage.setItem("clientSecret", clientSecret);

    localStorage.setItem("controller", controllerUrl + ":" + controllerPort);
    jwtService
      .signInWithEmailAndPassword(customerId, clientName, clientSecret)
      .then((user) => {
        // No need to do anything, user data will be set at app/auth/AuthContext
      })
      .catch((_errors) => {
        _errors.forEach((error) => {
          setError(error.type, {
            type: "manual",
            message: error.message,
          });
        });
      });
  }

  return (
    <div className="flex flex-col sm:flex-row items-center md:items-start sm:justify-center md:justify-start flex-1 min-w-0">
      <Paper className="h-full sm:h-auto md:flex md:items-center md:justify-end w-full sm:w-auto md:h-full md:w-1/2 py-8 px-16 sm:p-48 md:p-64 sm:rounded-2xl md:rounded-none sm:shadow md:shadow-none ltr:border-r-1 rtl:border-l-1">
        <div className="w-full max-w-320 sm:w-320 mx-auto sm:mx-0">
          <img
            className="w-200"
            src="assets/images/logo/appd-logo-transp-partofcisco.png"
            alt="logo"
          />

          <Typography className="mt-32 text-4xl font-extrabold tracking-tight leading-tight">
            Sign in
          </Typography>
          {/* <div className="flex items-baseline mt-2 font-medium">
            <Typography>Don't have an account?</Typography>
            <Link className="ml-4" to="/sign-up">
              Sign up
            </Link>
          </div> */}

          <form
            name="loginForm"
            noValidate
            className="flex flex-col justify-center w-full mt-32"
            onSubmit={handleSubmit(onSubmit)}
          >
            <Controller
              name="controllerUrl"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-24"
                  label="Controller"
                  autoFocus
                  error={!!errors.controllerUrl}
                  helperText={errors?.controllerUrl?.message}
                  variant="outlined"
                  required
                  fullWidth
                />
              )}
            />

            <Controller
              name="controllerPort"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  id="controllerPort"
                  label="Port"
                  placeholder="Port"
                  className="mt-8 mb-16 w-full"
                  variant="outlined"
                  type="number"
                  required
                  error={!!errors.controllerPort}
                  helperText={errors?.controllerPort?.message}
                />
              )}
            />

            <Controller
              name="controllerSsl"
              control={control}
              render={({ field: { onChange, value } }) => (
                <FormControlLabel
                  className="mt-8 mb-16 w-full"
                  label="Enable SSL"
                  control={
                    <Switch
                      onChange={(ev) => {
                        onChange(ev.target.checked);
                      }}
                      checked={value}
                      name="controllerSsl"
                    />
                  }
                />
              )}
            />

            <Controller
              name="customerId"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-24"
                  label="Customer ID"
                  error={!!errors.customerId}
                  helperText={errors?.customerId?.message}
                  variant="outlined"
                  required
                  fullWidth
                />
              )}
            />

            <Controller
              name="clientName"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-24"
                  label="Client Name"
                  error={!!errors.clientName}
                  helperText={errors?.clientName?.message}
                  variant="outlined"
                  required
                  fullWidth
                />
              )}
            />

            <Controller
              name="clientSecret"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  className="mb-24"
                  label="Client Secret"
                  type="password"
                  error={!!errors.clientSecret}
                  helperText={errors?.clientSecret?.message}
                  variant="outlined"
                  required
                  fullWidth
                />
              )}
            />
            {/*<div className="flex flex-col sm:flex-row items-center justify-center sm:justify-between">
               <Controller
                name="remember"
                control={control}
                render={({ field }) => (
                  <FormControl>
                    <FormControlLabel
                      label="Remember me"
                      control={<Checkbox size="small" {...field} />}
                    />
                  </FormControl>
                )}
              />
              <Link
                className="text-md font-medium"
                to="/pages/auth/forgot-password"
              >
                Forgot password?
              </Link>
            </div> */}

            <Button
              variant="contained"
              color="secondary"
              className=" w-full mt-16"
              aria-label="Sign in"
              disabled={_.isEmpty(dirtyFields) || !isValid}
              type="submit"
              size="large"
            >
              Sign in
            </Button>
          </form>
        </div>
      </Paper>

      <Box
        className="relative hidden md:flex flex-auto items-center justify-center h-full p-64 lg:px-112 overflow-hidden"
        sx={{ backgroundColor: "primary.main" }}
      >
        <svg
          className="absolute inset-0 pointer-events-none"
          viewBox="0 0 960 540"
          width="100%"
          height="100%"
          preserveAspectRatio="xMidYMax slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <Box
            component="g"
            sx={{ color: "primary.light" }}
            className="opacity-20"
            fill="none"
            stroke="currentColor"
            strokeWidth="100"
          >
            <circle r="234" cx="196" cy="23" />
            <circle r="234" cx="790" cy="491" />
          </Box>
        </svg>
        <Box
          component="svg"
          className="absolute -top-64 -right-64 opacity-20"
          sx={{ color: "primary.light" }}
          viewBox="0 0 220 192"
          width="220px"
          height="192px"
          fill="none"
        >
          <defs>
            <pattern
              id="837c3e70-6c3a-44e6-8854-cc48c737b659"
              x="0"
              y="0"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <rect x="0" y="0" width="4" height="4" fill="currentColor" />
            </pattern>
          </defs>
          <rect
            width="220"
            height="192"
            fill="url(#837c3e70-6c3a-44e6-8854-cc48c737b659)"
          />
        </Box>

        <div className="z-10 relative w-full max-w-2xl">
          <div className="text-7xl font-bold leading-none text-gray-100">
            <div>Welcome to</div>
            <div>AppDynamics Agent Control Center</div>
          </div>
          <div className="mt-24 text-lg tracking-tight leading-6 text-gray-400">
            AppDynamics Agent Control Center helps to deploy and update the
            AppDynamcis agents in all your environments
          </div>
        </div>
      </Box>
    </div>
  );
}

export default SignInPage;
