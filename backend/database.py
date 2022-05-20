import motor.motor_asyncio
from bson import ObjectId
from datetime import datetime

user = "test-user"
password = "test-user-password"

client = motor.motor_asyncio.AsyncIOMotorClient(f'mongodb+srv://{user}:{password}@expensestracker.p6sau.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
database = client.test
collection = database.Users

INITIAL_CATEGORIES = [
    {'id': str(ObjectId()),
     "name": "Business",
     "type": "Income"},
    {'id': str(ObjectId()),
     "name": "Investments",
     "type": "Income"},
    {'id': str(ObjectId()),
     "name": "Gifts",
     "type": "Income"},
    {'id': str(ObjectId()),
     "name": "Lottery",
     "type": "Income"},
    {'id': str(ObjectId()),
     "name": "Car",
     "type": "Expense"},
    {'id': str(ObjectId()),
     "name": "Food",
     "type": "Expense"},
    {'id': str(ObjectId()),
     "name": "Shopping",
     "type": "Expense"},
    {'id': str(ObjectId()),
     "name": "Clothing",
     "type": "Expense"},
    {'id': str(ObjectId()),
     "name": "House",
     "type": "Expense"}
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
            "id": tid
        }}
    ]

    cursor = collection.aggregate(pipeline)
    async for doc in cursor:
        return doc
    return False


async def fetch_n_transactions(user_id, have, n):
    pipeline = [
        {"$match": {
            '_id': ObjectId(user_id),
        }},
        {'$unwind': '$transactions'},
        {'$replaceWith': '$transactions'},
        {"$sort": {"date": -1, "id": -1}},
        {"$limit": n},
        {"$skip": have}
    ]

    transactions = []
    cursor = collection.aggregate(pipeline)

    async for doc in cursor:
        transactions.append(doc)

    return transactions


async def fetch_transactions_by_dates(user_id, from_date, to_date):
    pipeline = [
        {"$match": {
            '_id': ObjectId(user_id),
        }},
        {'$unwind': '$transactions'},
        {'$replaceWith': '$transactions'},
        {"$match": {
            "date": {
                "$gte": from_date,
                "$lte": to_date
            }
        }},
    ]

    transactions = []
    cursor = collection.aggregate(pipeline)

    async for doc in cursor:
        transactions.append(doc)

    return transactions

async def fetch_filtered_transactions(user_id, categories, from_date, to_date, from_amount, to_amount):
    pipeline = [
        {"$match": {
            '_id': ObjectId(user_id),
        }},
        {'$unwind': '$transactions'},
        {'$replaceWith': '$transactions'},
        {"$match": {
            "date": {
                "$gte": from_date,
                "$lte": to_date
            },
            "amount": {
                "$gte": from_amount,
                "$lte": to_amount
            },
            "category.id": {
                "$in": [c.id for c in categories]
            }
        }},
    ]

    transactions = []
    cursor = collection.aggregate(pipeline)

    async for doc in cursor:
        transactions.append(doc)

    print(transactions)
    return transactions


async def push_transaction(user_id, transaction):
    transaction.category = dict(transaction.category)
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
                "id": tid
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
        {'$replaceWith': '$periodical_transactions'},
        {'$match': {
            'id': tid
        }},
        {'$limit': 1}
    ]
    cursor = collection.aggregate(pipeline)
    async for doc in cursor:
        return doc
    return False


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
        transactions.append(doc)

    return transactions


async def push_periodical_transaction(user_id, p_transaction):
    p_transaction.category = dict(p_transaction.category)
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
                "id": tid
            }
        }}
    ]

    res = await collection.update_one(*pipeline)
    return True


# categories CRUD
async def fetch_categories(user_id):
    pipeline = [
        {"$match": {
            '_id': ObjectId(user_id),
        }},
        {'$unwind': '$categories'},
        {'$replaceWith': '$categories'}
    ]

    categories = []
    cursor = collection.aggregate(pipeline)

    async for doc in cursor:
        categories.append(doc)

    return categories


async def create_category(user_id, category):
    pipeline = [
        {'_id': ObjectId(user_id)},
        {'$push': {'categories': dict(category)}}
    ]

    await collection.update_one(*pipeline)
    return category


async def remove_category(uid, cid):
    pipeline = [
        {"_id": ObjectId(uid)},
        {"$pull": {
            "categories": {
                "id": cid
            }
        }}
    ]

    res = await collection.update_one(*pipeline)
    return True


async def add_user(usr):
    usr.categories = INITIAL_CATEGORIES
    res = await collection.insert_one(dict(usr))
    response = {
        "user": usr,
        "id": str(res.inserted_id)
    }
    return response


async def get_user(email):
    usr = await collection.find_one({"email": email})
    if not usr:
        return False
    usr['_id'] = str(usr.get("_id"))
    first_10_tran = await fetch_n_transactions(usr.get("_id"), 0, 10)
    first_10_tran_periodical = await fetch_n_periodical_transactions(usr.get("_id"), 0, 10)
    usr['transactions'] = first_10_tran
    usr['periodical_transactions'] = first_10_tran_periodical
    return usr



