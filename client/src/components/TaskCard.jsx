const TaskCard = ({ task, onEdit, onDelete }) => {
  const statusColors = {
    pending: "#f59e0b",
    "in-progress": "#3b82f6",
    completed: "#10b981",
  };

  const priorityColors = {
    low: "#6b7280",
    medium: "#f59e0b",
    high: "#ef4444",
  };

  return (
    <div className="task-card">
      <div className="task-card-header">
        <h3 className="task-title">{task.title}</h3>
        <div className="task-actions">
          <button
            className="btn-icon edit"
            onClick={() => onEdit(task)}
            title="Edit task"
          >
            ✏️
          </button>
          <button
            className="btn-icon delete"
            onClick={() => onDelete(task._id)}
            title="Delete task"
          >
            🗑️
          </button>
        </div>
      </div>

      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      <div className="task-meta">
        <span
          className="badge status-badge"
          style={{
            backgroundColor: statusColors[task.status] + "22",
            color: statusColors[task.status],
            borderColor: statusColors[task.status] + "44",
          }}
        >
          {task.status}
        </span>
        <span
          className="badge priority-badge"
          style={{
            backgroundColor: priorityColors[task.priority] + "22",
            color: priorityColors[task.priority],
            borderColor: priorityColors[task.priority] + "44",
          }}
        >
          {task.priority}
        </span>
        <span className="task-date">
          {new Date(task.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </span>
      </div>
    </div>
  );
};

export default TaskCard;
