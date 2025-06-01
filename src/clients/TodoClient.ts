import axios from 'axios';
import { Task } from '../models/Task';

export class TodoClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async getAllTasks(): Promise<Task[]> {
    const response = await axios.get(`${this.baseUrl}/tasks`);
    return response.data.map((item: any) => this.transformToTask(item));
  }

  async createTask(task: Task): Promise<Task> {
    const response = await axios.post(`${this.baseUrl}/tasks`, task);
    return this.transformToTask(response.data);
  }

  // Implementar PUT, DELETE...

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
