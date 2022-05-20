import React, { useState, useContext } from 'react'
import { TextField, Typography, Grid, Button, FormControl, InputLabel, Select, MenuItem } from '@material-ui/core'
import { ExpenseTrackerContext } from '../../../../context/context'
import { v4 as uuidv4 } from "uuid"
import { useSpeechContext } from '@speechly/react-client'
import { CustomizedSnackbar } from '../../../Snackbar/Snackbar'
import CategoriesForm from '../CategoriesForm/CategoriesForm'

import formatDate from '../../../../utils/formatDate'
import useStyles from "../styles"

const initialState = {
  amount: '',
  category: {},
  type: 'Income',
  date: formatDate(new Date()),
}

const Form = () => {
  const classes = useStyles()
  const [formData, setFormData] = useState(initialState)
  const { addTransaction, user } = useContext(ExpenseTrackerContext)
  const { segment } = useSpeechContext()
  const [open, setOpen] = useState(false)
  const [categoryFormOpen, setCategoryFormOpen] = useState(false)

  const createTransaction = () => {
    if (Number.isNaN(Number(formData.amount)) || Number(formData.amount) <= 0 || formData.category === '' || !formData.date.includes('-')) return

    const transaction = {
      category: formData.category,
      date: new Date(formData.date).toISOString(),
      amount: parseFloat(formData.amount),
      id: uuidv4()
    }
    
    setOpen(true)
    console.log(transaction)
    addTransaction(transaction)
    setFormData(initialState)
  }

  const handleClickOpen = () => {
    setCategoryFormOpen(true);
  };

  const compare = (a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0)


  // useEffect(() => {
  //   if (segment) {
  //     if (segment.intent.intent === 'add_expense') {
  //       setFormData({ ...formData, type: 'Expense' })
  //     } else if (segment.intent.intent === "add_income") {
  //       setFormData({ ...formData, type: "Income" })
  //     } else if (segment.isFinal && segment.intent.intent === "create_transaction") {
  //       return createTransaction();
  //     } else if (segment.isFinal && segment.intent.intent === "cancel_transaction") {
  //       return setFormData(initialState)
  //     }

  //     segment.entities.forEach((e) => {
  //       const category = `${e.value.charAt(0)}${e.value.slice(1).toLowerCase()}`
  //       switch (e.type) {
  //         case 'amount':
  //           setFormData({ ...formData, amount: e.value })
  //           break;
  //         case 'category':
  //           if (incomeCategories.map((c) => c.type).includes(category)) {
  //             setFormData({ ...formData, category, type: "Income" })
  //           } else if (expenseCategories.map((c) => c.type).includes(category)) {
  //             setFormData({ ...formData, category, type: "Expense" })
  //           }
  //           break
  //         case 'date':
  //           setFormData({ ...formData, date: e.value })
  //           break
  //         default:
  //           break;
  //       }
  //     })

  //     if (segment.isFinal && formData.amount && formData.category && formData.type && formData.date) {
  //       return createTransaction();
  //     }
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [segment])


  // const selectedCategories = formData.type === 'Income' ? incomeCategories : expenseCategories

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
            fullWidth
            margin='dense'
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
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
          >
            {user.categories.sort(compare).filter(c => c.type === formData.type).map((c) =>
              <MenuItem key={c.name} value={c}>{c.name}</MenuItem>)
            }
            <Button variant='contained' color='primary' 
              className={classes.category_button}
              onClick={handleClickOpen}
              >
              Add New 
            </Button>
          </Select>
          <CategoriesForm open={categoryFormOpen} setOpen={setCategoryFormOpen}/>
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