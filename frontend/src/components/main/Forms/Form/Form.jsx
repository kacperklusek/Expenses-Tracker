import React, { useState, useContext, useEffect } from 'react'
import { TextField, Typography, Grid, Button, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core'
import { ExpenseTrackerContext } from '../../../../context/context'
import { v4 as uuidv4 } from "uuid"
import { useSpeechContext } from '@speechly/react-client'
import { CustomizedSnackbar } from '../../../Snackbar/Snackbar'

import formatDate from '../../../../utils/formatDate'
import useStyles from "./styles"
import { incomeCategories, expenseCategories } from '../../../../constants/categories'

const initialState = {
  amount: '',
  categoryName: '',
  type: 'Income',
  date: formatDate(new Date()),
}

const Form = () => {
  const classes = useStyles()
  const [formData, setFormData] = useState(initialState)
  const { addTransaction } = useContext(ExpenseTrackerContext)
  const { segment } = useSpeechContext()
  const [open, setOpen] = useState(false)

  const createTransaction = () => {
    if (Number.isNaN(Number(formData.amount)) || Number(formData.amount) <= 0 || formData.category === '' || !formData.date.includes('-')) return
    const category = {
      type: formData.type,
      name: formData.categoryName
    }

    const transaction = {
      category: category,
      date: new Date(formData.date).toISOString(),
      amount: parseFloat(formData.amount),
      id: uuidv4()
    }
    
    setOpen(true)
    console.log(transaction)
    addTransaction(transaction)
    setFormData(initialState)
  }

  useEffect(() => {
    if (segment) {
      if (segment.intent.intent === 'add_expense') {
        setFormData({ ...formData, type: 'Expense' })
      } else if (segment.intent.intent === "add_income") {
        setFormData({ ...formData, type: "Income" })
      } else if (segment.isFinal && segment.intent.intent === "create_transaction") {
        return createTransaction();
      } else if (segment.isFinal && segment.intent.intent === "cancel_transaction") {
        return setFormData(initialState)
      }

      segment.entities.forEach((e) => {
        const category = `${e.value.charAt(0)}${e.value.slice(1).toLowerCase()}`
        switch (e.type) {
          case 'amount':
            setFormData({ ...formData, amount: e.value })
            break;
          case 'category':
            if (incomeCategories.map((c) => c.type).includes(category)) {
              setFormData({ ...formData, category, type: "Income" })
            } else if (expenseCategories.map((c) => c.type).includes(category)) {
              setFormData({ ...formData, category, type: "Expense" })
            }
            break
          case 'date':
            setFormData({ ...formData, date: e.value })
            break
          default:
            break;
        }
      })

      if (segment.isFinal && formData.amount && formData.category && formData.type && formData.date) {
        return createTransaction();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [segment])


  const selectedCategories = formData.type === 'Income' ? incomeCategories : expenseCategories

  return (
    <Grid container spacing={2}>
      <CustomizedSnackbar open={open} setOpen={setOpen} />
      <Grid item xs={12}>
        <Typography align="center" variant='subtitle2' gutterBottom>
          {segment && segment.words.map((word) => word.value).join(' ')}
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <FormControl fullWidth>
          <InputLabel>Type</InputLabel>
          <Select
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
          <Select
            value={formData.categoryName}
            onChange={(e) => setFormData({ ...formData, categoryName: e.target.value })}
          >
            {selectedCategories.map((c) =>
              <MenuItem key={c.type} value={c.type}>{c.type}</MenuItem>)
            }
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={6}>
        <TextField type="number" label="Amount" fullWidth value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })} />
      </Grid>
      <Grid item xs={6}>
        <TextField fullWidth label="date" type="date" value={formData.date}
          onChange={(e) => {setFormData({ ...formData, date: e.target.value })}} />
      </Grid>
      <Button className={classes.button} variant="outlined" color="primary" fullWidth onClick={createTransaction}>Create</Button>
    </Grid>
  )
}

export default Form