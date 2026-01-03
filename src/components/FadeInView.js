import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';

const FadeInView = ({ children }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current; // Opacidad inicial 0

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,           // Opacidad final 1
      duration: 800,        // Duración en milisegundos
      useNativeDriver: true, // Mejora el rendimiento
    }).start();
  }, [fadeAnim]);

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      {children}
    </Animated.View>
  );
};

export default FadeInView;