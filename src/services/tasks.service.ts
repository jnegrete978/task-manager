import { FirebaseTaskRepository } from '../repositories/firebaseTask.repository';
import { Task } from '../models/Task';

const firebaseRepo = new FirebaseTaskRepository();

export const tasksService = {
  async createTask(taskData: Omit<Task, 'id'>): Promise<Task> {
    return await firebaseRepo.createTask(taskData);
  },

  async getAllTasks(): Promise<Task[]> {
    return await firebaseRepo.getAllTasks();
  },

  async updateTask(id: string, taskData: Partial<Task>): Promise<void> {
    await firebaseRepo.updateTask(id, taskData);
  },

  async deleteTask(id: string): Promise<void> {
    await firebaseRepo.deleteTask(id);
  }
};
