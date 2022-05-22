from datetime import datetime

from bson import ObjectId
from fastapi import FastAPI, HTTPException
import uuid
from model import Transaction, User, Category, PeriodicalTransaction, FilterModel

from database import (
    fetch_one_transaction,
    fetch_n_transactions,
    push_transaction,
    remove_transaction,
    fetch_one_periodical_transaction,
    fetch_n_periodical_transactions,
    fetch_transactions_by_dates,
    fetch_filtered_transactions,
    push_periodical_transaction,
    remove_periodical_transaction,
    predict_balance,
    create_category,
    remove_category,
    fetch_categories,
    add_user,
    get_user,
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


# @app.get("/api/users/{uid}/transactions/{tid}")
# async def get_transaction(uid: str, tid: str):
#     response = await fetch_one_transaction(uid, tid)
#     if response:
#         return response
#     raise HTTPException(400, f"cannot fetch transaction with id:{tid} for user_id:{uid}")

# fetch n last transactions skipping {have} transactions because you could have already fetched {have} transactions
@app.get("/api/users/{uid}/transactions/{have}/{n}")
async def get_n_transactions(uid: str, have: int, n: int):
    response = await fetch_n_transactions(uid, have, n)
    return response


@app.get("/api/users/{uid}/by_date/transactions/{from_date}/{to_date}")
async def get_transactions_by_date(uid: str, from_date: datetime, to_date: datetime):
    response = await fetch_transactions_by_dates(uid, from_date, to_date)
    return response

# I am using post here to allow attachment of data
@app.post("/api/users/{uid}/filter/transactions")
async def filter_transactions(uid: str, filter_data: FilterModel):
    response = await fetch_filtered_transactions(
        uid,
        filter_data.categories,
        filter_data.from_date,
        filter_data.to_date,
        filter_data.from_amount,
        filter_data.to_amount
    )
    return response

@app.post("/api/users/{uid}/transactions")
async def add_transaction(uid: str, transaction: Transaction):
    response = await push_transaction(uid, transaction)
    if response:
        return transaction
    raise HTTPException(400, "cannot add transaction")

@app.delete("/api/users/{uid}/transactions/{id}")
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

@app.delete("/api/users/{uid}/periodical/{ptid}")
async def delete_periodical_transaction(uid: str, ptid: str):
    response = await remove_periodical_transaction(uid, ptid)
    if response:
        return f"Deleted periodical transaction with id {ptid} for user with uid:{uid}"
    raise HTTPException(400, f"Error deleting periodical transaction with id:{ptid} for user with uid:{uid}")

@app.get("/api/users/{uid}/predict/periodical/{end_date}")
async def get_predicted_balance(uid: str, end_date: datetime):
    response = await predict_balance(uid, end_date)
    if response or response == 0:
        return response
    raise HTTPException(400, f"Error predicting value for uid: {uid} and end_date: {end_date}")



@app.post("/api/users/{uid}/categories")
async def add_category(uid: str, category: Category):
    response = await create_category(uid, category)
    return response

@app.delete("/api/users/{uid}/categories/{cid}")
async def delete_category(uid: str, cid: str):
    response = await remove_category(uid, cid)
    return response

@app.get("/api/users/{uid}/categories")
async def get_categories(uid: str):
    response = await fetch_categories(uid)
    return response


@app.post("/api/users")
async def create_user(usr: User):
    response = await add_user(usr)
    return response

# returns _id of user with given email (id is string, and should be fetched from mongo using ObjectId(id))
@app.get("/api/users/{email}")
async def login(email: str):
    usr = await get_user(email)
    if usr:
        return usr
    raise HTTPException(400, "Error fetching user, probably no user with given email")



from database import update_balance
@app.get("/test/{uid}")
async def test(uid: str):
    await update_balance(uid, 20, "Expense")