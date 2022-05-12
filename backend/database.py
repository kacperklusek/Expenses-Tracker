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


async def fetch_one_transaction(user_id, id):
    pipeline = [
        {"$match": {
            '_id': ObjectId(user_id),
        }},
        {'$unwind': '$transactions'},
        {'$match': {
            'transactions._id': id
        }},
        {'$replaceWith': '$transactions'},
        {'$limit': 1}
    ]

    cursor = collection.aggregate(pipeline)

    async for doc in cursor:
        print(doc)
        document = doc

    return document

async def push_transaction(user_id, transaction):
    transaction.category = dict(transaction.category)

    pipeline = [
        {'_id': ObjectId(user_id)},
        {'$push': {'transactions': dict(transaction)}}
    ]

    await collection.update_one(*pipeline)

    return transaction


async def add_user(usr):
    # usr = {
    #     'name': name,
    #     'surname': surname,
    #     'email': email,
    #     # 'categories': [dict(cat) for cat in INITIAL_CATEGORIES],
    #     "categories": [],
    #     "transactions": [],
    #     "periodical_transactions": [],
    #     "balance": 0.0
    # }
    res = await collection.insert_one(dict(usr))
    print(res.inserted_id)

    return usr, res.inserted_id

async def get_id(email):
    res = await collection.find_one({"email": email})
    return res

async def fetch_n_transactions(user_id, have, n):
    pipeline = [
        {"$match": {
            '_id': ObjectId(user_id),
        }},
        {'$unwind': '$transactions'},
        {'$replaceWith': '$transactions'},
        {"$limit": n},
        {"$skip": have}
    ]

    transactions = []
    cursor = collection.aggregate(pipeline)

    async for doc in cursor:
        transactions.append(doc)

    return transactions


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

