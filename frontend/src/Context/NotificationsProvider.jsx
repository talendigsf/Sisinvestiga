import React, { createContext, useContext, useState, useEffect } from 'react';
import { getData } from '../services/apiServices';

const NotificationsContext = createContext();

export const useNotifications = () => useContext(NotificationsContext);

export const NotificationsProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const response = await getData('notifications');
      const notificationsArray = Array.isArray(response) ? response : [];
      setNotifications(notificationsArray);
      setUnreadCount(notificationsArray.filter(n => !n.isRead).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const removeNotification = (id) => {
    setNotifications(prevNotifications => prevNotifications.filter(n => n._id !== id));
    setUnreadCount(prevCount => prevCount - 1);
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Actualiza cada 30 segundos
    return () => clearInterval(interval);
  }, []);

  return (
    <NotificationsContext.Provider value={{ notifications, unreadCount, fetchNotifications, removeNotification }}>
      {children}
    </NotificationsContext.Provider>
  );
};