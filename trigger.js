exports = async function() {
  const { v4: uuidv4 } = require("uuid");
  
  const collection = context.services.get("expenses-tracker-service").db("test").collection("Users");
  let users = await collection.find({}).toArray();
  
  var periodicals, pipeline;
  
  users.forEach(async user => { // for each user
    pipeline = [
      {$match: {
          _id: user._id,
      }},
      {$unwind: "$periodical_transactions"},
      {$replaceWith: "$periodical_transactions"},
      {$match: {
        $or: [{finalDate: null}, {finalDate: {$gte: new Date()}}],
        date: { $lte: new Date()}
      }}
    ]
    periodicals = await collection.aggregate(pipeline).toArray()  // find all active periodicals
    
    periodicals.forEach( async transaction => { // and now for each periodical transaction

      const today = new Date()
      const start = transaction.date;
      
      const _MS_PER_DAY = 1000 * 60 * 60 * 24;
      const diffTime = Math.abs(today - start);
      const diffDays = Math.floor(diffTime / _MS_PER_DAY);
      
      var yearsDiff = today.getFullYear() - start.getFullYear();
      var monthsDiff = today.getMonth() - start.getMonth(); // difference in months (max 11)
      var daysDiff = today.getDate() - start.getDate(); // diference in days of the month (max 31)
      var diffMonths = (today.getFullYear() - start.getFullYear()) * 12; // number of months between today and start
      diffMonths -= start.getMonth();
      diffMonths += today.getMonth();
      
      let should_add = false;
      switch (transaction.periodType) {
        case "Day":
          should_add = diffDays % transaction.period === 0;
          break;
        case "Month":
          should_add = (diffMonths % transaction.period === 0) && (daysDiff === 0);
          break;
        case "Year":
          should_add = (yearsDiff % transaction.period === 0) && (monthsDiff === 0) && (daysDiff === 0);
          break;
        default:
          console.log("error: ", transaction);
          return;
      }
      
      if (should_add) {
        let tran = {
          id: uuidv4(),
          category: transaction.category,
          date: new Date().toISOString(),
          amount: transaction.amount
        }
        
        pipeline = [
          {_id: user._id},
          {$push: {transactions: tran}}
        ]
        
        let res = await collection.updateOne(...pipeline)
      }
    })
  })
};


