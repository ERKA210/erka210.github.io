INSERT INTO menus (place_id, menu_json)
SELECT id,
'[
  {"id":"salad","name":"Салад","price":7500,"category":"food"},
  {"id":"buuz","name":"Шарсан бууз","price":8000,"category":"food"},
  {"id":"cola","name":"Кола 0.5л","price":2500,"category":"drink"}
]'
FROM places WHERE name='Дэлгэрэх';