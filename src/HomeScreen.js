import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert, FlatList } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as database from './db/database';

export default function HomeScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [photos, setPhotos] = useState([]);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraRef, setCameraRef] = useState(null);

  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    database.initDB();
    loadPhotos();
  }, []);

  const loadPhotos = () => {
    const data = database.getDailyPhotos(today);
    setPhotos(data);
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
      <Text style={styles.header}>Enfoque3</Text>
      <Text style={styles.sub}>Hoy agradezco por...</Text>

      <FlatList
        data={photos}
        keyExtractor={(item) => item.id.toString()}
        numColumns={1}
        renderItem={({ item }) => (
          <Image source={{ uri: item.uri }} style={styles.photo} />
        )}
        ListEmptyComponent={<Text style={styles.empty}>Aún no hay fotos hoy.</Text>}
      />

      {photos.length < 3 && (
        <TouchableOpacity style={styles.fab} onPress={() => setIsCameraOpen(true)}>
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
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
  empty: { textAlign: 'center', marginTop: 50, color: '#BBB' }
});