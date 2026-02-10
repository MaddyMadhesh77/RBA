import { useState, useEffect } from "react";

const Notification = ({ notification, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (notification) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(onClose, 300); // Wait for fade out animation
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [notification, onClose]);

  if (!notification) return null;

  return (
    <div
      className={`notification ${notification.type} ${visible ? "show" : ""}`}
    >
      <div className="notification-content">
        <span className="notification-icon">
          {notification.type === "success" ? "✓" : "✕"}
        </span>
        <span className="notification-message">{notification.message}</span>
      </div>
      <button className="notification-close" onClick={onClose}>
        ×
      </button>
    </div>
  );
};

export default Notification;
