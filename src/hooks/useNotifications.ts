
import { useState, useEffect } from 'react';

export interface NotificationOptions {
  title: string;
  body: string;
  icon?: string;
  tag?: string;
}

export const useNotifications = () => {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    if ('Notification' in window) {
      setIsSupported(true);
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if (!isSupported) return false;
    
    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  };

  const showNotification = (options: NotificationOptions) => {
    console.log('showNotification called:', { isSupported, permission, options });
    
    if (!isSupported) {
      console.log('Notifications not supported in this browser');
      return;
    }

    if (permission !== 'granted') {
      console.log('Notification permission not granted, current permission:', permission);
      return;
    }

    try {
      // For testing, always show notification (remove browser focus check temporarily)
      const notification = new Notification(options.title, {
        body: options.body,
        icon: options.icon || '/favicon.ico',
        tag: options.tag,
        requireInteraction: false,
      });

      console.log('Notification created successfully:', notification);

      // Auto-close after 5 seconds
      setTimeout(() => {
        notification.close();
      }, 5000);

      // Handle click event
      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      return notification;
    } catch (error) {
      console.error('Error showing notification:', error);
    }
  };

  return {
    permission,
    isSupported,
    requestPermission,
    showNotification,
  };
};
