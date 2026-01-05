import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import * as database from './db/database';

export default function StatsScreen() {
  const [consecutiveDays, setConsecutiveDays] = useState(0);
  const [totalDays, setTotalDays] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      // Get all unique dates with photos
      const allPhotos = await getAllPhotos();
      const uniqueDates = [...new Set(allPhotos.map(photo => photo.date))].sort().reverse();

      // Calculate total days with photos
      setTotalDays(uniqueDates.length);

      // Calculate consecutive days
      const consecutive = calculateConsecutiveDays(uniqueDates);
      setConsecutiveDays(consecutive);
    } catch (error) {
      console.error('Error loading stats:', error);
      Alert.alert('Error', 'No se pudieron cargar las estadísticas');
    } finally {
      setLoading(false);
    }
  };

  const getAllPhotos = async () => {
    if (Platform.OS === 'web') {
      const photos = JSON.parse(localStorage.getItem('photos') || '[]');
      return photos;
    } else {
      const SQLite = require('expo-sqlite');
      const db = SQLite.openDatabaseSync('enfoque3.db');
      return db.getAllSync('SELECT * FROM photos ORDER BY date DESC');
    }
  };

  const calculateConsecutiveDays = (dates) => {
    if (dates.length === 0) return 0;

    // Convert string dates to Date objects and sort in descending order
    const dateObjects = dates.map(dateStr => {
      const [year, month, day] = dateStr.split('-').map(Number);
      return new Date(year, month - 1, day); // month is 0-indexed in Date constructor
    });

    dateObjects.sort((a, b) => b - a); // Sort in descending order (most recent first)

    // Start from today and check backwards
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0); // Normalize time for comparison

    // Check if today has photos
    const todayStr = currentDate.toISOString().split('T')[0];
    const hasTodayPhotos = dates.includes(todayStr);

    // If today doesn't have photos, start checking from yesterday
    if (!hasTodayPhotos) {
      currentDate.setDate(currentDate.getDate() - 1);
    }

    let consecutiveCount = 0;
    let dateIndex = 0;

    // Check backwards day by day
    while (dateIndex < dateObjects.length) {
      const currentCheckDate = new Date(currentDate);
      currentCheckDate.setHours(0, 0, 0, 0);

      const photoDate = new Date(dateObjects[dateIndex]);
      photoDate.setHours(0, 0, 0, 0);

      if (currentCheckDate.getTime() === photoDate.getTime()) {
        // This date matches, increment the count
        consecutiveCount++;
        dateIndex++;
        currentDate.setDate(currentDate.getDate() - 1); // Move to previous day
      } else {
        // Gap in the sequence, stop counting
        break;
      }
    }

    // If today has photos, we don't count it in the streak yet
    // since the streak continues until the end of the day
    if (hasTodayPhotos) {
      return consecutiveCount - 1;
    }

    return consecutiveCount;
  };

  const formatNumber = (num) => {
    return num.toString().padStart(2, '0');
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Cargando estadísticas...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFAF0' }}>
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 20 }}>
        <View style={styles.header}>
          <Text style={styles.title}>Estadísticas de Gratitud</Text>
          <Text style={styles.subtitle}>Tu progreso en gratitud</Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{formatNumber(consecutiveDays)}</Text>
            <Text style={styles.statLabel}>Días Seguidos</Text>
            <Text style={styles.statDescription}>Practicando gratitud</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{formatNumber(totalDays)}</Text>
            <Text style={styles.statLabel}>Días Totales</Text>
            <Text style={styles.statDescription}>Con gratitud</Text>
          </View>
        </View>

        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Sobre tu racha de gratitud</Text>
          <Text style={styles.infoText}>
            ¡Felicidades! Llevas {consecutiveDays} días seguidos practicando gratitud.
            Cada día que agradeces contribuye a formar un hábito positivo que mejora tu bienestar.
          </Text>
        </View>

        <TouchableOpacity style={styles.refreshButton} onPress={loadStats}>
          <Text style={styles.refreshButtonText}>Actualizar Estadísticas</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4A4A4A',
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
  },
  loadingText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 50,
    color: '#666',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    width: '48%',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  statNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A4A4A',
    marginBottom: 5,
    textAlign: 'center',
  },
  statDescription: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
  infoContainer: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A4A4A',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#666',
    lineHeight: 22,
  },
  refreshButton: {
    backgroundColor: '#E0E0E0',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 20,
  },
  refreshButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4A4A4A',
  },
});