from typing import List, Optional
from xmlrpc.client import boolean

from bson import ObjectId
from bson.errors import InvalidId
from pydantic import BaseModel, BaseConfig
from typing import List
from datetime import date, datetime


class OID(str):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        try:
            return ObjectId(str(v))
        except InvalidId:
            raise ValueError("Not a valid ObjectId")


class MongoModel(BaseModel):
    class Config(BaseConfig):
        json_encoders = {
            ObjectId: lambda oid: str(oid),
            datetime: lambda dt: str(dt),
        }


class Category(MongoModel):
    id: OID | None
    type: str
    name: str


class Transaction(MongoModel):
    id: OID | None
    category: Category
    date: datetime
    amount: float


class PeriodicalTransaction(MongoModel):
    id: OID | None
    category: Category
    date: str
    finalDate: str
    amount: float
    period: int
    periodType: str


class User(MongoModel):
    name: str
    surname: str
    email: str
    categories: List[Category]
    transactions: List[Transaction]
    periodical_transactions: List[PeriodicalTransaction]
    balance: float

