import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, FlatList, Alert, Platform, Dimensions, ScrollView } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as database from './db/database';
import CelebrationModal from './components/CelebrationModal';
import FadeInView from './components/FadeInView';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const navigation = useNavigation();
  const [permission, requestPermission] = useCameraPermissions();
  const [photos, setPhotos] = useState([]);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraRef, setCameraRef] = useState(null);
  const [showCelebration, setShowCelebration] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      await database.savePhoto(result.assets[0].uri);
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

  const showReplacePhotoDialog = (source) => {
    if (Platform.OS === 'web') {
      const options = photos.map((p, idx) => `Foto ${idx + 1}`).join('\n');
      const choice = window.confirm(`Ya tienes 3 fotos.\n\n¿Cuál foto quieres reemplazar?\n${options}\n\nPresiona Cancelar para cancelar.`);

      if (choice) {
        // En web, no podemos mostrar un diálogo de selección complejo fácilmente
        // Así que vamos a eliminar la primera foto y luego abrir la cámara/galería
        const firstPhoto = photos[0];
        if (firstPhoto) {
          database.deletePhoto(firstPhoto.id);
          loadPhotos();
          setTimeout(() => {
            if (source === 'camera') {
              setIsCameraOpen(true);
            } else {
              pickImage();
            }
          }, 100);
        }
      }
    } else {
      // Para móvil, crear un diálogo con opciones
      const options = photos.map((photo, index) => ({
        text: `Foto ${index + 1}`,
        onPress: () => {
          database.deletePhoto(photo.id);
          loadPhotos();
          setTimeout(() => {
            if (source === 'camera') {
              setIsCameraOpen(true);
            } else {
              pickImage();
            }
          }, 100);
        }
      }));

      Alert.alert(
        "Límite alcanzado",
        "Ya tienes 3 fotos. ¿Cuál quieres reemplazar?",
        [
          ...options,
          { text: "Cancelar", style: "cancel" }
        ]
      );
    }
  };

  useEffect(() => {
    database.initDB();
    loadPhotos();
  }, []);

  const loadPhotos = () => {
    const data = database.getDailyPhotos(today);
    setPhotos([...data]);

    // Si acaba de completar las 3, mostramos la celebración
    if (data.length === 3) {
      setShowCelebration(true);
      // Opcional: Ocultarlo automáticamente después de 4 segundos
      setTimeout(() => setShowCelebration(false), 4000);
    } else {
      setShowCelebration(false);
    }
  };

  const takePicture = async () => {
    if (cameraRef) {
      const photo = await cameraRef.takePictureAsync();
      await database.savePhoto(photo.uri);
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

  const renderPhotoItem = ({ item, index }) => {
    const total = photos.length;
    const { width: screenWidth } = Dimensions.get('window');
    const HORIZONTAL_PADDING = 10; // Corresponds to mosaicContainer paddingHorizontal
    const ITEM_MARGIN = 5; // Horizontal margin for each item

    let calculatedWidth;
    let calculatedHeight;

    if (total === 1) {
      // Single image takes full width
      calculatedWidth = screenWidth - (2 * HORIZONTAL_PADDING);
      calculatedHeight = 300;
    } else if (total === 2) {
      // Two images, each takes full width for better visibility
      calculatedWidth = screenWidth - (2 * HORIZONTAL_PADDING);
      calculatedHeight = 200;
    } else if (total === 3) {
      if (index === 0) {
        // First image takes full width
        calculatedWidth = screenWidth - (2 * HORIZONTAL_PADDING);
        calculatedHeight = 200;
      } else {
        // Second and third images share the remaining space
        calculatedWidth = (screenWidth - (2 * HORIZONTAL_PADDING) - ITEM_MARGIN) / 2;
        calculatedHeight = 180;
      }
    }

    return (
      <FadeInView style={{ width: calculatedWidth, height: calculatedHeight, marginBottom: ITEM_MARGIN * 2, marginHorizontal: ITEM_MARGIN }}>
        <View style={styles.photoWrapper}>
          <Image source={{ uri: item.uri }} style={[styles.photo, { width: calculatedWidth, height: calculatedHeight }]} />
          <TouchableOpacity
            style={styles.deleteBadge}
            onPress={() => handleDelete(item.id)}
          >
            <Text style={styles.deleteText}>✕</Text>
          </TouchableOpacity>
        </View>
      </FadeInView>
    );
  };

  return (
    <ScrollView style={styles.container}>
      {/* Contenedor de la lista - ocupa el espacio restante */}
      <View style={{ flex: 1 }}>
        <FlatList
          data={photos}
          keyExtractor={(item) => item.id.toString()}
          key={`grid-${photos.length}`}
          contentContainerStyle={styles.mosaicContainer}
          renderItem={renderPhotoItem}
          ListHeaderComponent={
            <View style={styles.logoContainer}>
              <Image source={require('../assets/logo-app.png')} style={styles.logo} />
              <Text style={styles.header}>Enfoque3</Text>
              <Text style={styles.sub}>Hoy agradezco por...</Text>
              {photos.length === 3 && (
                <Text style={styles.infoComplete}>¡Tríptico completo! Puedes reemplazar fotos si lo deseas.</Text>
              )}
            </View>
          }
          ListEmptyComponent={<Text style={styles.empty}>Tu tríptico de hoy está esperando...</Text>}
          style={{ marginBottom: 120 }} // Add margin to account for fixed buttons
        />
      </View>

      {/* MODAL DE CELEBRACIÓN */}
      <CelebrationModal visible={showCelebration} />

      {/* BOTONES FIJOS EN LA PARTE INFERIOR - SIEMPRE VISIBLES */}
      <View style={styles.fixedBottomButtons}>
        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={() => navigation.navigate('Stats')}
        >
          <Text style={styles.btnText}>Estadísticas</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryBtn}
          onPress={photos.length >= 3 ? () => showReplacePhotoDialog('gallery') : pickImage}
        >
          <Text style={styles.btnText}>Galería</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.fab}
          onPress={photos.length >= 3 ? () => showReplacePhotoDialog('camera') : () => setIsCameraOpen(true)}
        >
          <Text style={styles.fabText}>+</Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFAF0'
  },
  mosaicContainer: {
    paddingHorizontal: 10,
  },
  header: {
    fontSize: 28,
    fontWeight: '700',
    color: '#4A4A4A',
    letterSpacing: 1,
    textAlign: 'center',
    marginTop: 40,
  },
  sub: { fontSize: 18, textAlign: 'center', color: '#888', marginBottom: 10 },
  infoComplete: {
    fontSize: 14,
    textAlign: 'center',
    color: '#2E7D32',
    fontWeight: '600',
    backgroundColor: '#E8F5E9',
    padding: 8,
    borderRadius: 8,
    marginHorizontal: 20,
    marginTop: 5
  },
  photo: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  camera: { flex: 1 },
  cameraButtons: { flex: 1, justifyContent: 'flex-end', alignItems: 'center', marginBottom: 40 },
  shutter: { width: 80, height: 80, backgroundColor: 'white', borderRadius: 40, borderWidth: 6, borderColor: 'rgba(0,0,0,0.2)' },
  fab: {
    backgroundColor: '#FFD700',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  fabText: {
    fontSize: 30,
    color: 'white',
    fontWeight: 'bold'
  },
  empty: { textAlign: 'center', marginTop: 50, color: '#BBB' },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 20,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 10,
    borderRadius: 20,
  },
  photoWrapper: {
    flex: 1,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#eee',
    position: 'relative',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  deleteBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  deleteText: { color: 'white', fontWeight: 'bold' },
  secondaryBtn: {
    backgroundColor: '#E0E0E0',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  fixedBottomButtons: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 250, 240, 0.9)',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  btnText: {
    fontWeight: '600',
    color: '#4A4A4A'
  },
})