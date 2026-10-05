import { config } from './config/index.js';
import app from './app.js';

const server = app.listen(config.port, () => {
  console.info(`[server] Token Management System - BE running on port ${config.port} (${config.env})`);
  console.info(`[server] API docs available at http://localhost:${config.port}/api-docs`);
});

const shutdown = (): void => {
  console.info('[server] Graceful shutdown initiated');
  server.close(() => {
    console.info('[server] HTTP server closed');
    process.exit(0);
  });
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
