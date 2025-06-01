import axios from 'axios';
import { Task } from '../models/Task';
import { tasksService } from '../services/tasks.service';

export class TodoClient {
  private client = axios.create({
    baseURL: process.env.EXTERNAL_API_URL || 'https://jsonplaceholder.typicode.com',
    timeout: 5000
  });

  async getAllTasks(): Promise<Task[]> {
    const response = await this.client.get('/todos');
    return Promise.all(
      response.data.map(async (item: any) => {
        // Guardar en Firestore (generará ID automático)
        const task = await tasksService.createTask({
          title: item.title,
          completed: item.completed,
          createdAt: new Date(),
          updatedAt: new Date()
        });
        return task;
      })
    );
  }
}
