import React, { useEffect, useRef, useState, useContext } from 'react'
import { Grid } from '@material-ui/core'
// import { PushToTalkButton, PushToTalkButtonContainer, ErrorPanel } from '@speechly/react-ui'
import { SpeechState, useSpeechContext } from '@speechly/react-client'
import { ExpenseTrackerContext } from './context/context'

import DetailWrapper from './components/DetailWrapper/DetailWrapper'
import Main from './components/main/Main'
import useStyles from "./styles"
import LoginPopup from "./components/LoginPopup/LoginPopup"

const App = () => {
  const classes = useStyles()
  const { speechState } = useSpeechContext()
  const { user, getTransactions } = useContext(ExpenseTrackerContext)
  const main = useRef(null)
  const [buttonPopup, setButtonPopup] = useState(true);

  if (localStorage.getItem("uid") && !user.id) {
    setButtonPopup(false)
    user.id = localStorage.getItem("uid")
    getTransactions({"have": 0, "n": 10})
  }

  const executeScroll = () => main.current.scrollIntoView();

  useEffect(() => {
    if (speechState === SpeechState.Recording) {
      executeScroll()
    }
  }, [speechState])

  return (
    <div>
      {/* <button onClick={() => setButtonPopup(true)}>
         Open Popup 
      </button> */}
      <Grid className={classes.grid} container spacing={0} alignItems="center" justifyContent="center" style={{ 'height': '100vh' }}>
        <Grid item xs={11} sm={4} className={classes.desktop}>
          <DetailWrapper/>
        </Grid>
        <Grid ref={main} item xs={11} sm={6} style={{ 'minWidth': '325px' }} className={classes.main}>
          <Main />
        </Grid>
        <Grid item xs={11} sm={4} className={classes.mobile}>
          <DetailWrapper/>
        </Grid>
      </Grid>
      <LoginPopup trigger={buttonPopup} setTrigger={setButtonPopup}/>
      {/* <PushToTalkButtonContainer>
        <PushToTalkButton />
        <ErrorPanel />
      </PushToTalkButtonContainer> */}
    </div>
  )
}

export default App