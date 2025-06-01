import express from 'express';
import { config } from 'dotenv';
import { taskRouter } from './controllers/tasks.controller';
import { healthRouter } from './controllers/healthcheck.controller';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger/swagger.json';

config();

export const app = express();

app.use(express.json());
app.use('/api/tasks', taskRouter);
app.use('/api/health', healthRouter);
app.use('/swagger-ui.html', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
