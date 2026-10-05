# Token Management System - BE

REST API for the Token Management System backend. Built with Node.js, Express, and TypeScript.

## Tech Stack

- **Runtime:** Node.js ≥ 20
- **Framework:** Express 5
- **Language:** TypeScript 5.9 (strict mode)
- **Linting:** ESLint 10 + `@typescript-eslint`
- **Formatting:** Prettier 3
- **API Docs:** swagger-jsdoc + swagger-ui-express

## Project Structure

```
src/
├── config/          # Environment-variable config
├── middleware/      # Express middleware (error handler, 404)
├── routes/          # Route handlers with OpenAPI JSDoc annotations
├── types/           # Shared TypeScript types
├── app.ts           # Express app factory
├── server.ts        # HTTP server entry point
└── swagger.ts       # swagger-jsdoc base definition
scripts/
└── generate-openapi.ts   # Writes .polaira/openapi.json from route annotations
```

## Getting Started

```bash
# Install dependencies
npm install

# Copy environment file and edit values
cp .env.example .env

# Start in development mode (watch + auto-reload)
npm run dev

# Build for production
npm run build

# Start production build
npm start
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with nodemon + ts-node |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run compiled output |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Auto-fix ESLint issues |
| `npm run format` | Format with Prettier |
| `npm run format:check` | Check formatting |
| `npm run type-check` | Run `tsc --noEmit` |

## API Documentation

Interactive Swagger UI is served at `/api-docs` when the server is running.

To regenerate the static OpenAPI document:

```bash
./.polaira/emit-openapi.sh
```

Output: `.polaira/openapi.json` (not committed — see `.gitignore`).

## Routes

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/health` | Service health check |

## Security Audit

Run `npm audit` to check for known vulnerabilities. Results at scaffold time:

> Run `npm audit` after `npm install` to see current findings. Any reported vulnerabilities should be reviewed and addressed before deploying to production.

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | `development` | Runtime environment |
| `PORT` | `3000` | HTTP port |
| `LOG_LEVEL` | `info` | Log verbosity |

Copy `.env.example` to `.env` and set values for your environment.
