import { useState } from "react";
import { Draggable } from "@hello-pangea/dnd";
import { Pencil, Trash2, Check, X } from "lucide-react";
import { Task, Priority } from "@/types/kanban";
import { motion } from "framer-motion";

interface TaskCardProps {
  task: Task;
  index: number;
  onUpdate: (id: string, updates: Partial<Pick<Task, "title" | "description" | "priority">>) => void;
  onDelete: (id: string) => void;
}

const priorityConfig: Record<Priority, { label: string; className: string }> = {
  low: { label: "Low", className: "bg-priority-low/15 text-priority-low" },
  medium: { label: "Medium", className: "bg-priority-medium/15 text-priority-medium" },
  high: { label: "High", className: "bg-priority-high/15 text-priority-high" },
};

export default function TaskCard({ task, index, onUpdate, onDelete }: TaskCardProps) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [priority, setPriority] = useState<Priority>(task.priority);

  const handleSave = () => {
    if (!title.trim()) return;
    onUpdate(task.id, { title: title.trim(), description: description.trim(), priority });
    setEditing(false);
  };

  const handleCancel = () => {
    setTitle(task.title);
    setDescription(task.description);
    setPriority(task.priority);
    setEditing(false);
  };

  const p = priorityConfig[task.priority];

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`task-card mb-3 last:mb-0 ${snapshot.isDragging ? "dragging" : ""}`}
        >
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
            {editing ? (
              <div className="space-y-3">
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-secondary rounded-md px-3 py-1.5 text-sm font-medium text-foreground outline-none focus:ring-2 focus:ring-ring"
                  autoFocus
                />
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className="w-full bg-secondary rounded-md px-3 py-1.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring resize-none"
                  placeholder="Description (optional)"
                />
                <div className="flex gap-1">
                  {(["low", "medium", "high"] as Priority[]).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPriority(p)}
                      className={`priority-badge capitalize transition-all ${
                        priority === p ? priorityConfig[p].className : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <div className="flex gap-2 justify-end">
                  <button onClick={handleCancel} className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground transition-colors">
                    <X size={14} />
                  </button>
                  <button onClick={handleSave} className="p-1.5 rounded-md hover:bg-primary/10 text-primary transition-colors">
                    <Check size={14} />
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-medium text-sm text-card-foreground leading-snug">{task.title}</h4>
                  <div className="flex gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setEditing(true)}
                      className="p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Pencil size={13} />
                    </button>
                    <button
                      onClick={() => onDelete(task.id)}
                      className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
                {task.description && (
                  <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed line-clamp-2">{task.description}</p>
                )}
                <div className="mt-3">
                  <span className={`priority-badge ${p.className}`}>{p.label}</span>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </Draggable>
  );
}
