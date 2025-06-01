import { Router } from 'express';
import { Task } from '../models/Task';
import { TodoClient } from '../clients/TodoClient';
import { FirebaseTaskRepository } from '../repositories/FirebaseTaskRepository';

const router = Router();
const todoClient = new TodoClient(process.env.EXTERNAL_API_URL || '');
const firebaseRepo = new FirebaseTaskRepository();

// GET /api/tasks - Obtener todas las tareas (mergeadas)
router.get('/', async (req, res) => {
  try {
    const [externalTasks, firebaseTasks] = await Promise.all([
      todoClient.getAllTasks(),
      firebaseRepo.getAll()
    ]);

    const mergedTasks = [
      ...externalTasks,
      ...firebaseTasks.filter(fbTask => 
        !externalTasks.some(exTask => exTask.id === fbTask.id)
      )
    ];

    res.json(mergedTasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST /api/tasks - Crear nueva tarea
router.post('/', async (req, res) => {
  try {
    const newTask: Task = {
      ...req.body,
      id: Date.now().toString(),
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Guardar en ambos sistemas
    const [externalTask] = await Promise.all([
      todoClient.createTask(newTask),
      firebaseRepo.save(newTask)
    ]);

    res.status(201).json(externalTask);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(400).json({ error: 'Bad request' });
  }
});

// PUT /api/tasks/:id - Actualizar tarea
router.put('/:id', async (req, res) => {
  try {
    const updatedTask: Task = {
      ...req.body,
      id: req.params.id,
      updatedAt: new Date()
    };

    // Actualizar en ambos sistemas
    await Promise.all([
      todoClient.updateTask(updatedTask),
      firebaseRepo.save(updatedTask)
    ]);

    res.json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(404).json({ error: 'Task not found' });
  }
});

// DELETE /api/tasks/:id - Eliminar tarea
router.delete('/:id', async (req, res) => {
  try {
    await Promise.all([
      todoClient.deleteTask(req.params.id),
      firebaseRepo.delete(req.params.id)
    ]);

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(404).json({ error: 'Task not found' });
  }
});

export const taskRouter = router;
