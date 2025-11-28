"use client";

import { useState, useEffect, useMemo } from 'react';
import { Task, TaskStatus } from '@/types/task';
import { getTasks } from '@/lib/api';
import { TaskCard } from './task-card';
import { CreateTaskDialog } from './create-task-dialog';
import { Button } from '@workspace/ui/components/button';
import { cn } from '@workspace/ui/lib/utils';

const statusConfig: Record<TaskStatus, { label: string; color: string; icon: string }> = {
  todo: { label: 'À faire', color: 'text-slate-400', icon: '○' },
  doing: { label: 'En cours', color: 'text-amber-400', icon: '◐' },
  done: { label: 'Terminés', color: 'text-emerald-400', icon: '●' },
  cancel: { label: 'Annulés', color: 'text-rose-400', icon: '✕' },
};

export function TasksList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filter, setFilter] = useState<TaskStatus | 'all'>('all');

  const fetchTasks = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Statistiques des tâches
  const stats = useMemo(() => {
    const counts = { todo: 0, doing: 0, done: 0, cancel: 0 };
    tasks.forEach(task => {
      const status = task.status || 'todo';
      counts[status]++;
    });
    return counts;
  }, [tasks]);

  // Tâches filtrées
  const filteredTasks = useMemo(() => {
    if (filter === 'all') return tasks;
    return tasks.filter(task => (task.status || 'todo') === filter);
  }, [tasks, filter]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="relative">
          <div className="w-12 h-12 rounded-full border-2 border-zinc-700 border-t-violet-500 animate-spin" />
        </div>
        <p className="mt-4 text-sm text-zinc-500">Chargement des tâches...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-end">
          <Button 
            onClick={() => setIsDialogOpen(true)}
            className="bg-violet-600 hover:bg-violet-700 text-white"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nouvelle tâche
          </Button>
        </div>
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/5 p-6">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-rose-500/10">
              <svg className="w-5 h-5 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-rose-300">Erreur de chargement</p>
              <p className="text-sm text-rose-400/70 mt-1">{error}</p>
              <button
                onClick={fetchTasks}
                className="mt-3 text-sm text-rose-300 hover:text-rose-200 underline underline-offset-4"
              >
                Réessayer
              </button>
            </div>
          </div>
        </div>
        <CreateTaskDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onTaskCreated={fetchTasks}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Barre de statistiques */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {(Object.keys(statusConfig) as TaskStatus[]).map((status) => (
          <button
            key={status}
            onClick={() => setFilter(filter === status ? 'all' : status)}
            className={cn(
              "relative p-4 rounded-xl border transition-all duration-200",
              filter === status 
                ? "bg-zinc-800 border-zinc-600" 
                : "bg-zinc-900/50 border-zinc-800/50 hover:bg-zinc-800/50 hover:border-zinc-700"
            )}
          >
            <div className="flex items-center justify-between">
              <span className={cn("text-2xl font-bold", statusConfig[status].color)}>
                {stats[status]}
              </span>
              <span className="text-lg opacity-50">{statusConfig[status].icon}</span>
            </div>
            <p className="text-xs text-zinc-500 mt-1 text-left">{statusConfig[status].label}</p>
            {filter === status && (
              <div className={cn(
                "absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full",
                status === 'todo' && "bg-slate-400",
                status === 'doing' && "bg-amber-400",
                status === 'done' && "bg-emerald-400",
                status === 'cancel' && "bg-rose-400",
              )} />
            )}
          </button>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {filter !== 'all' && (
            <button
              onClick={() => setFilter('all')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-800 text-xs text-zinc-300 hover:bg-zinc-700 transition-colors"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Effacer le filtre
            </button>
          )}
          <span className="text-sm text-zinc-500">
            {filteredTasks.length} tâche{filteredTasks.length > 1 ? 's' : ''}
          </span>
        </div>
        <Button 
          onClick={() => setIsDialogOpen(true)}
          className="bg-violet-600 hover:bg-violet-700 text-white shadow-lg shadow-violet-600/20"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nouvelle tâche
        </Button>
      </div>

      {/* Liste des tâches */}
      {filteredTasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 rounded-xl border border-dashed border-zinc-800">
          <div className="p-4 rounded-full bg-zinc-800/50 mb-4">
            <svg className="w-8 h-8 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className="text-zinc-400 font-medium">Aucune tâche</p>
          <p className="text-sm text-zinc-600 mt-1">
            {filter !== 'all' ? 'Aucune tâche avec ce statut' : 'Commencez par créer une nouvelle tâche'}
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTasks.map((task) => (
            <TaskCard 
              key={task.id} 
              task={task}
              onTaskUpdated={fetchTasks}
              onTaskDeleted={fetchTasks}
            />
          ))}
        </div>
      )}

      <CreateTaskDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onTaskCreated={fetchTasks}
      />
    </div>
  );
}

