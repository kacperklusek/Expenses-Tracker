import axios from "axios";
import { saveUser } from "./context";

// state is our transactions list

export const url = "http://localhost:8000"


const contextReducer = (state, action) => {

  let transactions
  let user


  switch (action.type) {
    case "USER_IN_LOCALSTORAGE":
      user = action.payload
      console.log("setting user: " + user)
      return user
    case "DELETE_TRANSACTION":
      console.log("deleting..."+action.payload);
      transactions = state.filter((t) => t.id !== action.payload);

      axios.delete(url + '/api/transactions/'+action.payload)
        .then(res => {
          console.log("succesfully deleted transaction");
        })
        .catch(err => {
          console.log("error deleting transaction");
          return state
        })

      return transactions
    case "ADD_TRANSACTION":
      transactions = [action.payload, ...state]
      console.log(action.payload);
      axios.post(url + "/api/transactions/", action.payload)
        .then(res => {
          console.log("succesfully added transaction");
        })
        .catch(err => {
          console.log("error adding transaction");
          return state
        })
      return transactions
    case "GET_TRANSACTIONS":
      user = {...state}
      let have = action.payload.have
      let n = action.payload.n
      axios.get(url + `/api/users/${user.id}/${have}/${n}`)
        .then( res => {
          let newTransactions = [...state.transactions, ...res.data]
          user = {...state, transactions: newTransactions}
          return user
        })
        .catch(err => {
          console.log(err)
          return user
        })
      return user
    case "ADD_USER":
      user = {...state}
      axios.post(url + "/api/users", action.payload)
        .then(res => {
          console.log("added user, got response:")
          console.log(res.data.user)
          user = res.data.user
          let id = res.data.id
          user.id = id
          saveUser(user)
          return user
        })
        .catch(err => {
          console.log("error" + err)
          return state        
        })
      return user
    case "LOGIN":
      user = {...state}
      // TODO now login is based only on email, change that
      axios.get(url + "/api/users/" + action.payload.email)
        .then(res => {
          user = {...res.data}
          user.id = res.data._id
          console.log(user)
          saveUser(user)
          return user
        })
        .catch(err => {
          console.log(err)
          return state
        })
      return user
    case "SET_USER":
      return action.payload
    default:
      return state
  }
}

export default contextReducer