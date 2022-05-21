import motor.motor_asyncio
from bson import ObjectId
from datetime import datetime, date, timedelta

import model

user = "test-user"
password = "test-user-password"

client = motor.motor_asyncio.AsyncIOMotorClient(
    f'mongodb+srv://{user}:{password}@expensestracker.p6sau.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
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

async def fetch_one_transaction(uid, tid):
    print(uid, tid)
    pipeline = [
        {"$match": {
            '_id': ObjectId(uid),
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


async def fetch_n_transactions(uid, have, n):
    pipeline = [
        {"$match": {
            '_id': ObjectId(uid),
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


async def fetch_transactions_by_dates(uid, from_date, to_date):
    pipeline = [
        {"$match": {
            '_id': ObjectId(uid),
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


async def fetch_filtered_transactions(uid, categories, from_date, to_date, from_amount, to_amount):
    pipeline = [
        {"$match": {
            '_id': ObjectId(uid),
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


async def push_transaction(uid, transaction):
    transaction.category = dict(transaction.category)
    pipeline = [
        {'_id': ObjectId(uid)},
        {'$push': {'transactions': dict(transaction)}}
    ]
    await collection.update_one(*pipeline)

    await update_balance(uid, transaction.amount, transaction.category['type'])

    return transaction


async def remove_transaction(uid, tid):
    pipeline = [
        {"_id": ObjectId(uid)},
        {"$pull": {
            "transactions": {
                "id": tid
            }
        }},
    ]

    transaction = await fetch_one_transaction(uid, tid)
    print("Tran: ", transaction)
    if not transaction:
        raise ValueError("No user with giver id or transaction with given tid")

    res = await collection.update_one(*pipeline)
    res_balance = await update_balance(uid, transaction['amount'], transaction['category']['type'])

    return True if res and res_balance else False


async def update_balance(uid, amount, tran_type):
    if tran_type == "Expense":
        amount *= -1

    res = await collection.update_one(
        {"_id": ObjectId(uid)},
        {"$inc": {
            "amount": amount
        }}
    )

    if res:
        return True
    else:
        return False


# periodical transactions CRUD

async def fetch_one_periodical_transaction(uid, tid):
    pipeline = [
        {"$match": {
            '_id': ObjectId(uid),
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


async def fetch_n_periodical_transactions(uid, have, n):
    pipeline = [
        {"$match": {
            '_id': ObjectId(uid),
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


async def push_periodical_transaction(uid, p_transaction):
    p_transaction.category = dict(p_transaction.category)
    pipeline = [
        {'_id': ObjectId(uid)},
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


async def predict_balance(uid, end_date):
    today = datetime.today()
    # Below code is responsible for setting hour to 00:00
    today = datetime(today.year, today.month, today.day, 0, 0)
    end_date = end_date.replace(tzinfo=None)

    pipeline = [
        {"$match": {
            '_id': ObjectId(uid),
        }},
        {'$unwind': '$periodical_transactions'},
        {'$replaceWith': '$periodical_transactions'},
        {'$match': {
            "$or": [
                {'finalDate': None},
                {'finalDate': {"$gte": today}}
            ],
            "date": {"$lte": today}
        }}
    ]

    periodicals_cursor = collection.aggregate(pipeline)

    difference = 0
    async for tran in periodicals_cursor:
        final = tran['finalDate']
        if final is None or final > end_date:
            final = end_date

        diff = final - today
        diff_days = diff.days
        for days_delta in range(diff_days + 1):
            check_day = today + timedelta(days=days_delta)

            start = tran['date']
            time_delta = check_day - start
            diff_days = time_delta.days
            days_diff = check_day.day - start.day
            years_diff = check_day.year - start.year
            months_diff = check_day.month - start.month
            diff_months = (years_diff * 12) + months_diff

            period_type = tran['periodType']
            period = tran['period']
            if period_type == "Day":
                should_add = diff_days % period == 0
            elif period_type == "Month":
                should_add = (diff_months % period == 0) and \
                             (days_diff == 0)
            elif period_type == "Year":
                should_add = (years_diff % period == 0) and \
                             (months_diff == 0) and \
                             (days_diff == 0)
            else:
                raise ValueError(f"wrong period type in transaction: {period_type}")

            if should_add:
                print("adding on: ", check_day, tran['category']['type'], tran["amount"])
                tran_type = tran['category']['type']
                amount = tran['amount']
                if tran_type == "Income":
                    difference += amount
                elif tran_type == "Expense":
                    difference -= amount
                else:
                    raise ValueError(f"Wrong transaction category type: {tran.category.type}")

    return difference


# categories CRUD
async def fetch_categories(uid):
    pipeline = [
        {"$match": {
            '_id': ObjectId(uid),
        }},
        {'$unwind': '$categories'},
        {'$replaceWith': '$categories'}
    ]

    categories = []
    cursor = collection.aggregate(pipeline)

    async for doc in cursor:
        categories.append(doc)

    return categories


async def create_category(uid, category):
    pipeline = [
        {'_id': ObjectId(uid)},
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
    return True if res else False


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
