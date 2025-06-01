import * as admin from 'firebase-admin';
import { Task } from '../models/Task';

export class FirebaseTaskRepository {
  public db: admin.firestore.Firestore;

  constructor() {
    if (!admin.apps.length) {
      const serviceAccount = require('../../serviceAccountKey.json');
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: serviceAccount.project_id,
          clientEmail: serviceAccount.client_email,
          privateKey: serviceAccount.private_key.replace(/\\n/g, '\n')
        })
      });
    }
    this.db = admin.firestore();
  }

  async createTask(taskData: Omit<Task, 'id'>): Promise<Task> {
    const taskRef = this.db.collection('tasks').doc(); // Firestore genera ID
    
    const task: Task = {
      ...taskData,
      id: taskRef.id, // Usamos el ID generado
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await taskRef.set(task);
    return task;
  }

  async getAllTasks(): Promise<Task[]> {
    const snapshot = await this.db.collection('tasks').get();
    return snapshot.docs.map(doc => doc.data() as Task);
  }

  async updateTask(id: string, taskData: Partial<Task>): Promise<void> {
    await this.db.collection('tasks').doc(id).update({
      ...taskData,
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
  }

  async deleteTask(id: string): Promise<void> {
    await this.db.collection('tasks').doc(id).delete();
  }
}
