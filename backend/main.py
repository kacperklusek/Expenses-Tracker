from bson import ObjectId
from fastapi import FastAPI, HTTPException
import uuid
from model import Transaction, User, Category, PeriodicalTransaction

from database import (
    fetch_one_transaction,
    fetch_n_transactions,
    push_transaction,
    remove_transaction,
    fetch_one_periodical_transaction,
    fetch_n_periodical_transactions,
    push_periodical_transaction,
    remove_periodical_transaction,
    create_category,
    remove_category,
    add_user,
    get_id,
)

from fastapi.middleware.cors import CORSMiddleware
app = FastAPI()

origins = [
    "http://localhost:3000",
    # TODO: add deployment address if deployed
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/users/{uid}/{tid}")
async def get_transaction(uid: str, tid: str):
    response = await fetch_one_transaction(uid, tid)
    if response:
        return response
    raise HTTPException(400, f"cannot fetch transaction with id:{tid} for user_id:{uid}")

# fetch n last transactions skippinh {have} transactions because you could have already fetched {have} transactions
@app.get("/api/users/{uid}/{have}/{n}")
async def get_n_transactions(uid: str, have: int, n: int):
    response = await fetch_n_transactions(uid, have, n)
    return response

@app.post("/api/users/{uid}")
async def add_transaction(uid: str, transaction: Transaction):
    response = await push_transaction(uid, transaction)
    print(response)
    if response:
        return transaction
    raise HTTPException(400, "cannot add transaction")

@app.delete("/api/users/{uid}/{id}")
async def delete_transaction(uid: str, id: str):
    response = await remove_transaction(uid, id)
    if response:
        return f"Deleted transaction with id {id} for user with uid:{uid}"
    raise HTTPException(400, f"Error deleting transaction with id:{id} for user with uid:{uid}")



# Periodical transactions CRUD
@app.get("/api/users/{uid}/periodical/{tid}")
async def get_periodical_transaction(uid: str, tid: str):
    response = await fetch_one_periodical_transaction(uid, tid)
    if response:
        return response
    raise HTTPException(400, f"cannot fetch transaction with id:{tid} for user_id:{uid}")


# fetch n last transactions skippinh {have} transactions because you could have already fetched {have} transactions
@app.get("/api/users/{uid}/periodical/{have}/{n}")
async def get_n_periodical_transactions(uid: str, have: int, n: int):
    response = await fetch_n_periodical_transactions(uid, have, n)
    return response

@app.post("/api/users/{uid}/periodical")
async def add_periodical_transaction(uid: str, transaction: PeriodicalTransaction):
    response = await push_periodical_transaction(uid, transaction)
    print(response)
    if response:
        return transaction
    raise HTTPException(400, "cannot add periodical transaction")

@app.delete("/api/users/{uid}/periodical/{id}")
async def delete_periodical_transaction(uid: str, id: str):
    response = await remove_periodical_transaction(uid, id)
    if response:
        return f"Deleted periodical transaction with id {id} for user with uid:{uid}"
    raise HTTPException(400, f"Error deleting periodical transaction with id:{id} for user with uid:{uid}")






@app.post("/api/users/categories/{uid}")
async def add_category(uid: str, category: Category):
    response = await create_category(uid, category)
    return response

@app.delete("/api/users/categories/{uid}/{cid}")
async def delete_category(uid: str, cid: str):
    response = await remove_category(uid, cid)
    return response

@app.post("/api/users")
async def create_user(usr: User):
    response = await add_user(usr)
    return response

# returns _id of user with given email (id is string, and should be fetched from mongo using ObjectId(id))
@app.get("/api/users/{email}", response_model=str)
async def login(email: str):
    response = await get_id(email)
    _id = str(response.get('_id'))
    return _id


