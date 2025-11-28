"use client";

import { Task } from '@/types/task';
import { cn } from '@workspace/ui/lib/utils';

interface TaskCardProps {
  task: Task;
}

const statusColors = {
  todo: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  doing: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  done: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  cancel: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
};

const priorityColors = {
  low: 'text-gray-600 dark:text-gray-400',
  normal: 'text-blue-600 dark:text-blue-400',
  high: 'text-red-600 dark:text-red-400',
};

export function TaskCard({ task }: TaskCardProps) {
  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground">
            {task.title}
          </h3>
          {task.description && (
            <p className="mt-2 text-sm text-muted-foreground">
              {task.description}
            </p>
          )}
        </div>
        {task.status && (
          <span
            className={cn(
              'ml-4 rounded-full px-3 py-1 text-xs font-medium',
              statusColors[task.status] || statusColors.todo
            )}
          >
            {task.status}
          </span>
        )}
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {task.priority && (
            <span className={cn('font-medium', priorityColors[task.priority])}>
              Priority: {task.priority}
            </span>
          )}
          <span>
            {new Date(task.created_at).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </span>
        </div>
      </div>
    </div>
  );
}

