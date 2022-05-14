import React, { useState } from 'react'
// import "./cssStyle.css"
import useStyles from './styles'
import { TextField, Grid, Button, FormControl, Card, CardContent } from '@material-ui/core'


const LoginPopup = (props) => {
  const [formData, setFormData] = useState({email: "", password: ""});

  const submitHandler = e => {
    e.preventDefault();

    console.log("dziala");
    props.setTrigger(false);
    // Login(details)
  }

  const classes = useStyles()

  return (props.trigger) ? (
    <Card className={classes.popup}>
      <CardContent className={classes.innerPopup}>
        <Grid container spacing={2} >
          <Grid item xs={12}>
            <FormControl fullWidth color='primary'>
              <TextField type="email" label="Email" fullWidth value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value})}/>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <TextField type="password" label="Password" fullWidth value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value})}/>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button className={classes.button} variant="outlined" color="primary" fullWidth onClick={submitHandler}>Login</Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  ) : "";
}

export default LoginPopup