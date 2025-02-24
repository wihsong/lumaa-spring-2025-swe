// src/pages/Tasks.tsx
import React, { useEffect, useState } from "react";
import { api } from "../services/api";

interface Task {
  id: number;
  title: string;
  description?: string;
  isComplete: boolean;
}

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // For editing an existing task
  const [editTaskId, setEditTaskId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await api.request("/tasks");
      const data = await res.json();
      if (res.ok) {
        setTasks(data);
      } else {
        alert(data.error || "Error fetching tasks");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const createTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.request("/tasks", {
        method: "POST",
        body: JSON.stringify({ title, description }),
      });
      const data = await res.json();
      if (res.ok) {
        setTasks([...tasks, data]);
        setTitle("");
        setDescription("");
      } else {
        alert(data.error || "Error creating task");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleComplete = async (task: Task) => {
    try {
      const updatedTask = {
        title: task.title,
        description: task.description,
        isComplete: !task.isComplete,
      };
      const res = await api.request(`/tasks/${task.id}`, {
        method: "PUT",
        body: JSON.stringify(updatedTask),
      });
      const data = await res.json();
      if (res.ok) {
        setTasks(tasks.map((t) => (t.id === data.id ? data : t)));
      } else {
        alert(data.error || "Error updating task");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTask = async (taskId: number) => {
    try {
      const res = await api.request(`/tasks/${taskId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        setTasks(tasks.filter((t) => t.id !== taskId));
      } else {
        alert(data.error || "Error deleting task");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ---- NEW: Begin Edit Logic ----
  const startEditing = (task: Task) => {
    setEditTaskId(task.id);
    setEditTitle(task.title);
    setEditDescription(task.description || "");
  };

  const cancelEditing = () => {
    setEditTaskId(null);
    setEditTitle("");
    setEditDescription("");
  };

  const saveEdit = async (taskId: number) => {
    try {
      const updatedTask = {
        title: editTitle,
        description: editDescription,
        isComplete: false, // or keep original isComplete if you prefer
      };
      const res = await api.request(`/tasks/${taskId}`, {
        method: "PUT",
        body: JSON.stringify(updatedTask),
      });
      const data = await res.json();
      if (res.ok) {
        // Update our local list of tasks
        setTasks(tasks.map((t) => (t.id === data.id ? data : t)));
        cancelEditing();
      } else {
        alert(data.error || "Error editing task");
      }
    } catch (err) {
      console.error(err);
      alert("Error occurred while editing task.");
    }
  };
  // ---- NEW: End Edit Logic ----

  return (
    <div>
      <h1>Tasks</h1>
      <form onSubmit={createTask}>
        <div>
          <label>Title:</label>
          <input 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
          />
        </div>
        <div>
          <label>Description:</label>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <button type="submit">Create Task</button>
      </form>

      <ul>
        {tasks.map((task) => {
          // If this task is in edit mode
          if (editTaskId === task.id) {
            return (
              <li key={task.id}>
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                />
                <input
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                />
                <button onClick={() => saveEdit(task.id)}>Save</button>
                <button onClick={cancelEditing}>Cancel</button>
              </li>
            );
          }

          // Normal read-only display
          return (
            <li key={task.id}>
              <span
                style={{
                  textDecoration: task.isComplete ? "line-through" : "none",
                }}
              >
                {task.title} – {task.description}
              </span>{" "}
              <input
                type="checkbox"
                checked={task.isComplete}
                onChange={() => toggleComplete(task)}
              />
              <button onClick={() => startEditing(task)}>Edit</button>
              <button onClick={() => deleteTask(task.id)}>Delete</button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Tasks;
