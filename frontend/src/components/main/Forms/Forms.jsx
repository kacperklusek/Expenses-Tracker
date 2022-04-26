import React, { useState } from 'react'
import { CardContent, Typography, Divider, Tabs, Tab, Grid } from '@material-ui/core'

import Form from './Form/Form'
import FormPeriodical from "./FormPeriodical/FormPeriodical"
import useStyles from "./styles"
import InfoCard from '../../InfoCard';
import List from '../List/List'
import ListPeriodical from '../List/ListPeriodical'


const Forms = () => {
  const classes = useStyles()
  const [tab, setTab] = useState(0)


  return (
    <div>
      <CardContent>
        <Tabs
          variant='fullWidth'
          value={tab}
          textColor="primary"
          indicatorColor="primary"
          onChange={(event, newValue) => {
            setTab(newValue);
          }}
        >
          <Tab label="Regular Expenses" />
          <Tab label="Periodical Expenses" />
        </Tabs>
        {tab === 0 ? <Form /> : <FormPeriodical />}
      </CardContent>

      <Divider className={classes.divider} />
      <CardContent className={classes.cardContent}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            {tab === 0 ? <List /> : <ListPeriodical />}
          </Grid>
        </Grid>
      </CardContent>
    </div>

  )
}

export default Forms