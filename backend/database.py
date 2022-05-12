import motor.motor_asyncio
import pymongo
from model import Transaction

user = "test-user"
password = "test-user-password"

client = motor.motor_asyncio.AsyncIOMotorClient(f'mongodb+srv://{user}:{password}@expensestracker.p6sau.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
database = client.test
collection = database.transactions


async def fetch_one_transaction(id):
    document = await collection.find_one({"id": id})
    return document


async def fetch_all_transactions():
    transactions = []
    cursor = collection.find({})
    async for document in cursor:
        transactions.append(Transaction(**document))
    return transactions


async def create_transaction(tran):
    document = tran
    await collection.insert_one(document)
    return document


async def update_transaction(amount, category, type, date, id):
    await collection.update_one({"id": id}, {"$set": {"amount": amount,
                                                      "category": category,
                                                      "type": type,
                                                      "date": date}})
    document = await collection.find_one({"id": id})
    return document


async def remove_transaction(id):
    await collection.delete_one({"id": id})
    return True

