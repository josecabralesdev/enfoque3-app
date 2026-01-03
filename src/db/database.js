import { Platform } from 'react-native';

let db = null;
const IS_WEB = Platform.OS === 'web';

const getDb = () => {
  if (IS_WEB) return null;
  if (!db) {
    const SQLite = require('expo-sqlite');
    db = SQLite.openDatabaseSync('enfoque3.db');
  }
  return db;
};

const uriToBase64 = async (uri) => {
  const response = await fetch(uri);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export const initDB = () => {
  if (IS_WEB) {
    if (!localStorage.getItem('photos')) {
      localStorage.setItem('photos', JSON.stringify([]));
    }
  } else {
    const database = getDb();
    database.execSync(`
      CREATE TABLE IF NOT EXISTS photos (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        uri TEXT, 
        date TEXT
      );
    `);
  }
};

export const savePhoto = async (uri) => {
  const date = new Date().toISOString().split('T')[0];

  if (IS_WEB) {
    // CONVERTIMOS A BASE64 PARA PERSISTENCIA REAL EN WEB
    const base64Data = await uriToBase64(uri);
    const photos = JSON.parse(localStorage.getItem('photos') || '[]');
    const newPhoto = { id: Date.now(), uri: base64Data, date };
    photos.push(newPhoto);
    localStorage.setItem('photos', JSON.stringify(photos));
  } else {
    // En móvil las URIs de archivo son permanentes, no hace falta base64
    const database = getDb();
    database.runSync('INSERT INTO photos (uri, date) VALUES (?, ?)', [uri, date]);
  }
};

export const deletePhoto = (id) => {
  if (Platform.OS === 'web') {
    try {
      const photos = JSON.parse(localStorage.getItem('photos') || '[]');
      // Forzamos la comparación de IDs como strings para evitar errores de tipo
      const updatedPhotos = photos.filter(p => String(p.id) !== String(id));
      localStorage.setItem('photos', JSON.stringify(updatedPhotos));
      return true;
    } catch (error) {
      console.error("Error al borrar en Web:", error);
      return false;
    }
  } else {
    const database = getDb();
    database.runSync('DELETE FROM photos WHERE id = ?', [id]);
    return true;
  }
};

export const getDailyPhotos = (date) => {
  if (IS_WEB) {
    const photos = JSON.parse(localStorage.getItem('photos') || '[]');
    // Filtramos por fecha y limitamos a 3
    return photos.filter(p => p.date === date).slice(0, 3);
  } else {
    const database = getDb();
    return database.getAllSync('SELECT * FROM photos WHERE date = ? LIMIT 3', [date]);
  }
};