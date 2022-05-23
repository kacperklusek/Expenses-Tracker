import { useContext } from "react";
import { ExpenseTrackerContext } from "./context/context";

// title can be either income or expense
const useTransactions = (title) => {
  const { user } = useContext(ExpenseTrackerContext)
  // only with given title
  const transactionsPerType = user.transactions.filter((t) => t.category.type === title)
  // code below just sums all elements
  const total = transactionsPerType.reduce((acc, currVal) => acc += currVal.amount, 0)
  const categories = user.categories.filter(c => c.type === title)
  // let categories = user.transactions.map(t => t.category).filter(t => t.category.type == title)
  // categories = [...new Set(categories)]

  categories.forEach(c => c.amount = 0)
  transactionsPerType.forEach((t) => {
    const category = categories.find((c) => c.name === t.category.name)

    if (category) category.amount += t.amount
  });

  const filteredCategories = categories.filter((c) => c.amount > 0)

  const chartData = {
    labels: filteredCategories.map((c) => c.name),
    datasets: [{
      data: filteredCategories.map((c) => c.amount),
      backgroundColor: filteredCategories.map( c =>
        title === "Income" ?
        `rgb(${Math.floor(Math.random(c._id) * 160 + 90)}, 220, ${Math.floor(Math.random(c._id) * 160 + 90)})`
        :
        `rgb(166, ${Math.floor(Math.random(c._id) * 150 + 20)}, ${Math.floor(Math.random(c._id) * 150 + 20)})`
        ),
      hoverOffset: 4,
    }]
  }

  return { total, chartData }
}

export default useTransactions