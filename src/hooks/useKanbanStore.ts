import { useState, useEffect, useCallback } from "react";
import { Task, ColumnId, Priority } from "@/types/kanban";

const STORAGE_KEY = "kanban-tasks";

function loadTasks(): Task[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveTasks(tasks: Task[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

export function useKanbanStore() {
  const [tasks, setTasks] = useState<Task[]>(loadTasks);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const addTask = useCallback((title: string, description: string, priority: Priority) => {
    const task: Task = {
      id: crypto.randomUUID(),
      title,
      description,
      priority,
      columnId: "todo",
      createdAt: Date.now(),
    };
    setTasks((prev) => [...prev, task]);
  }, []);

  const updateTask = useCallback((id: string, updates: Partial<Pick<Task, "title" | "description" | "priority">>) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const moveTask = useCallback((taskId: string, toColumn: ColumnId, toIndex: number) => {
    setTasks((prev) => {
      const task = prev.find((t) => t.id === taskId);
      if (!task) return prev;

      const without = prev.filter((t) => t.id !== taskId);
      const updated = { ...task, columnId: toColumn };

      // Find the correct insertion point among tasks in the target column
      const columnTasks = without.filter((t) => t.columnId === toColumn);
      const otherTasks = without.filter((t) => t.columnId !== toColumn);

      columnTasks.splice(toIndex, 0, updated);
      return [...otherTasks, ...columnTasks];
    });
  }, []);

  const getFilteredTasks = useCallback(
    (columnId: ColumnId) => {
      return tasks
        .filter((t) => t.columnId === columnId)
        .filter(
          (t) =>
            !searchQuery ||
            t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
    },
    [tasks, searchQuery]
  );

  return { tasks, addTask, updateTask, deleteTask, moveTask, searchQuery, setSearchQuery, getFilteredTasks };
}
