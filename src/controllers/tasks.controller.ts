import { Router } from 'express';
import { TaskService } from '../services/tasks.service';
import { Task } from '../models/Task';

export const taskRouter = Router();
const tasksService = new TaskService();

taskRouter.get('/', async (_req, res) => {
  const tasks = await tasksService.getAllTasks();
  res.json(tasks);
});

taskRouter.post('/', async (req, res) => {
  const task: Task = req.body;
  const newTask = await tasksService.createTask(task);
  res.status(201).json(newTask);
});

taskRouter.put('/:id', async (req, res) => {
  const updated = await tasksService.updateTask(req.params.id, req.body);
  res.json(updated);
});

taskRouter.delete('/:id', async (req, res) => {
  await tasksService.deleteTask(req.params.id);
  res.status(204).send();
});

