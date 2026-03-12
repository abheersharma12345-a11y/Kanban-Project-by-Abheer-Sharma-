import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import { Search, Layout } from "lucide-react";
import { useKanbanStore } from "@/hooks/useKanbanStore";
import { COLUMNS, ColumnId } from "@/types/kanban";
import Column from "./Column";
import TaskForm from "./TaskForm";

export default function KanbanBoard() {
  const { addTask, updateTask, deleteTask, moveTask, searchQuery, setSearchQuery, getFilteredTasks } = useKanbanStore();

  const handleDragEnd = (result: DropResult) => {
    const { draggableId, destination } = result;
    if (!destination) return;
    moveTask(draggableId, destination.droppableId as ColumnId, destination.index);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Layout size={16} className="text-primary-foreground" />
            </div>
            <h1 className="font-display font-bold text-xl text-foreground">Kanban Board</h1>
          </div>

          <div className="flex items-center gap-3 flex-1 justify-end">
            <div className="relative max-w-xs w-full">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks..."
                className="w-full bg-secondary rounded-lg pl-9 pr-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground/60"
              />
            </div>
            <TaskForm onAdd={addTask} />
          </div>
        </div>
      </header>

      {/* Board */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex flex-col md:flex-row gap-6 md:items-start">
            {COLUMNS.map((col) => (
              <Column
                key={col.id}
                id={col.id}
                title={col.title}
                tasks={getFilteredTasks(col.id)}
                onUpdate={updateTask}
                onDelete={deleteTask}
              />
            ))}
          </div>
        </DragDropContext>
      </main>
    </div>
  );
}
