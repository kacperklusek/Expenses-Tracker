import React, { useContext, useState } from 'react'
import { List as MUIList, ListItem, ListItemAvatar, ListItemText, Avatar, ListItemSecondaryAction, IconButton, Slide, Button, Typography } from "@material-ui/core"
import { Delete, MoneyOff } from '@material-ui/icons'

import { ExpenseTrackerContext, saveUser } from '../../../context/context'
import useStyles from "./styles"
import axios from 'axios'

const List = () => {
  const classes = useStyles()
  const { deleteTransaction, user, url, setUser } = useContext(ExpenseTrackerContext)
  const [hasMore, setHasMore] = useState(true)
  const [isFetching, setIsFetching] = useState(false)

  const loadMore = () => {
    setIsFetching(true)
    const more = 5
    axios.get(url + `/api/users/${user.id}/transactions/${user.transactions.length}/${user.transactions.length + more}`)
      .then(res => {
        const usr = {...user}
        usr.transactions = [...usr.transactions, ...res.data]
        user.transactions = [...usr.transactions, ...res.data]
        console.log(usr.transactions)
        setUser(usr)
        saveUser(usr)
        if(res.data.length === 0) {
          setHasMore(false)
        }
        setIsFetching(false)
      })
      .catch(err => {
        console.log(err)
      })
  }
  
  return (
    <MUIList dense={false} className={classes.listReg}>
      {user.transactions.map((transaction) => (
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
              <IconButton edge="end" aria-label='delete' onClick={() => deleteTransaction(transaction)}>
                <Delete />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        </Slide>
      ))}
      {
        hasMore ? 
        <Slide direction='down' in mountOnEnter unmountOnExit >
          <ListItem>
            <Button variant='contained' onClick={() => loadMore()}>Load More</Button>
          </ListItem>
        </Slide> : ""
      }
      {isFetching && <Typography>loading more...</Typography>}
    </MUIList>
  )
}

export default List