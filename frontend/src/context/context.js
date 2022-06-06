import Cookies from "js-cookie";
import React, { useReducer, createContext, useEffect } from "react";

import contextReducer from './contextReducer'
import { url as URL } from "./contextReducer";

export const saveUser = (user) => {
  user = JSON.stringify(user)
  sessionStorage.setItem("user", user)
}

export const clearUser = (user) => {
  if (sessionStorage.getItem("user")){
    sessionStorage.removeItem('user')
  }
  if (Cookies.get('token') != null) {
    Cookies.remove('token')
  }
}

const initialState = {
  id: null,
  name: "",
  surname: "",
  email: "",
  categories: [],
  transactions: [],
  periodical_transactions: [],
  balance: 0.0
}

export const ExpenseTrackerContext = createContext(initialState)

export const Provider = ({ children }) => {
  const [user, dispatch] = useReducer(contextReducer, initialState)

  useEffect(() => {
    if (sessionStorage.getItem("user")) {
      let usr = JSON.parse(sessionStorage.getItem('user'))
      console.log(usr)
      dispatch({ type: "USER_IN_STORAGE", payload: usr })
      }
  }, [])

  // Action Creators
  const deleteTransaction = (tran) => dispatch({ type: "DELETE_TRANSACTION", payload: tran })
  const deletePeriodicalTransaction = (id) => dispatch({ type: "DELETE_PERIODICAL_TRANSACTION", payload: id })
  const addTransaction = (transaction) => dispatch({ type: "ADD_TRANSACTION", payload: transaction })
  const addPeriodicalTransaction = (transaction) => dispatch({ type: "ADD_PERIODICAL_TRANSACTION", payload: transaction })
  const getTransactions = (fetchData) => dispatch({type: "GET_TRANSACTIONS", payload: fetchData})
  const getPeriodicalTransactions = (fetchData) => dispatch({ type: "GET_PERIODICAL_TRANSACTIONS", payload: { have: 0, n: 10}})
  const getCategories = () => dispatch({type: "GET_CATEGORIES"})
  const addCategory = (category) => dispatch({type: "ADD_CATEGORY", payload: category})
  const deleteCategory = (id) => dispatch({type: "DELETE_CATEGORY", payload: id})
  const addUser = (userData) => dispatch({type: "ADD_USER", payload: userData})
  const logout = () => dispatch({type: "LOGOUT"})
  const setUser = (newUser) => dispatch({type: "SET_USER", payload:newUser})
  const url = URL


  return (
    <ExpenseTrackerContext.Provider value={{
      deleteTransaction,
      addTransaction,
      getTransactions,
      getPeriodicalTransactions,
      addPeriodicalTransaction,
      deletePeriodicalTransaction,
      addCategory,
      deleteCategory,
      getCategories,
      addUser,
      logout,
      setUser,
      user,
      url
    }}>
      {children}
    </ExpenseTrackerContext.Provider>
  )
}