import React, { useContext, useState } from 'react'
import { List as MUIList, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Slide, Typography, CardContent, Divider } from "@material-ui/core"
import { Delete } from '@material-ui/icons'
import { Tabs, Tab } from '@material-ui/core'

import { ExpenseTrackerContext} from '../../../context/context'
import useStyles from "./styles"

const List = () => {
  const classes = useStyles()
  const { deleteCategory, user } = useContext(ExpenseTrackerContext)
  const [type, setType] = useState("Income")

  const compare = (a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0)
  
  return (
    <CardContent>
      <Typography align="center" variant="h5">{user.name}'s Categories:</Typography>
      <Divider />
      <Tabs
          variant='fullWidth'
          textColor="primary"
          value = {type}
          indicatorColor="primary"
          onChange={(event, newValue) => {
            setType(newValue);
          }}
        >
          <Tab label="Income" value="Income"/>
          <Tab label="Expense" value="Expense" />
        </Tabs>
      <MUIList dense={false} className={classes.list}>
        {user.categories.filter(c => c.type === type).sort( compare ).map((category) => (
          // <Slide direction='down' in mountOnEnter unmountOnExit ref={lastElementRef} key={transaction.id}>
          <Slide direction='down' in mountOnEnter unmountOnExit key={category.id}>
          <ListItem>
              <ListItemText 
              primary={category.name} 
              secondary={`id: ${category.id}`}/>
              <ListItemSecondaryAction>
                <IconButton edge="end" aria-label='delete' onClick={() => deleteCategory(category.id)}>
                  <Delete />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          </Slide>
        ))}
      </MUIList>


    </CardContent>


  )
}

export default List