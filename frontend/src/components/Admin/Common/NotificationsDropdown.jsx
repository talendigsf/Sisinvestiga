import React from 'react';
import { Dropdown, Button } from 'react-bootstrap';
import { FaBell, FaCheck, FaEyeSlash, FaTrash, FaExternalLinkAlt } from 'react-icons/fa';
import '../../../css/Admin/NotificationsDropdown.css';

const NotificationsDropdown = ({
  notifications = [],
  unreadCount = 0,
  onMarkAsRead,
  onMarkAsUnread,
  onMarkAllAsRead,
  onMarkAllAsUnread,
  onDelete,
}) => {
  return (
    <Dropdown align="end" className="notifications-wrapper">
      <Dropdown.Toggle as="div" className="notification-toggle">
        <FaBell className="notification-bell" />
        {unreadCount > 0 && <span className="notification-badge">{unreadCount}</span>}
      </Dropdown.Toggle>

      <Dropdown.Menu className="notification-menu">
        <div className="notification-header">
          <h6 className="notification-title">Notifications</h6>
        </div>

        <div className="notification-body">
          {notifications.length === 0 ? (
            <div className="notification-empty">
              No notifications available
            </div>
          ) : (
            notifications.map((notification) => (
              <div key={notification._id} className={`notification-item ${notification.isRead ? 'read' : 'unread'}`}>
                <div className="notification-content">
                  <div className="notification-type">
                    {notification.type}
                  </div>
                  <p className="notification-message">
                    {notification.message}
                  </p>
                </div>
                
                <div className="notification-actions">
                  {notification.isRead ? (
                    <Button 
                      variant="outline-secondary"
                      size="sm"
                      className="action-btn"
                      onClick={() => onMarkAsUnread(notification._id)}
                    >
                      <FaEyeSlash />
                    </Button>
                  ) : (
                    <Button 
                      variant="outline-success"
                      size="sm"
                      className="action-btn"
                      onClick={() => onMarkAsRead(notification._id)}
                    >
                      <FaCheck />
                    </Button>
                  )}
                  <Button 
                    variant="outline-danger"
                    size="sm"
                    className="action-btn"
                    onClick={() => onDelete(notification._id)}
                  >
                    <FaTrash />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="notification-footer">
          <div className="footer-actions">
            <Button 
              variant="outline-primary" 
              size="sm" 
              className="footer-btn"
              onClick={onMarkAllAsRead}
            >
              Mark all as read
            </Button>
            <Button 
              variant="outline-secondary" 
              size="sm" 
              className="footer-btn"
              onClick={onMarkAllAsUnread}
            >
              Mark all as unread
            </Button>
          </div>
          <Button 
            variant="primary" 
            size="sm" 
            className="view-all-btn"
            href="/admin/notificaciones"
          >
            <FaExternalLinkAlt className="me-1" /> View all
          </Button>
        </div>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default NotificationsDropdown;