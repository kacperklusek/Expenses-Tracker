import { TextField, Checkbox, Grid, Button, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core'
import { CustomizedSnackbar } from '../../../Snackbar/Snackbar'
import { v4 as uuidv4 } from "uuid"
import React, { useState, useContext } from 'react'
import { ExpenseTrackerContext } from '../../../../context/context'
import formatDate from '../../../../utils/formatDate'

import useStyles from "../styles"
import CategoriesForm from '../CategoriesForm/CategoriesForm'

const initialState = {
  amount: '',
  categoryName: '',
  type: "Income",
  date: formatDate(new Date()), // start date
  finalDate: formatDate(new Date()),
  period: 1,
  periodType: "Month", // month/day/year
}

const FormPeriodical = () => {
  const classes = useStyles()
  const [formData, setFormData] = useState(initialState)
  const [finalDate, setFinalDate] = useState(false)
  const { addPeriodicalTransaction, user } = useContext(ExpenseTrackerContext)
  const [open, setOpen] = useState(false)
  const [categoryFormOpen, setCategoryFormOpen] = useState(false)

  const createTransaction = () => {
    if (Number.isNaN(Number(formData.amount)) || Number(formData.amount) <= 0 || Number(formData.period) <= 0 || formData.categoryName === '' || formData.periodType === '' || !formData.date.includes('-')) return

    const category = {
      type: formData.type,
      name: formData.categoryName
    }

    var transaction = {
      category: category,
      date: new Date(formData.date).toISOString(),
      finalDate: new Date(formData.finalDate).toISOString(),
      amount: parseFloat(formData.amount),
      period: parseFloat(formData.period),
      periodType: formData.periodType,
      id: uuidv4()
    }

    transaction.finalDate = finalDate ? transaction.finalDate : null

    setOpen(true)
    addPeriodicalTransaction(transaction)

    setFormData(initialState)
  }

  const handleClickOpen = (event) => {
    event.stopPropagation();
    setCategoryFormOpen(true);
  }


  const compare = (a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0)


  return (
    <Grid container spacing={2}>
      <CustomizedSnackbar open={open} setOpen={setOpen} />
      <Grid item xs={12}>
      </Grid>
      <Grid item xs={6}>
        <FormControl fullWidth>
          <InputLabel>Type</InputLabel>
          <Select fullWidth
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
          >
            <MenuItem value="Income">Income</MenuItem>
            <MenuItem value="Expense">Expense</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={6}>
        <FormControl fullWidth>
          <InputLabel>Category</InputLabel>
          <Select fullWidth
            value={formData.categoryName}
            onChange={(e) => setFormData({ ...formData, categoryName: e.target.value })}
          >
            {user.categories.sort( compare ).filter(c => c.type === formData.type).map((c) =>
              <MenuItem key={c.name} value={c.name}>
                {c.name}
              </MenuItem>)
            }
            <Button variant='contained' color='primary' 
              className={classes.category_button}
              onClick={(e) => handleClickOpen(e)}
              >
              Add New 
            </Button>
          </Select>
          <CategoriesForm open={categoryFormOpen} setOpen={setCategoryFormOpen}/>
        </FormControl>
      </Grid>
      <Grid item xs={12}>
        <TextField type="number" label="Amount" fullWidth value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })} />
      </Grid>
      <Grid item xs={5}>
        <TextField label="start date" type="date" value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
      </Grid>
      <Grid item xs={5}>
        <TextField label="final date*" type="date" value={formData.finalDate} disabled={!finalDate}
          onChange={(e) => setFormData({ ...formData, finalDate: e.target.value })} />
      </Grid>
      <Grid item xs={2}>
        <Checkbox label="set final date" color="default"
          onChange={(e) => setFinalDate(e.target.checked)} />
      </Grid>
      <Grid item xs={6}>
        <TextField type="number" label="payment period:" fullWidth value={formData.period}
          onChange={(e) => setFormData({ ...formData, period: e.target.value })} />
      </Grid>
      <Grid item xs={6}>
        <FormControl fullWidth>
          <InputLabel>Type</InputLabel>
          <Select fullWidth
            value={formData.periodType}
            onChange={(e) => setFormData({ ...formData, periodType: e.target.value })}
          >
            <MenuItem value="Day">Day</MenuItem>
            <MenuItem value="Month">Month</MenuItem>
            <MenuItem value="Year">Year</MenuItem>
          </Select>
        </FormControl>
      </Grid>

      <Button className={classes.button} variant="outlined" color="primary" fullWidth onClick={createTransaction}>Create</Button>
    </Grid>
  )
}

export default FormPeriodical