import _ from "@lodash";
import { styled } from "@mui/material/styles";
import FusePageSimple from "src/@internal/core/FusePageSimple";
import Typography from "@mui/material/Typography";
import { motion } from "framer-motion";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getItems,
  selectKeys,
  selectSearchText,
  setSearchText,
} from "./store/keysSlice";
import { removeItem } from "./store/keySlice";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import Swal from "sweetalert2";

import FuseLoading from "src/@internal/core/FuseLoading";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Link } from "react-router-dom";

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

function KeysHome(props) {
  const dispatch = useDispatch();
  const listKeys = useSelector(selectKeys);
  const searchText = useSelector(selectSearchText);
  const [listKeysFiltered, setListKeysFiltered] = useState(listKeys);
  const [loading, setLoading] = useState(false);

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
      setListKeysFiltered(
        _.filter(
          listKeys,
          (item) =>
            item.name.toLowerCase().includes(searchText.toLowerCase()) ||
            item.type.toLowerCase().includes(searchText.toLowerCase())
        )
      );
    } else {
      setListKeysFiltered(listKeys);
    }
  }, [listKeys, searchText]);

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
          title="Keys"
          setLoading={setLoading}
          selectSearchText={selectSearchText}
          setSearchText={setSearchText}
        />
      }
      content={
        <div className="flex-auto p-24 sm:p-40">
          {listKeysFiltered.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.1 } }}
              className="flex flex-1 items-center justify-center h-full"
            >
              <Typography color="text.secondary" variant="h5">
                There are no Keys!
              </Typography>
            </motion.div>
          )}
          {listKeysFiltered.length > 0 && (
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
                      <TableCell align="center">Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {listKeysFiltered &&
                      listKeysFiltered.map((row) => (
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
                          <TableCell align="center">
                            <IconButton
                              aria-label="edit"
                              color="secondary"
                              to={`/keys/${row.id}`}
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
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </motion.div>
          )}
        </div>
      }
      scroll="content"
    />
  );
}

export default KeysHome;
