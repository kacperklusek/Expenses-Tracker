from typing import List
from xmlrpc.client import boolean
from pydantic import BaseModel
from typing import List
from datetime import date, datetime


class Category(BaseModel):
    type: str
    name: str


class Transaction(BaseModel):
    category: Category
    date: datetime.date
    amount: float


class PeriodicalTransaction(BaseModel):
    category: Category
    date: datetime.date
    finalDate: datetime.date
    amount: float
    period: int
    periodType: str


class User(BaseModel):
    name: str
    surname: str
    categories: List[Category]

