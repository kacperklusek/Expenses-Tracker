
# Pydantic allows auto creation of JSON Schemas from models
from pydantic import BaseModel


class Transaction(BaseModel):
    amount: int
    category: str
    type: str
    date: str
    finalDate: str | None
    period: int | None
    periodType: str | None
    id: str

class PeriodicTransaction(BaseModel):
    amount: int
    category: str
    type: str
    date: str
    finalDate: str
    period: int
    periodType: str
    id: str

