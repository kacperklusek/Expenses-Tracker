import React, { useContext, useState } from 'react'
import { List as MUIList, ListItem, ListItemAvatar, ListItemText, Avatar, ListItemSecondaryAction, IconButton, Slide, Button, Typography } from "@material-ui/core"
import { Delete, MoneyOff } from '@material-ui/icons'

import { ExpenseTrackerContext, saveUser } from '../../../context/context'
import useStyles from "./styles"
import axios from 'axios'

const List = () => {
  const classes = useStyles()
  const { deletePeriodicalTransaction, user, setUser, url } = useContext(ExpenseTrackerContext)
  const [hasMore, setHasMore] = useState(true)
  const [isFetching, setIsFetching] = useState(false)

  const loadMore = () => {
    setIsFetching(true)
    const more = 5
    axios.get(url + `/api/users/${user.id}/periodical/${user.periodical_transactions.length}/${user.periodical_transactions.length + more}`)
      .then(res => {
        const usr = {...user}
        usr.periodical_transactions = [...usr.periodical_transactions, ...res.data]
        user.periodical_transactions = [...usr.periodical_transactions, ...res.data]
        console.log(usr.periodical_transactions)
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
    <MUIList dense={false} className={classes.listPer}>
      {user.periodical_transactions.map((transaction) => (
        <Slide direction='down' in mountOnEnter unmountOnExit key={transaction.id}>
          <ListItem>
            <ListItemAvatar>
              <Avatar className={transaction.category.type === "Income" ? classes.avatarIncome : classes.avatarExpense}>
                <MoneyOff />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={`${transaction.category.name} -  $${transaction.amount}`}
              secondary={
                `since ${new Date(transaction.date).toLocaleDateString()} - every ${transaction.period > 1 ? transaction.period : ''} ${transaction.periodType}${transaction.period > 1 ? 's' : ''}`
              } />
            <ListItemSecondaryAction>
              <IconButton edge="end" aria-label='delete' onClick={() => deletePeriodicalTransaction(transaction.id)}>
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
