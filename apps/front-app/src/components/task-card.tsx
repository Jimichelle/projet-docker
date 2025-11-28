"use client";

import { useState } from 'react';
import { Task, TaskStatus, Priority } from '@/types/task';
import { cn } from '@workspace/ui/lib/utils';
import { updateTaskStatus, deleteTask } from '@/lib/api';
import { Button } from '@workspace/ui/components/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@workspace/ui/components/select';

interface TaskCardProps {
  task: Task;
  onTaskUpdated?: () => void;
  onTaskDeleted?: () => void;
}

// Bordure gauche selon le statut
const statusBorderColors = {
  todo: 'border-l-slate-400',
  doing: 'border-l-amber-500',
  done: 'border-l-emerald-500',
  cancel: 'border-l-rose-500',
};

// Badge de statut
const statusBadgeStyles = {
  todo: 'bg-slate-500/10 text-slate-400 ring-slate-500/20',
  doing: 'bg-amber-500/10 text-amber-400 ring-amber-500/20',
  done: 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/20',
  cancel: 'bg-rose-500/10 text-rose-400 ring-rose-500/20',
};

// Styles de priorité
const priorityStyles: Record<Priority, { bg: string; text: string; label: string }> = {
  low: { bg: 'bg-sky-500/10', text: 'text-sky-400', label: 'Basse' },
  normal: { bg: 'bg-violet-500/10', text: 'text-violet-400', label: 'Normale' },
  high: { bg: 'bg-rose-500/10', text: 'text-rose-400', label: 'Haute' },
};

const statusLabels: Record<TaskStatus, string> = {
  todo: 'À faire',
  doing: 'En cours',
  done: 'Terminé',
  cancel: 'Annulé',
};

export function TaskCard({ task, onTaskUpdated, onTaskDeleted }: TaskCardProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleStatusChange = async (newStatus: TaskStatus) => {
    if (newStatus === task.status) return;
    
    setIsUpdating(true);
    try {
      await updateTaskStatus(task.id, newStatus);
      onTaskUpdated?.();
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) return;
    
    setIsDeleting(true);
    try {
      await deleteTask(task.id);
      onTaskDeleted?.();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const currentStatus = task.status || 'todo';
  const currentPriority = task.priority || 'normal';

  return (
    <div className={cn(
      "group relative rounded-xl border-l-4 bg-gradient-to-br from-zinc-900/80 to-zinc-900/40 p-5 backdrop-blur-sm transition-all duration-300",
      "hover:from-zinc-800/80 hover:to-zinc-800/40 hover:shadow-lg hover:shadow-black/20",
      "border border-zinc-800/50 hover:border-zinc-700/50",
      statusBorderColors[currentStatus],
      (isUpdating || isDeleting) && "opacity-50 pointer-events-none"
    )}>
      {/* Header avec titre et sélecteur de statut */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <h3 className={cn(
            "font-semibold text-zinc-100 leading-tight truncate",
            currentStatus === 'done' && "line-through text-zinc-500"
          )}>
            {task.title}
          </h3>
          {task.description && (
            <p className="mt-2 text-sm text-zinc-400 line-clamp-2 leading-relaxed">
              {task.description}
            </p>
          )}
        </div>
        
        <Select
          value={currentStatus}
          onValueChange={(value) => handleStatusChange(value as TaskStatus)}
          disabled={isUpdating || isDeleting}
        >
          <SelectTrigger 
            className={cn(
              "h-8 w-auto gap-2 rounded-full px-3 text-xs font-medium ring-1 ring-inset border-0 shadow-none",
              statusBadgeStyles[currentStatus]
            )}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-zinc-900 border-zinc-800">
            {(Object.keys(statusLabels) as TaskStatus[]).map((status) => (
              <SelectItem 
                key={status} 
                value={status}
                className="text-zinc-300 focus:bg-zinc-800 focus:text-zinc-100"
              >
                {statusLabels[status]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Footer avec métadonnées et actions */}
      <div className="mt-4 flex items-center justify-between pt-3 border-t border-zinc-800/50">
        <div className="flex items-center gap-3">
          {/* Badge de priorité */}
          <span className={cn(
            "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-medium",
            priorityStyles[currentPriority].bg,
            priorityStyles[currentPriority].text
          )}>
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            {priorityStyles[currentPriority].label}
          </span>
          
          {/* Date */}
          <span className="inline-flex items-center gap-1.5 text-[11px] text-zinc-500">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {new Date(task.created_at).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'short',
            })}
          </span>
        </div>

        {/* Bouton supprimer */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDelete}
          disabled={isDeleting || isUpdating}
          className="h-8 w-8 p-0 text-zinc-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-500/10 hover:text-rose-400"
        >
          {isDeleting ? (
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          )}
        </Button>
      </div>
    </div>
  );
}

