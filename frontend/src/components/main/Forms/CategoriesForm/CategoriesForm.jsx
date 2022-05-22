import React from 'react'
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core'
import { TextField, Button, Select, MenuItem, FormControl } from '@material-ui/core';
import { useContext, useState } from 'react';
import { ExpenseTrackerContext } from '../../../../context/context';
import { v4 as uuidv4 } from "uuid"

const INITIAL_STATE = {
  type: "Income",
  name: ""
}


const CategoriesForm = (props) => {
  const {addCategory} = useContext(ExpenseTrackerContext)
  const [formData, setFormData] = useState(INITIAL_STATE)

  const handleClose = () => {
    props.setOpen(false);
  };

  const handleAdd = () => {
    handleClose();
    
    const category = {
      id: uuidv4(),
      ...formData
    }

    addCategory(category)
  }

  return props.open ? (
    <Dialog open={props.open} onClose={handleClose}>
      <DialogTitle>Add your own Category</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Please enter category type and name
        </DialogContentText>
        <FormControl fullWidth>
          <Select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <MenuItem value="Income">Income</MenuItem>
              <MenuItem value="Expense">Expense</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <TextField
            margin="dense"
            id="name"
            label="Category Name"
            fullWidth
            variant="standard"
            onChange={e => setFormData({ ...formData, name: e.target.value })}
          />
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleAdd}>Add</Button>
      </DialogActions>
    </Dialog>
  ) : ""
}

export default CategoriesForm