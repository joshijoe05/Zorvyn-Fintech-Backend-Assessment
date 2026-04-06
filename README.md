<div align="center">

# 💰 Finance Backend API

**A production-grade financial dashboard backend built with Node.js, Express, TypeScript, and PostgreSQL.**

[![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![Prisma](https://img.shields.io/badge/Prisma-6.19.3-2D3748?style=flat-square&logo=prisma&logoColor=white)](https://www.prisma.io)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

<br/>

[**🚀 Live API**](https://zorvyn-fintech-backend-assessment-production.up.railway.app/api/v1) · [**📖 Swagger Docs**](https://zorvyn-fintech-backend-assessment-production.up.railway.app/api/v1/docs/)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Test Credentials](#-test-credentials)
- [Architecture](#-architecture)
- [Database Design](#-database-design)
- [Role-Based Access Control](#-role-based-access-control)
- [API Reference](#-api-reference)
- [Project Structure](#-project-structure)
- [Environment Variables](#-environment-variables)
- [Docker Setup](#-docker-setup)
- [If I Had More Time](#-if-i-had-more-time)

---

## 🧭 Overview

A backend for a **role-based finance dashboard system** where different users interact with financial records based on their assigned role.

The system supports:

- **JWT authentication** with access + refresh token rotation and token hashing
- **Role-based access control** enforced at both middleware and data layers
- **Financial record management** with soft deletes and full audit logging
- **Dashboard analytics** powered by PostgreSQL views — data scoped per user role
- **Paginated, filterable APIs** with sort support across all list endpoints
- **Swagger UI** at `/api/v1/docs` with complete endpoint documentation

---

## 🛠 Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Runtime | Node.js 20 + TypeScript 6 | Type safety across the entire codebase |
| Framework | Express.js | Lightweight, composable middleware |
| Database | PostgreSQL 16 | Relational data, NUMERIC precision, views, partial indexes |
| ORM | Prisma 6.19.3 | Type-safe queries, migration history, clean schema DSL |
| Validation | Zod | Runtime validation + TypeScript type inference from one schema |
| Auth | JWT + bcrypt | Industry-standard, stateless access control |
| Logging | Winston | Structured logs with environment-aware formatting |
| Docs | Swagger UI (OpenAPI 3.0) | Interactive API exploration |
| Deployment | Railway (API) + Supabase (DB) | Managed postgres, instant deploys |

---

## ⚡ Quick Start

## 🐳 Docker Setup

Run the full stack locally — Postgres + API + migrations + seed — in a single command:

```bash
docker-compose up --build
```

- **PostgreSQL 16** on port `5432`
- **Finance API** on port `3000`
- Migrations and seed run automatically on first start

```bash
# Stop containers
docker-compose down

# Stop and wipe the database volume
docker-compose down -v
```

---

### Prerequisites

- Node.js 20+
- PostgreSQL 16+

### 1. Clone and install

```bash
git clone https://github.com/yourusername/finance-backend.git
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
# Fill in DATABASE_URL and JWT secrets
```

### 3. Run migrations

```bash
npm run db:migrate      # development — runs migrations + prompts if schema drifted
# or
npm run db:migrate:prod # production / CI — applies migrations without prompting
```

> **Which one to use?**
> - `db:migrate` (`prisma migrate dev`) — use locally during development. It detects schema drift, regenerates the Prisma client, and prompts before destructive changes.
> - `db:migrate:prod` (`prisma migrate deploy`) — use in CI/CD and production. Non-interactive, applies only pending migrations, never prompts.

### 4. Seed test data

```bash
npm run db:seed
```

> ⚠️ **Important** — run this after migrations. The seed script inserts 3 test users (admin, analyst, viewer) and sample financial records so you can explore the API immediately. See [Test Credentials](#-test-credentials) below.

### 5. Start the server

```bash
npm run dev            # development with hot reload
npm run build && npm start  # production build
```

API → `http://localhost:3000/api/v1`
Swagger → `http://localhost:3000/api/v1/docs`

---

## 🔑 Test Credentials

After `npm run db:seed` or `docker-compose up`:

| Role | Email | Password |
|---|---|---|
| Admin | `admin@test.com` | `Password@123` |
| Analyst | `analyst@test.com` | `Password@123` |
| Viewer | `viewer@test.com` | `Password@123` |

**To use in Swagger UI:**
1. Open the [Swagger docs](https://zorvyn-fintech-backend-assessment-production.up.railway.app/api/v1/docs/)
2. `POST /auth/login` with any credential above
3. Copy the `accessToken` from the response
4. Click **Authorize** (top right) and paste the token
5. All protected endpoints are now unlocked

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         HTTP Request                            │
└──────────────────────────────┬──────────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────────┐
│                     Express Middleware Stack                    │
│            helmet → cors → compression → body-parser            │
└──────────────────────────────┬──────────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────────┐
│                          Route Layer                            │
│   /api/v1/auth   /api/v1/records   /api/v1/categories           │
│   /api/v1/dashboard                                             │
└──────────────────────────────┬──────────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────────┐
│                    Auth + RBAC Middleware                       │
│   requireAuth  →  JWT verify  →  DB user check                  │
│   requireRole  →  ADMIN | ANALYST | VIEWER                      │
└──────────────────────────────┬──────────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────────┐
│               Zod Validation Middleware                         │
│        validate(bodySchema) | validateQuery(querySchema)        │
└──────────────────────────────┬──────────────────────────────────┘
                               │
          ┌────────────────────┼────────────────────┐
          │                    │                    │
┌─────────▼──────┐  ┌─────────▼──────┐  ┌─────────▼──────┐
│   Controller   │  │   Controller   │  │   Controller   │
│  (HTTP in/out) │  │  (HTTP in/out) │  │  (HTTP in/out) │
└─────────┬──────┘  └─────────┬──────┘  └─────────┬──────┘
          │                   │                    │
┌─────────▼──────┐  ┌─────────▼──────┐  ┌─────────▼──────┐
│    Service     │  │    Service     │  │    Service     │
│ Business logic │  │ Business logic │  │ Business logic │
└─────────┬──────┘  └─────────┬──────┘  └─────────┬──────┘
          └────────────────────┼────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────────┐
│                     Prisma ORM                                  │
│    Tables → direct read/write  |  Views → $queryRaw             │
└──────────────────────────────┬──────────────────────────────────┘
                               │
┌──────────────────────────────▼──────────────────────────────────┐
│                      PostgreSQL 16                              │
│          Tables + Indexes + Views + Audit Logs                  │
└─────────────────────────────────────────────────────────────────┘
```

### Module Structure

Each feature module is fully self-contained:

```
module/
├── module.schema.ts     ← Zod validation + inferred TypeScript types
├── module.service.ts    ← Business logic + DB queries
├── module.controller.ts ← HTTP orchestration only
└── module.routes.ts     ← Middleware chain + route registration
```

---

## 🗄 Database Design

### Entity Relationship Diagram

```
┌──────────────────┐         ┌───────────────────────┐
│      users       │         │   financial_records   │
├──────────────────┤         ├───────────────────────┤
│ id          UUID │◄────────│ id              UUID  │
│ name        TEXT │    1:N  │ user_id         UUID  │
│ email  TEXT UNIQ │         │ category_id     UUID  │
│ password_hash    │         │ amount NUMERIC(15,2)  │
│ role        ENUM │         │ type            ENUM  │
│ status      ENUM │         │ date            DATE  │
│ last_login_at    │         │ notes           TEXT  │
│ created_at       │         │ created_at            │
│ updated_at       │         │ updated_at            │
│ deleted_at  NULL │         │ deleted_at      NULL  │
└──────────────────┘         └──────────┬────────────┘
        │                               │
        │ 1:N                           │ N:1
        │                               │
┌───────▼──────────┐         ┌──────────▼────────────┐
│  refresh_tokens  │         │      categories       │
├──────────────────┤         ├───────────────────────┤
│ id          UUID │         │ id              UUID  │
│ user_id     UUID │         │ name       VARCHAR(100)│
│ token_hash  TEXT │◄──────  │ description     TEXT  │
│ expires_at       │  hashed │ color      VARCHAR(7)  │
│ is_revoked  BOOL │  before │ icon       VARCHAR(50) │
│ ip_address       │  store  │ is_system       BOOL  │
│ user_agent       │         │ created_by      UUID  │
│ created_at       │         │ created_at            │
└──────────────────┘         │ deleted_at      NULL  │
                             └───────────────────────┘
        │
        │ 1:N (polymorphic)
        │
┌───────▼──────────┐
│   audit_logs     │
├──────────────────┤
│ id          UUID │
│ entity_type ENUM │  ← USER | FINANCIAL_RECORD | CATEGORY
│ entity_id   UUID │  ← points to any audited record
│ action      ENUM │  ← CREATE | UPDATE | DELETE | LOGIN | LOGOUT
│ old_values  JSON │  ← full state before mutation
│ new_values  JSON │  ← full state after mutation
│ performed_by UUID│
│ ip_address       │
│ created_at       │  ← append-only, never updated or deleted
└──────────────────┘
```

### Database Views

Five PostgreSQL views pre-compute joined and aggregated data.
All aggregation views group by `user_id` — the service layer applies a `WHERE user_id = ?` filter on top, making role-based data scoping a simple query clause rather than application logic.

| View | Groups By | Purpose |
|---|---|---|
| `v_financial_records_detail` | — (per record) | Records joined with category + user info |
| `v_financial_summary` | `user_id` | Income, expenses, net balance per user |
| `v_category_totals` | `user_id, category_id, type` | Per-user category breakdown |
| `v_monthly_trends` | `user_id, month` | Monthly income/expense/net per user |
| `v_weekly_trends` | `user_id, week` | Weekly income/expense/net per user |

---

## 🔐 Role-Based Access Control

### Role Definitions

| Role | Description |
|---|---|
| `VIEWER` | End user — views only their own financial data and dashboard |
| `ANALYST` | Data analyst — views all records and system-wide insights |
| `ADMIN` | Administrator — full system access, manages records and categories |

### Permission Matrix

| Action | Viewer | Analyst | Admin |
|---|:---:|:---:|:---:|
| **Auth** | | | |
| Login / Logout / Refresh | ✅ | ✅ | ✅ |
| **Dashboard** | | | |
| Summary (own data) | ✅ | ✅ | ✅ |
| Category totals (own data) | ✅ | ✅ | ✅ |
| View all users' aggregated data | ❌ | ✅ | ✅ |
| Filter dashboard by `?userId=` | ❌ | ✅ | ✅ |
| **Financial Records** | | | |
| View own records | ✅ | ✅ | ✅ |
| View all users' records | ❌ | ❌ | ✅ |
| Create / Update / Delete records | ❌ | ❌ | ✅ |
| **Categories** | | | |
| View all categories | ✅ | ✅ | ✅ |
| Create / Update / Delete categories | ❌ | ❌ | ✅ |

### How RBAC is Enforced

**Route-level** — `requireRole()` middleware blocks access before the controller runs:
```typescript
router.post('/records', requireAuth, requireRole('ADMIN'), controller.create);
```

**Data-level** — Dashboard APIs accept all roles but scope the response via `buildUserFilter()`:
```typescript
// VIEWER        → WHERE user_id = their own id  (enforced, no override)
// ANALYST/ADMIN → no filter by default; ?userId= to scope to one user
function buildUserFilter(role, requestingUserId, filterUserId?) { ... }
```

---

## 📡 API Reference

**Base URL:** `https://zorvyn-fintech-backend-assessment-production.up.railway.app/api/v1`

**Swagger UI:** `https://zorvyn-fintech-backend-assessment-production.up.railway.app/api/v1/docs/`

### Authentication

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/auth/register` | Public | Register a new user |
| `POST` | `/auth/login` | Public | Login — returns access + refresh token |
| `POST` | `/auth/refresh` | Public | Exchange refresh token for new pair |
| `POST` | `/auth/logout` | 🔒 Bearer | Revoke refresh token |

### Financial Records

| Method | Endpoint | Auth | Roles | Description |
|---|---|---|---|---|
| `GET` | `/records` | 🔒 | All | Paginated list with filters |
| `GET` | `/records/:id` | 🔒 | All | Get single record |
| `POST` | `/records` | 🔒 | Admin | Create a record |
| `PATCH` | `/records/:id` | 🔒 | Admin | Update a record |
| `DELETE` | `/records/:id` | 🔒 | Admin | Soft delete a record |

**Query parameters for `GET /records`:**

| Param | Type | Default | Description |
|---|---|---|---|
| `page` | integer | `1` | Page number |
| `limit` | integer | `20` | Items per page (max 100) |
| `type` | `INCOME\|EXPENSE` | — | Filter by type |
| `categoryId` | UUID | — | Filter by category |
| `from` | `YYYY-MM-DD` | — | Filter from date |
| `to` | `YYYY-MM-DD` | — | Filter to date |
| `sortBy` | `date\|amount\|createdAt` | `date` | Sort field |
| `sortOrder` | `asc\|desc` | `desc` | Sort direction |

### Dashboard

All authenticated users can access all dashboard endpoints. Data returned is scoped by role — Viewers always see their own data, Analysts and Admins see all users by default.

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/dashboard/summary` | 🔒 | Financial totals |
| `GET` | `/dashboard/category-totals` | 🔒 | Per-category breakdown |
| `GET` | `/dashboard/trends/monthly` | 🔒 | Monthly trend data |
| `GET` | `/dashboard/trends/weekly` | 🔒 | Weekly trend data |

> Analyst and Admin can pass `?userId=<uuid>` to any dashboard endpoint to scope results to a specific user.

### Categories

| Method | Endpoint | Auth | Roles | Description |
|---|---|---|---|---|
| `GET` | `/categories` | 🔒 | All | List all categories |
| `GET` | `/categories/:id` | 🔒 | All | Get category by ID |
| `POST` | `/categories` | 🔒 | Admin | Create a category |
| `PATCH` | `/categories/:id` | 🔒 | Admin | Update a category |
| `DELETE` | `/categories/:id` | 🔒 | Admin | Delete a category |

> System categories (seeded with the application) cannot be modified or deleted by anyone.

---


## 🚀 If I Had More Time

**High priority:**
- **Cleanup job for expired refresh tokens** — a scheduled task or Postgres function to `DELETE FROM refresh_tokens WHERE expires_at < NOW()`. Without it the table grows indefinitely.
- **Email verification on register** — send a verification link and block login until confirmed. Requires `emailVerifiedAt` column and an email provider integration (Resend/Nodemailer).
- **Users management module** — `GET /users`, `PATCH /users/:id`, `PATCH /users/:id/status` for admin user management. Schema and RBAC are already designed for it.

**Medium priority:**
- **Materialized views with refresh** — convert aggregation views to materialized and refresh after record mutations. Significant performance improvement at scale.
- **GitHub Actions CI/CD** — build Docker image on push to `main`, run tests, deploy to Railway automatically.

**Nice to have:**
- **OAuth (Google / GitHub)** — `provider` and `providerId` columns on users with passport.js strategy.
- **Audit log API** — `GET /audit-logs?entityType=&entityId=` for admins. The table and indexes are already designed for this query pattern.

---

<div align="center">

Built for the Fintech Backend Assessment · [**Swagger Docs →**](https://zorvyn-fintech-backend-assessment-production.up.railway.app/api/v1/docs/)

</div>
