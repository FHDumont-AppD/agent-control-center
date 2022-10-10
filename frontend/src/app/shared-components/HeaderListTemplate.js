import _ from "@lodash";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import Typography from "@mui/material/Typography";
import FuseSvgIcon from "src/@internal/core/FuseSvgIcon";
import Button from "@mui/material/Button";
import Input from "@mui/material/Input";
import NavLinkAdapter from "src/@internal/core/NavLinkAdapter";
import Paper from "@mui/material/Paper";

function HeaderListTemplate(props) {
  const {
    getItems,
    overrideRefresh,
    title,
    setLoading,
    searchText,
    setSearchText,
  } = props;

  const dispatch = useDispatch();

  function refresh() {
    if (overrideRefresh != undefined && overrideRefresh == true) {
      getItems();
    } else {
      setLoading(true);
      dispatch(getItems()).then(() => setLoading(false));
    }
  }

  return (
    <div className="flex flex-col sm:flex-row flex-1 w-full items-center justify-between space-y-8 sm:space-y-0 py-28 px-28 md:px-32">
      <div className="flex flex-col sm:items-start space-y-8 sm:space-y-0 w-full sm:max-w-3xl min-w-0">
        <motion.div
          className="flex flex-col items-center sm:items-start min-w-0"
          initial={{ x: -20 }}
          animate={{ x: 0, transition: { delay: 0.3 } }}
        >
          <Typography
            component="h2"
            className="flex-1 text-3xl md:text-4xl font-extrabold tracking-tight leading-7 sm:leading-10 truncate mx-10"
          >
            {title}
          </Typography>
        </motion.div>
      </div>
      <div className="flex">
        <Paper
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1, transition: { delay: 0.2 } }}
          className="flex items-center w-full sm:max-w-300 space-x-8 px-16 rounded-full border-1 shadow-0"
        >
          <FuseSvgIcon color="disabled">heroicons-solid:search</FuseSvgIcon>
          <Input
            placeholder={"Search " + title}
            className="flex flex-1 w-256"
            disableUnderline
            fullWidth
            inputProps={{
              "aria-label": "Search",
            }}
            defaultValue={searchText}
            onChange={(ev) => dispatch(setSearchText(ev.target.value))}
          />
        </Paper>
        <Button
          className="px-16 min-w-128 mx-4"
          variant="contained"
          color="secondary"
          startIcon={
            <FuseSvgIcon className="hidden sm:flex">
              material-solid:add
            </FuseSvgIcon>
          }
          component={NavLinkAdapter}
          to="new"
        >
          Add
        </Button>
        <Button
          className="px-16 min-w-128 mx-4"
          variant="contained"
          color="secondary"
          startIcon={
            <FuseSvgIcon className="hidden sm:flex">
              material-solid:refresh
            </FuseSvgIcon>
          }
          onClick={() => refresh()}
        >
          Refresh
        </Button>
      </div>
    </div>
  );
}

export default HeaderListTemplate;
