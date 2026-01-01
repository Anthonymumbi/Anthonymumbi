# Backend (Fastify + Prisma + S3 uploads)

A production-ready backend for the registration app with:
- Fastify + Zod validation
- Prisma + PostgreSQL
- S3-compatible presigned uploads (S3, Cloudflare R2, Supabase Storage, MinIO)

## Quick start (local)

```bash
cd server
cp .env.example .env
npm install
npm run prisma:generate
npm run prisma:migrate   # requires local Postgres
npm run dev
```

Routes are logged at start; default port: `4000`.

## API
- `GET /health` — health check
- `POST /api/uploads/presign` — body `{ contentType, contentLength }`; returns `{ uploadUrl, key }`
- `POST /api/register` — JSON body for member creation (includes optional `photoKey`/`photoUrl`)
- `GET /api/members` — list members
- `PUT /api/members/:id` — update
- `DELETE /api/members/:id` — delete
- `GET /api/analytics` — aggregates for charts

## Environment
See `.env.example` for all required variables: database URL, S3 bucket/credentials, and upload size/expiry limits.

## Docker (deployment wrapper)

Build and run locally with Postgres + MinIO:

```bash
cd server
docker compose up --build
```

## Deployment notes
- Works on any container host (Render, Fly.io, Railway). Set env vars and a managed Postgres + S3-compatible bucket.
- Vercel/Netlify Functions are supported if you wrap `buildServer()` in a handler; containers are recommended for background tasks.
