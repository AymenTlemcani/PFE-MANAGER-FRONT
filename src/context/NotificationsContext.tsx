import React, { createContext, useContext, useState } from 'react';

interface Notification {
  id: string;
  type: string;
  message: string;
  projectId?: string;
  partnerId?: string;
  status: 'pending' | 'accepted' | 'rejected';
}

interface NotificationsContextType {
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
  updateNotification: (id: string, status: 'accepted' | 'rejected') => void;
}

const NotificationsContext = createContext<NotificationsContextType | undefined>(undefined);

export function NotificationsProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Notification) => {
    setNotifications(prev => [...prev, notification]);
  };

  const updateNotification = async (id: string, status: 'accepted' | 'rejected') => {
    try {
      const notification = notifications.find(n => n.id === id);
      if (!notification) return;

      // Update project partnership status
      await fetch(`/api/projects/${notification.projectId}/partnership`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          partnerId: notification.partnerId,
          status: status
        }),
      });

      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, status } : n)
      );

    } catch (error) {
      console.error('Error updating partnership:', error);
      throw error;
    }
  };

  return (
    <NotificationsContext.Provider value={{ notifications, addNotification, updateNotification }}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
}