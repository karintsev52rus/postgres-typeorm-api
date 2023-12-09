# API интернет-магазина на PostgreSQL и TypeORM

## API

base URL: `http://localhost:8080/api`  

### Пользователи: `/users/`  

- GET `/get_users` - все пользователи  
- GET `/get_user/:id` пользователь по id  
- POST `/login` - авторизация  
- POST `/create_user` - создать пользователя  
- DELETE `/delete/:id` - удалить пользователя  
- PUT `/update/:id` - изменить данные пользователя  

### Товары: `/products/`  

- GET `/` - все товары  
- GET `/get_user/:id` товар по id  
- POST `/create` - создать товар  
- DELETE `/delete/:id` - удалить товар  
- PUT `/update/:id` - изменить данные товара  

### Корзина: `/cart/`

- GET `/get_cart/:id` - получить корзину пользователя  
- PUT `/update_cart` - добавить новый или изменить количество товара в корзине  
- DELETE `/delete` - удалить товар из корзины  
- DELETE `/clear` - очистить корзину  
  
### Заказы: `/orders/`

- POST `/new` - создать новый Заказы  
- GET `/all` - получить список всех заказов  
- GET `/user/:id` - получить список всех заказов пользователя  
- GET `/order/:id` - получить данные и товары из заказа  
- DELETE `/delete/:id` - удалить заказ  
- PUT `/update` - изменить количество товара в заказе  
- DELETE `/delete_product` - удалить товар из заказа  
