import { Platform } from 'react-native';

let db = null;
const IS_WEB = Platform.OS === 'web';

// Solo importamos SQLite si NO estamos en la web para evitar el error de .wasm
if (!IS_WEB) {
  const SQLite = require('expo-sqlite');
  db = SQLite.openDatabaseSync('enfoque3.db');
}

export const initDB = () => {
  if (IS_WEB) {
    if (!localStorage.getItem('photos')) {
      localStorage.setItem('photos', JSON.stringify([]));
    }
  } else {
    db.execSync(`
      CREATE TABLE IF NOT EXISTS photos (
        id INTEGER PRIMARY KEY AUTOINCREMENT, 
        uri TEXT, 
        date TEXT
      );
    `);
  }
};

export const savePhoto = (uri) => {
  const date = new Date().toISOString().split('T')[0];

  if (IS_WEB) {
    const photos = JSON.parse(localStorage.getItem('photos') || '[]');
    const newPhoto = { id: Date.now(), uri, date };
    photos.push(newPhoto);
    localStorage.setItem('photos', JSON.stringify(photos));
  } else {
    db.runSync('INSERT INTO photos (uri, date) VALUES (?, ?)', [uri, date]);
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
    db.runSync('DELETE FROM photos WHERE id = ?', [id]);
    return true;
  }
};

export const getDailyPhotos = (date) => {
  if (IS_WEB) {
    const photos = JSON.parse(localStorage.getItem('photos') || '[]');
    // Filtramos por fecha y limitamos a 3
    return photos.filter(p => p.date === date).slice(0, 3);
  } else {
    return db.getAllSync('SELECT * FROM photos WHERE date = ? LIMIT 3', [date]);
  }
};