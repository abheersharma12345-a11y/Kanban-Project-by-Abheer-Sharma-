import { Droppable } from "@hello-pangea/dnd";
import { ColumnId, Task } from "@/types/kanban";
import TaskCard from "./TaskCard";

interface ColumnProps {
  id: ColumnId;
  title: string;
  tasks: Task[];
  onUpdate: (id: string, updates: Partial<Pick<Task, "title" | "description" | "priority">>) => void;
  onDelete: (id: string) => void;
}

const dotColor: Record<ColumnId, string> = {
  todo: "bg-column-todo",
  "in-progress": "bg-column-progress",
  done: "bg-column-done",
};

export default function Column({ id, title, tasks, onUpdate, onDelete }: ColumnProps) {
  return (
    <div className="kanban-column flex flex-col min-h-[200px] w-full md:w-80 lg:w-[340px] shrink-0">
      <div className="flex items-center gap-2.5 mb-4 px-1">
        <div className={`column-header-dot ${dotColor[id]}`} />
        <h3 className="font-display font-semibold text-sm text-foreground tracking-wide uppercase">
          {title}
        </h3>
        <span className="text-xs text-muted-foreground font-medium ml-auto bg-secondary rounded-full px-2 py-0.5">
          {tasks.length}
        </span>
      </div>

      <Droppable droppableId={id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex-1 rounded-lg transition-colors min-h-[80px] ${
              snapshot.isDraggingOver ? "bg-primary/5 border border-dashed border-primary/20" : ""
            }`}
          >
            <div className="group">
              {tasks.map((task, index) => (
                <TaskCard key={task.id} task={task} index={index} onUpdate={onUpdate} onDelete={onDelete} />
              ))}
            </div>
            {provided.placeholder}
            {tasks.length === 0 && !snapshot.isDraggingOver && (
              <p className="text-xs text-muted-foreground text-center py-8 opacity-60">
                No tasks yet
              </p>
            )}
          </div>
        )}
      </Droppable>
    </div>
  );
}
