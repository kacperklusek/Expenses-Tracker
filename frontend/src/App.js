import React, { useEffect, useRef, useState, useContext } from 'react'
import { Grid } from '@material-ui/core'
// import { PushToTalkButton, PushToTalkButtonContainer, ErrorPanel } from '@speechly/react-ui'
import { SpeechState, useSpeechContext } from '@speechly/react-client'
import { Routes, Route } from "react-router-dom";

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

  const executeScroll = () => main.current.scrollIntoView();

  useEffect(() => {
    if (speechState === SpeechState.Recording) {
      executeScroll()
    }
  }, [speechState])

  const [page, setPage] = useState(0)

  return (
    <div>
      <Routes>
        <Route path="/" element = {<LoginPopup trigger={buttonPopup} setTrigger={setButtonPopup}/>}/>
        <Route path="/main" element = {
            <div>
            <ResponsiveAppBar page={page} setPage={setPage} pages={pages}/>
            <Grid className={classes.grid} container spacing={0} alignItems="center" justifyContent="center" style={{ 'height': '100vh' }}>
              <Grid ref={main} item xs={11} md={6} style={{ 'minWidth': '325px' }} >
                <Main page={page}/>
              </Grid>
              <Grid item xs={11} md={4}>
                <DetailWrapper/>
              </Grid>
            </Grid>
            </div>
        }/>
      </Routes>
    </div>
  )
}

export default App