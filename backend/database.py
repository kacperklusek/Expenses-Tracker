import motor.motor_asyncio
import pymongo
from bson import ObjectId

from model import Transaction, User

user = "test-user"
password = "test-user-password"

client = motor.motor_asyncio.AsyncIOMotorClient(f'mongodb+srv://{user}:{password}@expensestracker.p6sau.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
database = client.test
collection = database.Users

INITIAL_CATEGORIES = [
    {"name": "Business",
     "type": "Income"},
    {"name": "Investments",
     "type": "Income"},
    {"name": "Gifts",
     "type": "Income"},
    {"name": "Lottery",
     "type": "Income"},

    {"name": "Car",
     "type": "Expense"},
    {"name": "Food",
     "type": "Expense"},
    {"name": "Shopping",
     "type": "Expense"},
    {"name": "Clothing",
     "type": "Expense"},
    {"name": "House",
     "type": "Expense"}
]


# Transactions CRUD

async def fetch_one_transaction(user_id, tid):
    pipeline = [
        {"$match": {
            '_id': ObjectId(user_id),
        }},
        {'$unwind': '$transactions'},
        {'$match': {
            'transactions.id': ObjectId(tid)
        }},
        {'$replaceWith': '$transactions'},
        {'$limit': 1}
    ]
    cursor = collection.aggregate(pipeline)
    async for doc in cursor:
        # TO TRZEBA ZAMIENIĆ BO SIE PSUJE WTFFF
        doc['id'] = str(doc['id'])
        return doc
    return 1


async def fetch_n_transactions(user_id, have, n):
    pipeline = [
        {"$match": {
            '_id': ObjectId(user_id),
        }},
        {'$unwind': '$transactions'},
        {'$replaceWith': '$transactions'},
        {"$sort": {"date": -1}},
        {"$limit": n},
        {"$skip": have}
    ]

    transactions = []
    cursor = collection.aggregate(pipeline)

    async for doc in cursor:
        # TO TRZEBA ZAMIENIĆ BO SIE PSUJE WTFFF
        doc['id'] = str(doc['id'])
        transactions.append(doc)

    return transactions


async def push_transaction(user_id, transaction):
    transaction.category = dict(transaction.category)
    transaction.id = ObjectId()
    pipeline = [
        {'_id': ObjectId(user_id)},
        {'$push': {'transactions': dict(transaction)}}
    ]
    await collection.update_one(*pipeline)

    return transaction


async def remove_transaction(uid, tid):
    pipeline = [
        {"_id": ObjectId(uid)},
        {"$pull": {
            "transactions": {"id": tid}
        }}
    ]

    res = await collection.update_one(*pipeline)
    print(res)
    return True




async def add_user(usr):
    res = await collection.insert_one(dict(usr))
    print(res.inserted_id)

    return usr, res.inserted_id


async def get_id(email):
    res = await collection.find_one({"email": email})
    return res


#
# async def fetch_all_transactions():
#     transactions = []
#     cursor = collection.find({})
#     async for document in cursor:
#         transactions.append(Transaction(**document))
#     return transactions


#


