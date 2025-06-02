import * as admin from 'firebase-admin';
import { Task } from '../models/Task';

// Configuración de Firebase
const serviceAccount = require('../../serviceAccountKey.json');

class FirebaseTaskRepository {
    public db: admin.firestore.Firestore;

    constructor() {
        if (!admin.apps.length) {
            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId: serviceAccount.project_id,
                    clientEmail: serviceAccount.client_email,
                    privateKey: serviceAccount.private_key.replace(/\\n/g, '\n')
                }),
                databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
            });
        }
        this.db = admin.firestore();
    }

    async testConnection(): Promise<boolean> {
        try {
            await this.db.listCollections();
            return true;
        } catch (error) {
            console.error('Firestore connection error:', error);
            return false;
        }
    }

    async getAllTasks(): Promise<Task[]> {
        const snapshot = await this.db.collection('tasks').get();
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            createdAt: doc.data().createdAt?.toDate() || new Date(),
            updatedAt: doc.data().updatedAt?.toDate() || new Date()
        }) as Task);
    }

    async createTask(taskData: Omit<Task, 'id'>): Promise<Task> {
        const taskRef = this.db.collection('tasks').doc();
        const task: Task = {
            ...taskData,
            id: taskRef.id,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        await taskRef.set(task);
        return task;
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

// Exportamos la instancia singleton
export const firebaseRepo = new FirebaseTaskRepository();

// Opcional: Exportamos la clase por si se necesita crear múltiples instancias
export { FirebaseTaskRepository };
