#  @bekbrace
#  FARMSTACK Tutorial - Sunday 13.06.2021

# Pydantic allows auto creation of JSON Schemas from models
from xmlrpc.client import boolean
from pydantic import BaseModel


class Transaction(BaseModel):
  amount: int
  category: str
  type: str
  date: str
  id: str

# dobrze by było dodać do bazy kategorie
# i potem zamiast categories z constants
# pobierać dane z bazy danych, wtedy użytkownik może dodawać własne kategorie
# Dobrze by też było ustawić coś w stylu klucza głównego?
# żeby nie było można dodawać kategori o tej samej nazwie
# Postaram się to ogarnąć w wolnej chwili
# class Category(BaseModel):
#   name: str
#   color: str
#   user: boolean