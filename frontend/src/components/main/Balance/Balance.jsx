import React, { useState, useContext } from 'react'

import { TextField, Typography, CardContent, Divider, Button, Grid } from '@material-ui/core'
import { ExpenseTrackerContext } from '../../../context/context'
// import { v4 as uuidv4 } from "uuid"
// import { useSpeechContext } from '@speechly/react-client'

import formatDate from '../../../utils/formatDate'
import useStyles from "./styles"
import axios from "axios"


const initialState = {
  date: formatDate(new Date()),
}


const Balance = () => {
  const classes = useStyles()
  const { user, url } = useContext(ExpenseTrackerContext)
  const [formData, setFormData] = useState(initialState)
  const [targetBalance, setTargetBalance] = useState(user.balance)
  const [isLoading, setIsLoading] = useState(false)

  const periodicalTransactions = user.transactions.filter((transaction) => transaction.period !== null)

  const getBalance = async () => {
    if (!formData.date.includes('-')) return
    const target = new Date(formData.date)
    if (target < new Date()) {
      return
    }
    setIsLoading(true)

    var newBalance = user.balance

    axios.get(url + `/api/users/${user.id}/predict/periodical/${target.toISOString()}`)
      .then(res => {
        newBalance += res.data
        setTargetBalance(newBalance)
        setIsLoading(false)
      })
      .catch(err => {
        setTargetBalance("error")
        console.log(err)
        setIsLoading(false)
      })
  }


  return (
    <CardContent>
      <Typography align="center" variant="h5">Total Balance for today ${user.balance}</Typography>
      <Divider className={classes.divider} />
      <br />
      <Typography align="center" variant="h6">Your balance on {formData.date}: <big>${targetBalance}</big></Typography>
      { isLoading ? <Typography align="center">Loading...</Typography> : ""}
      <br />
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField fullWidth label="Target Date" type="date" value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })} />
        </Grid>
        <Button className={classes.button} variant="outlined" color="primary" fullWidth onClick={() => getBalance()}>Calculate</Button>
      </Grid>

    </CardContent>

  )
}

export default Balance

