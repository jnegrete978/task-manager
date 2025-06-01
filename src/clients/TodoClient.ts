import axios from 'axios';
import { Task } from '../models/Task';

export class TodoClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async getAll(): Promise<Task[]> {
    const response = await axios.get(this.baseUrl);
    return response.data.slice(0, 10).map((item: any) => ({
      id: item.id.toString(),
      title: item.title,
      completed: item.completed,
    }));
  }

  async createTask(task: Task): Promise<Task> {
    const response = await axios.post(this.baseUrl, task);
    return { ...task, id: response.data.id.toString() };
  }

  async updateTask(task: Task): Promise<void> {
    await axios.put(`${this.baseUrl}/${task.id}`, task);
  }

  async deleteTask(id: string): Promise<void> {
    await axios.delete(`${this.baseUrl}/${id}`);
  }
}

