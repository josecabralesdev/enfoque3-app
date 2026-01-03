// Verificar si hay fotos reales en el almacenamiento
const today = new Date().toISOString().split('T')[0];

// Simular localStorage con fotos existentes
const mockLocalStorage = {
  data: {
    'photos': JSON.stringify([
      { id: 1640000000000, uri: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwABmQ/9k=', date: today },
      { id: 1640000000001, uri: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwABmQ/9k=', date: today },
      { id: 1640000000002, uri: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCwABmQ/9k=', date: today }
    ])
  },
  getItem: function(key) { return this.data[key] || null; },
  setItem: function(key, value) { this.data[key] = value; }
};

// Función exacta de database.js
function getDailyPhotos(date) {
  const photos = JSON.parse(mockLocalStorage.getItem('photos') || '[]');
  return photos.filter(p => p.date === date).slice(0, 3);
}

console.log('=== VERIFICACIÓN DE FOTOS EXISTENTES ===');
console.log('Fecha de búsqueda:', today);

const photos = getDailyPhotos(today);
console.log('Fotos encontradas:', photos.length);

if (photos.length === 3) {
  console.log('\n✓ FOTOS ENCONTRADAS');
  console.log('✓ La aplicación DEBERÍA mostrarlas');
  console.log('\nSi no se muestran, el problema es:');
  console.log('  1. El servidor no está actualizado con los cambios');
  console.log('  2. El navegador tiene caché');
  console.log('  3. Las URIs no son válidas en el navegador real');
  console.log('\nSOLUCIÓN:');
  console.log('  1. Limpiar caché del navegador (Ctrl+Shift+R)');
  console.log('  2. Verificar que el servidor está en http://localhost:8081');
  console.log('  3. Si persiste, reiniciar el servidor');
} else {
  console.log('\n✗ No hay 3 fotos de hoy');
  console.log('Las fotos podrían ser de otro día o no existir');
}
