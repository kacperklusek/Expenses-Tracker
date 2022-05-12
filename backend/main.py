from bson import ObjectId
from fastapi import FastAPI, HTTPException
import uuid
from model import Transaction, User, Category, PeriodicalTransaction

from database import (
    fetch_one_transaction,
    fetch_n_transactions,
    push_transaction,
    remove_transaction,
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

@app.get("/api/users/{uid}/{have}/{n}")
async def get_n_transactions(uid: str, have: int, n: int):
    response = await fetch_n_transactions(uid, have, n)
    return response

# fetch n last transactions skippinh {have} transactions because you could have already fetched {have} transactions
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



@app.post("/api/users", response_model=User)
async def create_user(usr: User):
    response = await add_user(usr)
    return response

# returns _id of user with given email (id is string, and should be fetched from mongo using ObjectId(id))
@app.get("/api/users/{email}", response_model=str)
async def login(email: str):
    response = await get_id(email)
    _id = str(response.get('_id'))
    return _id


#
# @app.delete("/api/transactions/{id}")
# async def delete_transaction(id):
#     print(id)
#     response = await remove_transaction(id)
#     if response:
#         return f"Successfully deleted transaction with id {id}"
#     raise HTTPException(404, f"There is no todo with the id {id}")

