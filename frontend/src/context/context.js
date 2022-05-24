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
}

// const initialState = JSON.parse(sessionStorage.getItem("transactions")) || [{ amount: 500, category: 'Salary', type: 'Income', date: '2020-11-16', id: '44c68123-5b86-4cc8-b915-bb9e16cebe6a' }, { amount: 225, category: 'Investments', type: 'Income', date: '2020-11-16', id: '33b295b8-a8cb-49f0-8f0d-bb268686de1a' }, { amount: 50, category: 'Salary', type: 'Income', date: '2020-11-13', id: '270304a8-b11d-4e16-9341-33df641ede64' }, { amount: 123, category: 'Car', type: 'Expense', date: '2020-11-16', id: '0f72e66e-e144-4a72-bbc1-c3c92018635e' }, { amount: 50, category: 'Pets', type: 'Expense', date: '2020-11-13', id: 'c5647dde-d857-463d-8b4e-1c866cc5f83e' }, { amount: 500, category: 'Travel', type: 'Expense', date: '2020-11-13', id: '365a4ebd-9892-4471-ad55-36077e4121a9' }, { amount: 50, category: 'Investments', type: 'Income', date: '2020-11-23', id: '80cf7e33-fc3e-4f9f-a2aa-ecf140711460' }, { amount: 500, category: 'Savings', type: 'Income', date: '2020-11-23', id: 'ef090181-21d1-4568-85c4-5646232085b2' }, { amount: 5, category: 'Savings', type: 'Income', date: '2020-11-23', id: '037a35a3-40ec-4212-abe0-cc485a98aeee' }]
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
  const getUser = (loginData) => dispatch({type: "LOGIN", payload: loginData})
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
      getUser,
      logout,
      setUser,
      user,
      url
    }}>
      {children}
    </ExpenseTrackerContext.Provider>
  )
}