from typing import List, Optional
from xmlrpc.client import boolean
from pydantic import BaseModel
from typing import List
from datetime import date, datetime


class Category(BaseModel):
    type: str
    name: str


class Transaction(BaseModel):
    category: Category
    date: str
    amount: float


class PeriodicalTransaction(BaseModel):
    category: Category
    date: str
    finalDate: str
    amount: float
    period: int
    periodType: str


class User(BaseModel):
    # id: int
    name: str
    surname: str
    email: str
    categories: List[Category]
    transactions: List[Transaction]
    periodical_transactions: List[PeriodicalTransaction]
    balance: float

