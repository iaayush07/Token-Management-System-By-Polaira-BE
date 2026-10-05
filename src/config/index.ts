import 'dotenv/config';

export const config = {
  env: process.env['NODE_ENV'] ?? 'development',
  port: parseInt(process.env['PORT'] ?? '3000', 10),
  logLevel: process.env['LOG_LEVEL'] ?? 'info',
  databaseUrl: process.env['DATABASE_URL'] ?? '',
} as const;
