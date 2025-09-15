import { Alert, Snackbar } from "@mui/material";
import React from "react";

import { closeSnackbar } from "../redux/slices/snackbar";
import { useDispatch } from "react-redux";

const SnackBar = ({ isOpen, message, severity }) => {
  const dispatch = useDispatch();

  const handleClose = (_event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    dispatch(closeSnackbar());
  };

  return (
    <Snackbar
      open={isOpen}
      autoHideDuration={3000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      sx={{}}
    >
      <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default SnackBar;
