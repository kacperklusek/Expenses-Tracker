import axios from "axios";
import { saveUser, clearUser } from "./context";

export const url = "http://localhost:8000"


const contextReducer = (state, action) => {

  let user

  switch (action.type) {
    case "USER_IN_STORAGE":
      user = action.payload
      console.log("user found in locastorage")
      return user
    case "DELETE_TRANSACTION":
      console.log("deleting..."+action.payload);
      user = {...state}
      user.transactions = user.transactions.filter((t) => t.id !== action.payload.id);
      user.balance -= action.payload.category.type == "Income" ? action.payload.amount : -action.payload.amount

      axios.delete(url + `/api/users/${user.id}/transactions/${action.payload.id}`)
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
      user.transactions = [...new Set(user.transactions)]
      user.balance += action.payload.category.type == "Income" ? action.payload.amount : -action.payload.amount
      
      axios.post(url + `/api/users/${user.id}/transactions`, action.payload)
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
      axios.get(url + `/api/users/${user.id}/transactions/${have}/${n}`)
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
      user.periodical_transactions = [...new Set(user.periodical_transactions)]
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

    case "GET_CATEGORIES":
      user = {...state}
      axios.get(url + `/api/users/${user.id}/categories`)
        .then( res => {
          user = {...state, transactions: res.data}
          saveUser(user)
          return user
        })
        .catch(err => {
          console.log(err)
          return user
        })
      return user
    case "ADD_CATEGORY":
      user = {...state}
      user.categories = [action.payload, ...state.categories]
      user.categories = [...new Set(user.categories)]
      console.log("adding " + action.payload);
      axios.post(url + `/api/users/${user.id}/categories`, action.payload)
        .then(res => {
          console.log("succesfully added category");
        })
        .catch(err => {
          console.log("error adding category");
          saveUser(state)
          return state
        })
      saveUser(user)
      return user
    case "DELETE_CATEGORY":
      console.log("deleting..."+action.payload);
      user = {...state}
      user.categories = user.categories.filter((c) => c.id !== action.payload);

      axios.delete(url + `/api/users/${user.id}/categories/${action.payload}`)
        .then(res => {
          console.log("succesfully deleted category");
        })
        .catch(err => {
          console.log("error deleting category");
          saveUser(state)
          return state
        })
        saveUser(user)
        return user

    case "ADD_USER":
      user = {...state}
      axios.post(url + "/api/users", action.payload)
        .then(res => {
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
    case "LOGOUT":
      user = {...state}
      user.id = null
      clearUser()
      return user
    case "SET_USER":
      console.log('setting user')
      return action.payload
    default:
      return state
  }
}

export default contextReducer