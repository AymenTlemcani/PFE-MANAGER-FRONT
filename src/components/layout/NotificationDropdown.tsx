
import { Bell } from 'lucide-react';
import { useState } from 'react';
import { useNotifications } from '../../context/NotificationsContext';

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, updateNotification } = useNotifications();
  const pendingNotifications = notifications.filter(n => n.status === 'pending');

  const handlePartnershipResponse = async (notificationId: string, accept: boolean) => {
    try {
      await updateNotification(notificationId, accept ? 'accepted' : 'rejected');
      setIsOpen(false);
    } catch (error) {
      console.error('Error updating partnership:', error);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-gray-500"
      >
        <Bell className="h-6 w-6" />
        {pendingNotifications.length > 0 && (
          <span className="absolute top-0 right-0 block h-4 w-4 rounded-full bg-red-500 text-xs text-white text-center">
            {pendingNotifications.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
          <div className="p-4 divide-y divide-gray-100">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Notifications</h3>
            {pendingNotifications.length === 0 ? (
              <p className="text-sm text-gray-500 py-4">No new notifications</p>
            ) : (
              <div className="space-y-4">
                {pendingNotifications.map(notification => (
                  <div key={notification.id} className="py-4">
                    <p className="text-sm text-gray-900 mb-2">{notification.message}</p>
                    {notification.type === 'PARTNERSHIP_REQUEST' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handlePartnershipResponse(notification.id, true)}
                          className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handlePartnershipResponse(notification.id, false)}
                          className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300"
                        >
                          Decline
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}