from typing import List, Optional
from xmlrpc.client import boolean

from bson import ObjectId
from bson.errors import InvalidId
from pydantic import BaseModel, BaseConfig
from typing import List
from datetime import datetime


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
    id: str | None | OID
    type: str
    name: str


class Transaction(MongoModel):
    id: OID | None | str
    category: Category
    date: datetime
    amount: float


class PeriodicalTransaction(MongoModel):
    id: OID | None | str
    category: Category
    date: datetime
    finalDate: datetime | None
    amount: float
    period: int
    periodType: str     # Day / Month / Year


class User(MongoModel):
    name: str
    surname: str
    email: str
    categories: List[Category]
    transactions: List[Transaction]
    periodical_transactions: List[PeriodicalTransaction]
    balance: float


class DateSelect(MongoModel):
    from_date: datetime
    to_date: datetime

