# Server (SQLite + Express)

Quick backend for the registration app.

Run:

```bash
cd server
npm install
npm start
```

API:
- `GET /api/health` - health check
- `POST /api/register` - body `{ name, email, phone }`
- `GET /api/members` - list members
