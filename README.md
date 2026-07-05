# tinytasks-api

A tiny task-list REST API. Demo repo for [Docent](https://github.com/IamHarrie-Labs) — not a real product.

## Run

```
npm install
cp .env.example .env
npm start
```

## Endpoints

- `POST /login` — get a JWT for a username
- `GET /tasks` — list your tasks (auth required)
- `POST /tasks` — create a task (auth required)
