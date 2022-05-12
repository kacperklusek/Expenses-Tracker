from fastapi import FastAPI, HTTPException
import uuid
from model import Transaction, User, Category, PeriodicalTransaction

from database import (
    fetch_one_transaction,
    # fetch_all_transactions,
    # create_transaction,
    # update_transaction,
    # remove_transaction,
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

@app.get("/api/transactions/{uid}/{id}")
async def get_transaction(uid, id):
    response = await fetch_one_transaction(uid, id)
    return response

@app.post("/api/transactions/{uid}/")
async def add_transaction(uid, transaction):
    print(transaction)
    response = await add_transaction(uid, transaction)
    return response

#
#
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

