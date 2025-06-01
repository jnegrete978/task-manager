import { Task } from '../models/Task';
import { TodoClient } from '../clients/TodoClient';
import { FirebaseTaskRepository } from '../repositories/firebaseTask.repository';

const client = new TodoClient('https://jsonplaceholder.typicode.com/todos');
const firebaseRepo = new FirebaseTaskRepository();

export class TaskService {
  async getAllTasks(): Promise<Task[]> {
    const [external, internal] = await Promise.all([
      client.getAll(),
      firebaseRepo.getAll()
    ]);

    const merged = [...external];
    internal.forEach((task: Task) => {
      if (!merged.some(t => t.id === task.id)) {
        merged.push(task);
      }
    });

    return merged;
  }

  async createTask(task: Task): Promise<Task> {
    const newTask = await client.createTask(task);
    await firebaseRepo.save(newTask);
    return newTask;
  }

  async updateTask(id: string, task: Task): Promise<Task> {
    const updatedTask = { ...task, id };
    await client.updateTask(updatedTask);
    await firebaseRepo.save(updatedTask);
    return updatedTask;
  }

  async deleteTask(id: string): Promise<void> {
    await client.deleteTask(id);
    await firebaseRepo.delete(id);
  }
}

