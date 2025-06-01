import { Task } from '../models/Task';
import admin from 'firebase-admin';
import fs from 'fs';
import path from 'path';

let dbInstance: FirebaseFirestore.Firestore;

function initFirebase() {
  if (!admin.apps.length) {
    const keyPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || path.resolve('serviceAccountKey.json');
    const serviceAccount = JSON.parse(fs.readFileSync(keyPath, 'utf-8'));
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    dbInstance = admin.firestore();
  }
}

function getDb(): FirebaseFirestore.Firestore {
  if (!dbInstance) {
    initFirebase();
  }
  return dbInstance!;
}

export class FirebaseTaskRepository {
  private db = getDb();

  async getAll(): Promise<Task[]> {
    const snapshot = await this.db.collection('tasks').get();
    return snapshot.docs.map(doc => doc.data() as Task);
  }

  async save(task: Task): Promise<void> {
    await this.db.collection('tasks').doc(task.id).set(task);
  }

  async delete(id: string): Promise<void> {
    await this.db.collection('tasks').doc(id).delete();
  }
}
