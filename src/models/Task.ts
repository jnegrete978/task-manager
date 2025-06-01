export interface Task {
  id?: string;  // Opcional (Firebase lo asignará)
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}
