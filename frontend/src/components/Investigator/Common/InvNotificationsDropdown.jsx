import React from 'react';
import { Link } from 'react-router-dom';
import { FaCheck, FaEyeSlash, FaTrash, FaExternalLinkAlt } from 'react-icons/fa';
import '../../../css/Investigator/InvNotificationsDropdown.css';

const InvNotificationsDropdown = ({
  notifications = [],
  onMarkAsRead,
  onMarkAsUnread,
  onMarkAllAsRead,
  onMarkAllAsUnread,
  onDelete,
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="notifications-dropdown">
      <div className="notifications-header">
        <h3>Notificaciones</h3>
        <div className="notifications-actions">
          <div className="btn-group">
            <button 
              className="btn btn-sm btn-outline-success"
              onClick={onMarkAllAsRead}
            >
              <FaCheck className="icon-small" />
              <span className="d-none d-sm-inline">Marcar todo leído</span>
            </button>
            <button 
              className="btn btn-sm btn-outline-secondary"
              onClick={onMarkAllAsUnread}
            >
              <FaEyeSlash className="icon-small" />
              <span className="d-none d-sm-inline">Marcar todo no leído</span>
            </button>
          </div>
        </div>
      </div>
      
      <div className="notifications-list">
        {notifications.length === 0 ? (
          <div className="no-notifications">
            <p>No hay notificaciones</p>
          </div>
        ) : (
          notifications.map((notification) => (
            <div 
              key={notification._id} 
              className={`notification-item ${notification.isRead ? 'read' : 'unread'}`}
            >
              <div className="notification-content">
                <p className="notification-message">{notification.message}</p>
                <div className="notification-actions">
                  {notification.isRead ? (
                    <button
                      className="btn btn-sm btn-icon btn-outline-secondary"
                      onClick={() => onMarkAsUnread(notification._id)}
                      title="Marcar como no leída"
                    >
                      <FaEyeSlash className="icon-small" />
                    </button>
                  ) : (
                    <button
                      className="btn btn-sm btn-icon btn-outline-success"
                      onClick={() => onMarkAsRead(notification._id)}
                      title="Marcar como leída"
                    >
                      <FaCheck className="icon-small" />
                    </button>
                  )}
                  <button
                    className="btn btn-sm btn-icon btn-outline-danger"
                    onClick={() => onDelete(notification._id)}
                    title="Eliminar"
                  >
                    <FaTrash className="icon-small" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="notifications-footer">
        <Link 
          to="/invest/notificaciones" 
          className="btn btn-primary btn-sm w-100"
          onClick={onClose}
        >
          <FaExternalLinkAlt className="icon-small me-2" />
          Ver todas las notificaciones
        </Link>
      </div>
    </div>
  );
};

export default InvNotificationsDropdown;