import React from "react";
import { Snackbar } from "@material-ui/core";
import MuiAlert from '@material-ui/lab/Alert'

import useStyles from "./styles"


export const CustomizedSnackbar = ({open, setOpen}) => {
  const classes = useStyles()

  const handleClose = (event, reason) => {
    if(reason === 'clickaway') return

    setOpen(false)
  }

  return (
    <div className={classes.root}>
      <Snackbar
        anchorOrigin={{vertical: "top", horizontal: "right"}}
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
      >
        <MuiAlert onClose={handleClose} severity="success" elevation={6} variant="filled">
          Transaction succesfully created.
        </MuiAlert>
      </Snackbar>
    </div>
  )
}
