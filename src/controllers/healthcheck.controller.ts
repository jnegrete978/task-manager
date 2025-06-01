import { Router } from 'express';
import { FirebaseTaskRepository } from '../repositories/firebaseTask.repository';

const router = Router();
const firebaseRepo = new FirebaseTaskRepository();

router.get('/health', async (_, res) => {
    try {
        await firebaseRepo.getAllTasks();
        res.json({ 
            status: 'healthy',
            database: 'connected'
        });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
        res.status(500).json({
            status: 'unhealthy',
            database: 'disconnected',
            error: errorMessage
        });
    }
});

export const healthCheckRouter = router;
