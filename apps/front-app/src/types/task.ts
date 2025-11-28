export type TaskStatus = 'todo' | 'doing' | 'done' | 'cancel';
export type Priority = 'low' | 'normal' | 'high';

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus | null;
  priority: Priority | null;
  tags: string[];
  created_at: string;
  updated_at: string | null;
}

