import React, { useContext, useState } from 'react'
import { List as MUIList, ListItem, ListItemText, ListItemSecondaryAction,
   IconButton, Slide, Typography, CardContent, Divider, TextField, Grid,
   Button, ListItemAvatar, Avatar, FormControl, Select, MenuItem, InputLabel,
   Checkbox
   } from "@material-ui/core"
import { Delete, MoneyOff } from '@material-ui/icons'


import { ExpenseTrackerContext} from '../../../context/context'
import useStyles from "./styles"
import axios from 'axios';
import formatDate from '../../../utils/formatDate';

const INITIAL_STATE = {
  fromDate: formatDate(new Date()),
  toDate: formatDate(new Date()),
  fromAmount: 0,
  toAmount: 100,
  types: [],
  categories: []
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 6.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
  getContentAnchorEl: null
};


const History = () => {
  const classes = useStyles()
  const { deleteTransaction, user, url} = useContext(ExpenseTrackerContext)
  // const [type, setType] = useState("Income")
  const [formData, setFormData] = useState(INITIAL_STATE)
  const [transactions, setTranasactions] = useState([])
  const [isFetching, setIsFetching] = useState(false)
  const [allChecked, setAllChecked] = useState(false)

  const compare = (a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0)

  const handleSearch = async () => {
    if (formData.fromDate > formData.toDate) {return}
    if (formData.categories.length === 0) {return}

    const queryData = {
      categories: formData.categories,
      from_amount: formData.fromAmount,
      from_date: new Date(formData.fromDate).toISOString(),
      to_amount: formData.toAmount,
      to_date: new Date(formData.toDate).toISOString(),
    }

    setIsFetching(true)

    axios.post(url + "/api/users/" + user.id + "/filter/transactions", queryData)
      .then(res => {
        setTranasactions(res.data)
        setIsFetching(false)
      })
      .catch(err => {
        console.log(err)
        // TODO add error message
        setIsFetching(false)
      })
  }


  const handleChange = e => {
    console.log(e.target.value)
    // set all
    if (e.target.value.indexOf("All") !== -1 && !checkAllChecked()) {
      console.log("setalll")
      setFormData({...formData, categories: user.categories.filter(c =>  formData.types.indexOf(c.type) > -1)})
      setAllChecked(true)
    } else 
    // unset all
    if (e.target.value.indexOf("All") !== -1 && checkAllChecked()) {
      console.log("unsetalll")
      setFormData({...formData, categories: []})
      setAllChecked(false)
    }
    // regular set 
    else {
      console.log("resget")
      setFormData({...formData, categories: e.target.value})
      setAllChecked(e.target.value.length === user.categories.filter(c =>  formData.types.indexOf(c.type) > -1).length
                    && e.target.value.length > 0)
    }
  }

  const checkAllChecked = () => {
    return formData.categories.length === user.categories.filter(c =>  formData.types.indexOf(c.type) > -1).length
    && formData.categories.length > 0
  }
  
  return (
    <div>
    <CardContent>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant='h5' align='center'>{user.name}'s transactions filter </Typography>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel>Type</InputLabel>
            <Select
              value={formData.types}
              onChange={(e) => setFormData({ ...formData, types: e.target.value })}
              fullWidth
              multiple
              renderValue={(selected) => selected.join(', ')}
              margin='dense'
              MenuProps={MenuProps}
            >
              {
                ["Income", "Expense"].map(name => 
                  <MenuItem key={name} value={name}>
                    <Checkbox checked={formData.types.indexOf(name) > -1} color="primary"/>
                    <ListItemText primary={name}/>
                  </MenuItem>
                )
              }
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={formData.categories}
              onChange={handleChange}
              multiple
              renderValue={(selected) => selected.map(c => c.name).join(', ')}
              MenuProps={MenuProps}
            >
                <MenuItem key={"All"} value={"All"}>
                  <Checkbox 
                    checked={allChecked} 
                    color="primary"/>
                  <ListItemText primary={"All"}/>
                </MenuItem>
              {user.categories.sort(compare).filter(c => formData.types.indexOf(c.type) > -1).map((c) =>
                <MenuItem key={c.name} value={c}>
                  <Checkbox checked={formData.categories.indexOf(c) > -1} color="primary"/>
                  <ListItemText primary={c.name}/>
                </MenuItem>)
              }
            </Select>
          </FormControl>      
        </Grid>
        <Grid item xs={6}>
          <TextField type="number" label="$ from amount" fullWidth value={formData.fromAmount}
            onChange={(e) => setFormData({ ...formData, fromAmount: e.target.value })} />
        </Grid>
        <Grid item xs={6}>
          <TextField type="number" label="$ to amount" fullWidth value={formData.toAmount}
            onChange={(e) => setFormData({ ...formData, toAmount: e.target.value })} />
        </Grid>        
        <Grid item xs={6}>
          <TextField fullWidth label="since date" type="date" value={formData.fromDate}
            onChange={(e) => {setFormData({ ...formData, fromDate: e.target.value })}} />
        </Grid>
        <Grid item xs={6}>
          <TextField fullWidth label="to date" type="date" value={formData.toDate}
            onChange={(e) => {setFormData({ ...formData, toDate: e.target.value })}} />
        </Grid>        
        <Button className={classes.button} variant="outlined" color="primary" fullWidth onClick={handleSearch}>Search</Button>
      </Grid>
    </CardContent>
    <CardContent>
      <MUIList dense={false} className={classes.list}>
        {transactions.map((transaction) => (
          // <Slide direction='down' in mountOnEnter unmountOnExit ref={lastElementRef} key={transaction.id}>
          <Slide direction='down' in mountOnEnter unmountOnExit key={transaction.id}>
            <ListItem>
              <ListItemAvatar>
                <Avatar className={transaction.category.type === "Income" ? classes.avatarIncome : classes.avatarExpense}>
                  <MoneyOff />
                </Avatar>
              </ListItemAvatar>
              <ListItemText 
              primary={transaction.category.name} 
              secondary={`$${transaction.amount} - ${new Date(transaction.date).toDateString()}`}/>
              <ListItemSecondaryAction>
                <IconButton edge="end" aria-label='delete' onClick={() => {
                  deleteTransaction(transaction.id)
                  setTranasactions(transactions.filter(t => t.id !== transaction.id))
                  }}>
                  <Delete />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          </Slide>
        ))}
        {isFetching && <Typography>loading ...</Typography>}
      </MUIList>
    </CardContent>
    </div>
  )
}

export default History