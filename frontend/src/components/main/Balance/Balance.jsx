import React, { useState, useContext } from 'react'

import { TextField, Typography, CardContent, Divider, Button, Grid } from '@material-ui/core'
import { ExpenseTrackerContext } from '../../../context/context'
// import { v4 as uuidv4 } from "uuid"
// import { useSpeechContext } from '@speechly/react-client'

import formatDate from '../../../utils/formatDate'
import useStyles from "./styles"


const initialState = {
  date: formatDate(new Date()),
}


const Balance = () => {
  const classes = useStyles()
  const { user } = useContext(ExpenseTrackerContext)
  const [formData, setFormData] = useState(initialState)
  const [targetBalance, setTargetBalance] = useState(user.balance)

  const periodicalTransactions = user.transactions.filter((transaction) => transaction.period !== null)

  const getBalance = () => {
    if (!formData.date.includes('-')) return
    const target = new Date(formData.date)
    const today = new Date()
    if (target < today) {
      return
    }
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    const diffTime = Math.abs(target - today)
    const diffDays = Math.ceil(diffTime / _MS_PER_DAY) // difference in days

    var yearsDiff = target.getFullYear() - today.getFullYear()
    var monthsDiff = target.getMonth() - today.getMonth()
    var daysDiff = target.getDate() - today.getDate() // diference in days of the month (max 31)

    var fullYears = yearsDiff - (monthsDiff > 0 || (monthsDiff === 0 && daysDiff >= 0) ? 0 : 1)
    var fullMonths = monthsDiff - (daysDiff >= 0 ? 0 : 1)

    var newBalance = user.balance

    periodicalTransactions.forEach(tran => {
      var delta = 0
      switch (tran.periodType) {
        case "Day":
          delta += Math.floor(diffDays / tran.period) * tran.amount
          break;
        case "Month":
          delta += Math.floor((yearsDiff * 12 + fullMonths) / tran.period) * tran.amount
          break;
        case "Year":
          delta += Math.floor(fullYears / tran.period) * tran.amount
          break;
        default:
          console.log("error: ", tran);
      }
      newBalance += (tran.type === "Income" ? delta : -delta)
    });

    return newBalance
  }


  return (
    <CardContent>
      <Typography align="center" variant="h5">Total Balance for today ${user.balance}</Typography>
      <Divider className={classes.divider} />
      <br />
      <Typography align="center" variant="h6">Your balance on {formData.date}: <big>${targetBalance}</big></Typography>
      <br />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField fullWidth label="Target Date" type="date" value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
        </Grid>
        <Button className={classes.button} variant="outlined" color="primary" fullWidth onClick={() => setTargetBalance(getBalance())}>Calculate</Button>
      </Grid>

    </CardContent>

  )
}

export default Balance

