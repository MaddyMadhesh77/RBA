import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import TaskCard from "../components/TaskCard";
import TaskForm from "../components/TaskForm";

const Dashboard = ({ showNotification }) => {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState({ status: "", priority: "" });

  const fetchTasks = useCallback(async () => {
    try {
      const params = {};
      if (filter.status) params.status = filter.status;
      if (filter.priority) params.priority = filter.priority;
      const res = await API.get("/tasks", { params });
      setTasks(res.data.data);
    } catch (err) {
      showNotification("error", "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }, [filter, showNotification]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleCreateTask = async (data) => {
    try {
      await API.post("/tasks", data);
      showNotification("success", "Task created successfully!");
      setShowForm(false);
      fetchTasks();
    } catch (err) {
      showNotification(
        "error",
        err.response?.data?.message || "Failed to create task",
      );
    }
  };

  const handleUpdateTask = async (data) => {
    try {
      await API.put(`/tasks/${editingTask._id}`, data);
      showNotification("success", "Task updated successfully!");
      setEditingTask(null);
      fetchTasks();
    } catch (err) {
      showNotification(
        "error",
        err.response?.data?.message || "Failed to update task",
      );
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await API.delete(`/tasks/${id}`);
      showNotification("success", "Task deleted successfully!");
      fetchTasks();
    } catch (err) {
      showNotification(
        "error",
        err.response?.data?.message || "Failed to delete task",
      );
    }
  };

  const stats = {
    total: tasks.length,
    pending: tasks.filter((t) => t.status === "pending").length,
    inProgress: tasks.filter((t) => t.status === "in-progress").length,
    completed: tasks.filter((t) => t.status === "completed").length,
  };

  return (
    <div className="dashboard">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-brand">
          <span className="navbar-logo">⚡</span>
          <span className="navbar-title">TaskFlow</span>
        </div>
        <div className="navbar-user">
          <span className="navbar-greeting">
            Hello, <strong>{user?.name}</strong>
          </span>
          <span className="navbar-role badge">{user?.role}</span>
          <button className="btn btn-outline btn-sm" onClick={logout}>
            Logout
          </button>
        </div>
      </nav>

      {/* Main content */}
      <main className="main-content">
        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-number">{stats.total}</span>
            <span className="stat-label">Total Tasks</span>
          </div>
          <div className="stat-card stat-pending">
            <span className="stat-number">{stats.pending}</span>
            <span className="stat-label">Pending</span>
          </div>
          <div className="stat-card stat-progress">
            <span className="stat-number">{stats.inProgress}</span>
            <span className="stat-label">In Progress</span>
          </div>
          <div className="stat-card stat-completed">
            <span className="stat-number">{stats.completed}</span>
            <span className="stat-label">Completed</span>
          </div>
        </div>

        {/* Toolbar */}
        <div className="toolbar">
          <div className="toolbar-filters">
            <select
              value={filter.status}
              onChange={(e) => setFilter({ ...filter, status: e.target.value })}
              className="filter-select"
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <select
              value={filter.priority}
              onChange={(e) =>
                setFilter({ ...filter, priority: e.target.value })
              }
              className="filter-select"
            >
              <option value="">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => {
              setEditingTask(null);
              setShowForm(true);
            }}
          >
            + New Task
          </button>
        </div>

        {/* Tasks */}
        {loading ? (
          <div className="loading-screen">
            <div className="spinner"></div>
            <p>Loading tasks...</p>
          </div>
        ) : tasks.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">📋</span>
            <h3>No tasks yet</h3>
            <p>Create your first task to get started!</p>
            <button
              className="btn btn-primary"
              onClick={() => {
                setEditingTask(null);
                setShowForm(true);
              }}
            >
              + Create Task
            </button>
          </div>
        ) : (
          <div className="tasks-grid">
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={(t) => {
                  setEditingTask(t);
                  setShowForm(true);
                }}
                onDelete={handleDeleteTask}
              />
            ))}
          </div>
        )}
      </main>

      {/* Task Form Modal */}
      {showForm && (
        <TaskForm
          task={editingTask}
          onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
          onCancel={() => {
            setShowForm(false);
            setEditingTask(null);
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;
