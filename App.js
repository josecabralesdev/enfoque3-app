import React, { useEffect } from 'react';
import { AppState, View, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/HomeScreen';
import StatsScreen from './src/StatsScreen';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const Stack = createStackNavigator();

const GRATITUDE_MESSAGES = [
  "Hoy agradezco por el descanso y la paz que me renuevan para una nueva semana.", // Sunday
  "Hoy agradezco por nuevas oportunidades y bendiciones que llegan a mi vida.", // Monday
  "Hoy agradezco por la salud y el bienestar que me permiten disfrutar cada momento.", // Tuesday
  "Hoy agradezco por las personas que me rodean y me apoyan incondicionalmente.", // Wednesday
  "Hoy agradezco por el aprendizaje que cada experiencia me brinda.", // Thursday
  "Hoy agradezco por la abundancia en todas sus formas en mi vida.", // Friday
  "Hoy agradezco por los pequeños placeres y alegrías del día a día." // Saturday
]

export default function App() {
  useEffect(() => {
    const setupNotifications = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') return;

      const currentDay = new Date().getDay();
      const gratitudeMessage = GRATITUDE_MESSAGES[currentDay];

      // Programar recordatorio diario 8:00 PM
      await Notifications.cancelAllScheduledNotificationsAsync();

      // Schedule a notification that repeats daily with the current day's message
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Enfoque3 🌿",
          body: gratitudeMessage,
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

  // Update the notification message when the app becomes active to ensure it matches the current day
  useEffect(() => {
    const updateNotificationForDay = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') return;

      const currentDay = new Date().getDay();
      const gratitudeMessage = GRATITUDE_MESSAGES[currentDay];

      // Cancel existing scheduled notifications
      await Notifications.cancelAllScheduledNotificationsAsync();

      // Schedule a new notification with the correct daily message
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "Enfoque3 🌿",
          body: gratitudeMessage,
        },
        trigger: {
          hour: 20,
          minute: 0,
          repeats: true,
        },
      });
    };

    // Update notification when the app becomes active
    const AppStateSubscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        updateNotificationForDay();
      }
    });

    return () => {
      AppStateSubscription?.remove?.();
    };
  }, []);

  return (
    <View style={{ flex: 1, overflow: Platform.OS === 'web' ? 'auto' : 'hidden' }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{
              title: "Enfoque3",
              headerStyle: {
                backgroundColor: '#FFFAF0',
              },
              headerTintColor: '#4A4A4A',
            }}
          />
          <Stack.Screen
            name="Stats"
            component={StatsScreen}
            options={{
              title: "Estadísticas",
              headerStyle: {
                backgroundColor: '#FFFAF0',
              },
              headerTintColor: '#4A4A4A',
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </View>
  );
}