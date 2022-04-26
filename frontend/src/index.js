import React from 'react'
import ReactDOM from 'react-dom'

import { SpeechProvider } from '@speechly/react-client'
import { Provider } from './context/context'
import App from "./App"
import "./index.css"


ReactDOM.render(
  <SpeechProvider appId='c9be4f98-f956-4dd1-9f16-f9e606bc3ffe' language='en-US'>
    <Provider>
      <App />
    </Provider>
  </SpeechProvider>,
  document.getElementById("root")
)