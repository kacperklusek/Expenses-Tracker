import React from 'react'
// import "./cssStyle.css"
import useStyles from './styles'

const LoginPopup = (props) => {

  const classes = useStyles()

  return (props.trigger) ? (
    <div className={classes.popup}>
        <div className={classes.innerPopup}>
            <button className={classes.closeBtn}
            onClick={() => props.setTrigger(false)}>
                Close
            </button>
            { props.children }
        </div>
    </div>
  ) : "";
}

export default LoginPopup