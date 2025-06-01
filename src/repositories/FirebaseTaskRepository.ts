import { Task } from '../models/Task';
import * as admin from 'firebase-admin';

export class FirebaseTaskRepository {
  private db: admin.firestore.Firestore;

  constructor() {
    if (!admin.apps.length) {
      const serviceAccount = require('../../serviceAccountKey.json');
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
    }
    this.db = admin.firestore();
  }

  async save(task: Task): Promise<void> {
    await this.db.collection('tasks').doc(task.id).set(task);
  }

  async getAll(): Promise<Task[]> {
    const snapshot = await this.db.collection('tasks').get();
    return snapshot.docs.map(doc => doc.data() as Task);
  }

  async delete(id: string): Promise<void> {
    await this.db.collection('tasks').doc(id).delete();
  }
}
