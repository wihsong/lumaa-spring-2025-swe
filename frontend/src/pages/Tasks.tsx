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

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await api.request("/tasks");
      const data = await res.json();
      if (res.ok) {
        setTasks(data);
      } else {
        alert(data.message || "Error fetching tasks");
      }
    } catch (error) {
      console.error(error);
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
        alert(data.message || "Error creating task");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const toggleComplete = async (task: Task) => {
    try {
      const updated = {
        title: task.title,
        description: task.description,
        isComplete: !task.isComplete,
      };
      const res = await api.request(`/tasks/${task.id}`, {
        method: "PUT",
        body: JSON.stringify(updated),
      });
      const data = await res.json();
      if (res.ok) {
        // Update the local list
        setTasks(tasks.map((t) => (t.id === data.id ? data : t)));
      } else {
        alert(data.message || "Error updating task");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteTask = async (taskId: number) => {
    try {
      const res = await api.request(`/tasks/${taskId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        // Remove from local list
        setTasks(tasks.filter((t) => t.id !== taskId));
      } else {
        alert(data.message || "Error deleting task");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Tasks</h1>
      <form onSubmit={createTask}>
        <div>
          <label>Title:</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <label>Description:</label>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <button type="submit">Add Task</button>
      </form>

      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <span
              style={{
                textDecoration: task.isComplete ? "line-through" : "none",
              }}
            >
              {task.title} – {task.description}
            </span>
            <input
              type="checkbox"
              checked={task.isComplete}
              onChange={() => toggleComplete(task)}
            />
            <button onClick={() => deleteTask(task.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Tasks;
