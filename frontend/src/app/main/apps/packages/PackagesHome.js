import _ from "@lodash";
import { styled } from "@mui/material/styles";
import FusePageSimple from "src/@internal/core/FusePageSimple";
import { motion } from "framer-motion";
import clsx from "clsx";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getItems,
  selectPackages,
  selectSearchText,
  setSearchText,
} from "./store/packagesSlice";
import { removeItem } from "./store/packageSlice";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import Swal from "sweetalert2";

import {
  Alert,
  AlertTitle,
  AppBar,
  Dialog,
  DialogActions,
  DialogContent,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Switch,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";

import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

import Button from "@mui/material/Button";
import FuseLoading from "src/@internal/core/FuseLoading";
import FuseSvgIcon from "src/@internal/core/FuseSvgIcon";
import { Link } from "react-router-dom";
import NavLinkAdapter from "src/@internal/core/NavLinkAdapter";

import HeaderListTemplate from "../../../shared-components/HeaderListTemplate";

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

function PackagesHome(props) {
  const dispatch = useDispatch();
  const listPackages = useSelector(selectPackages);
  const searchText = useSelector(selectSearchText);
  const [listPackagesFiltered, setListPackagesFiltered] =
    useState(listPackages);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [packageSelected, setPackageSelected] = useState(undefined);

  useEffect(() => {
    setLoading(true);
    dispatch(getItems()).then(() => setLoading(false));
  }, []);

  const deleteRow = async (row) => {
    Swal.fire({
      title: "Are you sure?",
      html:
        "You won't be able to revert this!<br/><br/>Name: <b><i>" +
        row.name +
        "</i></b>",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setLoading(true);
        dispatch(removeItem(row.id)).then(() =>
          dispatch(getItems()).then(() => setLoading(false))
        );
      }
    });
  };

  useEffect(() => {
    if (searchText != undefined && searchText.length !== 0) {
      setListPackagesFiltered(
        _.filter(listPackages, (item) =>
          item.name.toLowerCase().includes(searchText.toLowerCase())
        )
      );
    } else {
      setListPackagesFiltered(listPackages);
    }
  }, [listPackages, searchText]);

  const handleOpenDialog = (item) => {
    setPackageSelected(item);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    // if (tier.id == "new") {
    //   deleteTier(tier);
    // }
    setOpenDialog(false);
  };

  const handleDiscard = () => {
    // if (tier.id == "new") {
    //   deleteTier(tier);
    // }
    setOpenDialog(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <FuseLoading />
      </div>
    );
  }

  return (
    <Root
      header={
        <HeaderListTemplate
          getItems={getItems}
          title="Packages"
          setLoading={setLoading}
          selectSearchText={selectSearchText}
          setSearchText={setSearchText}
        />
      }
      content={
        <>
          <div className="flex-auto p-24 sm:p-40">
            {listPackagesFiltered.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.1 } }}
                className="flex flex-1 items-center justify-center h-full"
              >
                <Typography color="text.secondary" variant="h5">
                  There are no Packages!
                </Typography>
              </motion.div>
            )}
            {listPackagesFiltered.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { delay: 0.1 } }}
                className="flex flex-1 items-center justify-center h-full"
              >
                <TableContainer component={Paper}>
                  <Table
                    sx={{ minWidth: 650 }}
                    stickyHeader
                    aria-label="sticky table"
                  >
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell align="left">Type</TableCell>
                        <TableCell align="left">Application Name</TableCell>
                        <TableCell align="left">Tiers</TableCell>
                        <TableCell align="left">Machine Agent</TableCell>
                        <TableCell align="center">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {listPackagesFiltered &&
                        listPackagesFiltered.map((row) => (
                          <TableRow
                            hover
                            key={row.id}
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                          >
                            <TableCell component="th" scope="row">
                              {row.name}
                            </TableCell>
                            <TableCell align="left">{row.type}</TableCell>
                            <TableCell align="left">
                              {row.type == "APM" ? row.applicationName : "-"}
                            </TableCell>
                            <TableCell align="left">
                              {row.tiers == undefined ? "0" : row.tiers.length}
                            </TableCell>
                            <TableCell align="left">
                              {row.machineId == undefined ||
                              row.machineId != "none"
                                ? "ACTIVE"
                                : "INACTIVE"}
                            </TableCell>
                            <TableCell align="center">
                              <IconButton
                                aria-label="edit"
                                color="secondary"
                                to={`/packages/setup/${row.id}`}
                                component={Link}
                              >
                                <EditIcon />
                              </IconButton>
                              <IconButton
                                aria-label="delete"
                                color="secondary"
                                onClick={() => deleteRow(row)}
                              >
                                <DeleteIcon />
                              </IconButton>
                              <IconButton
                                aria-label="play"
                                color="secondary"
                                onClick={() => handleOpenDialog(row)}
                              >
                                <PlayArrowIcon />
                              </IconButton>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </motion.div>
            )}
          </div>
          {packageSelected != undefined && (
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
                    Package: {packageSelected.name}
                  </Typography>
                </Toolbar>
              </AppBar>

              <DialogContent classes={{ root: "p-32" }}>
                <div className={clsx("w-full")}>
                  <Typography
                    className="flex items-center space-x-6 text-13"
                    color="text.secondary"
                  >
                    <span className="whitespace-nowrap leading-none w-120">
                      <i>Application Name</i>
                    </span>
                    <span className="whitespace-nowrap leading-none">
                      {packageSelected.applicationName}
                    </span>
                  </Typography>

                  {packageSelected.tiers.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1, transition: { delay: 0.1 } }}
                      className="flex flex-1 items-center justify-center h-full mt-24"
                    >
                      <TableContainer component={Paper}>
                        <Table
                          sx={{ minWidth: 650 }}
                          stickyHeader
                          aria-label="sticky table"
                        >
                          <TableHead>
                            <TableRow>
                              <TableCell>Tier</TableCell>
                              <TableCell align="left">Type</TableCell>
                              <TableCell align="left">
                                Application Server
                              </TableCell>
                              <TableCell align="left">Status</TableCell>
                              <TableCell align="left">Action</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {packageSelected.tiers &&
                              packageSelected.tiers.map((row) => (
                                <TableRow
                                  hover
                                  key={row.id}
                                  sx={{
                                    "&:last-child td, &:last-child th": {
                                      border: 0,
                                    },
                                  }}
                                >
                                  <TableCell component="th" scope="row">
                                    {row.tierName}
                                  </TableCell>
                                  <TableCell align="left">
                                    {row.tierType}
                                  </TableCell>
                                  <TableCell align="left">
                                    {row.applicationServer}
                                  </TableCell>
                                  <TableCell align="left">Status</TableCell>
                                  <TableCell align="left">Action</TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </motion.div>
                  )}
                </div>
              </DialogContent>

              <DialogActions className="flex flex-col w-full mb-24">
                <div className="flex">
                  <Button
                    className="px-16 min-w-128 mx-4"
                    variant="outlined"
                    color="secondary"
                    onClick={() => handleDiscard()}
                  >
                    Close
                  </Button>
                </div>
              </DialogActions>
            </Dialog>
          )}
        </>
      }
      scroll="content"
    />
  );
}

export default PackagesHome;
