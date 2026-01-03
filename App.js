import React, { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import HomeScreen from './src/HomeScreen';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  useEffect(() => {
    const setupNotifications = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') return;

      // Programar recordatorio diario 8:00 PM
      await Notifications.cancelAllScheduledNotificationsAsync();
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Enfoque3 🌿",
          body: "¿Ya guardaste tus 3 momentos de hoy?",
        },
        trigger: {
          hour: 20,
          minute: 0,
          repeats: true,
        },
      });
    };

    setupNotifications();
  }, []);

  return <HomeScreen />;
}