import { Task } from '../models/Task';
import { TodoClient } from '../clients/TodoClient';
import { FirebaseTaskRepository } from '../repositories/FirebaseTaskRepository';

const todoClient = new TodoClient(process.env.EXTERNAL_API_URL || '');
const firebaseRepo = new FirebaseTaskRepository();

export const tasksService = {
  async getAllTasks(): Promise<Task[]> {
    const [externalTasks, firebaseTasks] = await Promise.all([
      todoClient.getAllTasks(),
      firebaseRepo.getAll()
    ]);

    return [
      ...externalTasks,
      ...firebaseTasks.filter(fbTask => 
        !externalTasks.some(exTask => exTask.id === fbTask.id)
      )
    ];
  },

  async createTask(taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      completed: taskData.completed || false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await Promise.all([
      todoClient.createTask(newTask),
      firebaseRepo.save(newTask)
    ]);

    return newTask;
  },

  async updateTask(id: string, taskData: Partial<Task>): Promise<Task> {
    const updatedTask = {
      ...taskData,
      id,
      updatedAt: new Date()
    } as Task;

    await Promise.all([
      todoClient.updateTask(updatedTask),
      firebaseRepo.save(updatedTask)
    ]);

    return updatedTask;
  },

  async deleteTask(id: string): Promise<void> {
    await Promise.all([
      todoClient.deleteTask(id),
      firebaseRepo.delete(id)
    ]);
  }
};
