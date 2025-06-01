import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Task Manager API',
      version: '1.0.0',
    },
  },
  apis: ['./src/controllers/*.ts'],
};

const specs = swaggerJsdoc(options);

export const app = express();
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Rutas
import { taskRouter } from './controllers/tasks.controller';
app.use('/api/tasks', taskRouter);
