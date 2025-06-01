import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger/swagger.json';
import { taskRouter } from './controllers/tasks.controller';
import { healthCheckRouter } from './controllers/healthcheck.controller';

export const app = express();

app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/tasks', taskRouter);
app.use('/api/health', healthCheckRouter);
