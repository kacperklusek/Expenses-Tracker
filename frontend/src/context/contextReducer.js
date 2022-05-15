import axios from "axios";
import { saveUser, clearUser } from "./context";

// state is our transactions list

export const url = "http://localhost:8000"


const contextReducer = (state, action) => {

  let user

  switch (action.type) {
    case "USER_IN_LOCALSTORAGE":
      user = action.payload
      console.log("user found in locastorage")
      return user
    case "DELETE_TRANSACTION":
      console.log("deleting..."+action.payload);
      user = {...state}
      user.transactions = user.transactions.filter((t) => t.id !== action.payload);

      axios.delete(url + `/api/users/${user.id}/${action.payload}`)
        .then(res => {
          console.log("succesfully deleted transaction");
        })
        .catch(err => {
          console.log("error deleting transaction");
          saveUser(state)
          return state
        })
      saveUser(user)
      return user
    case "ADD_TRANSACTION":
      user = {...state}
      user.transactions = [action.payload, ...state.transactions]
      console.log("adding " + action.payload);
      axios.post(url + `/api/users/${user.id}`, action.payload)
        .then(res => {
          console.log("succesfully added transaction");
        })
        .catch(err => {
          console.log("error adding transaction");
          saveUser(state)
          return state
        })
      saveUser(user)
      return user
    case "GET_TRANSACTIONS":
      user = {...state}
      let have = action.payload.have
      let n = action.payload.n
      axios.get(url + `/api/users/${user.id}/${have}/${n}`)
        .then( res => {
          let newTransactions = [...state.transactions, ...res.data]
          newTransactions = [ ...new Set(newTransactions)]
          user = {...state, transactions: newTransactions}
          saveUser(user)
          return user
        })
        .catch(err => {
          console.log(err)
          return user
        })
      return user
    case "GET_PERIODICAL_TRANSACTIONS":
      user = {...state}
      let have_p = action.payload.have
      let n_p = action.payload.n
      axios.get(url + `/api/users/${user.id}/periodical/${have_p}/${n_p}/`)
        .then( res => {
          let newTransactions = [...state.periodical_transactions, ...res.data]
          newTransactions = [ ...new Set(newTransactions)]
          user = {...state, periodical_transactions: newTransactions}
          saveUser(user)
          console.log("save user")
          return user
        })
        .catch(err => {
          console.log(err)
          return user
        })
      return user
    case "DELETE_PERIODICAL_TRANSACTION":
      console.log("deleting..."+action.payload);
      user = {...state}
      user.periodical_transactions = user.periodical_transactions.filter((t) => t.id !== action.payload);

      axios.delete(url + `/api/users/${user.id}/periodical/${action.payload}`)
        .then(res => {
          console.log("succesfully deleted transaction");
        })
        .catch(err => {
          console.log("error deleting transaction");
          saveUser(state)
          return state
        })
        saveUser(user)
        return user
    case "ADD_PERIODICAL_TRANSACTION": 
      user = {...state}
      user.periodical_transactions = [action.payload, ...state.periodical_transactions]
      console.log("adding " + action.payload);
      axios.post(url + `/api/users/${user.id}/periodical`, action.payload)
        .then(res => {
          console.log("succesfully added transaction");
        })
        .catch(err => {
          console.log("error adding transaction");
          saveUser(state)
          return state
        })
      saveUser(user)
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
      console.log('setting user')
      return action.payload
    default:
      return state
  }
}

export default contextReducer