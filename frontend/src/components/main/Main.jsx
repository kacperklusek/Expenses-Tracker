import React, {useContext, useState} from 'react'
import { Card, CardHeader, CardContent, Typography, Grid, Divider, Tabs, Tab } from '@material-ui/core'

import { ExpenseTrackerContext } from '../../context/context'
import useStyles from "./styles"
import Form from './Form/Form'
import List from './List/List'
// import InfoCard from '../InfoCard';

const Main = () => {
  const classes = useStyles()
  const { balance } = useContext(ExpenseTrackerContext)
  const [tab, setTab] = useState(0)

  return (
    <Card className={classes.root}>
      <CardHeader title="Expense Tracker" subheader="Powered by Speechly"/>
      <CardContent>
        <Typography align="center" variant="h5">Total Balance ${balance}</Typography>
        {/* <Typography variant="subtitle1" style={{lineHeight:"1.5rem", marginTop:"20px"}}>
          <InfoCard />
        </Typography> */}
        <Divider className={classes.divider}/>
        <Tabs 
          variant='fullWidth'
          value={tab}
          textColor="primary"
          indicatorColor="primary"
          onChange={(event, newValue) => {
            setTab(newValue);
          }}
        >
          <Tab label="Regular Expenses"/>
          <Tab label="Periodical Expenses" />
        </Tabs>
          <Form />
      </CardContent>
      <CardContent className={classes.cardContent}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <List />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

export default Main