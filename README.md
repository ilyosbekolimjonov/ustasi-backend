# Ustasi Backend

Ustasi backend is now organized as a modular monolith around secure auth, repository-backed business modules, and environment-driven integrations.

## Stack

- NestJS
- TypeScript
- Prisma + PostgreSQL
- pnpm
- Swagger
- Cloudinary
- Gmail SMTP via Nodemailer
- Optional Telegram notifications

## Architecture

```txt
src/
├─ common/
├─ config/
├─ prisma/
├─ integrations/
│  ├─ cloudinary/
│  ├─ email/
│  └─ telegram/
└─ modules/
   ├─ auth/
   ├─ users/
   ├─ orders/
   ├─ basket/
   └─ uploads/
```

Core modules follow a repository-oriented layout:

- `presentation`: controllers and transport concerns
- `application`: use-case services and orchestration
- `domain`: repository contracts and core types
- `infrastructure`: Prisma repository implementations
- `dto`: request validation and Swagger metadata

## Auth Flow

- Registration creates a user with `isVerified = false` and `status = INACTIVE`
- Passwords are stored only as hashes
- Email verification uses a tokenized Gmail link, not OTP/SMS
- Refresh tokens are stored as hashes inside session records
- Logout revokes the active session
- Session listing and deletion are owner-only

## Security Defaults

- Strict global validation pipe with `whitelist`, `forbidNonWhitelisted`, and `transform`
- Centralized exception formatting
- Config validation through `Joi`
- Controlled CORS via env
- Auth-protected file uploads with MIME and size limits
- Public responses omit password hashes and verification token data

## Environment

Copy values from `.env.example` and provide real credentials for:

- `DATABASE_URL`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `JWT_ACCESS_EXPIRES_IN`
- `JWT_REFRESH_EXPIRES_IN`
- `EMAIL_USER`
- `EMAIL_PASS`
- `EMAIL_FROM`
- `APP_BASE_URL`
- `CORS_ORIGIN`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- Optional: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`

## Commands

```bash
pnpm install
pnpm prisma:generate
pnpm prisma:migrate:dev
pnpm start:dev
```

## Notes

- Legacy flat CRUD modules are intentionally left outside the new build include path while the refactor settles around the new `src/modules` architecture.
- After pulling the refactor, regenerate Prisma client before running the server because the schema has changed significantly.
