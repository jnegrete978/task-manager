import { Router } from 'express';
import { Task } from '../models/Task';
import { TodoClient } from '../clients/TodoClient';
import { FirebaseTaskRepository } from '../repositories/FirebaseTaskRepository';

const router = Router();
const todoClient = new TodoClient(process.env.EXTERNAL_API_URL || '');
const firebaseRepo = new FirebaseTaskRepository();

router.get('/', async (req, res) => {
  try {
    const externalTasks = await todoClient.getAllTasks();
    const firebaseTasks = await firebaseRepo.getAll();
    
    // Combinar tareas evitando duplicados
    const allTasks = [...externalTasks, ...firebaseTasks.filter(fbTask => 
      !externalTasks.some(exTask => exTask.id === fbTask.id)
    ];
    
    res.json(allTasks);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching tasks' });
  }
});

// Implementar POST, PUT, DELETE...

export const taskRouter = router;
