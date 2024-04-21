# E2E tests with fastify and database

API in Node.js using Fastify that uses MongoDB to register customers and ensures that each test has its isolated environment, even an isolated database, thus ensuring that one result does not affect the other.


## API documentation

#### Returns all customers

```http
  GET /customers
```

#### Create a customer

```http
  POST /customers
```

| Parâmetro   | Tipo       | Descrição                                   |
| :---------- | :--------- | :------------------------------------------ |
| `name`      | `string` | **Required**.  |
| `phone`      | `string` | **Required**.  |



