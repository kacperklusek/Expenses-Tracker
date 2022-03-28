// state is our transactions list

const contextReducer = (state, action) => {
  let transactions
  switch (action.type) {
    case "FETCH_SUCCESS":
      console.log(JSON.stringify(action.payload));
      // return []
      return action.payload

    case "DELETE_TRANSACTION":
      transactions = state.filter((t) => t.id !== action.payload);
      localStorage.setItem('transactions', JSON.stringify(transactions))
      // TODO tutaj zaktualizować w mongo itemsy

      return transactions
    case "ADD_TRANSACTION":
      transactions = [action.payload, ...state]
      localStorage.setItem('transactions', JSON.stringify(transactions))
      // TODO tutaj zaktualizować w mongo itemsy

      return transactions
    default:
      return state
  }
}

export default contextReducer