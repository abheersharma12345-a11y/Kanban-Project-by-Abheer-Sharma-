import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Priority } from "@/types/kanban";
import { motion, AnimatePresence } from "framer-motion";

interface TaskFormProps {
  onAdd: (title: string, description: string, priority: Priority) => void;
}

export default function TaskForm({ onAdd }: TaskFormProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd(title.trim(), description.trim(), priority);
    setTitle("");
    setDescription("");
    setPriority("medium");
    setOpen(false);
  };

  const priorityOptions: { value: Priority; label: string; activeClass: string }[] = [
    { value: "low", label: "Low", activeClass: "bg-priority-low/15 text-priority-low" },
    { value: "medium", label: "Medium", activeClass: "bg-priority-medium/15 text-priority-medium" },
    { value: "high", label: "High", activeClass: "bg-priority-high/15 text-priority-high" },
  ];

  return (
    <div>
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-foreground/20 backdrop-blur-sm z-40"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-x-4 top-[20%] md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 bg-card border border-border rounded-xl p-6 z-50 w-auto md:w-[420px] shadow-xl"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-display font-semibold text-lg text-card-foreground">New Task</h2>
                <button onClick={() => setOpen(false)} className="p-1.5 rounded-md hover:bg-secondary text-muted-foreground transition-colors">
                  <X size={16} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Title *</label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-secondary rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground/60"
                    placeholder="What needs to be done?"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full bg-secondary rounded-lg px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring resize-none placeholder:text-muted-foreground/60"
                    placeholder="Add details..."
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Priority</label>
                  <div className="flex gap-2">
                    {priorityOptions.map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => setPriority(opt.value)}
                        className={`priority-badge transition-all ${
                          priority === opt.value ? opt.activeClass : "bg-secondary text-muted-foreground hover:bg-accent"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground rounded-lg py-2.5 text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  Create Task
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 bg-primary text-primary-foreground rounded-lg px-4 py-2.5 text-sm font-medium hover:opacity-90 transition-opacity shadow-md"
      >
        <Plus size={16} />
        New Task
      </button>
    </div>
  );
}
