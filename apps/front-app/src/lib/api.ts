import { Task } from '@/types/task';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

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

