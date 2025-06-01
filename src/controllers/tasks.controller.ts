import { Router } from 'express';
import { tasksService } from '../services/tasks.service';

const router = Router();

router.get('/', async (_, res) => {
  try {
    const tasks = await tasksService.getAllTasks();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching tasks' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { id, ...taskData } = req.body; // Eliminar ID si existe
    const task = await tasksService.createTask(taskData);
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: 'Bad request' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    await tasksService.updateTask(req.params.id, req.body);
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ error: 'Task not found' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await tasksService.deleteTask(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(404).json({ error: 'Task not found' });
  }
});

export const taskRouter = router;
