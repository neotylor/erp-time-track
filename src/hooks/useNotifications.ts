
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

  const showNotification = async (options: NotificationOptions) => {
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

    // Auto-request permission if not set
    if (permission === 'default') {
      console.log('Permission is default, requesting permission...');
      const granted = await requestPermission();
      if (!granted) {
        console.log('Permission denied after request');
        return;
      }
    }

    if (permission !== 'granted') {
      console.log('Notification permission not granted, current permission:', permission);
      console.log('Attempting to request permission again...');
      const granted = await requestPermission();
      if (!granted) {
        console.log('Permission still denied');
        return;
      }
    }

    try {
      console.log('Creating notification with options:', options);
      
      // Create notification with all available options for maximum compatibility
      const notification = new Notification(options.title, {
        body: options.body,
        icon: options.icon || '/favicon.ico',
        tag: options.tag || `notification-${Date.now()}`, // Unique tag for each notification
        requireInteraction: false,
        silent: false,
        badge: options.icon || '/favicon.ico'
      });

      console.log('Notification created successfully:', notification);
      console.log('Notification properties:', {
        title: notification.title,
        body: notification.body,
        icon: notification.icon,
        tag: notification.tag,
        requireInteraction: notification.requireInteraction,
        silent: notification.silent
      });

      // Test if notification is working by checking events
      let notificationShown = false;
      
      // Handle show event
      notification.onshow = () => {
        console.log('✅ Notification shown successfully!');
        notificationShown = true;
      };

      // Handle error event
      notification.onerror = (event) => {
        console.error('❌ Notification error:', event);
      };

      // Handle click event
      notification.onclick = () => {
        console.log('Notification clicked');
        window.focus();
        notification.close();
      };

      // Auto-close after 8 seconds and check if it was shown
      setTimeout(() => {
        try {
          if (!notificationShown) {
            console.warn('⚠️ Notification may not have been displayed properly');
          }
          notification.close();
          console.log('Notification closed automatically');
        } catch (err) {
          console.log('Error closing notification:', err);
        }
      }, 8000);

      return notification;
    } catch (error) {
      console.error('Error creating notification:', error);
      console.error('Error details:', {
        message: error.message,
        name: error.name,
        stack: error.stack
      });
    }
  };

  return {
    permission,
    isSupported,
    requestPermission,
    showNotification,
  };
};
