import React, { useEffect, useRef, useState, useContext } from 'react'
import { Grid } from '@material-ui/core'
import { SpeechState, useSpeechContext } from '@speechly/react-client'
import { Routes, Route } from "react-router-dom";

import DetailWrapper from './components/DetailWrapper/DetailWrapper'
import Main from './components/main/Main'
import useStyles from "./styles"
import LoginPopup from "./components/LoginPopup/LoginPopup"
import ResponsiveAppBar from './components/Header/Header';

const pages = ["Expenses", "Categories", "History", "Balance"];

const App = () => {

  const classes = useStyles()
  const { speechState } = useSpeechContext()
  const main = useRef(null)

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
        <Route path="/" element = {<LoginPopup/>}/>
        <Route path="/main" element = {
            <div>
            <ResponsiveAppBar page={page} setPage={setPage} pages={pages}/>
            <Grid className={classes.grid} container spacing={0} alignItems="center" justifyContent="center" style={{ 'height': '100vh' }}>
              <Grid ref={main} item xs={11} md={6} style={{ 'minWidth': '325px' }} >
                <Main page={page}/>
              </Grid>
              <Grid item xs={11} md={4} className={classes.space_bottom}>
                <DetailWrapper />
              </Grid>
            </Grid>
            </div>
        }/>
      </Routes>
    
    </div>
  )
}

export default App