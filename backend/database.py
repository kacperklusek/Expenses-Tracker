import motor.motor_asyncio
import pymongo
from model import Transaction

user = "test-user"
password = "test-user-password"

client = motor.motor_asyncio.AsyncIOMotorClient(f'mongodb+srv://{user}:{password}@expensestracker.p6sau.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
database = client.test
collection = database.Users




async def fetch_one_transaction(user_id, id):
    pipeline = [
        {"$match": {
            '_id': user_id,
        }},
        {'$unwind': '$transactions'},
        {'$match': {
            'transactions._id': id
        }},
        {'$replaceWith': '$transactions'}
    ]

    cursor = collection.aggregate(pipeline)

    async for doc in cursor:
        print(doc)
        document = doc

    return document

async def push_transaction(user_id, transaction):
    transaction.category = dict(transaction.category)

    pipeline = [
        {'_id': user_id},
        {'$push': {'transactions': dict(transaction)}}
    ]

    await collection.update_one(*pipeline)

    return transaction


# async def fetch_n_transactions(n):
#     transactions = []
#     cursor = collection.find({}).sort({"date": 1})
#
#
# async def fetch_all_transactions():
#     transactions = []
#     cursor = collection.find({})
#     async for document in cursor:
#         transactions.append(Transaction(**document))
#     return transactions
#
#
# async def create_transaction(tran):
#     document = tran
#     await collection.insert_one(document)
#     return document
#
#
# async def update_transaction(amount, category, type, date, id):
#     await collection.update_one({"id": id}, {"$set": {"amount": amount,
#                                                       "category": category,
#                                                       "type": type,
#                                                       "date": date}})
#     document = await collection.find_one({"id": id})
#     return document
#
#
# async def remove_transaction(id):
#     await collection.delete_one({"id": id})
#     return True

