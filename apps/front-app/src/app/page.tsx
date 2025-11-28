import { getTasks } from '@/lib/api';
import { TaskCard } from '@/components/task-card';

export default async function Home() {
  let tasks = [];
  let error = null;

  try {
    tasks = await getTasks();
  } catch (e) {
    error = e instanceof Error ? e.message : 'Une erreur est survenue';
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Mes Tâches</h1>
            <p className="mt-2 text-muted-foreground">
              Gérez vos tâches efficacement
            </p>
          </div>
        </div>

        {error ? (
          <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-destructive">
            <p className="font-medium">Erreur de chargement</p>
            <p className="text-sm">{error}</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="rounded-lg border bg-card p-8 text-center">
            <p className="text-muted-foreground">Aucune tâche pour le moment</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
