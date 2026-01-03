import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList, Alert, Platform } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as database from './db/database';
import FadeInView from './components/FadeInView';

export default function HomeScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [photos, setPhotos] = useState([]);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraRef, setCameraRef] = useState(null);

  const today = new Date().toISOString().split('T')[0];

  const pickImage = async () => {
    if (photos.length >= 3) {
      Alert.alert("Límite alcanzado", "Ya tienes tus 3 momentos de hoy.");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      database.savePhoto(result.assets[0].uri);
      loadPhotos();
    }
  };

  const handleDelete = (id) => {
    const performDelete = () => {
      database.deletePhoto(id);
      loadPhotos(); // Esto fuerza a React a pedir las fotos de nuevo y re-renderizar
    };

    if (Platform.OS === 'web') {
      // Confirmación nativa del navegador para mayor compatibilidad
      if (window.confirm("¿Quieres eliminar este momento para elegir otro?")) {
        performDelete();
      }
    } else {
      // Alerta nativa de React Native para iOS/Android
      Alert.alert("Eliminar", "¿Quieres reemplazar este momento?", [
        { text: "Cancelar", style: "cancel" },
        { text: "Eliminar", style: "destructive", onPress: performDelete }
      ]);
    }
  };

  useEffect(() => {
    database.initDB();
    loadPhotos();
  }, []);

  const loadPhotos = () => {
    const data = database.getDailyPhotos(today);
    setPhotos([...data]);
  };

  const takePicture = async () => {
    if (cameraRef) {
      const photo = await cameraRef.takePictureAsync();
      database.savePhoto(photo.uri);
      setIsCameraOpen(false);
      loadPhotos();
    }
  };

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text>Necesitamos permiso para la cámara</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.button}>
          <Text>Dar Permiso</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (isCameraOpen) {
    return (
      <CameraView style={styles.camera} ref={(ref) => setCameraRef(ref)}>
        <View style={styles.cameraButtons}>
          <TouchableOpacity style={styles.shutter} onPress={takePicture} />
          <TouchableOpacity onPress={() => setIsCameraOpen(false)}>
            <Text style={{ color: 'white', marginTop: 20 }}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image source={require('../assets/logo-app.png')} style={styles.logo} />
        <Text style={styles.header}>Enfoque3</Text>
        <Text style={styles.sub}>Hoy agradezco por...</Text>
      </View>

      <FlatList
        data={photos}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 100 }}
        renderItem={({ item }) => (
          <FadeInView>
            <View style={styles.photoWrapper}>
              <Image source={{ uri: item.uri }} style={styles.photo} />
              <TouchableOpacity
                style={styles.deleteBadge}
                onPress={() => handleDelete(item.id)}
              >
                <Text style={styles.deleteText}>✕</Text>
              </TouchableOpacity>
            </View>
          </FadeInView>
        )}
      />

      {photos.length < 3 && (
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.secondaryBtn} onPress={pickImage}>
            <Text>Galería</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.fab} onPress={() => setIsCameraOpen(true)}>
            <Text style={styles.fabText}>+</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFAF0', padding: 20 },
  header: { fontSize: 32, fontWeight: 'bold', textAlign: 'center', marginTop: 40, color: '#4A4A4A' },
  sub: { fontSize: 18, textAlign: 'center', color: '#888', marginBottom: 20 },
  photo: { width: '100%', height: 250, borderRadius: 20, marginBottom: 15 },
  camera: { flex: 1 },
  cameraButtons: { flex: 1, justifyContent: 'flex-end', alignItems: 'center', marginBottom: 40 },
  shutter: { width: 80, height: 80, backgroundColor: 'white', borderRadius: 40, borderWidth: 6, borderColor: 'rgba(0,0,0,0.2)' },
  fab: { position: 'absolute', bottom: 30, right: 30, backgroundColor: '#FFD700', width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', elevation: 5 },
  fabText: { fontSize: 30, color: 'white' },
  empty: { textAlign: 'center', marginTop: 50, color: '#BBB' },
  logoContainer: {
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 20,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 10,
    borderRadius: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    color: '#4A4A4A',
    letterSpacing: 1,
  },
  photoWrapper: {
    position: 'relative',
    marginBottom: 15,
  },
  deleteBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(255, 0, 0, 0.7)',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteText: { color: 'white', fontWeight: 'bold' },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    position: 'absolute',
    bottom: 30,
    width: '100%',
    paddingHorizontal: 20
  },
  secondaryBtn: {
    backgroundColor: '#E0E0E0',
    padding: 15,
    borderRadius: 30,
  },
  fab: {
    backgroundColor: '#FFD700',
    width: 65,
    height: 65,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
  }
});