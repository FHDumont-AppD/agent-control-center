import _ from "@lodash";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useFormContext } from "react-hook-form";
import { motion } from "framer-motion";
import Swal from "sweetalert2";
import { showMessage } from "app/store/fuse/messageSlice";

import Typography from "@mui/material/Typography";
import FuseSvgIcon from "src/@internal/core/FuseSvgIcon";
import Button from "@mui/material/Button";
import NavLinkAdapter from "src/@internal/core/NavLinkAdapter";
import { Alert, Stack } from "@mui/material";

function HeaderFormTemplate(props) {
  const {
    goBackURL,
    titleSaved,
    title,
    addItem,
    updateItem,
    parseFields,
    setLoadingForm,
    titleBTSave,
  } = props;

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const routeParams = useParams();
  const methods = useFormContext();
  const { formState, watch, getValues } = methods;
  const { isValid } = formState;

  const name = watch("name");

  function handleSave() {
    if (isValid) {
      let item = getValues();
      if (parseFields) {
        item = parseFields(item);
      }
      setLoadingForm(true);
      if (routeParams.id === "new") {
        dispatch(addItem(item)).then((result) => {
          saved();
          setLoadingForm(false);
        });
      } else {
        dispatch(updateItem(item)).then((result) => {
          saved(result);
          setLoadingForm(false);
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

  function saved(result) {
    if (!result.error) {
      Swal.fire({
        position: "top-end",
        icon: "success",
        title: titleSaved || "Information recorded",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
      goBack();
    } else {
      console.log("[ERROR]", result);
    }
  }

  function goBack() {
    navigate(goBackURL);
  }

  return (
    <div className="flex flex-col sm:flex-row flex-1 w-full items-center justify-between space-y-8 sm:space-y-0 py-24 px-24 md:px-32">
      <div className="flex flex-col sm:items-start space-y-8 sm:space-y-0 w-full sm:max-w-3xl min-w-0">
        {/* <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1, transition: { delay: 0.3 } }}
        >
          <Typography
            className="flex items-center sm:mb-12"
            onClick={goBack}
            role="button"
            color="inherit"
          >
            <FuseSvgIcon size={20}>heroicons-outline:arrow-sm-left</FuseSvgIcon>
            <span className="flex mx-4 font-medium">Return to list</span>
          </Typography>
        </motion.div> */}

        <div className="flex items-center max-w-full">
          <motion.div
            className="flex flex-col items-center sm:items-start min-w-0"
            initial={{ x: -20 }}
            animate={{ x: 0, transition: { delay: 0.3 } }}
          >
            <Typography className="text-16 sm:text-20 truncate font-semibold">
              {name || `New ${title}`}
            </Typography>
            <Typography variant="caption" className="font-medium">
              {title} Detail
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
                material-solid:cancel
              </FuseSvgIcon>
            }
          >
            Cancel
          </Button>
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
            {titleBTSave || "Save"}
          </Button>
        </motion.div>
        {/* {isShowValidade && (
          <Alert variant="filled" severity="error" className="mt-16">
            Check all fields requireds (*)
          </Alert>
        )} */}
      </div>
    </div>
  );
}

export default HeaderFormTemplate;
