# Aplikacja do zarządzania personalnymi wydatkami
## Rafał Tekielski, Kacper Kłusek, Karol Wrona

### 1. Opis Projektu

Naszym celem było stworzenie aplikacji webowej do zarządzania budżetem. Aplikacja pozwala na kategoryzacje wydatków i przychodów, wyświetlanie graficznej reprezentacji zawieranych transakcji, dodawanie cyklicznych płatności oraz przewidywanie przyszłego stanu budżetu.


### 2. Stos technologiczny

* Baza danych: MongoDB
* Frontend: ReactJS
* Backend: FastApi

### 3 Deployment:
* Frontend: Netlify
* Banckend: Heroku
 Strona dostępna **[tutaj](https://expenses-tracker-ns.netlify.app/)**


### 4. Baza Danych

Baza danych składa się z kolekcji users, która przechowuje informacje o użytkownikach oraz dodanych przez nich transakcjach i kategoriach.
Struktura dokumentu w kolekcji users:

```javascript
    user = {
        _id: id,
        name: string,
        surname: string,
        hashed_password: string | null,
        email: string,
        categories: [
            {
                id: string,
                name: string,
                type: string
            },
            ...
        ],
        transactions: [
            {
                id: string,
                category: {
                    id: id,
                    name: string,
                    type: string
                },
                date: date,
                amount: float
            },
            ...
        ],
        periodical_transaction: [
            {
                id: string,
                category: {
                    id: id,
                    name: string,
                    type: string
                },
                date: date,
                finalDate: null,
                amount: float,
                period: int,
                periodType: string
            },
            ...
        ],
        balance: float,
    }
```

Tak wygląda implementacja struktury bazy danych po stronie back-endu:

model.py
```python
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
    hashed_password: str | None
    categories: List[Category]
    transactions: List[Transaction]
    periodical_transactions: List[PeriodicalTransaction]
    balance: float
```

Poza powyższymi klasami w pliku ```model.py``` znajdują się dodatkowe modele niezbędne do przetwarzania zapytań do serwera.

### 3. Operacje na bazie danych

Serwer umożliwia wykonywanie następujących operacji na bazie danych:

Pobranie dla użytkownika określonej liczby transakcji naraz:

```python
async def fetch_n_transactions(uid, have, n):
    pipeline = [
        {"$match": {
            '_id': ObjectId(uid),
        }},
        {'$unwind': '$transactions'},
        {'$replaceWith': '$transactions'},
        {"$sort": {"date": -1, "id": -1}},
        {"$limit": n},
        {"$skip": have}
    ]

    transactions = []
    cursor = collection.aggregate(pipeline)

    async for doc in cursor:
        transactions.append(doc)

    return transactions
```

Pobranie transakcji dla danego użytkownika z danego okresu:

```python
async def fetch_transactions_by_dates(uid, from_date, to_date):
    pipeline = [
        {"$match": {
            '_id': ObjectId(uid),
        }},
        {'$unwind': '$transactions'},
        {'$replaceWith': '$transactions'},
        {"$match": {
            "date": {
                "$gte": from_date,
                "$lte": to_date
            }
        }},
    ]

    transactions = []
    cursor = collection.aggregate(pipeline)

    async for doc in cursor:
        transactions.append(doc)

    return transactions
```

Pobranie transakcji według danego filtra (kategoria, data, wartość transakcji):

```python
async def fetch_filtered_transactions(uid, categories, from_date, to_date, from_amount, to_amount):
    pipeline = [
        {"$match": {
            '_id': ObjectId(uid),
        }},
        {'$unwind': '$transactions'},
        {'$replaceWith': '$transactions'},
        {"$match": {
            "date": {
                "$gte": from_date,
                "$lte": to_date
            },
            "amount": {
                "$gte": from_amount,
                "$lte": to_amount
            },
            "category.id": {
                "$in": [c.id for c in categories]
            }
        }},
    ]

    transactions = []
    cursor = collection.aggregate(pipeline)

    async for doc in cursor:
        transactions.append(doc)

    return transactions
```

Dodanie i usunięcie transakcji:

```python
async def push_transaction(uid, transaction):
    transaction.category = dict(transaction.category)
    pipeline = [
        {'_id': ObjectId(uid)},
        {'$push': {'transactions': dict(transaction)}}
    ]
    await collection.update_one(*pipeline)

    await update_balance(uid, transaction.amount, transaction.category['type'])

    return transaction


async def remove_transaction(uid, tid):
    pipeline = [
        {"_id": ObjectId(uid)},
        {"$pull": {
            "transactions": {
                "id": tid
            }
        }},
    ]

    transaction = await fetch_one_transaction(uid, tid)
    print("Tran: ", transaction)
    if not transaction:
        raise ValueError("No user with giver id or transaction with given tid")

    res = await collection.update_one(*pipeline)
    res_balance = await update_balance(uid, transaction['amount'], transaction['category']['type'])

    return True if res and res_balance else False
```

Zaktualizowanie balansu użytkownika:

```python
async def update_balance(uid, amount, tran_type):
    if tran_type == "Expense":
        amount *= -1

    res = await collection.update_one(
        {"_id": ObjectId(uid)},
        {"$inc": {
            "balance": amount
        }}
    )

    if res:
        return True
    else:
        return False
```

Pobranie określonej liczby najnowszych wydatków okresowych:

```python
async def fetch_n_periodical_transactions(uid, have, n):
    pipeline = [
        {"$match": {
            '_id': ObjectId(uid),
        }},
        {'$unwind': '$periodical_transactions'},
        {'$replaceWith': '$periodical_transactions'},
        {"$sort": {"date": -1}},
        {"$limit": n},
        {"$skip": have}
    ]

    transactions = []
    cursor = collection.aggregate(pipeline)

    async for doc in cursor:
        transactions.append(doc)

    return transactions
```

Dodanie oraz usunięcie wydatków okresowych:

```python
async def push_periodical_transaction(uid, p_transaction):
    p_transaction.category = dict(p_transaction.category)
    pipeline = [
        {'_id': ObjectId(uid)},
        {'$push': {'periodical_transactions': dict(p_transaction)}}
    ]
    await collection.update_one(*pipeline)
    return p_transaction


async def remove_periodical_transaction(uid, tid):
    pipeline = [
        {"_id": ObjectId(uid)},
        {"$pull": {
            "periodical_transactions": {
                "id": tid
            }
        }}
    ]

    res = await collection.update_one(*pipeline)
    return True
```

Funkcja, która przewiduje stan konta użytkownika:

```python
async def predict_balance(uid, end_date):
    today = datetime.today()
    # Below code is responsible for setting hour to 00:00
    today = datetime(today.year, today.month, today.day, 0, 0)
    end_date = end_date.replace(tzinfo=None)

    pipeline = [
        {"$match": {
            '_id': ObjectId(uid),
        }},
        {'$unwind': '$periodical_transactions'},
        {'$replaceWith': '$periodical_transactions'},
        {'$match': {
            "$or": [
                {'finalDate': None},
                {'finalDate': {"$gte": today}}
            ],
            "date": {"$lte": today}
        }}
    ]

    periodicals_cursor = collection.aggregate(pipeline)

    difference = 0
    async for tran in periodicals_cursor:
        final = tran['finalDate']
        if final is None or final > end_date:
            final = end_date

        diff = final - today
        diff_days = diff.days
        for days_delta in range(diff_days + 1):
            check_day = today + timedelta(days=days_delta)

            start = tran['date']
            time_delta = check_day - start
            diff_days = time_delta.days
            days_diff = check_day.day - start.day
            years_diff = check_day.year - start.year
            months_diff = check_day.month - start.month
            diff_months = (years_diff * 12) + months_diff

            period_type = tran['periodType']
            period = tran['period']
            if period_type == "Day":
                should_add = diff_days % period == 0
            elif period_type == "Month":
                should_add = (diff_months % period == 0) and \
                             (days_diff == 0)
            elif period_type == "Year":
                should_add = (years_diff % period == 0) and \
                             (months_diff == 0) and \
                             (days_diff == 0)
            else:
                raise ValueError(f"wrong period type in transaction: {period_type}")

            if should_add:
                print("adding on: ", check_day, tran['category']['type'], tran["amount"])
                tran_type = tran['category']['type']
                amount = tran['amount']
                if tran_type == "Income":
                    difference += amount
                elif tran_type == "Expense":
                    difference -= amount
                else:
                    raise ValueError(f"Wrong transaction category type: {tran.category.type}")

    return difference
```

Pobranie, dodanie, usunięcie kategori użytkownika:

```python
async def fetch_categories(uid):
    pipeline = [
        {"$match": {
            '_id': ObjectId(uid),
        }},
        {'$unwind': '$categories'},
        {'$replaceWith': '$categories'}
    ]

    categories = []
    cursor = collection.aggregate(pipeline)

    async for doc in cursor:
        categories.append(doc)

    return categories


async def create_category(uid, category):
    pipeline = [
        {'_id': ObjectId(uid)},
        {'$push': {'categories': dict(category)}}
    ]

    await collection.update_one(*pipeline)
    return category


async def remove_category(uid, cid):
    pipeline = [
        {"_id": ObjectId(uid)},
        {"$pull": {
            "categories": {
                "id": cid
            }
        }}
    ]

    res = await collection.update_one(*pipeline)
    return True if res else False
```

Rejestracja nowego użytkownika oraz logowanie. Proces rejestracji i logowania jest skomplikowany i rozbity na kilka funkcji oraz plików, dlatego w celu analizy implementacji lepiej zajrzeć do pliku ```main.py``` i przeanalizować endpointy:
 * ```/token``` - zwraca token do logowoania
 * ```/users/me``` - zwraca użytkownika na podstawie tokena
 * ```/api/users``` - rejestruje nowego użytkownika


Komunikacja z serwerem jest zaimplementowana w pliku ```main.py```

### 4. Triggery

Do dodawania nowych transakcji na podstawie periodical_transaction, dochodzi za pomocą triggera (Scheduled Trigger) działającego w serwisie Mongo Atlas. Trigger ten jest uruchamiany raz dziennie o danej godzinie (01:00). Dla każdego użytkownika wybiera aktywne w tym momencie transakcje okresowe i sprawdza czy powinien on dodać nową transakcje dla każdej z ww. transakcji.

```javascript
exports = async function() {
  const { v4: uuidv4 } = require("uuid");
  
  const collection = context.services.get("expenses-tracker-service").db("test").collection("Users");
  let users = await collection.find({}).toArray();
  
  var periodicals, pipeline;
  
  users.forEach(async user => { // for each user
    pipeline = [
      {$match: {
          _id: user._id,
      }},
      {$unwind: "$periodical_transactions"},
      {$replaceWith: "$periodical_transactions"},
      {$match: {
        $or: [{finalDate: null}, {finalDate: {$gte: new Date()}}],
        date: { $lte: new Date()}
      }}
    ]
    periodicals = await collection.aggregate(pipeline).toArray()  // find all active periodicals
    
    periodicals.forEach( async transaction => { // and now for each periodical transaction

      const today = new Date()
      const start = transaction.date;
      
      const _MS_PER_DAY = 1000 * 60 * 60 * 24;
      const diffTime = Math.abs(today - start);
      const diffDays = Math.floor(diffTime / _MS_PER_DAY);
      
      var yearsDiff = today.getFullYear() - start.getFullYear();
      var monthsDiff = today.getMonth() - start.getMonth(); // difference in months (max 11)
      var daysDiff = today.getDate() - start.getDate(); // diference in days of the month (max 31)
      var diffMonths = (today.getFullYear() - start.getFullYear()) * 12; // number of months between today and start
      diffMonths -= start.getMonth();
      diffMonths += today.getMonth();
      
      let should_add = false;
      switch (transaction.periodType) {
        case "Day":
          should_add = diffDays % transaction.period === 0;
          break;
        case "Month":
          should_add = (diffMonths % transaction.period === 0) && (daysDiff === 0);
          break;
        case "Year":
          should_add = (yearsDiff % transaction.period === 0) && (monthsDiff === 0) && (daysDiff === 0);
          break;
        default:
          console.log("error: ", transaction);
          return;
      }
      
      if (should_add) {
        let tran = {
          id: uuidv4(),
          category: transaction.category,
          date: new Date().toISOString(),
          amount: transaction.amount
        }
        
        pipeline = [
          {_id: user._id},
          {$push: {transactions: tran}}
        ]
        
        let res = await collection.updateOne(...pipeline)
      }
    })
  })
};
```

### 5. Widoki aplikacji 
*  EXPENSES

Główny widok aplikacji składa się z menu nawigującego, formsa służącego do dodawania transakcji, listy transakcji oraz wykresu prezentującego albo wydatki albo dochody danego użytkownika, w zależności od tego co chcemy w danej chwili oglądać. Dodając transakcję możemy wybrać kategorie z listy juz istniejących, albo dodać nową.

![image](https://user-images.githubusercontent.com/75839071/169917428-2f97b9d6-6702-4ac3-8db1-6c0053b3c541.png)


* CATEGORIES

W tym widoku użytkownik ma podgląd na wszystkie swoje kategorie podzielone na kategorie związane z wydatkami i kategorie związane z dochodami. W tym miejscu możemy przeglądać kategorie oraz je usuwać.

![image](https://user-images.githubusercontent.com/75839071/169917551-f2f4aee6-b88c-4a27-920c-de140c844ffe.png)

* HISTORY

Widok history umożliwia użytkownikowi wyszukiwanie transakcji w bazie danych. Udostępnione zostały 4 kryteria filtrowania: typ (expense, income), kategoria, kwota oraz data.

![image](https://user-images.githubusercontent.com/75839071/169917646-89be8572-aa16-4e36-a54c-674d02685b65.png)

* BALANCE

W tym widoku wyświetlany jest aktualny balans użytkownika, czyli po prostu różnica między dochodami, a wydatkami. W tym miejscu możemy również obliczyć spodziewnay balans w przyszłości, który obliczany jest na podstawie już wykonanych transakcji oraz symulacji transakcji okresowych.

![image](https://user-images.githubusercontent.com/75839071/169917844-008268c3-cc9e-44e7-a709-4c21bbf54ea1.png)


* LOGOWANIE

Na początku uruchamiania aplikacji pojawia się ekran do logowania, gdzie możemy się zalogować lub zarejestrować nowego użytkownika.

![image](https://user-images.githubusercontent.com/75839071/169917177-88955457-a545-4e99-9112-4575988e99c9.png)

![image](https://user-images.githubusercontent.com/75839071/169917277-563b9b47-eb3c-416b-bfb3-a090ab8f96f1.png)

