
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
    console.log('Current browser state:', {
      documentHidden: document.hidden,
      visibilityState: document.visibilityState,
      hasFocus: document.hasFocus()
    });
    
    if (!isSupported) {
      console.log('Notifications not supported in this browser');
      return;
    }

    if (permission !== 'granted') {
      console.log('Notification permission not granted, current permission:', permission);
      return;
    }

    try {
      // For browser notifications, we should show them regardless of focus state
      const notification = new Notification(options.title, {
        body: options.body,
        icon: options.icon || '/favicon.ico',
        tag: options.tag,
        requireInteraction: false,
        // Add additional options to ensure visibility
        silent: false,
        badge: options.icon || '/favicon.ico'
      });

      console.log('Notification created successfully:', notification);
      console.log('Notification object:', {
        title: notification.title,
        body: notification.body,
        icon: notification.icon,
        tag: notification.tag
      });

      // Auto-close after 5 seconds
      setTimeout(() => {
        try {
          notification.close();
          console.log('Notification closed automatically');
        } catch (err) {
          console.log('Error closing notification:', err);
        }
      }, 5000);

      // Handle click event
      notification.onclick = () => {
        console.log('Notification clicked');
        window.focus();
        notification.close();
      };

      // Handle show event
      notification.onshow = () => {
        console.log('Notification shown successfully');
      };

      // Handle error event
      notification.onerror = (event) => {
        console.error('Notification error:', event);
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
