import React, { useState } from 'react'
import { Card, Tabs, Tab } from '@material-ui/core'

import useStyles from "./styles"
import Forms from './Forms/Forms'
import Balance from './Balance/Balance'

const Main = () => {
  const classes = useStyles()
  const [mode, setMode] = useState(0)

  return (
    <Card className={classes.root}>
      <Tabs
        variant='fullWidth'
        value={mode}
        textColor="primary"
        indicatorColor="primary"
        onChange={(event, newMode) => {
          setMode(newMode);
        }}
      >
        <Tab label="Expenses" />
        <Tab label="Balance" />
      </Tabs>
      {/* <CardHeader title="Expense Tracker" subheader="Powered by Speechly" /> */}
      {mode === 0 ?
        <Forms />
        :
        <div className={classes.balance}>
          <Balance />
        </div>
      }

    </Card >
  )
}

export default Main