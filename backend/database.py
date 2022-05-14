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
     "type": "Income",
     "id": '1'},
    {"name": "Investments",
     "type": "Income",
     "id": '2'},
    {"name": "Gifts",
     "type": "Income",
     "id": '3'},
    {"name": "Lottery",
     "type": "Income",
     "id": '4'},
    {"name": "Car",
     "type": "Expense",
     "id": '5'},
    {"name": "Food",
     "type": "Expense",
     "id": '6'},
    {"name": "Shopping",
     "type": "Expense",
     "id": '7'},
    {"name": "Clothing",
     "type": "Expense",
     "id": '8'},
    {"name": "House",
     "type": "Expense",
     "id": '9'}
]


# Regular Transactions CRUD

async def fetch_one_transaction(user_id, tid):
    pipeline = [
        {"$match": {
            '_id': ObjectId(user_id),
        }},
        {'$unwind': '$transactions'},
        {'$replaceWith': '$transactions'},
        {'$match': {
            'id': ObjectId(tid)
        }}
    ]
    cursor = collection.aggregate(pipeline)
    async for doc in cursor:
        # TO TRZEBA ZAMIENIĆ BO SIE PSUJE WTFFF
        doc['id'] = str(doc['id'])
        print(doc)
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
        # id trzeba jak niżej zamienić na stringa, bo się sypie
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
            "transactions": {
                "id": ObjectId(tid)
            }
        }}
    ]

    res = await collection.update_one(*pipeline)
    print(res)
    return True




# periodical transactions CRUD

async def fetch_one_periodical_transaction(user_id, tid):
    pipeline = [
        {"$match": {
            '_id': ObjectId(user_id),
        }},
        {'$unwind': '$periodical_transactions'},
        {'$match': {
            'periodical_transactions': {'id': ObjectId(tid)}
        }},
        {'$replaceWith': '$periodical_transactions'},
        {'$limit': 1}
    ]
    cursor = collection.aggregate(pipeline)
    async for doc in cursor:
        # TO TRZEBA ZAMIENIĆ BO SIE PSUJE WTFFF
        doc['id'] = str(doc['id'])
        return doc
    return 1


async def fetch_n_periodical_transactions(user_id, have, n):
    pipeline = [
        {"$match": {
            '_id': ObjectId(user_id),
        }},
        {'$unwind': '$periodical_transactions'},
        {'$replaceWith': '$periodical_transactions'},
        {"$sort": {"date": -1}},
        {"$limit": n},
        {"$skip": have}
    ]

    transactions = []
    cursor = collection.aggregate(pipeline)

    async for doc in cursor:
        # id trzeba jak niżej zamienić na stringa, bo się sypie
        doc['id'] = str(doc['id'])
        transactions.append(doc)

    return transactions


async def push_periodical_transaction(user_id, p_transaction):
    p_transaction.category = dict(p_transaction.category)
    p_transaction.id = ObjectId()
    pipeline = [
        {'_id': ObjectId(user_id)},
        {'$push': {'periodical_transactions': dict(p_transaction)}}
    ]
    await collection.update_one(*pipeline)

    return p_transaction


async def remove_periodical_transaction(uid, tid):
    pipeline = [
        {"_id": ObjectId(uid)},
        {"$pull": {
            "periodical_transactions": {
                "id": ObjectId(tid)
            }
        }}
    ]

    res = await collection.update_one(*pipeline)
    print(res)
    return True



async def create_category(user_id, category):
    pipeline = [
        {'_id': ObjectId(user_id)},
        {'$push': {'categories': dict(category)}}
    ]
    category.id = ObjectId()

    await collection.update_one(*pipeline)
    return category


async def remove_category(uid, cid):
    pipeline = [
        {"_id": ObjectId(uid)},
        {"$pull": {
            "categories": {
                "id": ObjectId(cid)
            }
        }}
    ]

    res = await collection.update_one(*pipeline)
    print(res)
    return True


async def add_user(usr):
    usr.categories = INITIAL_CATEGORIES
    res = await collection.insert_one(dict(usr))
    response = {
        "user": usr,
        "id": str(res.inserted_id)
    }
    return response


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


