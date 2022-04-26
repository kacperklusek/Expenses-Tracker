import { useContext } from "react";
import { ExpenseTrackerContext } from "./context/context";
import { incomeCategories, expenseCategories, resetCategories } from "./constants/categories";

// title can be either income or expense
const useTransactions = (title) => {
  resetCategories()
  const { transactions } = useContext(ExpenseTrackerContext)
  // only with given title and non periodical
  const transactionsPerType = transactions.filter((t) => t.type === title && t.period === null)
  // code below just sums all elements
  const total = transactionsPerType.reduce((acc, currVal) => acc += currVal.amount, 0)
  const categories = title === "Income" ? incomeCategories : expenseCategories

  transactionsPerType.forEach((t) => {
    const category = categories.find((c) => c.type === t.category)

    if (category) category.amount += t.amount
  });

  const filteredCategories = categories.filter((c) => c.amount > 0)

  const chartData = {
    labels: filteredCategories.map((c) => c.type),
    datasets: [{
      data: filteredCategories.map((c) => c.amount),
      backgroundColor: filteredCategories.map((c) => c.color),
      hoverOffset: 4,
    }]
  }

  return { total, chartData }
}

export default useTransactions