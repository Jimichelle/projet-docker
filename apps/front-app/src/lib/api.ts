import { Task } from '@/types/task';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3008';

export async function getTasks(): Promise<Task[]> {
  try {
    const response = await fetch(`${API_URL}/task`, {
      cache: 'no-store', // Pour avoir les données à jour
    });

    if (!response.ok) {
      throw new Error('Failed to fetch tasks');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }
}

export interface CreateTaskInput {
  title: string;
  description?: string | null;
  status?: 'todo' | 'doing' | 'done' | 'cancel';
  priority?: 'low' | 'normal' | 'high';
}

export async function createTask(input: CreateTaskInput): Promise<Task> {
  try {
    const response = await fetch(`${API_URL}/task`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: input.title,
        description: input.description || null,
        status: input.status || 'todo',
        priority: input.priority || 'normal',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to create task');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating task:', error);
    throw error;
  }
}

