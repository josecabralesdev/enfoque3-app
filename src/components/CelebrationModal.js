import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export default function CelebrationModal({ visible }) {
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        useNativeDriver: true,
      }).start();
    } else {
      scaleAnim.setValue(0);
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <Animated.View style={[styles.card, { transform: [{ scale: scaleAnim }] }]}>
        <Text style={styles.emoji}>✨</Text>
        <Text style={styles.title}>¡Día Completado!</Text>
        <Text style={styles.message}>
          Has capturado tus 3 momentos de hoy. Tu mente y tu corazón te lo agradecen.
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 250, 240, 0.9)', // Fondo cálido semi-transparente
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  card: {
    width: width * 0.8,
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 25,
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
  },
  emoji: { fontSize: 50, marginBottom: 10 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#4A4A4A', marginBottom: 10 },
  message: { fontSize: 16, textAlign: 'center', color: '#666', lineHeight: 22 },
});