# Aurel Dental Studio

A polished full-stack portfolio demo for a **fictional** dental practice. Includes a responsive public website, an appointment request form backed by SQLite, and a password-protected staff dashboard. It does not represent a real clinic, clinicians, location, or live booking service.

## Stack

- React + Vite, with responsive custom CSS and Lucide icons
- Node.js + Express API
- SQLite via `better-sqlite3` (persistent local database)
- Zod server-side validation, bcrypt password hashing, express-session stored in SQLite, Helmet security headers, rate-limited public submissions and login

## Requirements

- Node.js 20 or newer
- npm

## Run locally

```bash
npm install
cp .env.example .env
```

Edit `.env` and set a unique `ADMIN_EMAIL`, an `ADMIN_PASSWORD` of at least 12 characters, and a random `SESSION_SECRET` (32+ characters). For example, generate a secret with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`. Never commit `.env`.

Initialize the administrator once:

```bash
npm run db:init
```

Start the frontend and API in development mode:

```bash
npm run dev
```

Open the Vite URL printed in the terminal (usually `http://localhost:5173`). API requests are proxied to the backend at port 3000. The staff portal is `/admin`.

## Production build / run

```bash
npm run build
NODE_ENV=production npm start
```

The Express server serves the built frontend and API on port 3000 (or `PORT`). In production, set `NODE_ENV=production`, `PORT`, `SESSION_SECRET` (32+ random characters), `ADMIN_EMAIL`, and `DATABASE_PATH` as appropriate. HTTPS is required in production because secure session cookies are enabled when `NODE_ENV=production`. Put the app behind a TLS-enabled reverse proxy or use a hosting platform that terminates TLS. Back up the SQLite database and `data/sessions.sqlite`; use persistent disk storage.

## Database

The schema is initialized automatically on server start. By default the SQLite file is `data/aurel.sqlite`; override with `DATABASE_PATH`. Appointment submissions persist across restarts. No demo appointment records are seeded. To create the first administrator, configure `.env` and run `npm run db:init`. The script refuses the example password and refuses to overwrite an existing administrator. There is no default login.

## Features

- Public landing page with service descriptions, fictional team profiles, FAQs, gallery, contact/location placeholders and appointment request form
- Server validation and persistence for appointment requests, with a generated reference number
- Rate-limited public form and login endpoints
- Staff login/logout with password hashes and server-enforced authorization
- Dashboard totals calculated from database records, searchable/filterable/paginated requests, status updates, editing, and deletion
- Request states: New, Contacted, Confirmed, Completed, Cancelled. Only staff can set a request to Confirmed
- Health check at `/api/health`

## API

- `GET /api/health`
- `GET /api/auth/me`
- `POST /api/auth/login`
- `POST /api/auth/logout` (authenticated)
- `POST /api/appointments` (public, rate-limited)
- `GET /api/admin/summary` (authenticated)
- `GET /api/admin/appointments?page=1&limit=8&status=All&q=` (authenticated)
- `GET /api/admin/appointments/:id` (authenticated)
- `PATCH /api/admin/appointments/:id` (authenticated; edit details)
- `PATCH /api/admin/appointments/:id/status` (authenticated)
- `DELETE /api/admin/appointments/:id` (authenticated)

## Brand / contact configuration

The fictional brand and all content are currently in `src/main.jsx`; colors and layout are in `src/styles.css`. Replace the illustrative image URLs with licensed practice photography before using this design for a real client. The Austin location is city-only; no street address, phone number, or real inbox is fabricated. Do not launch the fictional clinic as a real business.

## Email

Email notifications are not enabled in this build. Appointment requests are saved to SQLite and the UI says so honestly; it does not claim email was sent. SMTP variables are reserved in `.env.example` for a future integration, but no SMTP provider is required to run this app.

## Tests and limitations

Run `npm test` for the Node test suite (the project can be extended with route integration tests). Run `npm run build` to verify the production frontend bundle. Before using for a real clinic, arrange a security/privacy review, HTTPS, persistent and backed-up storage, retention/deletion policy, real verified practice information, licensed image assets, monitoring, and appropriate healthcare privacy compliance. This portfolio demo should not collect sensitive medical information or be used for real patient data without that review.

The app does not deploy itself to a public URL. Deployment requires a hosting account and persistent storage; no domain or external service credentials are assumed.
