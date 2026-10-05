import { Options } from 'swagger-jsdoc';

export const swaggerOptions: Options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Token Management System - BE',
      version: '1.0.0',
      description:
        'REST API for the Token Management System backend. Manages API token lifecycle including creation, rotation, revocation, and validation.',
      contact: {
        name: 'API Support',
      },
    },
    servers: [
      {
        url: '/api/v1',
        description: 'Current version',
      },
    ],
    components: {
      schemas: {
        HealthResponse: {
          type: 'object',
          required: ['success', 'data'],
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            data: {
              type: 'object',
              required: ['status', 'uptime', 'timestamp', 'environment'],
              properties: {
                status: {
                  type: 'string',
                  enum: ['healthy'],
                  example: 'healthy',
                },
                uptime: {
                  type: 'number',
                  description: 'Process uptime in seconds',
                  example: 42.7,
                },
                timestamp: {
                  type: 'string',
                  format: 'date-time',
                  example: '2026-10-05T00:00:00.000Z',
                },
                environment: {
                  type: 'string',
                  example: 'production',
                },
              },
            },
          },
        },
        ApiError: {
          type: 'object',
          required: ['success', 'error'],
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            error: {
              type: 'string',
              example: 'Not Found',
            },
            message: {
              type: 'string',
              example: 'The requested resource does not exist',
            },
          },
        },
      },
      responses: {
        NotFound: {
          description: 'Resource not found',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiError' },
            },
          },
        },
        InternalServerError: {
          description: 'Unexpected server error',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ApiError' },
            },
          },
        },
      },
    },
    tags: [
      {
        name: 'Health',
        description: 'Service liveness and readiness',
      },
    ],
  },
  apis: ['./src/routes/**/*.ts'],
};
