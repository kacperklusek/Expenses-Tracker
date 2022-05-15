import React from 'react'
import { Card, CardHeader, CardContent, Typography } from "@material-ui/core"
import { Doughnut } from 'react-chartjs-2'
import useStyles from './styles'
import useTransactions from '../../useTransactions'

import {Chart, ArcElement, Legend} from 'chart.js'
Chart.register(ArcElement, Legend);

const Details = ({title}) => {
  const classes = useStyles()
  const { total, chartData } = useTransactions(title)

  console.log(chartData)

  return (
    <Card className={title === "Income" ? classes.income : classes.expense}>
      <CardHeader title={title} />
      <CardContent variant="h5">
        <Typography>${total}</Typography>
        <Doughnut data={chartData} />
      </CardContent>
    </Card>
  )
}

export default Details