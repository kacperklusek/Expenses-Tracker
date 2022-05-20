import React, { useState } from 'react'
import { Card, Tabs, Tab } from '@material-ui/core'

import useStyles from "./styles"
import Forms from './Forms/Forms'
import Balance from './Balance/Balance'
import Categories from "./Categories/Categories"
import History from "./History/History"

const Main = (props) => {
  const classes = useStyles()
  const { page } = props

  const renderSwitch = () => {
    switch (page) {
      case 0:
        return <Forms/>
      case 1:
        return <Categories />
      case 2:
        return <History />
      case 3:
        return <Balance/>
    }
  }
 

  return (
    <Card className={classes.root}>
      {renderSwitch()}

    </Card >
  )
}

export default Main