import axios, { AxiosInstance } from 'axios';
import { Task } from '../models/Task';

export class TodoClient {
  private client: AxiosInstance;

  constructor(baseUrl: string) {
    this.client = axios.create({
      baseURL: baseUrl,
      timeout: 5000,
    });
  }

  async getAllTasks(): Promise<Task[]> {
    const response = await this.client.get('/tasks');
    return response.data.map(this.transformToTask);
  }

  async createTask(task: Task): Promise<Task> {
    const response = await this.client.post('/tasks', task);
    return this.transformToTask(response.data);
  }

  async updateTask(task: Task): Promise<void> {
    await this.client.put(`/tasks/${task.id}`, task);
  }

  async deleteTask(id: string): Promise<void> {
    await this.client.delete(`/tasks/${id}`);
  }

  private transformToTask(data: any): Task {
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      completed: data.completed || false,
      createdAt: new Date(data.createdAt || Date.now()),
      updatedAt: new Date(data.updatedAt || Date.now())
    };
  }
}
