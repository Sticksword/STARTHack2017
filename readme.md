
# API

Personas
- student
- young_professional
- young_couple
- family
- high_performer


GET  /destinations?persona=student&duration_in_days=5&month=12
[
  {
    "id": "london",
    "name": "London",
    "total_expense": 800
  }
]


GET  /details?destination=london&persona=student&duration_in_days=5&month=12
{
  "id": "london",
  "name": "London",
  "expenses": {
    "hotel": 200,
    "food": 500,
    ...
  }
}
