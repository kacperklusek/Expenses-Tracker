import axios from "axios";
// state is our transactions list

const contextReducer = (state, action) => {
  let transactions
  switch (action.type) {
    case "FETCH_SUCCESS":
      return action.payload

    case "DELETE_TRANSACTION":
      console.log("deleting..."+action.payload);
      transactions = state.filter((t) => t.id !== action.payload);

      axios.delete('http://localhost:8000/api/transactions/'+action.payload)
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
      
      axios.post("http://localhost:8000/api/transactions/", action.payload)
        .then(res => {
          console.log("succesfully added transaction");
        })
        .catch(err => {
          console.log("error adding transaction");
          return state
        })

      return transactions
    default:
      return state
  }
}

export default contextReducer