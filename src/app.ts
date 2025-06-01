import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { taskRouter } from './controllers/tasks.controller';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Task Manager API',
      version: '1.0.0',
      description: 'API for managing tasks with Firebase integration',
    },
    servers: [{ url: 'http://localhost:3000/api' }],
  },
  apis: ['./src/controllers/*.ts'],
};

const specs = swaggerJsdoc(options);

export const app = express();

app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use('/api/tasks', taskRouter);
