import React, { useEffect, useRef, useState, useContext } from 'react'
import { Grid } from '@material-ui/core'
// import { PushToTalkButton, PushToTalkButtonContainer, ErrorPanel } from '@speechly/react-ui'
import { SpeechState, useSpeechContext } from '@speechly/react-client'

import DetailWrapper from './components/DetailWrapper/DetailWrapper'
import Main from './components/main/Main'
import useStyles from "./styles"
import LoginPopup from "./components/LoginPopup/LoginPopup"
import ResponsiveAppBar from './components/Header/Header';
import { ExpenseTrackerContext } from './context/context';

const pages = ["Expenses", "Categories", "History", "Balance"];

const App = () => {

  const { user } = useContext(ExpenseTrackerContext)
  const classes = useStyles()
  const { speechState } = useSpeechContext()
  const main = useRef(null)
  const [buttonPopup, setButtonPopup] = useState(true);


  // if (!localStorage.getItem("user")) {
  //   setButtonPopup(true)
  // }

  const executeScroll = () => main.current.scrollIntoView();

  useEffect(() => {
    if (speechState === SpeechState.Recording) {
      executeScroll()
    }
  }, [speechState])

  const [page, setPage] = useState(0)

  return (
    <div>
      {
        user.id !== null ? 
        <div>
          <ResponsiveAppBar page={page} setPage={setPage} pages={pages}/>
          {/* <button onClick={() => setButtonPopup(true)}>
            Open Popup 
          </button> */}
          <Grid className={classes.grid} container spacing={0} alignItems="center" justifyContent="center" style={{ 'height': '100vh' }}>
            <Grid item xs={11} sm={4} className={classes.desktop}>
              <DetailWrapper/>
            </Grid>
            <Grid ref={main} item xs={11} sm={6} style={{ 'minWidth': '325px' }} className={classes.main}>
              <Main page={page}/>
            </Grid>
            <Grid item xs={11} sm={4} className={classes.mobile}>
              <DetailWrapper/>
            </Grid>
          </Grid>
        </div>
        :
        <LoginPopup trigger={buttonPopup} setTrigger={setButtonPopup}/>
      }
      {/* <PushToTalkButtonContainer>
        <PushToTalkButton />
        <ErrorPanel />
      </PushToTalkButtonContainer> */}
    </div>
  )
}

export default App