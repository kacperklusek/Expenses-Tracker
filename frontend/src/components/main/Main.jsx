import React, { useState } from 'react'
import { Card, Tabs, Tab } from '@material-ui/core'
import { PushToTalkButton, PushToTalkButtonContainer, ErrorPanel } from '@speechly/react-ui'


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
    <div>
       <Card className={classes.root}>
      {renderSwitch()}

      </Card >   
      <PushToTalkButtonContainer>
        <PushToTalkButton/>
        <ErrorPanel/>
      </PushToTalkButtonContainer>
    </div>

  )
}

export default Main