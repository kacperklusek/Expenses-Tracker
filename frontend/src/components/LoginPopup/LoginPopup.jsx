import React, { useState } from 'react'
// import "./cssStyle.css"
import useStyles from './styles'

const LoginPopup = (props) => {
  const [details, setDetails] = useState({email: "", password: ""});

  const submitHandler = e => {
    e.preventDefault();

    console.log("dziala");
    props.setTrigger(false);
    // Login(details)
  }

  const classes = useStyles()

  return (props.trigger) ? (
    <div className={classes.popup}>
      <form onSubmit={submitHandler}>
        <div className={classes.innerPopup}>
      <p>Work in progres: you can type whatever you want</p>
              {/* <button className={classes.closeBtn}
              onClick={() => props.setTrigger(false)}>
                  Close
              </button> */}
              <div className={classes.form}>
                <label htmlFor='email'>Email:</label>
                <input type="text" name="email" id="email" />
              </div>
              <div className={classes.form}>
                <label htmlFor='password'>Password:</label>
                <input type="text" name="password" id="password" />
              </div>
              <input type="submit" value="LOGIN"></input>
          </div>
      </form>
    </div>
  ) : "";
}

export default LoginPopup