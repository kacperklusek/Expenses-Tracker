import React from 'react'
import { Card, CardHeader, CardContent, Typography } from "@material-ui/core"
import { Doughnut } from 'react-chartjs-2'
import useStyles from './styles'
import useTransactions from '../../useTransactions'

import {Chart, ArcElement, Legend} from 'chart.js'
Chart.register(ArcElement, Legend);

const Details = ({title}) => {
  const classes = useStyles()
  const { total, chartData, have, balance } = useTransactions(title)
  var dis
  if (have == 0) {
    dis = title
  }
  if (have == 1) {
    dis = title  + ": $" + total + " from " + have + " transaction"
  }
  if (have > 1) {
    dis = title  + ": $" + total + " from " + have + " transactions"
  }
  const display = dis
  
  return (
    <Card className={title === "Income" ? classes.income: classes.expense} >
      <CardHeader title={display}/>
      <CardContent variant="h5">
        <Doughnut data={chartData} />
      </CardContent>
    </Card>
  )
}

export default Details