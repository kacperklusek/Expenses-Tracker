import React, { useState, useContext } from 'react'
// import "./cssStyle.css"
import useStyles from './styles'
import { TextField, Grid, Button, FormControl, Card, CardContent, Switch, FormLabel } from '@material-ui/core'
import { ExpenseTrackerContext } from '../../context/context'

const LoginPopup = (props) => {
  const { addUser, getUser, getTransactions } = useContext(ExpenseTrackerContext)
  const [formData, setFormData] = useState({email: "", password: "", name:"", surname:""});
  const [register, setRegister] = useState(false);

  const submitHandler = e => {
    if (register) {
      let usr = {
        name: formData.name,
        surname: formData.surname,
        email: formData.email,
        categories: [],
        transactions: [],
        periodical_transactions: [],
        balance: 0.0
      }
      addUser(usr)
    } else { // login for now only based on email
      getUser({
        email: formData.email,
        password: formData.password
      })
    }

    // fetch first 10 transactions for our user
    // getTransactions({have: 0, n:10})

    props.setTrigger(false);
  }

  const classes = useStyles()

  return (props.trigger) ? (
    <Card className={classes.popup}>
      <CardContent className={classes.innerPopup}>
        <Grid container spacing={2}>
          {/* <CloseIcon /> */}
          <Grid item xs={12}>
            <FormLabel>Register</FormLabel>
            <Switch label="Register" color='primary' checked={register} onClick={(e) => setRegister(!register)}/>
          </Grid>
          {
            register ?
            <Grid item xs={12}>
              <FormControl fullWidth>
                <TextField type="name" label="Name" fullWidth value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value})}/>
              </FormControl>
              <FormControl fullWidth>
                <TextField type="surname" label="Surname" fullWidth value={formData.surname}
                  onChange={(e) => setFormData({ ...formData, surname: e.target.value})}/>
              </FormControl>
            </Grid>
             : ""
          }
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
            <Button className={classes.button} variant="outlined" color="primary" fullWidth onClick={submitHandler}>
              {register ? 'create account' : 'login'}
            </Button>
          </Grid>
        </Grid>
        
      </CardContent>
    </Card>
  ) : "";
}

export default LoginPopup