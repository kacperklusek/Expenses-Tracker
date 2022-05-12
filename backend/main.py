from fastapi import FastAPI, HTTPException
import uuid
from model import Transaction, User, Category, PeriodicalTransaction

from database import (
    fetch_one_transaction,
    fetch_n_transactions,
    push_transaction,
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


# returns _id of user with given email (id is string, and should be fetched from mongo using ObjectId(id))
@app.get("/api/users/{email}", response_model=str)
async def login(email: str):
    response = await get_id(email)
    _id = str(response.get('_id'))
    return _id

@app.get("/api/users/{uid}/{id}")
async def get_transaction(uid: str, tid: int):
    response = await fetch_one_transaction(uid, tid)
    return response

# fetch n last transactions skippinh {have} transactions because you could have already fetched {have} transactions
@app.get("/api/users/{uid}/{have}/{n}")
async def get_n_transactions(uid: str, have: int, n: int):
    response = await fetch_n_transactions(uid, have, n)
    return response

@app.post("/api/users/{uid}", response_model=Transaction)
async def add_transaction(uid: str, transaction: Transaction):
    response = await push_transaction(uid, transaction)
    return response

@app.post("/api/users", response_model=User)
async def create_user(usr: User):
    response = await add_user(usr)
    return response

# TODO delete transaction





# @app.get("/api/transactions/{id}", response_model=Transaction)
# async def get_transaction_by_id(id):
#     response = await fetch_one_transaction(id)
#     if response:
#         return response
#     raise HTTPException(404, f"There is no transaction with the id {id}")
#
#
# @app.post("/api/transactions/", response_model=Transaction)
# async def post_transaction(transaction: Transaction):
#     response = await create_transaction(transaction.dict())
#     if response:
#         return response
#     raise HTTPException(400, "Something went wrong")
#
# @app.put("/api/transactions/{id}", response_model=Transaction)
# async def put_transaction(amount, category, type, date, id):
#     response = await update_transaction(amount, category, type, date, id)
#     if response:
#         return response
#     raise HTTPException(404, f"There is no todo with the id {id}")
#
# @app.delete("/api/transactions/{id}")
# async def delete_transaction(id):
#     print(id)
#     response = await remove_transaction(id)
#     if response:
#         return f"Successfully deleted transaction with id {id}"
#     raise HTTPException(404, f"There is no todo with the id {id}")

