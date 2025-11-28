import { TasksList } from '@/components/tasks-list';

export default function Home() {
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

        <TasksList />
      </main>
    </div>
  );
}
